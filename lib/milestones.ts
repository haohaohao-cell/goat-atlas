import milestonesJson from "@/data/milestones.json";
import { milestonesSchema } from "./schemas";
import type { Milestone, MilestonesData } from "./types";

export const milestones = milestonesSchema.parse(
  milestonesJson,
) as MilestonesData;

export function milestoneProgress(milestone: Milestone): {
  remaining: number;
  percent: number;
  completed: boolean;
} {
  const remaining = Math.max(milestone.target - milestone.current, 0);
  const percent = Math.min(
    100,
    Math.max(0, (milestone.current / milestone.target) * 100),
  );

  return {
    remaining,
    percent,
    completed: remaining === 0,
  };
}

export function sortedMilestones(): Milestone[] {
  return [...milestones.items].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (b.featured && !a.featured) return 1;
    return milestoneProgress(a).remaining - milestoneProgress(b).remaining;
  });
}
