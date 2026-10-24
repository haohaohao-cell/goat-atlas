"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { EraWithMoments } from "@/lib/types";
import { KIND_META } from "@/lib/kinds";
import { formatDate, getYear } from "@/lib/format";
import { ArrowUpRight } from "./Icons";

export function StoryExperience({ eras }: { eras: EraWithMoments[] }) {
  const [active, setActive] = useState(eras[0]?.id ?? "");

  const activeIndex = useMemo(
    () => Math.max(0, eras.findIndex((era) => era.id === active)),
    [eras, active],
  );

  useEffect(() => {
    const sections = eras
      .map((era) => document.getElementById(`era-${era.id}`))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace("era-", ""));
          }
        }
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [eras]);

  return (
    <div className="container story-layout">
      <aside className="story-rail" aria-label="生涯章节导航">
        <div className="story-rail-counter">
          <span>CHAPTER</span>
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <em>/ {String(eras.length).padStart(2, "0")}</em>
        </div>

        <nav className="story-rail-nav">
          {eras.map((era) => (
            <a
              key={era.id}
              href={`#era-${era.id}`}
              className={era.id === active ? "is-active" : ""}
              aria-current={era.id === active ? "true" : undefined}
            >
              <span className="story-rail-index">{era.index}</span>
              <span className="story-rail-name">
                {era.name}
                <em>{era.range}</em>
              </span>
            </a>
          ))}
        </nav>

        <div className="story-progress" aria-hidden="true">
          <span style={{ width: `${((activeIndex + 1) / eras.length) * 100}%` }} />
        </div>
      </aside>

      <div className="story-flow">
        {eras.map((era) => (
          <section
            key={era.id}
            id={`era-${era.id}`}
            className="story-chapter"
            data-era={era.id}
          >
            <header className="story-chapter-head">
              <span className="story-chapter-index">{era.index}</span>
              <div>
                <p className="eyebrow">
                  {era.label} · {era.range}
                </p>
                <h2>{era.name}</h2>
                <p className="story-chapter-description">{era.description}</p>
                <p className="story-chapter-club">{era.club}</p>
              </div>
            </header>

            <div className="story-moments">
              {era.moments.map((moment) => (
                <article className="story-moment" key={moment.id}>
                  <div className="story-moment-year" aria-hidden="true">
                    {getYear(moment.date)}
                  </div>

                  <div className="story-moment-body">
                    <div className="story-moment-kicker">
                      <span>{formatDate(moment.date)}</span>
                      <span className="story-kind">
                        {KIND_META[moment.kind].label}
                      </span>
                      <span>{moment.competition}</span>
                    </div>

                    <h3>
                      <Link href={`/atlas/${moment.slug}`}>{moment.title}</Link>
                    </h3>
                    <p className="story-moment-en">{moment.titleEn}</p>
                    <p className="story-moment-summary">{moment.summary}</p>

                    {moment.stat ? (
                      <div className="story-stat">
                        <strong>{moment.stat.value}</strong>
                        <span>{moment.stat.label}</span>
                      </div>
                    ) : null}

                    <Link
                      className="story-moment-link"
                      href={`/atlas/${moment.slug}`}
                    >
                      展开这个瞬间
                      <ArrowUpRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="story-end">
          <p className="eyebrow">END OF THE STORY — FOR NOW</p>
          <h2>故事还没有结束。</h2>
          <p>
            这里收录的是 26 个坐标，不是全部。下一章，可能是第 1000 球，也可能是某个
            还没发生的夜晚。
          </p>
          <div className="story-end-actions">
            <Link className="button button-gold" href="/atlas">
              进入 Atlas 检索
              <ArrowUpRight />
            </Link>
            <Link className="button button-ghost" href="/about#contribute">
              参与补充
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
