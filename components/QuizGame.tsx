"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizDifficulty, QuizQuestion } from "@/lib/types";
import { CheckIcon, CloseIcon, DownloadIcon, LinkIcon, ShareIcon } from "./Icons";

const STORAGE_KEY = "goat-atlas-quiz-v1";

const DIFFICULTY_LABEL: Record<QuizDifficulty, string> = {
  easy: "热身",
  medium: "正赛",
  hard: "加时",
};

interface SavedState {
  lastDate: string;
  current: number;
  best: number;
}

function readSaved(): SavedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedState;
    if (
      typeof parsed.lastDate !== "string" ||
      typeof parsed.current !== "number" ||
      typeof parsed.best !== "number"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function QuizGame({
  questions,
  dateKey,
  dateLabel,
}: {
  questions: QuizQuestion[];
  dateKey: string;
  dateLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const question = questions[index];
  const score = answers.reduce(
    (total, answer, answerIndex) =>
      total + (answer === questions[answerIndex]?.answer ? 1 : 0),
    0,
  );
  const currentStreak = saved?.current ?? 0;
  const bestStreak = saved?.best ?? 0;

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function flash(message: string) {
    setFeedback(message);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setFeedback(""), 2600);
  }

  function choose(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = optionIndex;
      return next;
    });
  }

  function finish(finalAnswers: number[]) {
    const finalScore = finalAnswers.reduce(
      (total, answer, answerIndex) =>
        total + (answer === questions[answerIndex]?.answer ? 1 : 0),
      0,
    );
    const previous = readSaved();
    let current = 1;

    if (previous) {
      if (previous.lastDate === dateKey) {
        current = previous.current;
      } else {
        const previousTime = Date.parse(`${previous.lastDate}T00:00:00Z`);
        const currentTime = Date.parse(`${dateKey}T00:00:00Z`);
        const diff = Math.round((currentTime - previousTime) / 86_400_000);
        current = diff === 1 ? previous.current + 1 : 1;
      }
    }

    const next: SavedState = {
      lastDate: dateKey,
      current,
      best: Math.max(previous?.best ?? 0, current),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private mode or storage disabled: the quiz still works.
    }

    setSaved(next);
    setAnswers(finalAnswers);
    setFinished(true);
    flash(`完成：${finalScore}/${questions.length}`);
  }

  function next() {
    if (selected === null) return;
    if (index === questions.length - 1) {
      finish(answers);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function replay() {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setFeedback("");
  }

  function resultText() {
    return `我在 GOAT Atlas 每日问答拿到 ${score}/${questions.length}，连续 ${currentStreak} 天。来试试：${window.location.href}`;
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(resultText());
      flash("结果已复制");
    } catch {
      flash("复制失败，请手动复制");
    }
  }

  async function shareResult() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GOAT Atlas 每日问答",
          text: `我在 GOAT Atlas 每日问答拿到 ${score}/${questions.length}。`,
          url: window.location.href,
        });
      } catch {
        // User cancelled.
      }
      return;
    }
    await copyResult();
  }

  async function downloadCard() {
    if (!cardRef.current || busy) return;
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b0a08",
      });
      const link = document.createElement("a");
      link.download = `goat-atlas-quiz-${dateKey}.png`;
      link.href = dataUrl;
      link.click();
      flash("结果卡已生成");
    } catch {
      flash("生成失败，请直接截图");
    } finally {
      setBusy(false);
    }
  }

  if (finished) {
    const message =
      score === questions.length
        ? "全对。你比大多数球迷更懂他。"
        : score >= 3
          ? "不错，但还有细节可以挖。"
          : "回去补课，Atlas 里都有。";

    return (
      <div className="quiz-result">
        <div className="quiz-result-card" ref={cardRef}>
          <div className="quiz-result-top">
            <span>GOAT <em>ATLAS</em></span>
            <strong aria-hidden="true">7</strong>
          </div>
          <p className="quiz-result-date">DAILY QUIZ · {dateLabel}</p>
          <div className="quiz-result-score">
            <strong>{score}</strong>
            <span>/ {questions.length}</span>
          </div>
          <h2>{message}</h2>
          <p className="quiz-result-streak">
            连续 {currentStreak} 天 · 最佳 {bestStreak} 天
          </p>
          <div className="quiz-result-foot">
            <span>CRISTIANO RONALDO · CAREER ATLAS</span>
            <span>GOAT ATLAS</span>
          </div>
        </div>

        <div className="quiz-result-actions">
          <button type="button" className="button button-gold" onClick={shareResult}>
            <ShareIcon />
            分享结果
          </button>
          <button
            type="button"
            className="button button-ghost"
            onClick={downloadCard}
            disabled={busy}
          >
            <DownloadIcon />
            {busy ? "生成中…" : "下载结果卡"}
          </button>
          <button type="button" className="button button-quiet" onClick={copyResult}>
            <LinkIcon />
            复制结果
          </button>
          <button type="button" className="button button-quiet" onClick={replay}>
            再玩一次
          </button>
        </div>

        <p className="quiz-result-feedback" role="status" aria-live="polite">
          {feedback || "每天 5 题，题库全部开源。"}
        </p>

        <div className="quiz-review">
          <p className="eyebrow">REVIEW</p>
          <h3>复盘这 5 题</h3>
          {questions.map((item, questionIndex) => {
            const correct = answers[questionIndex] === item.answer;
            return (
              <details key={item.id} className={correct ? "is-correct" : "is-wrong"}>
                <summary>
                  <span>{correct ? <CheckIcon /> : <CloseIcon />}</span>
                  {item.question}
                </summary>
                <p>{item.explanation}</p>
                <a href={item.source} target="_blank" rel="noreferrer">
                  来源
                </a>
              </details>
            );
          })}
        </div>
      </div>
    );
  }

  const correct = selected !== null && selected === question.answer;

  return (
    <div className="quiz-shell">
      <div className="quiz-head">
        <span>
          QUESTION {String(index + 1).padStart(2, "0")} /{" "}
          {String(questions.length).padStart(2, "0")}
        </span>
        <span>STREAK {currentStreak} 天</span>
      </div>

      <div className="quiz-progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <article className="quiz-card">
        <div className="quiz-card-meta">
          <span>{DIFFICULTY_LABEL[question.difficulty]}</span>
          <em>{dateLabel}</em>
        </div>
        <h2>{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isAnswer = selected !== null && optionIndex === question.answer;
            const isWrong = isSelected && !correct;

            return (
              <button
                key={option}
                type="button"
                className={`quiz-option ${isSelected ? "is-selected" : ""} ${
                  isAnswer ? "is-answer" : ""
                } ${isWrong ? "is-wrong" : ""}`}
                onClick={() => choose(optionIndex)}
                aria-pressed={isSelected}
                disabled={selected !== null}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                {option}
                {isAnswer ? <CheckIcon /> : isWrong ? <CloseIcon /> : null}
              </button>
            );
          })}
        </div>

        {selected !== null ? (
          <div className={`quiz-feedback ${correct ? "is-correct" : "is-wrong"}`}>
            <strong>{correct ? "答对了" : `正确答案：${question.options[question.answer]}`}</strong>
            <p>{question.explanation}</p>
            <a href={question.source} target="_blank" rel="noreferrer">
              查看来源
            </a>
          </div>
        ) : null}
      </article>

      <div className="quiz-actions">
        <button
          type="button"
          className="button button-gold"
          onClick={next}
          disabled={selected === null}
        >
          {index === questions.length - 1 ? "查看结果" : "下一题"}
        </button>
        <span className="quiz-feedback-text" role="status" aria-live="polite">
          {feedback || (selected === null ? "选一个答案。" : "")}
        </span>
      </div>
    </div>
  );
}
