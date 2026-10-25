import updatesJson from "@/data/updates.json";
import { updatesSchema } from "./schemas";
import type { UpdateItem, UpdatesData } from "./types";

export const updates: UpdatesData = updatesSchema.parse(
  updatesJson,
) as UpdatesData;

export const UPDATE_KIND_LABEL: Record<UpdateItem["kind"], string> = {
  match: "比赛",
  milestone: "里程碑",
  title: "冠军",
  record: "纪录",
};

export function sortedUpdates(): UpdateItem[] {
  return [...updates.items].sort((a, b) => b.date.localeCompare(a.date));
}
