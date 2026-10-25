#!/usr/bin/env node
/**
 * 检查 data/*.json 里所有来源链接是否可访问。
 *
 * 用法：
 *   node scripts/check-links.mjs
 *   node scripts/check-links.mjs --report link-report.md
 *   node scripts/check-links.mjs --url https://example.com/a --url https://example.com/b
 *
 * 退出码：有 404/410/5xx 或网络错误时返回 1；401/403/429 视为“被拦截”，只警告。
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);

function argValue(name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function argList(name) {
  const values = [];
  args.forEach((arg, index) => {
    if (arg === name && args[index + 1]) values.push(args[index + 1]);
  });
  return values;
}

const timeout = Number(argValue("--timeout", process.env.LINK_CHECK_TIMEOUT_MS ?? 15000));
const concurrency = Number(argValue("--concurrency", process.env.LINK_CHECK_CONCURRENCY ?? 6));
const reportPath = argValue("--report", "link-report.md");
const jsonPath = argValue("--json", "");
const manualUrls = argList("--url");

const root = process.cwd();

function readData(file) {
  return JSON.parse(readFileSync(join(root, "data", file), "utf8"));
}

function collectSources() {
  const items = new Map();
  const add = (url, ref) => {
    if (!url || typeof url !== "string") return;
    if (!items.has(url)) items.set(url, new Set());
    items.get(url).add(ref);
  };

  for (const moment of readData("moments.json")) {
    for (const source of moment.sources ?? []) add(source.url, `moments:${moment.slug}`);
  }
  for (const question of readData("quiz.json")) {
    add(question.source, `quiz:${question.id}`);
  }
  const compare = readData("compare.json");
  for (const player of compare.players ?? []) {
    for (const source of player.sources ?? []) add(source.url, `compare:${player.id}`);
  }
  for (const metric of compare.metrics ?? []) add(metric.source, `compare:${metric.id}`);
  for (const milestone of readData("milestones.json").items ?? []) {
    add(milestone.source, `milestones:${milestone.id}`);
  }
  const live = readData("live.json");
  add(live.sourceUrl, "live");
  for (const match of live.recentMatches ?? []) add(match.sourceUrl, `live:match:${match.date}`);
  for (const fixture of live.fixtures ?? []) add(fixture.sourceUrl, `live:fixture:${fixture.date}`);

  return items;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    signal: AbortSignal.timeout(timeout),
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; goat-atlas-linkcheck/1.0; +https://github.com/haohaohao-cell/goat-atlas)",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  return response;
}

async function probe(url) {
  let response;
  try {
    response = await request(url, "HEAD");
  } catch (error) {
    return { url, kind: "error", status: "", detail: error.name };
  }

  if ([401, 403, 405, 429, 501].includes(response.status)) {
    try {
      response = await request(url, "GET");
    } catch (error) {
      return { url, kind: "error", status: "", detail: error.name };
    }
  }

  const status = response.status;
  const final = response.url;

  if (status >= 200 && status < 400) return { url, kind: "ok", status, final };
  if ([401, 403, 429].includes(status)) return { url, kind: "blocked", status };
  if (status >= 500) {
    await sleep(800);
    try {
      const retry = await request(url, "GET");
      if (retry.status < 400) return { url, kind: "ok", status: retry.status, final: retry.url };
      if (retry.status >= 500) return { url, kind: "error", status: retry.status, detail: "server error" };
      return { url, kind: "broken", status: retry.status };
    } catch (error) {
      return { url, kind: "error", status: "", detail: error.name };
    }
  }
  return { url, kind: "broken", status };
}

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|");
}

async function run(urls) {
  const results = new Array(urls.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (cursor < urls.length) {
      const index = cursor++;
      results[index] = await probe(urls[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

const manualMode = manualUrls.length > 0;
const sourceMap = manualMode ? new Map(manualUrls.map((url) => [url, new Set(["manual"])])) : collectSources();
const urls = [...sourceMap.keys()];

console.log(`Checking ${urls.length} URL(s) with concurrency ${concurrency}, timeout ${timeout}ms...`);

const results = await run(urls);
const byKind = { ok: [], blocked: [], broken: [], error: [] };
for (const result of results) byKind[result.kind].push(result);

const refsOf = (url) => [...(sourceMap.get(url) ?? [])].join(", ");

const lines = [
  "# 来源链接检查",
  "",
  `- 时间：${new Date().toISOString()}`,
  `- 唯一链接：**${urls.length}**`,
  `- 正常：${byKind.ok.length}`,
  `- 被拦截（401/403/429，需人工确认）：${byKind.blocked.length}`,
  `- 失效（404/410/其他 4xx）：${byKind.broken.length}`,
  `- 网络错误 / 超时：${byKind.error.length}`,
  "",
];

function section(title, items, columns) {
  lines.push(`## ${title}`, "");
  if (!items.length) {
    lines.push("无。", "");
    return;
  }
  lines.push(`| ${columns.join(" | ")} |`, `| ${columns.map(() => "---").join(" | ")} |`);
  for (const item of items) {
    lines.push(
      `| ${[item.status || item.detail || "", item.url, refsOf(item.url)]
        .map(escapeCell)
        .join(" | ")} |`,
    );
  }
  lines.push("");
}

section("失效", byKind.broken, ["状态", "URL", "引用"]);
section("网络错误", byKind.error, ["错误", "URL", "引用"]);
section("被拦截", byKind.blocked, ["状态", "URL", "引用"]);

const report = lines.join("\n");
writeFileSync(join(root, reportPath), report, "utf8");
if (jsonPath) {
  writeFileSync(join(root, jsonPath), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2), "utf8");
}

console.log(`ok: ${byKind.ok.length}, blocked: ${byKind.blocked.length}, broken: ${byKind.broken.length}, error: ${byKind.error.length}`);
if (byKind.broken.length || byKind.error.length) {
  for (const item of [...byKind.broken, ...byKind.error]) {
    console.log(`FAIL ${item.status || item.detail} ${item.url} (${refsOf(item.url)})`);
  }
}
console.log(`Report written to ${reportPath}`);

process.exit(byKind.broken.length || byKind.error.length ? 1 : 0);
