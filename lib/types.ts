export type MomentKind = "goal" | "trophy" | "award" | "debut" | "moment";

export type SourceTier = "official" | "media" | "reference" | "other";

export interface Source {
  label: string;
  url: string;
  tier?: SourceTier;
}

export interface MomentStat {
  label: string;
  value: string;
}

export interface Moment {
  id: string;
  slug: string;
  date: string;
  title: string;
  titleEn: string;
  kind: MomentKind;
  club: string;
  clubZh: string;
  competition: string;
  opponent?: string;
  venue?: string;
  city?: string;
  score?: string;
  minute?: string;
  summary: string;
  context: string;
  why: string;
  tags: string[];
  featured: boolean;
  era: string;
  stat?: MomentStat;
  sources: Source[];
  media?: MomentMedia;
}

export interface Era {
  id: string;
  index: string;
  label: string;
  name: string;
  range: string;
  club: string;
  description: string;
}

export interface Club {
  name: string;
  nameZh: string;
  years: string;
}

export interface Player {
  id: string;
  name: string;
  nameZh: string;
  shortName: string;
  nickname: string;
  tagline: string;
  intro: string;
  birthDate: string;
  birthPlace: string;
  position: string;
  clubs: Club[];
  honours: string[];
  eras: Era[];
}

export interface AtlasStats {
  moments: number;
  eras: number;
  sources: number;
  clubs: number;
  goalMoments: number;
  yearStart: number;
  yearEnd: number;
}

export interface EraWithMoments extends Era {
  moments: Moment[];
}

export type LiveStatus = "live" | "fallback" | "snapshot" | "unconfigured";

export interface LiveStat {
  competition: string;
  team: string;
  appearances: number;
  goals: number;
  assists?: number;
  minutes?: number;
}

export interface LiveGoal {
  minute: string | null;
  penalty: boolean;
  ownGoal: boolean;
}

export interface LiveMatch {
  date: string;
  competition: string;
  opponent: string;
  score: string;
  result: "W" | "D" | "L";
  goals: number;
  ronaldoGoals?: LiveGoal[];
  venue?: string;
  sourceUrl?: string;
}

export interface LiveMilestone {
  date: string;
  title: string;
  detail: string;
}

export interface LiveFixture {
  date: string;
  time?: string;
  competition: string;
  opponent: string;
  venue?: string;
  home: boolean;
  sourceUrl?: string;
}

export interface LiveData {
  updatedAt: string;
  checkedAt: string;
  provider: string;
  status: LiveStatus;
  season: string;
  note: string;
  sourceUrl?: string;
  stats: LiveStat[];
  recentMatches: LiveMatch[];
  fixtures: LiveFixture[];
  latest: LiveMilestone[];
}

export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source: string;
  difficulty: QuizDifficulty;
  tags: string[];
}

export interface ComparePlayer {
  id: string;
  name: string;
  nameZh: string;
  country: string;
  accent: "gold" | "blue";
  sources: Source[];
}

export interface CompareMetric {
  id: string;
  label: string;
  short: string;
  unit: string;
  defaultWeight: number;
  values: Record<string, number>;
  source: string;
  note?: string;
}

export interface CompareData {
  asOf: string;
  note: string;
  players: ComparePlayer[];
  metrics: CompareMetric[];
}

export interface MilestoneBreakdown {
  label: string;
  value: number;
}

export interface Milestone {
  id: string;
  title: string;
  category: string;
  current: number;
  target: number;
  unit: string;
  description: string;
  source: string;
  featured?: boolean;
  breakdown?: MilestoneBreakdown[];
}

export interface MilestonesData {
  asOf: string;
  note: string;
  items: Milestone[];
}

export type UpdateKind = "match" | "milestone" | "title" | "record";

export interface UpdateItem {
  date: string;
  kind: UpdateKind;
  title: string;
  summary: string;
  source: string;
}

export interface UpdatesData {
  asOf: string;
  note: string;
  items: UpdateItem[];
}

export interface MomentMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
  width?: number;
  height?: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  era: string;
  credit: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
}

export interface GalleryData {
  asOf: string;
  note: string;
  items: GalleryItem[];
}
