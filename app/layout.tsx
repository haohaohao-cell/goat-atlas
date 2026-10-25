import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "GOAT Atlas contributors" }],
  creator: "GOAT Atlas",
  keywords: [
    "C罗",
    "Cristiano Ronaldo",
    "CR7",
    "足球",
    "GOAT",
    "职业生涯",
    "数据可视化",
    "名场面",
    "欧冠",
    "金球奖",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl("/og.png"),
        width: 1200,
        height: 630,
        alt: "GOAT Atlas — C罗职业生涯图鉴",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/og.png")],
  },
  manifest: absoluteUrl("/manifest.webmanifest"),
  icons: {
    icon: [
      {
        url: absoluteUrl("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: absoluteUrl("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: absoluteUrl("/icons/apple-touch-icon.png"),
        sizes: "180x180",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GOAT Atlas",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main">
          跳到主要内容
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
