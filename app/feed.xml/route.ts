import { moments } from "@/lib/data";
import { latestContentDate } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
  const items = [...moments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const latest = latestContentDate();

  const entries = items
    .map((moment) => {
      const url = `${siteConfig.url}/atlas/${moment.slug}/`;
      return `    <item>
      <title>${escapeXml(moment.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate(moment.date)}</pubDate>
      <description>${escapeXml(moment.summary)}</description>
      <category>${escapeXml(moment.era)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${escapeXml(siteConfig.url)}/</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>zh-cn</language>
    <lastBuildDate>${pubDate(latest)}</lastBuildDate>
    <atom:link href="${escapeXml(siteConfig.url)}/feed.xml" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
