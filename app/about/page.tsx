import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GithubIcon,
  SourceIcon,
  SparkIcon,
} from "@/components/Icons";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About · 项目、数据与路线图",
  description:
    "GOAT Atlas 是一个开源的 C 罗职业生涯图鉴。了解它的数据原则、技术选择、路线图和参与方式。",
  alternates: { canonical: absoluteUrl("/about/") },
};

const FORM_FACTOR = [
  {
    number: "01",
    title: "Web + PWA",
    tag: "现在",
    body: "一套响应式网站，手机和桌面共用。PWA 支持添加到主屏幕，先解决“打开就能看”的问题。",
    points: ["SEO 可被搜索", "分享链接零门槛", "迭代不需要审核"],
  },
  {
    number: "02",
    title: "小程序",
    tag: "之后",
    body: "等内容和留存跑通，再做一个微信小程序壳，复用同一套数据 API。它负责传播，不负责承载全部体验。",
    points: ["适合国内裂变", "需要主体与审核", "不碰社区 UGC"],
  },
  {
    number: "03",
    title: "原生 App",
    tag: "最后",
    body: "只有当用户明确要求“离线 + 推送 + 随身”时，才用 Capacitor 或 Expo 套壳。现在做 App 是 premature optimization。",
    points: ["成本最高", "审核最慢", "留存验证后再做"],
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    title: "内容底座",
    status: "已完成",
    body: "36 个名场面、6 个章节、时间线、检索、详情页、分享卡、PWA manifest、Live 数据页，以及带日历订阅的 Match Center。目标：让一个球迷在 30 秒内找到他想看的瞬间，并且不错过下一场。",
  },
  {
    phase: "Phase 2",
    title: "单人互动",
    status: "已完成",
    body: "每日 5 题、连击、结果分享卡，以及可调权重的 C 罗 vs 梅西 GOAT 对比器。目标：让用户有理由第二次回来。",
  },
  {
    phase: "Phase 3",
    title: "习惯与提醒",
    status: "进行中",
    body: "“历史上的今天”、里程碑追踪和英文/葡语入口已经上线；翻译暂缓，下一步专注扩充 Atlas 数据和带上下文的提醒 bot。",
  },
  {
    phase: "Phase 4",
    title: "社区",
    status: "等待时机",
    body: "先用 GitHub Discussions 和现成社群，等有稳定复访和审核能力，再评估自建讨论区。",
  },
];

