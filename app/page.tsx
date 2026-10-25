import Link from "next/link";
import { erasWithMoments, featuredMoments, player, stats } from "@/lib/data";
import { live, liveStatusLabel, liveUpdatedDate } from "@/lib/live";
import { milestones, milestoneProgress } from "@/lib/milestones";
import { sortedUpdates, UPDATE_KIND_LABEL, updates } from "@/lib/updates";
import { formatDate } from "@/lib/format";
import { EraCard } from "@/components/EraCard";
import { MomentCard } from "@/components/MomentCard";
import { Reveal } from "@/components/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  GithubIcon,
  SourceIcon,
  SparkIcon,
} from "@/components/Icons";
import { siteConfig } from "@/lib/site";

const TICKER = [
  "SPORTING CP",
  "MANCHESTER UNITED",
  "REAL MADRID",
  "JUVENTUS",
  "AL NASSR",
  "PORTUGAL",
];

const ROADMAP = [
  {
    phase: "01",
    title: "Atlas 内容底座",
    detail: "时间线、名场面检索、来源标注、分享卡、Live 数据层、赛程日历。",
    status: "已完成",
  },
  {
    phase: "02",
    title: "每日问答 + 球员对比",
    detail: "5 题连击、结果分享卡、可调权重的 GOAT 对比器。",
    status: "现在",
  },
  {
    phase: "03",
    title: "历史上的今天 + 里程碑提醒",
    detail: "Today、里程碑、单频道 Bot 与英/葡入口已上线；题库扩到 60 题。",
    status: "已完成",
  },
  {
    phase: "3.5",
    title: "发布准备",
    detail: "PWA 离线、来源分级与链接检查已到位；接下来是小范围发布与反馈。",
    status: "现在",
  },
  {
    phase: "04",
    title: "球迷讨论区",
    detail: "先用 GitHub Discussions 和现成社群，不急着写论坛。",
    status: "等待时机",
  },
];

