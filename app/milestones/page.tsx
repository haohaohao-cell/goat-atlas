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
    "每 6 小时自动同步的 C 罗职业生涯 1000 球进度、国家队与 Al-Nassr 里程碑。俱乐部与国家队拆分公开，只追踪可核实数据。",
  alternates: { canonical: absoluteUrl("/milestones/") },
};

export default function MilestonesPage() {
  const items = sortedMilestones();
  const next = items[0];
  const nextProgress = milestoneProgress(next);
  const career = milestones.items.find(
    (milestone) => milestone.id === "career-1000-goals",
  );
  const careerProgress = career ? milestoneProgress(career) : null;
  const breakdownTotal =
    career?.breakdown?.reduce((total, item) => total + item.value, 0) ?? 0;
  const internationalTotal =
    career?.breakdown?.find((item) => item.label === "Portugal")?.value ?? 0;
  const clubTotal = breakdownTotal - internationalTotal;

  return (
    <>
      <section className="page-hero milestones-hero">
        <div className="container">
          <div className="eyebrow">
            MILESTONE WATCH <span>·</span> AS OF {milestones.asOf}
          </div>
          <h1>
            还差 {nextProgress.remaining} {next.unit}，
            <br />
            <span>就到 {next.target}。</span>
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

            {career?.breakdown ? (
              <div className="career-ledger">
                <div className="career-ledger-head">
                  <div>
                    <p className="eyebrow">CAREER LEDGER</p>
                    <h2>
                      {career.current} = 俱乐部 {clubTotal} + 国家队{" "}
                      {internationalTotal}
                    </h2>
                  </div>
                  <span>SUM {breakdownTotal}</span>
                </div>
                <div className="career-ledger-grid">
                  {career.breakdown.map((item) => (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="career-ledger-foot">
                  <span>Total senior goals</span>
                  <strong>{career.current}</strong>
                  <em>
                    还差 {careerProgress?.remaining ?? 0} 球到 {career.target}
                  </em>
                </div>
              </div>
            ) : null}

            <div className="milestone-method">
              <p className="eyebrow">SOURCE & METHOD</p>
              <h2>为什么是 {career?.current ?? "—"}？</h2>
              <p>
                俱乐部 {clubTotal} 球 + 国家队 {internationalTotal} 球 ={" "}
                {career?.current ?? "—"} 球。俱乐部部分包含 Sporting CP、
                曼联（两段）、皇马、尤文和 Al-Nassr 的正式比赛；只使用
                Wikipedia 生涯统计表口径，不估算、不预测日期。
              </p>
              <p>
                {career?.target ?? 1000} 球还差 {careerProgress?.remaining ?? "—"}{" "}
                球。不同来源可能有不同统计口径，所以这里把拆分摊开，而不是只给一个总数。
                当前数据截至 {formatDate(milestones.asOf)}，由每次同步自动更新。
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
