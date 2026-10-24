import momentsJson from "@/data/moments.json";
import playerJson from "@/data/player.json";
import { momentsSchema, playerSchema } from "./schemas";
import type {
  AtlasStats,
  EraWithMoments,
  Moment,
  MomentKind,
  Player,
} from "./types";

export const player: Player = playerSchema.parse(playerJson) as Player;

export const moments: Moment[] = momentsSchema
  .parse(momentsJson)
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date)) as Moment[];

const eraIds = new Set(player.eras.map((era) => era.id));

for (const moment of moments) {
  if (!eraIds.has(moment.era)) {
    throw new Error(
      `Moment "${moment.slug}" references unknown era "${moment.era}".`,
    );
  }
}

const sourceUrls = new Set(
  moments.flatMap((moment) => moment.sources.map((source) => source.url)),
);

const years = moments.map((moment) => Number(moment.date.slice(0, 4)));

export const stats: AtlasStats = {
  moments: moments.length,
  eras: player.eras.length,
  sources: sourceUrls.size,
  clubs: new Set(moments.map((moment) => moment.club)).size,
  goalMoments: moments.filter((moment) => moment.kind === "goal").length,
  yearStart: Math.min(...years),
  yearEnd: Math.max(...years),
};

export const kindCounts = moments.reduce<Record<MomentKind, number>>(
  (acc, moment) => {
    acc[moment.kind] += 1;
    return acc;
  },
  { goal: 0, trophy: 0, award: 0, debut: 0, moment: 0 },
);

export const featuredMoments = moments.filter((moment) => moment.featured);

export const erasWithMoments: EraWithMoments[] = player.eras.map((era) => ({
  ...era,
  moments: moments.filter((moment) => moment.era === era.id),
}));

export function getMomentBySlug(slug: string): Moment | undefined {
  return moments.find((moment) => moment.slug === slug);
}

export function getEra(id: string) {
  return player.eras.find((era) => era.id === id);
}

export function getEraMoments(eraId: string): Moment[] {
  return moments.filter((moment) => moment.era === eraId);
}

export function getMomentNeighbors(slug: string): {
  previous?: Moment;
  next?: Moment;
} {
  const index = moments.findIndex((moment) => moment.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? moments[index - 1] : undefined,
    next: index < moments.length - 1 ? moments[index + 1] : undefined,
  };
}

export function getRelatedMoments(moment: Moment, limit = 3): Moment[] {
  return moments
    .filter((candidate) => candidate.id !== moment.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) =>
        moment.tags.includes(tag),
      ).length;
      const eraBonus = candidate.era === moment.era ? 2 : 0;
      return { candidate, score: sharedTags + eraBonus };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.candidate.date.localeCompare(a.candidate.date),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
