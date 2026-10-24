import type { Metadata } from "next";
import Link from "next/link";
import { moments } from "@/lib/data";
import { live, liveStatusLabel, liveUpdatedDate } from "@/lib/live";
import { formatDate, formatDateLong } from "@/lib/format";
import { MomentCard } from "@/components/MomentCard";
import { ArrowUpRight, GithubIcon, SourceIcon, SparkIcon } from "@/components/Icons";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Live · 数据更新状态",
  description:
    "C 罗最新赛季数据、最近比赛与里程碑。由 GitHub Actions 定时同步，自动更新到线上。",
  alternates: { canonical: absoluteUrl("/live/") },
};

export default function LivePage() {
  const curatedLatest = moments.slice(-3).reverse();
  const actionsUrl = siteConfig.githubUrl
    ? `${siteConfig.githubUrl}/actions`
    : "";

  return (
    <>
      <section className="page-hero live-hero">
        <div className="container">
          <div className="eyebrow live-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            LIVE DATA <span>·</span> {live.season}
          </div>

          <h1>
            数据会继续
            <br />
            <span>往前走。</span>
          </h1>

          <div className="page-hero-bottom">
            <p>
              这里放的是会变化的东西：最新赛季、最近比赛、刚刚发生的里程碑。
              自动同步负责“快”，人工策展负责“准”。两者分开。
            </p>

            <div className={`live-status-card is-${live.status}`}>
              <span className="live-status-dot" aria-hidden="true" />
              <div>
                <strong>{liveStatusLabel(live.status)}</strong>
                <span>
                  更新于 {formatDate(liveUpdatedDate())} · {live.provider}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="live-section">
        <div className="container live-grid">
          <div className="live-main">
            <div className="live-block">
              <div className="live-block-head">
                <p className="eyebrow">CURRENT SEASON</p>
                <h2>本赛季</h2>
              </div>

              {live.stats.length ? (
                <div className="live-stats-wrap">
                  <table className="live-stats">
                    <thead>
                      <tr>
                        <th>赛事</th>
                        <th>球队</th>
                        <th>出场</th>
                        <th>进球</th>
                        <th>助攻</th>
                        <th>分钟</th>
                      </tr>
                    </thead>
                    <tbody>
                      {live.stats.map((stat) => (
                        <tr key={`${stat.competition}-${stat.team}`}>
                          <td>{stat.competition}</td>
                          <td>{stat.team}</td>
                          <td>{stat.appearances}</td>
                          <td className="is-gold">{stat.goals}</td>
                          <td>{stat.assists ?? "—"}</td>
                          <td>
                            {stat.minutes != null
                              ? stat.minutes.toLocaleString("en-US")
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {live.status === "fallback" ? (
                    <p className="live-table-note">
                      免费方案：进球与赛果可用；助攻、分钟暂不提供。
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="live-empty">
                  <SourceIcon />
                  <div>
                    <h3>等待数据源</h3>
                    <p>
                      当前展示的是 2025 年 6 月的策展快照。配置{" "}
                      <code>API_FOOTBALL_KEY</code> 后，这里会自动出现最新赛季数据。
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="live-block">
              <div className="live-block-head">
                <p className="eyebrow">RECENT MATCHES</p>
                <h2>最近比赛</h2>
              </div>

              {live.recentMatches.length ? (
                <div className="match-list">
                  {live.recentMatches.map((match) => (
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
                        <span className={`result-badge is-${match.result.toLowerCase()}`}>
                          {match.result}
                        </span>
                      </div>
                      <div className="match-goals">
                        {match.goals > 0 ? (
                          <>
                            <span className="goal-label">C罗</span>
                            <div className="goal-list">
                              {match.ronaldoGoals?.length ? (
                                match.ronaldoGoals.map((goal, index) => (
                                  <span
                                    className="goal-pill"
                                    key={`${goal.minute ?? "na"}-${index}`}
                                  >
                                    {goal.minute ? `${goal.minute}'` : "进球"}
                                    {goal.penalty ? " 点" : ""}
                                  </span>
                                ))
                              ) : (
                                <span className="goal-pill">
                                  {match.goals} 球
                                </span>
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="muted-pill">未进球</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="live-empty">
                  <SparkIcon />
                  <div>
                    <h3>等待下一场比赛</h3>
                    <p>
                      同步任务还没有接入实时比赛数据。你仍然可以在 Atlas
                      里查看已经整理好的 36 个名场面。
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="live-block">
              <div className="live-block-head">
                <p className="eyebrow">LATEST MILESTONES</p>
                <h2>最近节点</h2>
              </div>

              <div className="milestone-list">
                {live.latest.map((milestone) => (
                  <div className="milestone-row" key={`${milestone.date}-${milestone.title}`}>
                    <span>{formatDate(milestone.date)}</span>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="live-aside">
            <div className="live-meta-card">
              <p className="eyebrow">DATA STATUS</p>
              <h2>{liveStatusLabel(live.status)}</h2>
              <p className="live-note">{live.note}</p>

              <dl>
                <div>
                  <dt>Provider</dt>
                  <dd>{live.provider}</dd>
                </div>
                <div>
                  <dt>Plan</dt>
                  <dd>
                    {live.status === "fallback"
                      ? "Free · Wikipedia"
                      : live.status === "live"
                        ? "API-Football"
                        : "Snapshot"}
                  </dd>
                </div>
                <div>
                  <dt>Season</dt>
                  <dd>{live.season}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatDateLong(liveUpdatedDate())}</dd>
                </div>
                <div>
                  <dt>Checked</dt>
                  <dd>{formatDateLong(live.checkedAt.slice(0, 10))}</dd>
                </div>
                <div>
                  <dt>Schedule</dt>
                  <dd>每 6 小时</dd>
                </div>
              </dl>

              {live.sourceUrl ? (
                <a
                  className="live-source-link"
                  href={live.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  查看数据源
                  <ArrowUpRight />
                </a>
              ) : null}

              <Link className="live-source-link" href="/matches">
                赛程与提醒
                <ArrowUpRight />
              </Link>
            </div>

            <div className="live-how">
              <p className="eyebrow">HOW IT WORKS</p>
              <h3>自动数据，人工把关。</h3>
              <ol>
                <li>
                  <span>01</span>
                  GitHub Actions 定时调用 API-Football，拉取本赛季统计和最近比赛。
                </li>
                <li>
                  <span>02</span>
                  同步脚本只更新 <code>data/live.json</code>，不会自动改写 Atlas
                  里的策展故事。
                </li>
                <li>
                  <span>03</span>
                  新里程碑先进入 Live；值得长期收藏的，再由编辑整理进 Atlas。
                </li>
              </ol>

              {actionsUrl ? (
                <a
                  className="button button-ghost"
                  href={actionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon />
                  查看同步任务
                </a>
              ) : (
                <p className="live-config-note">
                  在仓库的 Settings → Secrets and variables → Actions 中添加{" "}
                  <code>API_FOOTBALL_KEY</code> 即可启用自动同步。
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="live-curated">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">CURATED, NOT CRAWLED</p>
              <h2>自动数据之外，仍然需要故事。</h2>
            </div>
            <Link className="section-link" href="/atlas">
              进入 Atlas
              <ArrowUpRight />
            </Link>
          </div>

          <div className="moment-grid">
            {curatedLatest.map((moment) => (
              <MomentCard key={moment.id} moment={moment} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
