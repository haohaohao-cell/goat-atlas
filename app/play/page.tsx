import type { Metadata } from "next";
import Link from "next/link";
import { getDailyQuestions, getQuizDateKey } from "@/lib/quiz";
import { compare } from "@/lib/compare";
import { live } from "@/lib/live";
import { milestoneProgress, sortedMilestones } from "@/lib/milestones";
import { ArrowUpRight, CalendarIcon, SparkIcon } from "@/components/Icons";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Play · 问答、对比与赛程",
  description:
    "每日 5 题、GOAT 对比器、赛程日历。用三种方式继续聊 C 罗。",
  alternates: { canonical: absoluteUrl("/play/") },
};

export default function PlayPage() {
  const questions = getDailyQuestions(getQuizDateKey(), 5);
  const closestMilestones = sortedMilestones().slice(0, 3);

  return (
    <>
      <section className="page-hero play-hero">
        <div className="container">
          <div className="eyebrow">PLAYGROUND · AFTER THE ATLAS</div>
          <h1>
            看完，
            <br />
            <span>来玩。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              一种是记忆，一种是争论，一种是今天，一种是别错过下一场。
              四个入口，都不需要注册。
            </p>
            <div className="page-hero-meta">
              <span>5 题 / 天</span>
              <span>{compare.metrics.length} 个对比维度</span>
              <span>Free</span>
            </div>
          </div>
        </div>
      </section>

      <section className="play-section">
        <div className="container play-grid">
          <Link className="play-card is-quiz" href="/quiz">
            <div className="play-card-top">
              <span>01</span>
              <em>DAILY</em>
            </div>
            <SparkIcon />
            <h2>每日问答</h2>
            <p>
              今天这 5 题，考的是名场面、对手和纪录。
              答完有解析和结果卡。
            </p>
            <div className="play-card-foot">
              <span>{questions.length} 题 · 约 2 分钟</span>
              <ArrowUpRight />
            </div>
          </Link>

          <Link className="play-card is-compare" href="/compare">
            <div className="play-card-top">
              <span>02</span>
              <em>DEBATE</em>
            </div>
            <SparkIcon />
            <h2>GOAT 对比器</h2>
            <p>
              C 罗 vs 梅西，6 个可核实指标。
              默认 3 : 3，权重由你拉。
            </p>
            <div className="play-card-foot">
              <span>3 : 3 · 50 / 50</span>
              <ArrowUpRight />
            </div>
          </Link>

          <Link className="play-card is-today" href="/today">
            <div className="play-card-top">
              <span>03</span>
              <em>TODAY</em>
            </div>
            <SparkIcon />
            <h2>历史上的今天</h2>
            <p>
              按日期看 C 罗的历史瞬间。
              没有精确匹配时，就给你一个当天的坐标。
            </p>
            <div className="play-card-foot">
              <span>每天更新 · 有出处</span>
              <ArrowUpRight />
            </div>
          </Link>

          <Link className="play-card is-matches" href="/matches">
            <div className="play-card-top">
              <span>04</span>
              <em>REMIND</em>
            </div>
            <CalendarIcon />
            <h2>赛程与提醒</h2>
            <p>
              下一场、赛后战报和 C 罗进球分钟。
              下载日历，赛前自动提醒。
            </p>
            <div className="play-card-foot">
              <span>{live.fixtures.length} 场待踢 · ICS</span>
              <ArrowUpRight />
            </div>
          </Link>
        </div>

        <Link className="play-milestones" href="/milestones">
          <div>
            <p className="eyebrow">MILESTONE WATCH</p>
            <h2>还差几球，到下一个整数？</h2>
            <p>不预测日期，只把可核实的差距摊开。赛程日历里也会带上这份观察。</p>
          </div>
          <div className="play-milestone-numbers">
            {closestMilestones.map((milestone) => (
              <span key={milestone.id}>
                <strong>{milestoneProgress(milestone).remaining}</strong>
                <em>{milestone.unit}</em>
                <small>{milestone.title}</small>
              </span>
            ))}
          </div>
          <ArrowUpRight />
        </Link>
      </section>
    </>
  );
}
