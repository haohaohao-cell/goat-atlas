import { moments } from "./data";
import { gallery } from "./gallery";
import { milestones } from "./milestones";
import { updates } from "./updates";

/**
 * 内容最后更新的日期（取数据里最新的日期）。
 * 用于 sitemap 的 lastModified，避免每次构建都变成“现在”。
 */
export function latestContentDate(): string {
  const dates = [
    ...moments.map((moment) => moment.date),
    ...updates.items.map((item) => item.date),
    updates.asOf,
    gallery.asOf,
    milestones.asOf,
  ];
  return dates.sort().at(-1) ?? "2026-01-01";
}
