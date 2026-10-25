import type { MetadataRoute } from "next";
import { moments } from "@/lib/data";
import { latestContentDate } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const withSlash = (path: string) => `${base}${path}/`;
  const contentUpdated = new Date(`${latestContentDate()}T00:00:00Z`);

  const staticRoutes = [
    "",
    "/atlas",
    "/story",
    "/about",
    "/live",
    "/matches",
    "/play",
    "/quiz",
    "/compare",
    "/today",
    "/milestones",
    "/en",
    "/pt",
    "/credits",
    "/gallery",
  ].map((route) => ({
      url: route === "" ? `${base}/` : withSlash(route),
      lastModified: contentUpdated,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  );

  const momentRoutes = moments.map((moment) => ({
    url: withSlash(`/atlas/${moment.slug}`),
    lastModified: new Date(moment.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...momentRoutes];
}
