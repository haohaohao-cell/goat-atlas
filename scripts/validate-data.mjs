import { readFileSync } from "node:fs";

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8"));

const player = read("player.json");
const moments = read("moments.json");

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
  if (slugs.has(moment.slug)) errors.push(`Duplicate slug: ${moment.slug}`);
  if (ids.has(moment.id)) errors.push(`Duplicate id: ${moment.id}`);
  slugs.add(moment.slug);
  ids.add(moment.id);
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
