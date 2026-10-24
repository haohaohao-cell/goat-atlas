import type { MomentKind } from "./types";

export const KIND_META: Record<
  MomentKind,
  { label: string; en: string; short: string }
> = {
  goal: { label: "进球", en: "Goal", short: "G" },
  trophy: { label: "冠军", en: "Trophy", short: "T" },
  award: { label: "荣誉", en: "Award", short: "A" },
  debut: { label: "首秀", en: "Debut", short: "D" },
  moment: { label: "时刻", en: "Moment", short: "M" },
};

export const KIND_ORDER: MomentKind[] = [
  "goal",
  "trophy",
  "award",
  "debut",
  "moment",
];
