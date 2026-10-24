import { readFile, writeFile } from "node:fs/promises";

const LIVE_PATH = new URL("../data/live.json", import.meta.url);
const OUT_PATH = new URL("../public/matches.ics", import.meta.url);
const TIMEZONE = "Asia/Riyadh";

function escapeIcs(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function dateStamp(date) {
  return date.replaceAll("-", "");
}

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function dateTimeStamp(date, time) {
  return `${dateStamp(date)}T${time.replace(":", "")}00`;
}

function endDateTimeStamp(date, time) {
  const value = new Date(`${date}T${time}:00Z`);
  value.setUTCHours(value.getUTCHours() + 2);
  return value.toISOString().replace(/[-:]/g, "").slice(0, 15);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const live = JSON.parse(await readFile(LIVE_PATH, "utf8"));
const fixtures = live.fixtures ?? [];
const now = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}Z$/, "Z");

const lines = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//GOAT Atlas//Cristiano Ronaldo Match Calendar//EN",
  "CALSCALE:GREGORIAN",
  "METHOD:PUBLISH",
  "X-WR-CALNAME:GOAT Atlas · C罗赛程",
  "X-WR-CALDESC:Al-Nassr 赛程与 C 罗比赛提醒",
  `X-WR-TIMEZONE:${TIMEZONE}`,
];

for (const fixture of fixtures) {
  const summary = fixture.home
    ? `Al-Nassr vs ${fixture.opponent}`
    : `${fixture.opponent} vs Al-Nassr`;
  const hasTime = Boolean(fixture.time);
  const uid = `goat-atlas-${fixture.date}-${slug(fixture.opponent)}@haohaohao-cell.github.io`;

  lines.push("BEGIN:VEVENT");
  lines.push(`UID:${uid}`);
  lines.push(`DTSTAMP:${now}`);

  if (hasTime) {
    lines.push(
      `DTSTART;TZID=${TIMEZONE}:${dateTimeStamp(fixture.date, fixture.time)}`,
    );
    lines.push(
      `DTEND;TZID=${TIMEZONE}:${endDateTimeStamp(fixture.date, fixture.time)}`,
    );
  } else {
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(fixture.date)}`);
    lines.push(`DTEND;VALUE=DATE:${dateStamp(addDays(fixture.date, 1))}`);
  }

  lines.push(`SUMMARY:${escapeIcs(summary)}`);
  lines.push(
    `DESCRIPTION:${escapeIcs(
      `${fixture.competition} · ${fixture.home ? "主场" : "客场"}${fixture.venue ? ` · ${fixture.venue}` : ""} · GOAT Atlas 赛程提醒`,
    )}`,
  );
  if (fixture.venue) lines.push(`LOCATION:${escapeIcs(fixture.venue)}`);
  if (fixture.sourceUrl) lines.push(`URL:${fixture.sourceUrl}`);

  lines.push("BEGIN:VALARM");
  lines.push("ACTION:DISPLAY");
  lines.push(`DESCRIPTION:${escapeIcs(`比赛提醒：${summary}`)}`);
  lines.push(hasTime ? "TRIGGER:-PT1H" : "TRIGGER:-PT12H");
  lines.push("END:VALARM");

  lines.push("BEGIN:VALARM");
  lines.push("ACTION:DISPLAY");
  lines.push(`DESCRIPTION:${escapeIcs(`明天有比赛：${summary}`)}`);
  lines.push("TRIGGER:-P1D");
  lines.push("END:VALARM");

  lines.push("END:VEVENT");
}

lines.push("END:VCALENDAR");

await writeFile(OUT_PATH, `${lines.join("\r\n")}\r\n`, "utf8");
console.log(`Calendar written: ${fixtures.length} fixtures.`);
