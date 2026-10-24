import type { Metadata } from "next";
import { StoryExperience } from "@/components/StoryExperience";
import { erasWithMoments, stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Story · 二十二年，六个章节",
  description:
    "沿着时间线读 C 罗的职业生涯：里斯本、曼彻斯特、马德里、都灵、回家，以及利雅得。不是集锦，是故事。",
  alternates: { canonical: "/story" },
};

export default function StoryPage() {
  return (
    <>
      <section className="story-hero">
        <div className="story-hero-bg" aria-hidden="true" />
        <div className="container">
          <div className="eyebrow">
            THE STORY <span>·</span> {stats.yearStart}—{stats.yearEnd}
          </div>

          <h1>
            一个人，
            <br />
            <span>二十二年。</span>
          </h1>

          <div className="story-hero-bottom">
            <p>
              这不是一份履历，也不是一条数据曲线。
              这是一条从马德拉出发、经过里斯本、曼彻斯特、马德里、都灵，
              最后抵达利雅得的路。
            </p>
            <div className="story-hero-meta">
              <span>{stats.moments} 个瞬间</span>
              <span>{stats.eras} 个章节</span>
              <span>约 12 分钟读完</span>
            </div>
          </div>
        </div>
      </section>

      <StoryExperience eras={erasWithMoments} />
    </>
  );
}
