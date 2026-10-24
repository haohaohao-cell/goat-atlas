"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { Era, Moment, MomentKind } from "@/lib/types";
import { KIND_META, KIND_ORDER } from "@/lib/kinds";
import { MomentCard } from "./MomentCard";
import { CloseIcon, SearchIcon } from "./Icons";

type KindFilter = MomentKind | "all";
type SortMode = "oldest" | "newest" | "az";

export function AtlasExplorer({
  moments,
  eras,
}: {
  moments: Moment[];
  eras: Era[];
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [era, setEra] = useState("all");
  const [sort, setSort] = useState<SortMode>("oldest");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag) setQuery(tag);
  }, []);

  const kindCounts = useMemo(() => {
    const counts: Record<MomentKind, number> = {
      goal: 0,
      trophy: 0,
      award: 0,
      debut: 0,
      moment: 0,
    };
    for (const moment of moments) counts[moment.kind] += 1;
    return counts;
  }, [moments]);

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    const result = moments.filter((moment) => {
      if (kind !== "all" && moment.kind !== kind) return false;
      if (era !== "all" && moment.era !== era) return false;
      if (!needle) return true;

      const haystack = [
        moment.title,
        moment.titleEn,
        moment.summary,
        moment.context,
        moment.club,
        moment.clubZh,
        moment.competition,
        moment.opponent ?? "",
        moment.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });

    return result.sort((a, b) => {
      if (sort === "newest") return b.date.localeCompare(a.date);
      if (sort === "az") return a.title.localeCompare(b.title, "zh-CN");
      return a.date.localeCompare(b.date);
    });
  }, [moments, kind, era, deferredQuery, sort]);

  const hasFilters = query !== "" || kind !== "all" || era !== "all";

  function reset() {
    setQuery("");
    setKind("all");
    setEra("all");
    setSort("oldest");
  }

  return (
    <section className="atlas-section" aria-label="名场面检索">
      <div className="container">
        <div className="atlas-controls">
          <label className="atlas-search">
            <SearchIcon width={20} height={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索名场面、对手、赛事或关键词……"
              aria-label="搜索名场面"
            />
            {query ? (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="清空搜索"
              >
                <CloseIcon width={16} height={16} />
              </button>
            ) : null}
          </label>

          <label className="atlas-sort">
            <span>排序</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
            >
              <option value="oldest">时间正序</option>
              <option value="newest">时间倒序</option>
              <option value="az">按标题</option>
            </select>
          </label>
        </div>

        <div className="filter-block">
          <span className="filter-label">类型</span>
          <div className="filter-chips">
            <button
              type="button"
              className={kind === "all" ? "chip is-active" : "chip"}
              onClick={() => setKind("all")}
              aria-pressed={kind === "all"}
            >
              全部
              <em>{moments.length}</em>
            </button>
            {KIND_ORDER.map((item) => (
              <button
                key={item}
                type="button"
                className={kind === item ? "chip is-active" : "chip"}
                onClick={() => setKind(item)}
                aria-pressed={kind === item}
              >
                {KIND_META[item].label}
                <em>{kindCounts[item]}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <span className="filter-label">章节</span>
          <div className="filter-chips">
            <button
              type="button"
              className={era === "all" ? "chip is-active" : "chip"}
              onClick={() => setEra("all")}
              aria-pressed={era === "all"}
            >
              全部
            </button>
            {eras.map((item) => (
              <button
                key={item.id}
                type="button"
                className={era === item.id ? "chip is-active" : "chip"}
                onClick={() => setEra(item.id)}
                aria-pressed={era === item.id}
              >
                {item.name}
                <em>{item.range.split("—")[0]}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="atlas-results-head">
          <p role="status">
            <strong>{filtered.length}</strong> 个瞬间
            <span>· 共 {moments.length} 条记录</span>
          </p>
          <button
            type="button"
            className="text-button"
            onClick={reset}
            disabled={!hasFilters}
          >
            重置筛选
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="moment-grid">
            {filtered.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        ) : (
          <div className="atlas-empty">
            <span>Ø</span>
            <h3>没有找到这个瞬间</h3>
            <p>换一个关键词，或者清空筛选，重新逛一遍。</p>
            <button type="button" className="button button-gold" onClick={reset}>
              查看全部
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
