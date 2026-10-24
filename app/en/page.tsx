import type { Metadata } from "next";
import { LocalizedHome } from "@/components/LocalizedHome";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "GOAT Atlas | Cristiano Ronaldo career atlas" },
  description:
    "An open, source-backed career atlas for Cristiano Ronaldo: 26 defining moments, six chapters, live data and match reminders.",
  alternates: {
    canonical: absoluteUrl("/en/"),
    languages: {
      en: absoluteUrl("/en/"),
      pt: absoluteUrl("/pt/"),
      "zh-CN": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/en/"),
    siteName: "GOAT Atlas",
    title: "GOAT Atlas | Cristiano Ronaldo career atlas",
    description:
      "An open, source-backed career atlas for Cristiano Ronaldo: 26 defining moments, six chapters, live data and match reminders.",
    images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOAT Atlas | Cristiano Ronaldo career atlas",
    description:
      "An open, source-backed career atlas for Cristiano Ronaldo.",
    images: [absoluteUrl("/og.png")],
  },
};

export default function EnglishHomePage() {
  return <LocalizedHome locale="en" />;
}
