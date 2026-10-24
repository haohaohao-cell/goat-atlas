import type { MetadataRoute } from "next";
import { moments } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = ["", "/atlas", "/story", "/about"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const momentRoutes = moments.map((moment) => ({
    url: `${base}/atlas/${moment.slug}`,
    lastModified: new Date(moment.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...momentRoutes];
}
