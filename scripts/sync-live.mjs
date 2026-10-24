import { readFile, writeFile } from "node:fs/promises";
import { fetchWikipediaSnapshot } from "./providers/wikipedia.mjs";

const LIVE_PATH = new URL("../data/live.json", import.meta.url);
const API_BASE =
  process.env.API_FOOTBALL_BASE ?? "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY?.trim();
const PLAYER_ID = Number(process.env.API_FOOTBALL_PLAYER_ID ?? 874);

function seasonFromDate(date = new Date()) {
  if (process.env.API_FOOTBALL_SEASON) {
    return Number(process.env.API_FOOTBALL_SEASON);
  }
  const year = date.getUTCFullYear();
  return date.getUTCMonth() >= 6 ? year : year - 1;
}

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "x-apisports-key": API_KEY,
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`API-Football HTTP ${response.status} for ${path}`);
  }

  const payload = await response.json();
  const errors = payload.errors;

  if (
    errors &&
    ((Array.isArray(errors) && errors.length > 0) ||
      (!Array.isArray(errors) && Object.keys(errors).length > 0))
  ) {
    throw new Error(`API-Football error: ${JSON.stringify(errors)}`);
  }

  return payload.response ?? [];
}

function resultFor(goalsFor, goalsAgainst) {
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

function comparable(data) {
  const { updatedAt, checkedAt, ...rest } = data;
  return JSON.stringify(rest);
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(LIVE_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function syncFromApiFootball(existing) {
  const season = seasonFromDate();

  const players = await request(`/players?id=${PLAYER_ID}&season=${season}`);
  const player = players[0];

  if (!player) {
    throw new Error(
      `No API-Football player data for player ${PLAYER_ID}, season ${season}.`,
    );
  }

  const rawStats = player.statistics ?? [];
  const stats = rawStats
    .map((entry) => ({
      competition: entry.league?.name ?? "Unknown competition",
      team: entry.team?.name ?? "Unknown team",
      appearances: entry.games?.appearences ?? 0,
      goals: entry.goals?.total ?? 0,
      assists: entry.goals?.assists ?? 0,
      minutes: entry.games?.minutes ?? 0,
    }))
    .sort((a, b) => b.appearances - a.appearances);

  const primaryTeam = rawStats
    .slice()
    .sort(
      (a, b) =>
        (b.games?.appearences ?? 0) - (a.games?.appearences ?? 0),
    )[0]?.team;
  const teamId = primaryTeam?.id ? Number(primaryTeam.id) : null;

  // API-Football does not expose a player filter on /fixtures. Use the
  // player's primary team (club or national team) and inspect goal events.
  const fixtures = teamId
    ? await request(`/fixtures?team=${teamId}&season=${season}`)
    : [];

  const recentMatches = fixtures
    .filter((fixture) => {
      const short = fixture.fixture?.status?.short;
      return (
        (!short || ["FT", "AET", "PEN"].includes(short)) &&
        new Date(fixture.fixture?.date ?? 0).getTime() <= Date.now()
      );
    })
    .sort((a, b) =>
      String(b.fixture?.date ?? "").localeCompare(String(a.fixture?.date ?? "")),
    )
    .slice(0, 10)
    .map((fixture) => {
      const homeId = Number(fixture.teams?.home?.id);
      const isHome = teamId ? homeId === teamId : true;
      const goalsFor = isHome
        ? (fixture.goals?.home ?? 0)
        : (fixture.goals?.away ?? 0);
      const goalsAgainst = isHome
        ? (fixture.goals?.away ?? 0)
        : (fixture.goals?.home ?? 0);
      const goalEvents = (fixture.events ?? []).filter(
        (event) =>
          Number(event.player?.id) === PLAYER_ID &&
          event.type === "Goal" &&
          event.detail !== "Own Goal",
      );
      const ronaldoGoals = goalEvents.map((event) => {
        const elapsed = event.time?.elapsed;
        const extra = event.time?.extra;
        return {
          minute:
            elapsed != null
              ? `${elapsed}${extra != null ? `+${extra}` : ""}`
              : null,
          penalty: event.detail === "Penalty",
          ownGoal: false,
        };
      });

      return {
        date: String(fixture.fixture?.date ?? "").slice(0, 10),
        competition: fixture.league?.name ?? "Unknown competition",
        opponent: isHome
          ? (fixture.teams?.away?.name ?? "Unknown opponent")
          : (fixture.teams?.home?.name ?? "Unknown opponent"),
        score: `${fixture.goals?.home ?? "-"}-${fixture.goals?.away ?? "-"}`,
        result: resultFor(goalsFor, goalsAgainst),
        goals: ronaldoGoals.length,
        ronaldoGoals,
        venue: fixture.fixture?.venue?.name ?? undefined,
        sourceUrl: "https://www.api-football.com/",
      };
    });

  const upcomingFixtures = fixtures
    .filter((fixture) => {
      const short = fixture.fixture?.status?.short;
      return (
        new Date(fixture.fixture?.date ?? 0).getTime() > Date.now() &&
        !["CANC", "PST", "ABD", "AWD", "WO"].includes(short)
      );
    })
    .sort((a, b) =>
      String(a.fixture?.date ?? "").localeCompare(String(b.fixture?.date ?? "")),
    )
    .slice(0, 6)
    .map((fixture) => {
      const homeId = Number(fixture.teams?.home?.id);
      const isHome = teamId ? homeId === teamId : true;
      const kickoff = String(fixture.fixture?.date ?? "");

      return {
        date: kickoff.slice(0, 10),
        time: kickoff.slice(11, 16) || undefined,
        competition: fixture.league?.name ?? "Unknown competition",
        opponent: isHome
          ? (fixture.teams?.away?.name ?? "Unknown opponent")
          : (fixture.teams?.home?.name ?? "Unknown opponent"),
        venue: fixture.fixture?.venue?.name ?? undefined,
        home: isHome,
        sourceUrl: "https://www.api-football.com/",
      };
    });

  if (!stats.length && !recentMatches.length) {
    throw new Error("API-Football returned no stats or matches.");
  }

  const generatedLatest = recentMatches
    .filter((match) => match.goals > 0)
    .slice(0, 4)
    .map((match) => {
      const minutes = (match.ronaldoGoals ?? [])
        .map((goal) => goal.minute)
        .filter(Boolean);

      return {
        date: match.date,
        title: `对阵 ${match.opponent} 进球`,
        detail: `${match.competition} · ${match.score} · ${match.goals} 球${
          minutes.length
            ? `（${minutes.map((minute) => `${minute}'`).join("、")}）`
            : ""
        }`,
      };
    });

  return {
    updatedAt: new Date().toISOString(),
    checkedAt: new Date().toISOString(),
    provider: "API-Football",
    status: "live",
    season: String(season),
    note: "由 GitHub Actions 每 6 小时自动同步。自动数据进入 Live；名场面经编辑审核后进入 Atlas。",
    sourceUrl: "https://www.api-football.com/",
    stats,
    recentMatches,
    fixtures: upcomingFixtures,
    latest: generatedLatest.length
      ? generatedLatest
      : (existing?.latest ?? []),
  };
}

async function syncFromWikipedia(existing) {
  const wiki = await fetchWikipediaSnapshot();

  const statsLine = wiki.stats
    .map((stat) => `${stat.team} ${stat.appearances} 场 ${stat.goals} 球`)
    .join("；");

  const marker = {
    date: wiki.updatedAt.slice(0, 10),
    title: `数据更新至 ${wiki.season} 赛季`,
    detail: `Wikipedia：${statsLine}。`,
  };

  const latest = wiki.latest.length
    ? wiki.latest
    : [
        marker,
        ...(existing?.latest ?? []).filter(
          (item) =>
            !(item.date === marker.date && item.title.startsWith("数据更新至")),
        ),
      ].slice(0, 4);

  return {
    updatedAt: wiki.updatedAt,
    checkedAt: new Date().toISOString(),
    provider: wiki.provider,
    status: "fallback",
    season: wiki.season,
    note: wiki.note,
    sourceUrl: wiki.sourceUrl,
    stats: wiki.stats,
    recentMatches: wiki.recentMatches,
    fixtures: wiki.fixtures,
    latest,
  };
}

async function main() {
  const existing = await readExisting();
  let next = null;

  if (API_KEY) {
    try {
      next = await syncFromApiFootball(existing);
    } catch (error) {
      console.warn(`API-Football unavailable: ${error.message}`);
      console.warn("Falling back to Wikipedia current-season data.");
    }
  } else {
    console.warn("API_FOOTBALL_KEY is not set. Using Wikipedia fallback.");
  }

  if (!next) {
    next = await syncFromWikipedia(existing);
  }

  if (existing && comparable(existing) === comparable(next)) {
    console.log("Live data unchanged; nothing to write.");
    return;
  }

  await writeFile(LIVE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(
    `Live data updated via ${next.provider}: ${next.stats.length} stat rows.`,
  );
}

main().catch((error) => {
  console.error("Live sync failed:", error.message);
  process.exit(1);
});
