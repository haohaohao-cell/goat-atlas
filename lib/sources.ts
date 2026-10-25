import type { SourceTier } from "./types";

export const SOURCE_TIER_META: Record<
  SourceTier,
  { label: string; hint: string; className: string; rank: number }
> = {
  official: {
    label: "官方",
    hint: "赛事组织、俱乐部或联赛的官方页面",
    className: "tier-official",
    rank: 0,
  },
  media: {
    label: "媒体",
    hint: "通讯社或媒体的现场报道",
    className: "tier-media",
    rank: 1,
  },
  reference: {
    label: "百科",
    hint: "维基百科等索引条目，用于交叉核对",
    className: "tier-reference",
    rank: 2,
  },
  other: {
    label: "其他",
    hint: "暂未分级的来源",
    className: "tier-other",
    rank: 3,
  },
};

const OFFICIAL_HOSTS = [
  "uefa.com",
  "fifa.com",
  "premierleague.com",
  "manutd.com",
  "realmadrid.com",
  "juventus.com",
  "alnassr.sa",
  "fpf.pt",
  "the-afc.com",
  "spl.com.sa",
];

const REFERENCE_HOSTS = ["wikipedia.org", "wikidata.org", "britannica.com"];

const MEDIA_HOSTS = [
  "bbc.com",
  "bbc.co.uk",
  "rte.ie",
  "abc.net.au",
  "espn.com",
  "apnews.com",
  "reuters.com",
  "onefootball.com",
  "sportsmole.co.uk",
  "tbsnews.net",
  "azertag.az",
  "saudigazette.com.sa",
  "olympics.com",
  "theguardian.com",
  "skysports.com",
  "marca.com",
  "as.com",
  "record.pt",
  "abola.pt",
  "ojogo.pt",
];

export function sourceHost(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function matches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

export function sourceTier(url: string, explicit?: SourceTier): SourceTier {
  if (explicit) return explicit;
  const host = sourceHost(url);
  if (!host) return "other";
  if (OFFICIAL_HOSTS.some((domain) => matches(host, domain))) return "official";
  if (REFERENCE_HOSTS.some((domain) => matches(host, domain)))
    return "reference";
  if (MEDIA_HOSTS.some((domain) => matches(host, domain))) return "media";
  return "other";
}

export function sourceTierCounts(
  sources: { url: string; tier?: SourceTier }[],
): Record<SourceTier, number> {
  const counts: Record<SourceTier, number> = {
    official: 0,
    media: 0,
    reference: 0,
    other: 0,
  };
  for (const source of sources) {
    counts[sourceTier(source.url, source.tier)] += 1;
  }
  return counts;
}

export function correctionIssueUrl(options: {
  githubUrl: string;
  slug: string;
  title: string;
  date: string;
  sources: { label: string; url: string }[];
}): string {
  const { githubUrl, slug, title, date, sources } = options;
  const body = [
    `记录：${title}（${date}）`,
    `页面：/atlas/${slug}/`,
    "",
    "问题类型：日期 / 比分 / 对手 / 来源 / 文字表述（请保留一项并补充说明）",
    "",
    "当前来源：",
    ...sources.map((source) => `- ${source.label}：${source.url}`),
    "",
    "建议补充的来源（请附链接）：",
    "",
  ].join("\n");

  const params = new URLSearchParams({
    template: "data-correction.yml",
    title: `[数据纠错] ${title}`,
    body,
  });

  return `${githubUrl}/issues/new?${params.toString()}`;
}
