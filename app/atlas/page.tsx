import type { Metadata } from "next";
import { AtlasExplorer } from "@/components/AtlasExplorer";
import { moments, player, stats } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Atlas · 名场面检索",
  description:
    "按年份、章节、类型、对手和关键词检索 C 罗职业生涯的 46 个名场面。每一条记录都附有来源。",
  alternates: { canonical: `${siteConfig.url}/atlas/` },
};

export default function AtlasPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">
            THE ATLAS <span>·</span> {stats.yearStart}—{stats.yearEnd}
          </div>
          <h1>
            把职业生涯，
            <br />
            摊开成一张地图。
          </h1>
          <div className="page-hero-bottom">
            <p>
              按章节、类型、对手或关键词检索。这里收录的不是全部，
              而是目前最值得被记住的 {stats.moments} 个坐标。
            </p>
            <div className="page-hero-meta">
              <span>{stats.moments} 个瞬间</span>
              <span>{stats.eras} 个章节</span>
              <span>{stats.sources} 个来源</span>
            </div>
          </div>
        </div>
      </section>

      <AtlasExplorer moments={moments} eras={player.eras} />
    </>
  );
}
