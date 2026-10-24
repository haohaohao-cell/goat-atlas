import Link from "next/link";
import type { EraWithMoments } from "@/lib/types";
import { ArrowUpRight } from "./Icons";

export function EraCard({ era }: { era: EraWithMoments }) {
  return (
    <Link href={`/story#era-${era.id}`} className="era-card">
      <div className="era-card-top">
        <span className="era-index">{era.index}</span>
        <span className="era-label">{era.label}</span>
      </div>

      <div className="era-card-main">
        <h3>{era.name}</h3>
        <p className="era-range">{era.range}</p>
        <p className="era-description">{era.description}</p>
      </div>

      <div className="era-card-foot">
        <span>{era.club}</span>
        <span className="era-count">
          {era.moments.length} 个瞬间
          <ArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
