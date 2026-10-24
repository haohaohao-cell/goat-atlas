import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath =
  rawBasePath && rawBasePath !== "/"
    ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

const pagesConfig = isGitHubPages
  ? {
      output: "export" as const,
      trailingSlash: true,
      images: { unoptimized: true },
      ...(basePath ? { basePath } : {}),
    }
  : {};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  ...pagesConfig,
};

export default nextConfig;
