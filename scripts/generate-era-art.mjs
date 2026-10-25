#!/usr/bin/env node
/**
 * 生成六个生涯章节的原创线稿插画（SVG）。
 * 不使用任何第三方照片或版权素材；文件由项目以 CC BY-SA 4.0 发布。
 *
 * 输出：public/art/era-<id>.svg
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const player = JSON.parse(readFileSync(join(root, "data/player.json"), "utf8"));
const outDir = join(root, "public", "art");
mkdirSync(outDir, { recursive: true });

const GOLD = "#e3bd6a";
const MUTED = "#9b9386";

function ticks(count) {
  return Array.from({ length: count }, (_, index) => {
    const y = 140 + index * 52;
    const length = index % 4 === 0 ? 18 : 8;
    return `<line x1="${1080 - length}" y1="${y}" x2="1080" y2="${y}" stroke-opacity="${
      index % 4 === 0 ? 0.26 : 0.12
    }" />`;
  }).join("\n      ");
}

function eraArt(era) {
  const chapter = String(era.index).replace(/^0?/, "").padStart(2, "0");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${era.label} chapter illustration">
  <g fill="none" stroke="${GOLD}" stroke-width="1">
    <circle cx="880" cy="430" r="340" stroke-opacity="0.10" />
    <circle cx="880" cy="430" r="250" stroke-opacity="0.16" />
    <circle cx="880" cy="430" r="160" stroke-opacity="0.08" />
    <path d="M 500 800 A 450 450 0 0 1 1200 800" stroke-opacity="0.18" />
    <path d="M 560 800 A 390 390 0 0 1 1160 800" stroke-opacity="0.10" />
    <line x1="120" y1="120" x2="120" y2="800" stroke-opacity="0.16" />
    <line x1="120" y1="800" x2="1120" y2="800" stroke-opacity="0.16" />
    <g>
      ${ticks(13)}
    </g>
  </g>

  <text x="880" y="600" text-anchor="middle" font-family="'Bodoni 72', Didot, 'Times New Roman', serif" font-size="540" fill="none" stroke="${GOLD}" stroke-opacity="0.13" stroke-width="1.5">7</text>

  <text x="120" y="836" font-family="'SFMono-Regular', Consolas, monospace" font-size="14" letter-spacing="6" fill="${MUTED}" fill-opacity="0.8">CHAPTER ${chapter} · ${era.label.toUpperCase()} · ${era.range}</text>
  <text x="120" y="862" font-family="'SFMono-Regular', Consolas, monospace" font-size="12" letter-spacing="4" fill="${MUTED}" fill-opacity="0.55">GOAT ATLAS · SIX CHAPTERS, ONE CAREER</text>
</svg>
`;
}

let count = 0;
for (const era of player.eras ?? []) {
  writeFileSync(join(outDir, `era-${era.id}.svg`), eraArt(era), "utf8");
  count += 1;
}

console.log(`Era art written: ${count} SVG files → public/art/`);
