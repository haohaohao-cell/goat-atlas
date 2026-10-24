import type { Metadata } from "next";
import { LocalizedHome } from "@/components/LocalizedHome";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "GOAT Atlas | Atlas da carreira de Cristiano Ronaldo",
  },
  description:
    "Um atlas aberto e com fontes sobre a carreira de Cristiano Ronaldo: 56 momentos, seis capítulos, dados ao vivo e lembretes de jogos.",
  alternates: {
    canonical: absoluteUrl("/pt/"),
    languages: {
      en: absoluteUrl("/en/"),
      pt: absoluteUrl("/pt/"),
      "zh-CN": absoluteUrl("/"),
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: absoluteUrl("/pt/"),
    siteName: "GOAT Atlas",
    title: "GOAT Atlas | Atlas da carreira de Cristiano Ronaldo",
    description:
      "Um atlas aberto e com fontes sobre a carreira de Cristiano Ronaldo: 56 momentos, seis capítulos, dados ao vivo e lembretes de jogos.",
    images: [{ url: absoluteUrl("/og.png"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOAT Atlas | Atlas da carreira de Cristiano Ronaldo",
    description:
      "Um atlas aberto e com fontes sobre a carreira de Cristiano Ronaldo.",
    images: [absoluteUrl("/og.png")],
  },
};

export default function PortugueseHomePage() {
  return <LocalizedHome locale="pt" />;
}
