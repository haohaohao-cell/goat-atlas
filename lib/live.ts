import liveJson from "@/data/live.json";
import { liveSchema } from "./schemas";
import type { LiveData } from "./types";

export const live = liveSchema.parse(liveJson) as LiveData;

export function liveStatusLabel(status: LiveData["status"]): string {
  if (status === "live") return "自动同步中";
  if (status === "snapshot") return "策展快照";
  return "等待配置";
}

export function liveUpdatedDate(): string {
  return live.updatedAt.slice(0, 10);
}
