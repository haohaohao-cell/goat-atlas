"use client";

import { useState } from "react";

export function VideoEmbed({
  videoId,
  title,
  channel,
}: {
  videoId: string;
  title: string;
  channel: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <div className="video-embed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="video-embed">
      <button
        type="button"
        className="video-facade"
        onClick={() => setActive(true)}
        aria-label={`播放：${title}`}
      >
        <span className="video-play" aria-hidden="true">
          ▶
        </span>
        <strong>{title}</strong>
        <em>{channel} · 点击加载 YouTube 播放器</em>
      </button>
    </div>
  );
}
