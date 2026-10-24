"use client";

import { useEffect, useRef, useState } from "react";
import type { Moment } from "@/lib/types";
import { formatDate, getYear } from "@/lib/format";
import { DownloadIcon, LinkIcon, ShareIcon } from "./Icons";

export function ShareCard({ moment }: { moment: Moment }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      flash("链接已复制");
    } catch {
      flash("复制失败，请手动复制地址栏");
    }
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
      link.download = `goat-atlas-${moment.slug}.png`;
      link.href = dataUrl;
      link.click();
      flash("分享卡已生成");
    } catch {
      flash("生成失败，请直接截图保存");
    } finally {
      setBusy(false);
    }
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${moment.title} | GOAT Atlas`,
          text: moment.summary,
          url: window.location.href,
        });
        flash("已打开分享");
      } catch {
        // User cancelled the native share sheet.
      }
      return;
    }
    await copyLink();
  }

  return (
    <div className="share-module">
      <div className="share-card" ref={cardRef}>
        <div className="share-card-grain" aria-hidden="true" />
        <div className="share-card-top">
          <span>
            GOAT <em>ATLAS</em>
          </span>
          <strong aria-hidden="true">7</strong>
        </div>

        <div className="share-card-year" aria-hidden="true">
          {getYear(moment.date)}
        </div>

        <div className="share-card-body">
          <p className="share-card-kicker">
            {formatDate(moment.date)} · {moment.clubZh}
          </p>
          <h3>{moment.title}</h3>
          <p>{moment.summary}</p>
        </div>

        <div className="share-card-bottom">
          <div>
            <span>{moment.competition}</span>
            <strong>
              {moment.stat
                ? `${moment.stat.label} ${moment.stat.value}`
                : "Cristiano Ronaldo"}
            </strong>
          </div>
          <span className="share-card-sign">CR7</span>
        </div>
      </div>

      <div className="share-actions">
        <button type="button" className="button button-gold" onClick={shareCard}>
          <ShareIcon />
          分享
        </button>
        <button
          type="button"
          className="button button-ghost"
          onClick={downloadCard}
          disabled={busy}
        >
          <DownloadIcon />
          {busy ? "生成中…" : "下载卡片"}
        </button>
        <button type="button" className="button button-quiet" onClick={copyLink}>
          <LinkIcon />
          复制链接
        </button>
      </div>

      <p className="share-hint" role="status" aria-live="polite">
        {feedback || "保存为图片，发给一个懂球的朋友。"}
      </p>
    </div>
  );
}
