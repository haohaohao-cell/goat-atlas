import type { MetadataRoute } from "next";
import { siteConfig, withBasePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const startUrl = siteConfig.basePath ? `${siteConfig.basePath}/` : "/";

  return {
    name: "GOAT Atlas — C罗职业生涯图鉴",
    short_name: "GOAT Atlas",
    description:
      "一个可检索、可追溯、可分享的 C 罗职业生涯数据博物馆。",
    start_url: startUrl,
    scope: startUrl,
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0908",
    theme_color: "#0a0908",
    lang: "zh-CN",
    categories: ["sports", "education", "reference"],
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
