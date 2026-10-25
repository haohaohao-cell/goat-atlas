#!/usr/bin/env node
/**
 * 用 YouTube oEmbed 验证视频是否存在，并输出标题 / 频道 / 缩略图。
 * 在 CI 里跑（本地网络不可靠）。
 *
 * 用法：node scripts/verify-video.mjs https://www.youtube.com/watch?v=...
 */

const url = process.argv[2];

if (!url) {
  console.error("Usage: node scripts/verify-video.mjs <youtube-url>");
  process.exit(1);
}

const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

const response = await fetch(endpoint, {
  headers: {
    "user-agent":
      "Mozilla/5.0 (compatible; goat-atlas-video-check/1.0; +https://github.com/haohaohao-cell/goat-atlas)",
    accept: "application/json",
  },
});

const body = await response.text();

if (!response.ok) {
  console.error(`INVALID (${response.status}): ${url}`);
  console.error(body.slice(0, 300));
  process.exit(1);
}

const data = JSON.parse(body);
console.log(
  JSON.stringify(
    {
      url,
      title: data.title,
      author_name: data.author_name,
      author_url: data.author_url,
      thumbnail_url: data.thumbnail_url,
      provider_name: data.provider_name,
    },
    null,
    2,
  ),
);
