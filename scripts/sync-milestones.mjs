import { readFile, writeFile } from "node:fs/promises";
import { fetchWikipediaCareerStats } from "./providers/wikipedia.mjs";

const MILESTONES_PATH = new URL("../data/milestones.json", import.meta.url);
const LIVE_PATH = new URL("../data/live.json", import.meta.url);

async function readJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

function setCurrent(data, id, current) {
  if (!Number.isFinite(current)) return;
  const item = data.items.find((milestone) => milestone.id === id);
  if (item) item.current = current;
}

function updateBreakdown(careerItem, alNassrGoals, internationalGoals) {
  const breakdown = careerItem.breakdown ?? [];
  const alNassr = breakdown.find((item) => item.label === "Al-Nassr");
  const portugal = breakdown.find((item) => item.label === "Portugal");

  if (alNassr) alNassr.value = alNassrGoals;
  else breakdown.push({ label: "Al-Nassr", value: alNassrGoals });

  if (portugal) portugal.value = internationalGoals;
  else breakdown.push({ label: "Portugal", value: internationalGoals });

  careerItem.breakdown = breakdown;
}

async function main() {
  const milestones = await readJson(MILESTONES_PATH);
  if (!milestones) throw new Error("Could not read data/milestones.json.");

  const live = await readJson(LIVE_PATH, { stats: [] });
  const career = await fetchWikipediaCareerStats();
  const careerItem = milestones.items.find(
    (item) => item.id === "career-1000-goals",
  );
  if (!careerItem) throw new Error("career-1000-goals milestone is missing.");

  careerItem.current = career.total;
  updateBreakdown(careerItem, career.alNassrGoals, career.internationalGoals);

  const remaining = Math.max(careerItem.target - career.total, 0);
  careerItem.description =
    `俱乐部 ${career.clubGoals} 球 + 国家队 ${career.internationalGoals} 球 = ` +
    `${career.total} 球。${
      remaining > 0 ? `距离 ${careerItem.target} 球还差 ${remaining} 球。` : "已达成。"
    }`;

  if (career.asOf) milestones.asOf = career.asOf;

  const alNassr = live.stats?.find((stat) => /Al-Nassr/i.test(stat.team));
  const portugal = live.stats?.find((stat) => /Portugal/i.test(stat.team));

  if (alNassr) {
    setCurrent(milestones, "al-nassr-120-league-goals", alNassr.goals);
    setCurrent(milestones, "al-nassr-120-league-apps", alNassr.appearances);
  }

  setCurrent(milestones, "portugal-150-goals", career.internationalGoals);
  if (portugal) {
    setCurrent(milestones, "portugal-250-caps", portugal.appearances);
  }

  const breakdownTotal = (careerItem.breakdown ?? []).reduce(
    (total, item) => total + item.value,
    0,
  );
  if (breakdownTotal !== careerItem.current) {
    throw new Error(
      `Career breakdown ${breakdownTotal} does not match total ${careerItem.current}.`,
    );
  }

  const next = `${JSON.stringify(milestones, null, 2)}\n`;
  const current = await readFile(MILESTONES_PATH, "utf8");
  if (current === next) {
    console.log(`Milestones unchanged at ${career.total} goals.`);
    return;
  }

  await writeFile(MILESTONES_PATH, next, "utf8");
  console.log(
    `Milestones updated: ${career.total} goals (${career.clubGoals} club + ${career.internationalGoals} Portugal).`,
  );
}

main().catch((error) => {
  console.warn(`Milestone sync skipped: ${error.message}`);
  // Keep the scheduled deployment alive with the last verified ledger.
  process.exitCode = 0;
});
