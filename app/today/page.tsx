import type { Metadata } from "next";
import Link from "next/link";
import { getQuizDateKey, getQuizDateLabel } from "@/lib/quiz";
import { getDailyMoment, getMonthMoments, getOnThisDay } from "@/lib/today";
import { formatDate, getYear } from "@/lib/format";
import { ShareCard } from "@/components/ShareCard";
import { ArrowUpRight, SparkIcon } from "@/components/Icons";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "On This Day · 历史上的今天",
  description:
    "按日期看 C 罗的历史瞬间。没有精确匹配时，展示当天的今日坐标，而不是硬编一个故事。",
  alternates: { canonical: absoluteUrl("/today/") },
};

function monthDayLabel(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${Number(month)} 月 ${Number(day)} 日`;
}

export default function TodayPage() {
  const dateKey = getQuizDateKey();
  const dateLabel = getQuizDateLabel(dateKey);
  const dayLabel = monthDayLabel(dateKey);
  const exact = getOnThisDay(dateKey);
  const todayMoment = exact[0] ?? getDailyMoment(dateKey);
  const monthMoments = getMonthMoments(dateKey)
    .filter((moment) => moment.id !== todayMoment.id)
    .slice(0, 4);
  const hasExact = exact.length > 0;

  return (
    <>
      <section className="page-hero today-hero">
        <div className="container">
          <div className="eyebrow">
            ON THIS DAY <span>·</span> {dateLabel}
          </div>
          <h1>
            {dayLabel}
            <br />
            <span>{hasExact ? "历史上的今天。" : "今天，先看一个坐标。"}</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              {hasExact
                ? `这一天在 Atlas 里留下了 ${exact.length} 个瞬间。`
                : "这一天还没有被精确收录。与其编一个“历史上的今天”，不如给你一个当天的坐标。"}
            </p>
            <div className="page-hero-meta">
              <span>{hasExact ? `${exact.length} 个匹配` : "今日坐标"}</span>
              <span>{dateLabel}</span>
              <span>每天更新</span>
            </div>
          </div>
        </div>
      </section>

      <section className="today-section">
        <div className="container today-grid">
          <div className="today-main">
            {hasExact ? (
              exact.map((moment) => (
                <article className="today-story" key={moment.id}>
                  <div className="today-story-year" aria-hidden="true">
                    {getYear(moment.date)}
                  </div>
                  <div className="today-story-body">
                    <p className="eyebrow">
                      {formatDate(moment.date)} · {moment.clubZh}
                    </p>
                    <h2>{moment.title}</h2>
                    <p className="today-story-en">{moment.titleEn}</p>
                    <p className="today-story-summary">{moment.summary}</p>
                    <p className="today-story-why">{moment.why}</p>
                    <div className="today-story-foot">
                      <span>
                        {moment.competition}
                        {moment.opponent ? ` · vs ${moment.opponent}` : ""}
                      </span>
                      <Link href={`/atlas/${moment.slug}`}>
                        打开详情
                        <ArrowUpRight />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <article className="today-story is-fallback">
                <div className="today-fallback-mark" aria-hidden="true">
                  <SparkIcon />
                  <span>TODAY&apos;S COORDINATE</span>
                </div>
                <div className="today-story-year" aria-hidden="true">
                  {getYear(todayMoment.date)}
                </div>
                <div className="today-story-body">
                  <p className="eyebrow">
                    {formatDate(todayMoment.date)} · {todayMoment.clubZh}
                  </p>
                  <h2>{todayMoment.title}</h2>
                  <p className="today-story-en">{todayMoment.titleEn}</p>
                  <p className="today-story-summary">{todayMoment.summary}</p>
                  <p className="today-story-why">{todayMoment.why}</p>
                  <div className="today-story-foot">
                    <span>{todayMoment.competition}</span>
                    <Link href={`/atlas/${todayMoment.slug}`}>
                      打开详情
                      <ArrowUpRight />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            <div className="today-month">
              <div className="today-month-head">
                <div>
                  <p className="eyebrow">SAME MONTH</p>
                  <h2>{Number(dateKey.slice(5, 7))} 月的其他瞬间</h2>
                </div>
                <Link className="section-link" href="/atlas">
                  全部 Atlas
                  <ArrowUpRight />
                </Link>
              </div>

              {monthMoments.length ? (
                <div className="today-month-list">
                  {monthMoments.map((moment) => (
                    <Link
                      className="today-month-row"
                      href={`/atlas/${moment.slug}`}
                      key={moment.id}
                    >
                      <span>{formatDate(moment.date)}</span>
                      <strong>{moment.title}</strong>
                      <ArrowUpRight />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="today-month-empty">
                  本月还没有其他收录。去 Atlas 看完整时间线。
                </p>
              )}
            </div>
          </div>

          <aside className="today-aside">
            <ShareCard moment={todayMoment} />

            <div className="today-note">
              <p className="eyebrow">WHY THIS PAGE</p>
              <p>
                “历史上的今天”最容易变成硬凑。所以这里只在日期精确匹配时展示历史瞬间；
                没有匹配，就展示一个当天的坐标，并明确标注。
              </p>
              <p>
                当前策展库有 76 个瞬间，大多数日期不会命中。等数据变厚，这个页面会越来越有内容。
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