const PRINCIPLES = [
  {
    icon: <SourceIcon />,
    title: "来源优先",
    body: "每条记录至少一个可点击来源。优先 Wikipedia / Wikidata、官方比赛报告和可核验的公开资料，不把二手转述当事实。",
  },
  {
    icon: <SparkIcon />,
    title: "区分事实与叙事",
    body: "比分、日期、出场数是事实；“为什么重要”是编辑判断。两者在数据结构里分开，读者可以自己判断。",
  },
  {
    icon: <GithubIcon />,
    title: "可纠错",
    body: "数据是 JSON，校验是脚本，修改通过 PR。任何球迷都可以带着来源来纠正一条记录，而不是只能在评论区吵架。",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="container">
          <div className="eyebrow">ABOUT THE PROJECT</div>
          <h1>
            给记忆一个
            <br />
            可以验证的形状。
          </h1>
          <div className="page-hero-bottom">
            <p>
              GOAT Atlas 是一个开源的 C 罗职业生涯图鉴。它先服务 C 罗球迷，
              再用同一套结构服务所有足球爱好者。
            </p>
            <div className="page-hero-meta">
              <span>{stats.moments} 条记录</span>
              <span>{stats.sources} 个来源</span>
              <span>Open source</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container about-intro">
          <div>
            <p className="eyebrow">THE PROBLEM</p>
            <h2>
              球迷不缺内容，
              <br />
              缺的是一张能<span className="nowrap">反复查</span>的地图。
            </h2>
          </div>
          <div className="about-intro-copy">
            <p>
              集锦在短视频里，数据在表格里，故事在评论区里。三者很少出现在同一个地方。
              于是“C 罗哪一场最伟大”这种问题，最后总是变成各说各话。
            </p>
            <p>
              GOAT Atlas 想做的，是把名场面、数据、上下文和来源放在同一个页面上。
              你既可以把它当成一部可滚动的传记，也可以把它当成一个可检索的数据库。
            </p>
          </div>
        </div>
      </section>

      <section className="about-section form-factor-section" id="form-factor">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">FORM FACTOR</p>
              <h2>为什么先做网站，而不是 App 或小程序？</h2>
            </div>
            <p className="section-intro">
              形态不是身份。先把内容、数据和分享跑通，再决定用什么壳承载它。
            </p>
          </div>

          <div className="form-factor-grid">
            {FORM_FACTOR.map((item) => (
              <article className="form-card" key={item.number}>
                <div className="form-card-top">
                  <span>{item.number}</span>
                  <em>{item.tag}</em>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="form-factor-note">
            结论：<strong>Web 是核心，小程序是渠道，App 是后置选项。</strong>
            一套数据层，多个展示壳，避免三套代码互相追着更新。
          </p>
        </div>
      </section>

      <section className="about-section" id="data">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">DATA PRINCIPLES</p>
              <h2>数据不是答案，是让记忆可以被验证的方式。</h2>
            </div>
          </div>

          <div className="principles-detail-grid">
            {PRINCIPLES.map((item) => (
              <article className="principle-detail" key={item.title}>
                <span className="principle-detail-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <div className="data-note">
            <h3>当前数据的边界</h3>
            <p>
              这是一份策展式样本，不是完整数据库。36 条记录覆盖了职业生涯的关键坐标，
              但远未穷尽所有比赛和进球。收录标准偏向“有叙事价值、可被验证、能代表一个阶段”。
              当前策展数据截至 2025 年 6 月。最新赛季、最近比赛、C 罗进球分钟
              和里程碑由 Live 数据层承载：GitHub Actions 每 6 小时自动同步；
              API-Football 免费版不覆盖当前赛季时，会自动回退到 Wikipedia。
              免费方案不含助攻，也不会自动改写 Atlas 里的策展故事。
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" id="roadmap">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">ROADMAP</p>
              <h2>按顺序做，不按兴奋度做。</h2>
            </div>
            <p className="section-intro">
              每个阶段都有一个可验证的假设。上一阶段没有跑通，就不进入下一阶段。
            </p>
          </div>

          <div className="roadmap-list">
            {ROADMAP.map((item) => (
              <article className="roadmap-row" key={item.phase}>
                <div className="roadmap-row-phase">
                  <span>{item.phase}</span>
                  <em className={item.status === "进行中" ? "is-now" : ""}>
                    {item.status}
                  </em>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="contribute">
        <div className="container contribute-grid">
          <div>
            <p className="eyebrow">CONTRIBUTE</p>
            <h2>带着来源来，而不是带着情绪来。</h2>
            <p>
              这个项目最需要的不是更多代码，而是更准确的数据、更好的问题，
              以及愿意花时间核对细节的球迷。
            </p>
            <div className="contribute-actions">
              {siteConfig.githubUrl ? (
                <a
                  className="button button-gold"
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon />
                  打开 GitHub 仓库
                </a>
              ) : (
                <span className="button button-disabled">
                  <GithubIcon />
                  仓库即将公开
                </span>
              )}
              <Link className="button button-ghost" href="/atlas">
                先逛逛 Atlas
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="contribute-card">
            <h3>一条记录长什么样</h3>
            <pre>
              <code>{`{
  "slug": "ucl-2008-final",
  "date": "2008-05-21",
  "title": "莫斯科雨夜，首夺欧冠",
  "kind": "trophy",
  "sources": [
    { "label": "Wikipedia", "url": "..." }
  ]
}`}</code>
            </pre>
            <p>
              修改 <code>data/moments.json</code>，运行{" "}
              <code>pnpm validate</code>，提 PR。类型和校验会帮你挡住大部分低级错误。
            </p>
          </div>
        </div>
      </section>

      <section className="about-section about-tech">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">STACK</p>
              <h2>刻意保持简单。</h2>
            </div>
          </div>
          <div className="tech-row">
            {[
              ["Next.js 16", "App Router / 静态生成"],
              ["TypeScript", "数据与组件类型"],
              ["Zod", "构建时数据校验"],
              ["CSS", "无 UI 框架，完全可控"],
              ["Vercel", "零配置部署"],
              ["PWA", "可添加到主屏幕"],
            ].map(([name, detail]) => (
              <div className="tech-item" key={name}>
                <strong>{name}</strong>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-disclaimer">
        <div className="container">
          <p className="eyebrow">DISCLAIMER</p>
          <p>
            这是一个非官方球迷项目，与 Cristiano Ronaldo、任何俱乐部、联赛或足协均无隶属关系。
            站内不使用官方标志、赛事转播画面或未授权照片。数据仅供参考，欢迎纠错。
          </p>
          <p className="about-license">
            代码采用 MIT License；策展数据采用 CC BY-SA 4.0。转载或复用请保留来源链接。
          </p>
          <Link className="section-link" href="/atlas">
            回到 Atlas
            <ArrowUpRight />
          </Link>
        </div>
      </section>
    </>
  );
}
