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
