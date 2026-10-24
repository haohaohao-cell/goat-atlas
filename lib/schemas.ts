import { z } from "zod";

export const momentKindSchema = z.enum([
  "goal",
  "trophy",
  "award",
  "debut",
  "moment",
]);

const sourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

const statSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const momentSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  titleEn: z.string().min(1),
  kind: momentKindSchema,
  club: z.string().min(1),
  clubZh: z.string().min(1),
  competition: z.string().min(1),
  opponent: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  score: z.string().optional(),
  minute: z.string().optional(),
  summary: z.string().min(1),
  context: z.string().min(1),
  why: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  featured: z.boolean(),
  era: z.string().min(1),
  stat: statSchema.optional(),
  sources: z.array(sourceSchema).min(1),
});

export const eraSchema = z.object({
  id: z.string().min(1),
  index: z.string().min(1),
  label: z.string().min(1),
  name: z.string().min(1),
  range: z.string().min(1),
  club: z.string().min(1),
  description: z.string().min(1),
});

export const clubSchema = z.object({
  name: z.string().min(1),
  nameZh: z.string().min(1),
  years: z.string().min(1),
});

export const playerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameZh: z.string().min(1),
  shortName: z.string().min(1),
  nickname: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(1),
  birthDate: z.string().min(1),
  birthPlace: z.string().min(1),
  position: z.string().min(1),
  clubs: z.array(clubSchema).min(1),
  honours: z.array(z.string().min(1)).min(1),
  eras: z.array(eraSchema).min(1),
});

export const momentsSchema = z.array(momentSchema).min(1);

const liveStatSchema = z.object({
  competition: z.string().min(1),
  team: z.string().min(1),
  appearances: z.number().nonnegative(),
  goals: z.number().nonnegative(),
  assists: z.number().nonnegative().optional(),
  minutes: z.number().nonnegative().optional(),
});

const liveGoalSchema = z.object({
  minute: z.string().nullable(),
  penalty: z.boolean(),
  ownGoal: z.boolean(),
});

const liveMatchSchema = z.object({
  date: z.string().min(1),
  competition: z.string().min(1),
  opponent: z.string().min(1),
  score: z.string().min(1),
  result: z.enum(["W", "D", "L"]),
  goals: z.number().nonnegative(),
  ronaldoGoals: z.array(liveGoalSchema).optional(),
  venue: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const liveFixtureSchema = z.object({
  date: z.string().min(1),
  time: z.string().optional(),
  competition: z.string().min(1),
  opponent: z.string().min(1),
  venue: z.string().optional(),
  home: z.boolean(),
  sourceUrl: z.string().optional(),
});

const liveMilestoneSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
});

export const quizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  answer: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
  source: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string().min(1)).min(1),
});

export const quizQuestionsSchema = z.array(quizQuestionSchema).min(1);

const comparePlayerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameZh: z.string().min(1),
  country: z.string().min(1),
  accent: z.enum(["gold", "blue"]),
  sources: z.array(sourceSchema).min(1),
});

const compareMetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  short: z.string().min(1),
  unit: z.string().min(1),
  defaultWeight: z.number().nonnegative(),
  values: z.record(z.string(), z.number()),
  source: z.string().min(1),
  note: z.string().optional(),
});

export const compareSchema = z.object({
  asOf: z.string().min(1),
  note: z.string().min(1),
  players: z.array(comparePlayerSchema).length(2),
  metrics: z.array(compareMetricSchema).min(1),
});

export const liveSchema = z.object({
  updatedAt: z.string().min(1),
  checkedAt: z.string().min(1),
  provider: z.string().min(1),
  status: z.enum(["live", "fallback", "snapshot", "unconfigured"]),
  season: z.string().min(1),
  note: z.string().min(1),
  sourceUrl: z.string().optional(),
  stats: z.array(liveStatSchema),
  recentMatches: z.array(liveMatchSchema),
  fixtures: z.array(liveFixtureSchema),
  latest: z.array(liveMilestoneSchema),
});
