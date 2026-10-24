import type { Metadata } from "next";
import Link from "next/link";
import {
  getDailyQuestions,
  getQuizDateKey,
  getQuizDateLabel,
} from "@/lib/quiz";
import { QuizGame } from "@/components/QuizGame";
import { ArrowUpRight, GithubIcon } from "@/components/Icons";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Daily Quiz · 你有多懂 C 罗",
  description:
    "每天 5 道 C 罗知识题：名场面、对手、比分、纪录。答完有解析和结果分享卡。",
  alternates: { canonical: absoluteUrl("/quiz/") },
};

export default function QuizPage() {
  const dateKey = getQuizDateKey();
  const dateLabel = getQuizDateLabel(dateKey);
  const questions = getDailyQuestions(dateKey, 5);

  return (
    <>
      <section className="page-hero quiz-hero">
        <div className="container">
          <div className="eyebrow">
            DAILY QUIZ <span>·</span> {dateLabel}
          </div>
          <h1>
            你有多懂
            <br />
            <span>C 罗？</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              每天 5 题，从名场面到冷知识。答完有解析、来源和一张可以发出去的结果卡。
              没有排行榜，只有你和你的记忆。
            </p>
            <div className="page-hero-meta">
              <span>5 题</span>
              <span>约 2 分钟</span>
              <span>每天更新</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quiz-section">
        <div className="container">
          <QuizGame
            questions={questions}
            dateKey={dateKey}
            dateLabel={dateLabel}
          />

          <div className="quiz-source-note">
            <p>
              题库在 <code>data/quiz.json</code>，每题都带来源。发现争议或错误，
              欢迎带着链接来改。
            </p>
            {siteConfig.githubUrl ? (
              <a href={`${siteConfig.githubUrl}/blob/main/data/quiz.json`} target="_blank" rel="noreferrer">
                <GithubIcon />
                查看题库
              </a>
            ) : (
              <Link href="/about#contribute">
                参与贡献
                <ArrowUpRight />
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
