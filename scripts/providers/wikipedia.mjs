import { readFile } from "node:fs/promises";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const PAGE = "Cristiano_Ronaldo";
const SOURCE_URL = "https://en.wikipedia.org/wiki/Cristiano_Ronaldo";

const COMPETITION_BY_CLUB = {
  "Al-Nassr": "Saudi Pro League（联赛）",
  "Manchester United": "Premier League（联赛）",
  "Real Madrid": "La Liga（联赛）",
  Juventus: "Serie A（联赛）",
  "Sporting CP": "Primeira Liga（联赛）",
};

const MONTHS = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

function cleanWiki(value) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/\[\[([^|\]]*)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/''+/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .trim();
}

function cleanTeam(value) {
  return cleanWiki(value)
    .replace(/\{\{fbaicon\|[^}]+\}\}/gi, "")
    .replace(/\{\{flagicon\|[^}]+\}\}/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function field(wikitext, name) {
  const match = wikitext.match(
    new RegExp(`^\\| *${name} *=\\s*(.+)$`, "m"),
  );
  return match ? cleanWiki(match[1]) : "";
}

function numberField(wikitext, name) {
  const value = field(wikitext, name).replace(/[^\d]/g, "");
  return value ? Number(value) : null;
}

function parseUpdateTimestamp(value) {
  const match = value.match(
    /(\d{1,2}):(\d{2}),\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/,
  );
  if (!match) return new Date().toISOString();

  const [, hour, minute, day, monthName, year] = match;
  const month = MONTHS[monthName];
  if (month === undefined) return new Date().toISOString();

  return new Date(
    Date.UTC(Number(year), month, Number(day), Number(hour), Number(minute)),
  ).toISOString();
}

function parseMatchDate(value) {
  const match = value.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = MONTHS[monthName];
  if (month === undefined) return null;

  return `${year}-${String(month + 1).padStart(2, "0")}-${String(
    Number(day),
  ).padStart(2, "0")}`;
}

function seasonFromDate(date = new Date()) {
  const year = date.getUTCFullYear();
  const start = date.getUTCMonth() >= 6 ? year : year - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
}

function clubEntries(wikitext) {
  return [...wikitext.matchAll(/^\| *clubs(\d+) *=\s*(.+)$/gm)]
    .map((match) => ({
      index: Number(match[1]),
      name: cleanWiki(match[2]),
    }))
    .sort((a, b) => b.index - a.index);
}

function seniorNationalTeam(wikitext) {
  const entries = [...wikitext.matchAll(/^\| *national_team(\d+) *=\s*(.+)$/gm)]
    .map((match) => ({
      index: Number(match[1]),
      raw: match[2],
      name: cleanWiki(match[2]),
    }))
    .filter(
      (entry) =>
        /national football team/i.test(entry.raw) &&
        !/under-|U\d|Olympic/i.test(entry.raw),
    )
    .sort((a, b) => b.index - a.index);

  return entries[0] ?? null;
}

function extractTemplates(text, name) {
  const opener = `{{${name}`;
  const templates = [];
  let cursor = 0;

  while (true) {
    const start = text.indexOf(opener, cursor);
    if (start === -1) break;

    let depth = 0;
    let end = -1;

    for (let i = start; i < text.length; ) {
      if (text.startsWith("{{", i)) {
        depth += 1;
        i += 2;
      } else if (text.startsWith("}}", i)) {
        depth -= 1;
        i += 2;
        if (depth === 0) {
          end = i;
          break;
        }
      } else {
        i += 1;
      }
    }

    if (end === -1) break;
    templates.push({ block: text.slice(start, end), start });
    cursor = end;
  }

  return templates;
}

