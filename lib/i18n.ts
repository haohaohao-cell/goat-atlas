export type Locale = "en" | "pt";

interface LocalizedCard {
  index: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}

export interface LocalizedHomeCopy {
  eyebrow: string;
  kicker: string;
  name: string;
  lede: string;
  primary: string;
  secondary: string;
  proof: [string, string, string];
  note: string;
  insideTitle: string;
  insideIntro: string;
  cards: LocalizedCard[];
  chaptersTitle: string;
  chaptersIntro: string;
  momentsTitle: string;
  momentsIntro: string;
  ctaTitle: string;
  ctaBody: string;
  languageNote: string;
}

export const localizedHome: Record<Locale, LocalizedHomeCopy> = {
  en: {
    eyebrow: "UNOFFICIAL FAN ATLAS · 2003—2026",
    kicker: "THE CAREER OF",
    name: "Cristiano Ronaldo",
    lede: "From Madeira to the world stage. 86 defining moments, six chapters, and a source for every claim.",
    primary: "Open the Atlas",
    secondary: "Read the story",
    proof: ["moments", "chapters", "sources"],
    note: "English overview. The full interactive Atlas is currently Chinese-first; English and Portuguese editions are being expanded.",
    insideTitle: "Not another tribute page.",
    insideIntro: "A source-backed career atlas you can search, read and share.",
    cards: [
      {
        index: "01",
        title: "Atlas",
        body: "Search 86 defining moments by chapter, type, opponent or keyword.",
        href: "/atlas",
        cta: "Explore",
      },
      {
        index: "02",
        title: "Story",
        body: "Six chapters from Lisbon to Riyadh.",
        href: "/story",
        cta: "Read",
      },
      {
        index: "03",
        title: "Live",
        body: "Current-season totals, recent matches and goal minutes. Free data, refreshed every six hours.",
        href: "/live",
        cta: "View",
      },
      {
        index: "04",
        title: "Matches",
        body: "Fixtures, post-match reports and a calendar you can subscribe to.",
        href: "/matches",
        cta: "Open",
      },
      {
        index: "05",
        title: "Play",
        body: "Daily quiz and a transparent GOAT comparison tool.",
        href: "/play",
        cta: "Play",
      },
      {
        index: "06",
        title: "Milestones",
        body: "Track the gaps to 150 Portugal goals, 250 caps and more.",
        href: "/milestones",
        cta: "Track",
      },
    ],
    chaptersTitle: "Six chapters, one career.",
    chaptersIntro:
      "From Lisbon to Riyadh, each chapter has its own colour, opponents and cost.",
    momentsTitle: "Selected coordinates.",
    momentsIntro: "Every entry links back to a source.",
    ctaTitle: "Start anywhere.",
    ctaBody:
      "Search, read, play, or follow the next match. No account needed.",
    languageNote: "English overview · Chinese-first data",
  },
  pt: {
    eyebrow: "ATLAS NÃO OFICIAL · 2003—2026",
    kicker: "A CARREIRA DE",
    name: "Cristiano Ronaldo",
    lede: "Da Madeira ao topo do mundo. 86 momentos, seis capítulos e uma fonte para cada afirmação.",
    primary: "Abrir o Atlas",
    secondary: "Ler a história",
    proof: ["momentos", "capítulos", "fontes"],
    note: "Visão geral em português. O Atlas interativo completo está por enquanto em chinês; as edições em inglês e português estão a ser ampliadas.",
    insideTitle: "Não é mais uma página de homenagem.",
    insideIntro:
      "Um atlas de carreira com fontes, para pesquisar, ler e partilhar.",
    cards: [
      {
        index: "01",
        title: "Atlas",
        body: "Pesquise 86 momentos por capítulo, tipo, adversário ou palavra-chave.",
        href: "/atlas",
        cta: "Explorar",
      },
      {
        index: "02",
        title: "História",
        body: "Seis capítulos de Lisboa a Riade.",
        href: "/story",
        cta: "Ler",
      },
      {
        index: "03",
        title: "Live",
        body: "Números da temporada, jogos recentes e minutos dos golos. Dados gratuitos, atualizados a cada seis horas.",
        href: "/live",
        cta: "Ver",
      },
      {
        index: "04",
        title: "Jogos",
        body: "Jogos, relatos pós-jogo e um calendário para subscrever.",
        href: "/matches",
        cta: "Abrir",
      },
      {
        index: "05",
        title: "Jogar",
        body: "Quiz diário e um comparador GOAT transparente.",
        href: "/play",
        cta: "Jogar",
      },
      {
        index: "06",
        title: "Marcos",
        body: "Acompanhe a distância para os 150 golos por Portugal, 250 internacionalizações e mais.",
        href: "/milestones",
        cta: "Acompanhar",
      },
    ],
    chaptersTitle: "Seis capítulos, uma carreira.",
    chaptersIntro:
      "De Lisboa a Riade, cada capítulo tem a sua cor, adversários e custo.",
    momentsTitle: "Coordenadas selecionadas.",
    momentsIntro: "Cada entrada tem uma fonte.",
    ctaTitle: "Comece por onde quiser.",
    ctaBody:
      "Pesquise, leia, jogue ou acompanhe o próximo jogo. Sem conta.",
    languageNote: "Visão geral em português · dados em chinês",
  },
};

export const eraCopy: Record<
  Locale,
  Record<string, { name: string; description: string }>
> = {
  en: {
    lisbon: {
      name: "Lisbon",
      description:
        "A Madeira-born teenager joins Sporting CP and catches Manchester United's eye.",
    },
    "manchester-1": {
      name: "Manchester",
      description:
        "From stepovers to a first Ballon d'Or under Ferguson.",
    },
    madrid: {
      name: "Madrid",
      description:
        "438 games, 450 goals, four Champions League titles.",
    },
    turin: {
      name: "Turin",
      description:
        "A new challenge in Serie A and a hat-trick against Atlético.",
    },
    "manchester-2": {
      name: "The Return",
      description:
        "Back at Old Trafford, two goals on his second debut.",
    },
    riyadh: {
      name: "Riyadh & Beyond",
      description:
        "Five World Cups, 900 goals and a Nations League title.",
    },
  },
  pt: {
    lisbon: {
      name: "Lisboa",
      description:
        "O adolescente da Madeira entra no Sporting CP e chama a atenção do Manchester United.",
    },
    "manchester-1": {
      name: "Manchester",
      description:
        "Dos dribles ao primeiro Ballon d'Or, com Ferguson.",
    },
    madrid: {
      name: "Madrid",
      description:
        "438 jogos, 450 golos e quatro Champions League.",
    },
    turin: {
      name: "Turim",
      description:
        "Um novo desafio na Serie A e um hat-trick contra o Atlético.",
    },
    "manchester-2": {
      name: "O Regresso",
      description:
        "De volta a Old Trafford, dois golos na segunda estreia.",
    },
    riyadh: {
      name: "Riade e Além",
      description:
        "Cinco Mundiais, 900 golos e uma Liga das Nações.",
    },
  },
};
