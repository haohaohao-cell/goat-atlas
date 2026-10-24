import { readFile, writeFile } from "node:fs/promises";

const MOMENTS_PATH = new URL("../data/moments.json", import.meta.url);
const LIVE_PATH = new URL("../data/live.json", import.meta.url);
const MILESTONES_PATH = new URL("../data/milestones.json", import.meta.url);
const STATE_PATH = new URL("../data/bot-state.json", import.meta.url);

const SITE_URL = (
  process.env.SITE_URL ?? "https://haohaohao-cell.github.io/goat-atlas"
).replace(/\/$/, "");
const MODE = process.env.BOT_MODE === "daily" ? "daily" : "check";
const DRY_RUN = ["1", "true"].includes(
  (process.env.BOT_DRY_RUN ?? "").toLowerCase(),
);
const FORCE = process.env.BOT_FORCE === "1";
const TIME_ZONE = process.env.BOT_TIMEZONE ?? "Asia/Shanghai";

function readJson(path, fallback) {
  return readFile(path, "utf8")
    .then((value) => JSON.parse(value))
    .catch(() => fallback);
}

function dateInTimeZone(date = new Date()) {
  if (process.env.BOT_TODAY) return process.env.BOT_TODAY;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function dateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function daysBetween(from, to) {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86_400_000,
  );
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function link(path) {
  return `${SITE_URL}${path}`;
}

function line(value) {
  return String(value ?? "").trim();
}

function buildDailyMessage({ today, moments, milestones }) {
  const exact = moments
    .filter((moment) => moment.date.slice(5) === today.slice(5))
    .sort((a, b) => b.date.localeCompare(a.date));
  const moment = exact[0] ?? moments[hash(today) % moments.length];
  const heading = exact.length ? "历史上的今天" : "今日坐标";
  const career = milestones.items?.find(
    (item) => item.id === "career-1000-goals",
  );
  const remaining = career
    ? Math.max(career.target - career.current, 0)
    : null;

  const message = [
    "🐐 GOAT Atlas · 今日",
    dateLabel(today),
    "",
    `【${heading}】`,
    `${dateLabel(moment.date)} · ${moment.title}`,
    line(moment.summary),
    `详情：${link(`/atlas/${moment.slug}/`)}`,
    "",
    "【1000 球进度】",
    career
      ? `${career.current} / ${career.target} · 还差 ${remaining} 球`
      : "数据同步中",
    "",
    "打开 Today：",
    link("/today/"),
  ];

  if (!exact.length) {
    message.splice(
      3,
      0,
      "今天没有精确收录的日期，以下是一个按日期轮换的坐标。",
    );
  }

  return message.join("\n");
}

function buildMatchMessage({ fixture, today, milestones }) {
  const career = milestones.items?.find(
    (item) => item.id === "career-1000-goals",
  );
  const remaining = career
    ? Math.max(career.target - career.current, 0)
    : null;
  const dayWord = daysBetween(today, fixture.date) === 0 ? "今天" : "明天";
  const fixtureLabel = fixture.home
    ? `Al-Nassr vs ${fixture.opponent}`
    : `${fixture.opponent} vs Al-Nassr`;

  return [
    "⚽ 赛前提醒 · GOAT Atlas",
    `${dayWord}有比赛`,
    `${dateLabel(fixture.date)} · ${fixture.competition}`,
    fixtureLabel,
    fixture.venue ? `场地：${fixture.venue}` : null,
    "",
    "【1000 球进度】",
    career
      ? `${career.current} / ${career.target} · 还差 ${remaining} 球`
      : "数据同步中",
    "",
    "赛程与日历：",
    link("/matches/"),
  ]
    .filter((value) => value !== null)
    .join("\n");
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return { configured: false, ok: false };

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(20_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram HTTP ${response.status}`);
  }

  return { configured: true, ok: true };
}

async function sendDiscord(text) {
  const webhook = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!webhook) return { configured: false, ok: false };

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content: text,
      allowed_mentions: { parse: [] },
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Discord HTTP ${response.status}`);
  }

  return { configured: true, ok: true };
}

async function deliver(text, label) {
  if (DRY_RUN) {
    console.log(`\n--- ${label} (dry run) ---\n${text}\n`);
    return false;
  }

  const results = await Promise.allSettled([
    sendTelegram(text),
    sendDiscord(text),
  ]);
  let configured = false;
  let delivered = false;

  for (const result of results) {
    if (result.status === "rejected") {
      console.warn(`Bot delivery failed: ${result.reason.message}`);
      continue;
    }
    configured ||= result.value.configured;
    delivered ||= result.value.ok;
  }

  if (!configured) {
    console.log(
      "No bot channels configured. Set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID or DISCORD_WEBHOOK_URL.",
    );
  } else if (!delivered) {
    console.warn("Bot message was not delivered.");
  }

  return delivered;
}

async function main() {
  const [moments, live, milestones, state] = await Promise.all([
    readJson(MOMENTS_PATH, []),
    readJson(LIVE_PATH, { fixtures: [] }),
    readJson(MILESTONES_PATH, { items: [] }),
    readJson(STATE_PATH, { daily: null, fixtures: {} }),
  ]);

  const today = dateInTimeZone();
  const nextState = {
    daily: state.daily ?? null,
    fixtures: { ...(state.fixtures ?? {}) },
  };
  let changed = false;

  if (MODE === "daily" && (FORCE || nextState.daily !== today)) {
    const message = buildDailyMessage({ today, moments, milestones });
    if (await deliver(message, "Daily digest")) {
      nextState.daily = today;
      changed = true;
    }
  }

  const fixtures = (live.fixtures ?? []).filter((fixture) => {
    const days = daysBetween(today, fixture.date);
    return days >= 0 && days <= 1;
  });

  for (const fixture of fixtures) {
    const key = `${fixture.date}-${fixture.opponent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;
    if (!FORCE && nextState.fixtures[key]) continue;

    const message = buildMatchMessage({ fixture, today, milestones });
    if (await deliver(message, `Match reminder: ${fixture.opponent}`)) {
      nextState.fixtures[key] = today;
      changed = true;
    }
  }

  if (DRY_RUN) {
    console.log("\nDry run complete. State was not written.");
    return;
  }

  if (changed) {
    await writeFile(STATE_PATH, `${JSON.stringify(nextState, null, 2)}\n`);
    console.log(`Bot state updated: daily=${nextState.daily ?? "-"}.`);
  } else {
    console.log("No bot messages sent.");
  }
}

main().catch((error) => {
  console.error(`Bot failed: ${error.message}`);
  process.exitCode = 1;
});