export default function HomePage() {
  const featured = featuredMoments.slice(0, 4);
  const career = milestones.items.find(
    (item) => item.id === "career-1000-goals",
  );
  const careerProgress = career ? milestoneProgress(career) : null;
  const breakdown = career?.breakdown ?? [];
  const nationalGoals =
    breakdown.find((item) => item.label === "Portugal")?.value ?? 0;
  const clubGoals = breakdown
    .filter((item) => item.label !== "Portugal")
    .reduce((total, item) => total + item.value, 0);
  const latestUpdates = sortedUpdates().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="live-dot" aria-hidden="true" />
              UNOFFICIAL FAN ATLAS
              <span>·</span>
              {stats.yearStart}—{stats.yearEnd}
            </div>

            <h1>
              <span className="hero-kicker">The career of</span>
              <span className="hero-name">Cristiano</span>
              <span className="hero-name hero-name-outline">Ronaldo</span>
            </h1>

            <p className="hero-lede">{player.intro}</p>

            <div className="hero-actions">
              <Link className="button button-gold" href="/atlas">
                进入 Atlas
                <ArrowRight />
              </Link>
              <Link className="button button-ghost" href="/story">
                先看故事
                <ArrowUpRight />
              </Link>
            </div>

            <div className="hero-proof">
              <div>
                <strong>{stats.moments}</strong>
                <span>个瞬间</span>
              </div>
              <div>
                <strong>{stats.eras}</strong>
                <span>个章节</span>
              </div>
              <div>
                <strong>{stats.sources}</strong>
                <span>个来源</span>
              </div>
            </div>

            {career && careerProgress ? (
              <Link className="hero-ledger" href="/milestones">
                <div className="hero-ledger-top">
                  <span>CAREER GOALS</span>
                  <strong>
                    {career.current}
                    <em>/ {career.target}</em>
                  </strong>
                </div>
                <div className="hero-ledger-track" aria-hidden="true">
                  <span style={{ width: `${careerProgress.percent}%` }} />
                </div>
                <div className="hero-ledger-foot">
                  <span>
                    俱乐部 {clubGoals} + 国家队 {nationalGoals}
                  </span>
                  <span>距 1000 球还差 {careerProgress.remaining} 球</span>
                </div>
              </Link>
            ) : null}
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-art-frame">
              <div className="hero-art-ring ring-a" />
              <div className="hero-art-ring ring-b" />
              <div className="hero-art-ring ring-c" />
              <span className="hero-art-seven">7</span>
              <span className="hero-art-coord">32°39′N · 16°54′W</span>

              <div className="hero-art-top">
                <span>MADEIRA</span>
                <span>1985</span>
              </div>

              <ul className="hero-clubs">
                <li>SPORTING</li>
                <li>UNITED</li>
                <li>MADRID</li>
                <li>JUVENTUS</li>
                <li>AL NASSR</li>
              </ul>

              <div className="hero-art-bottom">
                <span>GOAT</span>
                <span>ATLAS</span>
              </div>
            </div>
            <div className="hero-art-caption">
              <span>FIG. 01</span>
              <span>THE CAREER AS A MAP</span>
            </div>
          </div>
        </div>

        <div className="container hero-scroll">
          <span>SCROLL TO EXPLORE</span>
          <span className="hero-scroll-line" aria-hidden="true" />
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section className="stats-band" aria-label="项目数据">
        <div className="container stats-grid">
          <div className="stat-item">
            <strong>{stats.moments}</strong>
            <span>收录瞬间</span>
            <em>MOMENTS</em>
          </div>
          <div className="stat-item">
            <strong>{stats.eras}</strong>
            <span>生涯章节</span>
            <em>CHAPTERS</em>
          </div>
          <div className="stat-item">
            <strong>5</strong>
            <span>欧冠冠军</span>
            <em>UCL TITLES</em>
          </div>
          <div className="stat-item">
            <strong>5</strong>
            <span>金球奖</span>
            <em>BALLON D&apos;OR</em>
          </div>
          <div className="stat-item">
            <strong>{career?.current ?? 981}</strong>
            <span>生涯进球</span>
            <em>
              CAREER GOALS
              {careerProgress ? ` · 距 1000 差 ${careerProgress.remaining}` : ""}
            </em>
          </div>
        </div>
      </section>

      <Link className="live-strip" href="/live">
        <span className="live-strip-left">
          <span className="live-dot" aria-hidden="true" />
          <strong>LIVE DATA</strong>
          <span>{liveStatusLabel(live.status)}</span>
        </span>
        <span className="live-strip-right">
          更新于 {formatDate(liveUpdatedDate())}
          <ArrowUpRight />
        </span>
      </Link>

      <section className="section updates-section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="eyebrow">SEASON LOG · {updates.asOf}</p>
                <h2>最近在发生什么。</h2>
              </div>
              <Link className="section-link" href="/live#updates">
                查看全部动态
                <ArrowUpRight />
              </Link>
            </div>
          </Reveal>

          <div className="updates-grid">
            {latestUpdates.map((item, index) => (
              <Reveal key={`${item.date}-${item.title}`} delay={index * 50}>
                <article className="update-card">
                  <div className="update-top">
                    <span className="update-date">{formatDate(item.date)}</span>
                    <span className={`update-kind is-${item.kind}`}>
                      {UPDATE_KIND_LABEL[item.kind]}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <a href={item.source} target="_blank" rel="noreferrer">
                    来源
                    <ArrowUpRight />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section chapters-section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="eyebrow">SIX CHAPTERS · ONE CAREER</p>
                <h2>
                  一个人的职业生涯，
                  <br />
                  六个时代。
                </h2>
              </div>
              <p className="section-intro">
                从马德拉到利雅得，每一章都有它的颜色、对手和代价。
                点进任意一章，沿时间线往下读。
              </p>
            </div>
          </Reveal>

          <div className="era-grid">
            {erasWithMoments.map((era, index) => (
              <Reveal key={era.id} delay={index * 45}>
                <EraCard era={era} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="eyebrow">SELECTED MOMENTS</p>
                <h2>不是集锦，是坐标。</h2>
              </div>
              <Link className="section-link" href="/atlas">
                查看全部 {stats.moments} 个瞬间
                <ArrowUpRight />
              </Link>
            </div>
          </Reveal>

          <div className="featured-grid">
            {featured[0] ? (
              <Reveal className="featured-large">
                <MomentCard moment={featured[0]} variant="wide" />
              </Reveal>
            ) : null}

            <div className="featured-side">
              {featured.slice(1).map((moment, index) => (
                <Reveal key={moment.id} delay={index * 60}>
                  <MomentCard moment={moment} variant="compact" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section principles-section">
        <div className="container principles-grid">
          <Reveal className="principles-copy">
            <p className="eyebrow">WHY THIS EXISTS</p>
            <h2>
              每一个瞬间，
              <br />
              都应该有出处。
            </h2>
            <p>
              球迷不缺集锦，缺的是一张能反复查看、可以验证、还能继续补充的地图。
              GOAT Atlas 先把 C 罗这一章做好，再把同一套结构开放给更多球员。
            </p>
            <Link className="section-link" href="/about#data">
              阅读数据原则
              <ArrowUpRight />
            </Link>
          </Reveal>

          <div className="principles-list">
            <Reveal delay={60}>
              <div className="principle-item">
                <span className="principle-number">01</span>
                <SourceIcon />
                <div>
                  <h3>来源可追溯</h3>
                  <p>
                    每条记录至少附一个来源链接。没有出处的数字，不进入 Atlas。
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="principle-item">
                <span className="principle-number">02</span>
                <SparkIcon />
                <div>
                  <h3>允许纠错</h3>
                  <p>
                    球迷比任何数据库都更在意细节。发现错误，开 issue，附上来源。
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="principle-item">
                <span className="principle-number">03</span>
                <GithubIcon />
                <div>
                  <h3>数据开放</h3>
                  <p>
                    JSON 数据、TypeScript 类型和校验脚本全部开源，任何人都能复用。
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section roadmap-section" id="roadmap">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="eyebrow">ROADMAP · BUILD IN PUBLIC</p>
                <h2>
                  先把内容做厚，
                  <br />
                  再让互动长出来。
                </h2>
              </div>
              <p className="section-intro">
                这不是一个一次性上线的产品。每一阶段都对应一个可以验证的假设。
              </p>
            </div>
          </Reveal>

          <div className="roadmap-grid">
            {ROADMAP.map((item, index) => (
              <Reveal key={item.phase} delay={index * 50}>
                <article
                  className={`roadmap-card ${
                    item.status === "现在" ? "is-now" : ""
                  }`}
                >
                  <div className="roadmap-top">
                    <span>{item.phase}</span>
                    <em>{item.status}</em>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="container home-cta-inner">
          <div>
            <p className="eyebrow">START ANYWHERE</p>
            <h2>
              先逛一遍，
              <br />
              再决定从哪里开始。
            </h2>
          </div>
          <div className="home-cta-actions">
            <Link className="button button-gold" href="/atlas">
              打开 Atlas
              <ArrowRight />
            </Link>
            <Link className="button button-ghost" href="/story">
              读完整故事
              <ArrowUpRight />
            </Link>
            {siteConfig.githubUrl ? (
              <a
                className="button button-quiet"
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon />
                Star on GitHub
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
