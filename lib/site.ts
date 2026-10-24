function normalizeBasePath(value: string | undefined): string {
  if (!value || value === "/") return "";
  const withoutEdges = value.replace(/^\/+|\/+$/g, "");
  return withoutEdges ? `/${withoutEdges}` : "";
}

const origin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export const siteConfig = {
  name: "GOAT Atlas",
  title: "GOAT Atlas | C罗职业生涯图鉴",
  description:
    "一个可检索、可追溯、可分享的 C 罗职业生涯数据博物馆。收录名场面、冠军、纪录与故事，每一条都有出处。",
  origin,
  basePath,
  url: `${origin}${basePath}`,
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "",
  locale: "zh_CN",
};

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