function templateFields(block) {
  const fields = {};
  for (const match of block.matchAll(
    /^\|[ \t]*([A-Za-z0-9_]+)[ \t]*=[ \t]*(.*)$/gm,
  )) {
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function sectionAt(text, index) {
  const headings = [
    ...text
      .slice(0, index)
      .matchAll(/^(={2,3})\s*([^=].*?)\s*\1\s*$/gm),
  ];
  return cleanWiki(headings.at(-1)?.[2] ?? "");
}

function parseSeasonMatches(seasonWikitext, sourceUrl, now = new Date()) {
  return extractTemplates(seasonWikitext, "Football box collapsible")
    .map(({ block, start }) => {
      const fields = templateFields(block);
      const date = parseMatchDate(fields.date ?? "");
      if (!date || new Date(`${date}T23:59:59Z`) > now) return null;

      const team1 = cleanTeam(fields.team1 ?? "");
      const team2 = cleanTeam(fields.team2 ?? "");
      const alNassrIsHome = /Al-Nassr/i.test(team1);
      if (!alNassrIsHome && !/Al-Nassr/i.test(team2)) return null;

      const opponent = alNassrIsHome ? team2 : team1;
      const goalsText = alNassrIsHome
        ? (fields.goals1 ?? "")
        : (fields.goals2 ?? "");
      const goals = (goalsText.match(/Ronaldo/gi) ?? []).length;
      const rawScore = (fields.score ?? "").replace("–", "-");
      const [homeGoals, awayGoals] = rawScore
        .split("-")
        .map((value) => Number(value));
      const goalsFor = alNassrIsHome ? homeGoals : awayGoals;
      const goalsAgainst = alNassrIsHome ? awayGoals : homeGoals;
      const score =
        Number.isFinite(goalsFor) && Number.isFinite(goalsAgainst)
          ? `${goalsFor}-${goalsAgainst}`
          : rawScore || "-";
      const result =
        goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D";
      const section = sectionAt(seasonWikitext, start);
      const round = cleanWiki(fields.round ?? "");

      return {
        date,
        competition: section || round || "Al-Nassr",
        opponent: opponent || "Unknown opponent",
        score,
        result,
        goals,
        venue: cleanWiki(fields.stadium ?? "") || undefined,
        sourceUrl,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
}

export function parseWikipediaWikitext(
  wikitext,
  seasonWikitext = "",
  seasonTitle = "",
) {
  const club = clubEntries(wikitext)[0];
  if (!club) throw new Error("Could not find the current club in the infobox.");

  const appearances = numberField(wikitext, `caps${club.index}`);
  const goals = numberField(wikitext, `goals${club.index}`);
  const national = seniorNationalTeam(wikitext);
  const nationalCaps = national
    ? numberField(wikitext, `national_caps${national.index}`)
    : null;
  const nationalGoals = national
    ? numberField(wikitext, `national_goals${national.index}`)
    : null;

  const stats = [];
  if (appearances != null && goals != null) {
    stats.push({
      competition: COMPETITION_BY_CLUB[club.name] ?? "League（联赛）",
      team: club.name,
      appearances,
      goals,
    });
  }
  if (national && nationalCaps != null && nationalGoals != null) {
    stats.push({
      competition: "International（国家队）",
      team: national.name,
      appearances: nationalCaps,
      goals: nationalGoals,
    });
  }

  if (!stats.length) {
    throw new Error("Wikipedia infobox did not contain usable stats.");
  }

  const season = seasonFromDate();
  const seasonPageUrl = seasonTitle
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(
        seasonTitle.replaceAll(" ", "_"),
      )}`
    : SOURCE_URL;

  const recentMatches = seasonWikitext
    ? parseSeasonMatches(seasonWikitext, seasonPageUrl)
    : [];

  const latest = recentMatches
    .filter((match) => match.goals > 0)
    .slice(0, 4)
    .map((match) => ({
      date: match.date,
      title: `对阵 ${match.opponent} 进球`,
      detail: `${match.competition} · ${match.score}${
        match.goals > 1 ? ` · ${match.goals} 球` : ""
      }`,
    }));

  return {
    provider: "Wikipedia (fallback)",
    status: "fallback",
    season,
    updatedAt: parseUpdateTimestamp(field(wikitext, "club_update")),
    sourceUrl: SOURCE_URL,
    seasonPageUrl,
    stats,
    recentMatches,
    latest,
    club: club.name,
    note: "API-Football 免费套餐不覆盖当前赛季，当前使用 Wikipedia 的当前生涯数据与最近比赛回退；联赛数据为 Wikipedia infobox 口径。",
  };
}

async function fetchPageWikitext(title) {
  const url = new URL(WIKI_API);
  url.search = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "wikitext",
    format: "json",
    formatversion: "2",
  }).toString();

  const response = await fetch(url, {
    headers: {
      "user-agent":
        "GOAT-Atlas/0.1 (https://github.com/haohaohao-cell/goat-atlas)",
      accept: "application/json",
    },
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`Wikipedia HTTP ${response.status} for ${title}`);
  }

  const payload = await response.json();
  const wikitext = payload.parse?.wikitext;
  if (!wikitext) throw new Error(`Wikipedia did not return wikitext for ${title}.`);
  return wikitext;
}

export async function fetchWikipediaSnapshot() {
  const season = seasonFromDate();
  const seasonTitle = `${season.replace("-", "–")} Al-Nassr FC season`;

  if (process.env.WIKIPEDIA_WIKITEXT_FILE) {
    const wikitext = await readFile(process.env.WIKIPEDIA_WIKITEXT_FILE, "utf8");
    let seasonWikitext = "";
    if (process.env.WIKIPEDIA_SEASON_WIKITEXT_FILE) {
      seasonWikitext = await readFile(
        process.env.WIKIPEDIA_SEASON_WIKITEXT_FILE,
        "utf8",
      );
    }
    return parseWikipediaWikitext(wikitext, seasonWikitext, seasonTitle);
  }

  const [wikitext, seasonWikitext] = await Promise.all([
    fetchPageWikitext(PAGE),
    fetchPageWikitext(seasonTitle).catch((error) => {
      console.warn(`Season page unavailable: ${error.message}`);
      return "";
    }),
  ]);

  return parseWikipediaWikitext(wikitext, seasonWikitext, seasonTitle);
}
