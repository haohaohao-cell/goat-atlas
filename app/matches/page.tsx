import type { Metadata } from "next";
import Link from "next/link";
import { live } from "@/lib/live";
import { formatDate } from "@/lib/format";
import { MatchCalendarActions } from "@/components/MatchCalendarActions";
import { ArrowUpRight, CalendarIcon, SparkIcon } from "@/components/Icons";
import { absoluteUrl, siteConfig, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Matches · 赛程与提醒",
  description:
    "C 罗与 Al-Nassr 的近期赛程、赛后战报和进球分钟。下载日历，开赛前自动提醒。",
  alternates: { canonical: absoluteUrl("/matches/") },
};

function dateParts(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  return {
    day: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      timeZone: "UTC",
    }).format(value),
    month: new Intl.DateTimeFormat("en-GB", {
      month: "short",
      timeZone: "UTC",
    })
      .format(value)
      .toUpperCase(),
    weekday: new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      timeZone: "UTC",
    })
      .format(value)
      .toUpperCase(),
  };
}

function GoalPills({
  goals,
  minutes,
}: {
  goals: number;
  minutes?: { minute: string | null; penalty: boolean }[];
}) {
  if (!goals) return <span className="muted-pill">未进球</span>;

  return (
    <div className="goal-list">
      {minutes?.length ? (
        minutes.map((goal, index) => (
          <span className="goal-pill" key={`${goal.minute ?? "na"}-${index}`}>
            {goal.minute ? `${goal.minute}'` : "进球"}
            {goal.penalty ? " 点" : ""}
          </span>
        ))
      ) : (
        <span className="goal-pill">{goals} 球</span>
      )}
    </div>
  );
}

export default function MatchesPage() {
  const nextFixture = live.fixtures[0];
  const calendarUrl = `${siteConfig.url}/matches.ics`;

  return (
    <>
      <section className="page-hero matches-hero">
        <div className="container">
          <div className="eyebrow">
            MATCH CENTER <span>·</span> {live.season}
          </div>
          <h1>
            下一场，
            <br />
            <span>别错过。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              赛前提醒交给手机日历，赛后战报留在这里。
              不注册、不订阅邮件、不装新 App。
            </p>
            <div className="page-hero-meta">
              <span>{live.fixtures.length} 场待踢</span>
              <span>{live.recentMatches.length} 场战报</span>
              <span>Free · ICS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="matches-section">
        <div className="container match-center-grid">
          <div className="match-center-main">
            <section className="match-block">
              <div className="match-block-head">
                <div>
                  <p className="eyebrow">UPCOMING</p>
                  <h2>接下来</h2>
                </div>
                {nextFixture ? (
                  <span className="next-match-label">
                    NEXT · {formatDate(nextFixture.date)}
                  </span>
                ) : null}
              </div>

              {live.fixtures.length ? (
                <div className="fixture-list">
                  {live.fixtures.map((fixture, index) => {
                    const parts = dateParts(fixture.date);
                    return (
                      <article
                        className={`fixture-row ${index === 0 ? "is-next" : ""}`}
                        key={`${fixture.date}-${fixture.opponent}`}
                      >
                        <div className="fixture-date">
                          <strong>{parts.day}</strong>
                          <span>{parts.month}</span>
                          <em>{parts.weekday}</em>
                        </div>
                        <div className="fixture-main">
                          <span>{fixture.competition}</span>
                          <h3>
                            {fixture.home
                              ? `Al-Nassr vs ${fixture.opponent}`
                              : `${fixture.opponent} vs Al-Nassr`}
                          </h3>
                          <em>
                            {fixture.home ? "主场" : "客场"}
                            {fixture.venue ? ` · ${fixture.venue}` : ""}
                          </em>
                        </div>
                        <div className="fixture-time">
                          {fixture.time ?? "待定"}
                          {index === 0 ? <span>NEXT</span> : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="live-empty">
                  <CalendarIcon />
                  <div>
                    <h3>还没有下一场</h3>
                    <p>
                      同步任务会在赛程页面更新后自动带入。你也可以先看最近的
                      Live 数据。
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="match-block">
              <div className="match-block-head">
                <div>
                  <p className="eyebrow">POST-MATCH</p>
                  <h2>赛后战报</h2>
                </div>
                <Link className="section-link" href="/live">
                  查看 Live 数据
                  <ArrowUpRight />
                </Link>
              </div>

              {live.recentMatches.length ? (
                <div className="match-list">
                  {live.recentMatches.slice(0, 6).map((match) => (
                    <article
                      className="match-row"
                      key={`${match.date}-${match.opponent}-${match.score}`}
                    >
                      <div className="match-date">{formatDate(match.date)}</div>
                      <div className="match-main">
                        <span>{match.competition}</span>
                        <h3>vs {match.opponent}</h3>
                        {match.venue ? <em>{match.venue}</em> : null}
                      </div>
                      <div className="match-score">
                        <strong>{match.score}</strong>
                        <span
                          className={`result-badge is-${match.result.toLowerCase()}`}
                        >
                          {match.result}
                        </span>
                      </div>
                      <div className="match-goals">
                        {match.goals > 0 ? <span className="goal-label">C罗</span> : null}
                        <GoalPills
                          goals={match.goals}
                          minutes={match.ronaldoGoals}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="live-empty">
                  <SparkIcon />
                  <div>
                    <h3>等待下一份战报</h3>
                    <p>比赛结束后，Live 数据同步会带来比分和 C 罗进球分钟。</p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="match-center-aside">
            <div className="reminder-card">
              <p className="eyebrow">MATCH REMINDERS</p>
              <h2>让日历提醒你。</h2>
              <p>
                下载 `.ics` 后导入 Google Calendar、Apple Calendar 或 Outlook。
                有开球时间的比赛会提前 1 天和 1 小时提醒；没有时间的按全天事件处理。
              </p>
              <MatchCalendarActions
                downloadUrl={withBasePath("/matches.ics")}
                calendarUrl={calendarUrl}
              />
              <ol className="calendar-steps">
                <li>下载 `.ics` 并导入，或复制订阅链接</li>
                <li>Google Calendar → 其他日历 → 从网址添加</li>
                <li>开启日历通知，赛前自动提醒</li>
              </ol>
            </div>

            <div className="calendar-facts">
              <div>
                <CalendarIcon />
                <span>赛前 1 天</span>
                <em>日历通知</em>
              </div>
              <div>
                <CalendarIcon />
                <span>赛前 1 小时</span>
                <em>有开球时间时</em>
              </div>
              <div>
                <ArrowUpRight />
                <span>赛后战报</span>
                <em>进球分钟 + 比分</em>
              </div>
            </div>

            <div className="match-source">
              <p className="eyebrow">SOURCE</p>
              <p>
                赛程与战报来自 Wikipedia 当前赛季页，免费方案不提供助攻。
                最后更新：{formatDate(live.updatedAt.slice(0, 10))}。
              </p>
              {live.sourceUrl ? (
                <a href={live.sourceUrl} target="_blank" rel="noreferrer">
                  查看来源
                  <ArrowUpRight />
                </a>
              ) : null}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
