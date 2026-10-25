#!/usr/bin/env node
/**
 * 在 CI 里核对 Wikimedia Commons 候选图片的许可证，并只下载自由许可的图。
 *
 * 输入：data/media-candidates.json 的 titles
 * 输出：media-audit/report.json、media-audit/report.md、media-audit/files/*
 *
 * 规则：
 * - 只接受 CC0 / Public domain / CC BY / CC BY-SA（拒绝 NC / ND / 非自由）
 * - 记录作者、许可、原始文件页；没有这些信息的不下载
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const candidates = JSON.parse(
  readFileSync(join(root, "data", "media-candidates.json"), "utf8"),
);
const outDir = join(root, "media-audit");
const filesDir = join(outDir, "files");
mkdirSync(filesDir, { recursive: true });

const UA =
  "goat-atlas-media-audit/1.0 (https://github.com/haohaohao-cell/goat-atlas; contact via GitHub issues)";
const ALLOWED = /^(CC0|Public domain|PD|CC BY(?:-SA)?\s?\d)/i;
const REJECTED = /(NC|ND|Non-free|Fair use)/i;

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extension(url) {
  const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  return (match?.[1] ?? "jpg").toLowerCase();
}

function slug(title) {
  return title
    .replace(/^File:/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

async function queryTitles(titles) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "1200",
    titles: titles.join("|"),
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "user-agent": UA, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Commons API ${response.status}`);
  return response.json();
}

const results = [];
const titles = candidates.titles ?? [];

for (let start = 0; start < titles.length; start += 10) {
  const batch = titles.slice(start, start + 10);
  const data = await queryTitles(batch);
  const pages = data?.query?.pages ?? {};

  for (const page of Object.values(pages)) {
    const title = page.title;
    const info = page.imageinfo?.[0];
    if (!info) {
      results.push({ title, status: "missing", reason: "页面不存在或没有 imageinfo" });
      continue;
    }
    const meta = info.extmetadata ?? {};
    const license = stripHtml(meta.LicenseShortName?.value);
    const licenseUrl = stripHtml(meta.LicenseUrl?.value);
    const artist = stripHtml(meta.Artist?.value) || "未署名";
    const credit = stripHtml(meta.Credit?.value);
    const description = stripHtml(meta.ImageDescription?.value);
    const filePage = info.descriptionurl;
    const original = info.url;

    if (!license || REJECTED.test(license) || !ALLOWED.test(license)) {
      results.push({
        title,
        status: "rejected",
        reason: `许可不接受：${license || "未知"}`,
        license,
        filePage,
      });
      continue;
    }

    const name = `${slug(title)}.${extension(original)}`;
    let downloaded = false;
    try {
      const response = await fetch(original, { headers: { "user-agent": UA } });
      if (response.ok) {
        const buffer = Buffer.from(await response.arrayBuffer());
        writeFileSync(join(filesDir, name), buffer);
        downloaded = true;
      }
    } catch {
      downloaded = false;
    }

    results.push({
      title,
      status: downloaded ? "ok" : "download-failed",
      license,
      licenseUrl,
      artist,
      credit,
      description: description.slice(0, 300),
      filePage,
      original,
      width: info.width,
      height: info.height,
      file: downloaded ? `files/${name}` : null,
    });
  }
}

const ok = results.filter((item) => item.status === "ok");
const rejected = results.filter((item) => item.status !== "ok");

const report = {
  generatedAt: new Date().toISOString(),
  source: "Wikimedia Commons API",
  checked: results.length,
  accepted: ok.length,
  rejected: rejected.length,
  items: results,
};
writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2), "utf8");

const lines = [
  "# 图片许可审计（Wikimedia Commons）",
  "",
  `- 检查：${results.length}`,
  `- 可用：${ok.length}`,
  `- 拒绝 / 失败：${rejected.length}`,
  "",
  "## 可用",
  "",
  "| 文件 | 许可 | 作者 | 尺寸 | 文件页 |",
  "| --- | --- | --- | --- | --- |",
  ...ok.map(
    (item) =>
      `| ${item.title.replace(/\|/g, "\\|")} | ${item.license} | ${item.artist} | ${item.width}×${item.height} | ${item.filePage} |`,
  ),
  "",
  "## 拒绝 / 失败",
  "",
  ...(rejected.length
    ? rejected.map((item) => `- ${item.title}：${item.reason ?? item.status}`)
    : ["无。"]),
];
writeFileSync(join(outDir, "report.md"), lines.join("\n") + "\n", "utf8");

console.log(`Media audit: ${ok.length} accepted, ${rejected.length} rejected/failed`);
for (const item of ok) {
  console.log(`OK ${item.license} | ${item.artist} | ${item.title} -> ${item.file}`);
}
for (const item of rejected) {
  console.log(`SKIP ${item.title}: ${item.reason ?? item.status}`);
}
