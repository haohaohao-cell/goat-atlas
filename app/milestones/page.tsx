import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import {
  milestoneProgress,
  milestones,
  sortedMilestones,
} from "@/lib/milestones";
import { ArrowUpRight, CalendarIcon } from "@/components/Icons";
import { absoluteUrl, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Milestones · 里程碑追踪",
  description:
    "C 罗的国家队进球、国家队出场、Al-Nassr 联赛进球和联赛出场里程碑进度。只追踪可核实数据。",
  alternates: { canonical: absoluteUrl("/milestones/") },
};

export default function MilestonesPage() {
  const items = sortedMilestones();
  const next = items[0];
  const nextProgress = milestoneProgress(next);

  return (
    <>
      <section className="page-hero milestones-hero">
        <div className="container">
          <div className="eyebrow">
            MILESTONE WATCH <span>·</span> AS OF {milestones.asOf}
          </div>
          <h1>
            还差几球，
            <br />
            <span>就到下一个整数。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              不预测，不猜。只追踪能核实的累计数据，把“还差多少”摊开。
              每场比赛前，赛程日历里也会带上这份观察。
            </p>
            <div className="page-hero-meta">
              <span>{items.length} 个里程碑</span>
              <span>{milestones.asOf}</span>
              <span>每 6 小时同步</span>
            </div>
          </div>
        </div>
      </section>

      <section className="milestones-section">
        <div className="container milestones-grid">
          <div className="milestones-main">
            <div className="milestone-cards">
              {items.map((milestone, index) => {
                const progress = milestoneProgress(milestone);

                return (
                  <article
                    className={`milestone-card ${
                      index === 0 ? "is-next" : ""
                    }`}
                    key={milestone.id}
                  >
                    <div className="milestone-card-top">
                      <span>{milestone.category}</span>
                      <em>
                        {progress.completed
                          ? "已达成"
                          : `还差 ${progress.remaining} ${milestone.unit}`}
                      </em>
                    </div>

                    <h2>{milestone.title}</h2>
                    <div className="milestone-numbers">
                      <strong>{milestone.current}</strong>
                      <span>
                        / {milestone.target} {milestone.unit}
                      </span>
                    </div>

                    <div
                      className="milestone-bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={milestone.target}
                      aria-valuenow={milestone.current}
                      aria-label={milestone.title}
                    >
                      <span style={{ width: `${progress.percent}%` }} />
                    </div>

                    <p className="milestone-description">
                      {milestone.description}
                    </p>

                    <div className="milestone-card-foot">
                      <span>{Math.round(progress.percent)}%</span>
                      <a
                        href={milestone.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        来源
                        <ArrowUpRight />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="milestone-method">
              <p className="eyebrow">SOURCE & METHOD</p>
              <h2>为什么没有“1000 球”？</h2>
              <p>
                因为生涯总进球没有一个稳定、统一口径的实时来源。这里只追踪
                Wikipedia infobox 能核实的国家队和俱乐部联赛累计数据，
                不估算、不预测达成日期。
              </p>
              <p>
                当前数据截至 {formatDate(milestones.asOf)}。如果你有更权威的来源，
                欢迎带着链接来改。
              </p>
            </div>
          </div>

          <aside className="milestones-aside">
            <div className="milestone-reminder">
              <p className="eyebrow">REMIND ME</p>
              <h2>赛前看一眼。</h2>
              <p>
                订阅赛程日历后，每场比赛前会提醒你。
                日历描述里会附上当前的里程碑观察，不用自己记数字。
              </p>
              <a
                className="button button-gold"
                href={withBasePath("/matches.ics")}
                download="goat-atlas-matches.ics"
              >
                <CalendarIcon />
                下载赛程日历
              </a>
              <Link className="button button-ghost" href="/matches">
                打开 Match Center
                <ArrowUpRight />
              </Link>
            </div>

            <div className="milestone-next">
              <p className="eyebrow">NEXT UP</p>
              <h3>{next.title}</h3>
              <p>
                还差 <strong>{nextProgress.remaining}</strong> {next.unit}
              </p>
              <div className="milestone-bar">
                <span style={{ width: `${nextProgress.percent}%` }} />
              </div>
              <Link href="/matches">
                看下一场比赛
                <ArrowUpRight />
              </Link>
            </div>

            <div className="milestone-source-link">
              <p className="eyebrow">KEEP EXPLORING</p>
              <Link href="/today">
                历史上的今天
                <ArrowUpRight />
              </Link>
              <Link href="/atlas">
                进入 Atlas
                <ArrowUpRight />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
