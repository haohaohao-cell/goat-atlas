import type { Moment } from "./types";
import { absoluteUrl, siteConfig } from "./site";

const PERSON = {
  "@type": "Person",
  name: "Cristiano Ronaldo",
  alternateName: ["C 罗", "CR7"],
  birthDate: "1985-02-05",
  birthPlace: {
    "@type": "Place",
    name: "Funchal, Madeira, Portugal",
  },
  nationality: "Portugal",
  jobTitle: "Footballer",
  url: absoluteUrl("/"),
  sameAs: ["https://en.wikipedia.org/wiki/Cristiano_Ronaldo"],
};

export function websiteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: `${siteConfig.url}/`,
        description: siteConfig.description,
        inLanguage: "zh-CN",
        about: PERSON,
      },
      {
        ...PERSON,
        description:
          "葡萄牙足球运动员，GOAT Atlas 收录的职业生涯图鉴主角。",
      },
    ],
  };
}

export function momentGraph(moment: Moment) {
  const pageUrl = absoluteUrl(`/atlas/${moment.slug}/`);
  const image = absoluteUrl(`/og/era-${moment.era}.png`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: moment.title,
        name: moment.title,
        description: moment.summary,
        datePublished: `${moment.date}T00:00:00+00:00`,
        dateModified: `${moment.date}T00:00:00+00:00`,
        inLanguage: "zh-CN",
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        image: [image],
        author: {
          "@type": "Organization",
          name: "GOAT Atlas contributors",
          url: `${siteConfig.url}/about/`,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: `${siteConfig.url}/`,
        },
        about: PERSON,
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: `${siteConfig.url}/`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "首页",
            item: `${siteConfig.url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Atlas",
            item: `${siteConfig.url}/atlas/`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: moment.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
