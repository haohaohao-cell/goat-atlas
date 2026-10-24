import { moments } from "./data";
import type { Moment } from "./types";

function monthDay(dateKey: string): string {
  return dateKey.slice(5);
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function getOnThisDay(dateKey: string): Moment[] {
  const target = monthDay(dateKey);
  return moments
    .filter((moment) => monthDay(moment.date) === target)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getDailyMoment(dateKey: string): Moment {
  const index = hashString(dateKey) % moments.length;
  return moments[index] ?? moments[0];
}

export function getMonthMoments(dateKey: string): Moment[] {
  const month = dateKey.slice(5, 7);
  return moments
    .filter((moment) => moment.date.slice(5, 7) === month)
    .sort((a, b) => b.date.localeCompare(a.date));
}
