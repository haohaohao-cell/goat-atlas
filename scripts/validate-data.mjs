import { readFileSync } from "node:fs";

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8"));

const player = read("player.json");
const moments = read("moments.json");
const live = read("live.json");
const quiz = read("quiz.json");
const compare = read("compare.json");
const milestones = read("milestones.json");
const updates = read("updates.json");

const errors = [];
const required = [
  "id",
  "slug",
  "date",
  "title",
  "titleEn",
  "kind",
  "club",
  "clubZh",
  "competition",
  "summary",
  "context",
  "why",
  "era",
  "tags",
  "sources",
];
const kinds = new Set(["goal", "trophy", "award", "debut", "moment"]);
const eraIds = new Set((player.eras ?? []).map((era) => era.id));
const slugs = new Set();
const ids = new Set();

for (const [index, moment] of moments.entries()) {
  for (const field of required) {
    if (moment[field] === undefined || moment[field] === "") {
      errors.push(`moments[${index}] missing "${field}"`);
    }
  }

  if (!/^[a-z0-9-]+$/.test(moment.slug ?? "")) {
    errors.push(`Invalid slug: ${moment.slug}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(moment.date ?? "")) {
    errors.push(`Invalid date: ${moment.date} (${moment.slug})`);
  }
  if (!kinds.has(moment.kind)) {
    errors.push(`Invalid kind: ${moment.kind} (${moment.slug})`);
  }
  if (!eraIds.has(moment.era)) {
    errors.push(`Unknown era: ${moment.era} (${moment.slug})`);
  }
  if (!Array.isArray(moment.tags) || moment.tags.length === 0) {
    errors.push(`Missing tags: ${moment.slug}`);
  }
  if (!Array.isArray(moment.sources) || moment.sources.length === 0) {
    errors.push(`Missing sources: ${moment.slug}`);
  }
  for (const source of moment.sources ?? []) {
    if (!source.label || !source.url) {
      errors.push(`Invalid source on ${moment.slug}`);
    }
  }
  if (moment.media) {
    for (const field of ["type", "src", "alt", "credit", "license", "sourceUrl"]) {
      if (!moment.media[field]) {
        errors.push(`Media on ${moment.slug} missing "${field}"`);
      }
    }
    if (!["image", "video"].includes(moment.media.type)) {
      errors.push(`Media on ${moment.slug} has invalid type`);
    }
  }
  if (slugs.has(moment.slug)) errors.push(`Duplicate slug: ${moment.slug}`);
  if (ids.has(moment.id)) errors.push(`Duplicate id: ${moment.id}`);
  slugs.add(moment.slug);
  ids.add(moment.id);
}

for (const field of [
  "updatedAt",
  "checkedAt",
  "provider",
  "status",
  "season",
  "note",
  "stats",
  "recentMatches",
  "fixtures",
  "latest",
]) {
  if (live[field] === undefined) errors.push(`live.json missing "${field}"`);
}

if (!["live", "fallback", "snapshot", "unconfigured"].includes(live.status)) {
  errors.push(`Invalid live status: ${live.status}`);
}

for (const stat of live.stats ?? []) {
  for (const field of ["competition", "team"]) {
    if (!stat[field]) errors.push(`live stat missing "${field}"`);
  }
  for (const field of ["appearances", "goals", "assists", "minutes"]) {
    if (
      stat[field] !== undefined &&
      (typeof stat[field] !== "number" || stat[field] < 0)
    ) {
      errors.push(`Invalid live stat "${field}"`);
    }
  }
}

for (const fixture of live.fixtures ?? []) {
  for (const field of ["date", "competition", "opponent"]) {
    if (!fixture[field]) errors.push(`live fixture missing "${field}"`);
  }
  if (typeof fixture.home !== "boolean") {
    errors.push(`Invalid fixture home flag: ${fixture.opponent}`);
  }
}

for (const match of live.recentMatches ?? []) {
  for (const field of ["date", "competition", "opponent", "score", "result"]) {
    if (!match[field]) errors.push(`live match missing "${field}"`);
  }
  if (!["W", "D", "L"].includes(match.result)) {
    errors.push(`Invalid live match result: ${match.result}`);
  }
  if (match.ronaldoGoals !== undefined) {
    if (!Array.isArray(match.ronaldoGoals)) {
      errors.push(`Invalid ronaldoGoals: ${match.opponent}`);
    } else {
      if (match.goals !== match.ronaldoGoals.length) {
        errors.push(`Goal count mismatch: ${match.opponent}`);
      }
      for (const goal of match.ronaldoGoals) {
        if (
          goal.minute !== null &&
          typeof goal.minute !== "string"
        ) {
          errors.push(`Invalid goal minute: ${match.opponent}`);
        }
        if (typeof goal.penalty !== "boolean" || typeof goal.ownGoal !== "boolean") {
          errors.push(`Invalid goal flags: ${match.opponent}`);
        }
      }
    }
  }
}

const quizIds = new Set();
for (const [index, question] of quiz.entries()) {
  if (quizIds.has(question.id)) errors.push(`Duplicate quiz id: ${question.id}`);
  quizIds.add(question.id);
  if (!Array.isArray(question.options) || question.options.length !== 4) {
    errors.push(`Quiz ${question.id} must have 4 options`);
  }
  if (
    !Number.isInteger(question.answer) ||
    question.answer < 0 ||
    question.answer >= (question.options?.length ?? 0)
  ) {
    errors.push(`Quiz ${question.id} has invalid answer index`);
  }
  for (const field of ["question", "explanation", "source"]) {
    if (!question[field]) errors.push(`Quiz ${question.id} missing "${field}"`);
  }
}

const compareIds = new Set((compare.players ?? []).map((player) => player.id));
for (const metric of compare.metrics ?? []) {
  for (const playerId of compareIds) {
    if (typeof metric.values?.[playerId] !== "number") {
      errors.push(`Compare metric ${metric.id} missing value for ${playerId}`);
    }
  }
  if (!metric.source) errors.push(`Compare metric ${metric.id} missing source`);
}

const milestoneIds = new Set();
for (const milestone of milestones.items ?? []) {  if (milestoneIds.has(milestone.id)) {
    errors.push(`Duplicate milestone id: ${milestone.id}`);
  }
  milestoneIds.add(milestone.id);
  if (
    typeof milestone.current !== "number" ||
    typeof milestone.target !== "number" ||
    milestone.current < 0 ||
    milestone.target <= 0 ||
    milestone.current > milestone.target
  ) {
    errors.push(`Invalid milestone range: ${milestone.id}`);
  }
  if (!milestone.source) errors.push(`Milestone ${milestone.id} missing source`);
  if (milestone.breakdown) {
    const sum = milestone.breakdown.reduce(
      (total, item) => total + item.value,
      0,
    );
    if (sum !== milestone.current) {
      errors.push(
        `Milestone ${milestone.id} breakdown ${sum} != current ${milestone.current}`,
      );
    }
  }
}

const updateKinds = new Set(["match", "milestone", "title", "record"]);
for (const [index, item] of (updates.items ?? []).entries()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date ?? "")) {
    errors.push(`updates[${index}] invalid date`);
  }
  if (!updateKinds.has(item.kind)) {
    errors.push(`updates[${index}] invalid kind: ${item.kind}`);
  }
  for (const field of ["title", "summary"]) {
    if (!item[field]) errors.push(`updates[${index}] missing "${field}"`);
  }
  if (!/^https?:\/\//.test(item.source ?? "")) {
    errors.push(`updates[${index}] source must be an http(s) URL`);
  }
}

if (errors.length) {
  console.error("Data validation failed:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const sourceCount = new Set(
  moments.flatMap((moment) => moment.sources.map((source) => source.url)),
).size;

console.log(
  `Data OK: ${moments.length} moments, ${player.eras.length} eras, ${sourceCount} sources.`,
);
