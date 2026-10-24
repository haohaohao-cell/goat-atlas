import Link from "next/link";
import type { Moment } from "@/lib/types";
import { KIND_META } from "@/lib/kinds";
import { formatDate, getYear } from "@/lib/format";
import { ArrowUpRight } from "./Icons";

export function MomentCard({
  moment,
  variant = "default",
}: {
  moment: Moment;
  variant?: "default" | "wide" | "compact";
}) {
  return (
    <Link
      href={`/atlas/${moment.slug}`}
      className={`moment-card ${variant === "wide" ? "is-wide" : ""} ${
        variant === "compact" ? "is-compact" : ""
      }`.trim()}
      data-kind={moment.kind}
    >
      {variant === "wide" ? (
        <span className="moment-watermark" aria-hidden="true">
          {getYear(moment.date)}
        </span>
      ) : null}

      <div className="moment-card-top">
        <span className="moment-year">{getYear(moment.date)}</span>
        <span className="kind-badge">
          <span className="kind-dot" aria-hidden="true" />
          {KIND_META[moment.kind].label}
          <em>{KIND_META[moment.kind].en}</em>
        </span>
      </div>

      <div className="moment-card-main">
        <p className="moment-date">
          {formatDate(moment.date)}
          <span>·</span>
          {moment.clubZh}
        </p>
        <h3>{moment.title}</h3>
        <p className="moment-en">{moment.titleEn}</p>
        {variant !== "compact" ? (
          <p className="moment-summary">{moment.summary}</p>
        ) : null}
      </div>

      {variant === "wide" && moment.stat ? (
        <div className="moment-highlight">
          <strong>{moment.stat.value}</strong>
          <span>{moment.stat.label}</span>
        </div>
      ) : null}

      <div className="moment-card-foot">
        <span>
          {moment.competition}
          {moment.opponent ? ` · vs ${moment.opponent}` : ""}
        </span>
        <ArrowUpRight className="moment-arrow" />
      </div>
    </Link>
  );
}
