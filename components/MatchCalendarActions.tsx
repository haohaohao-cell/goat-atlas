"use client";

import { useEffect, useRef, useState } from "react";
import { DownloadIcon, LinkIcon } from "./Icons";

export function MatchCalendarActions({
  downloadUrl,
  calendarUrl,
}: {
  downloadUrl: string;
  calendarUrl: string;
}) {
  const timerRef = useRef<number | undefined>(undefined);
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

  async function copy() {
    try {
      await navigator.clipboard.writeText(calendarUrl);
      flash("订阅链接已复制");
    } catch {
      flash("复制失败，请手动复制");
    }
  }

  return (
    <div className="calendar-actions">
      <a
        className="button button-gold"
        href={downloadUrl}
        download="goat-atlas-matches.ics"
      >
        <DownloadIcon />
        下载赛程日历
      </a>
      <button type="button" className="button button-ghost" onClick={copy}>
        <LinkIcon />
        复制订阅链接
      </button>
      <p className="calendar-feedback" role="status" aria-live="polite">
        {feedback || "支持 Google Calendar、Apple Calendar、Outlook。"}
      </p>
    </div>
  );
}
