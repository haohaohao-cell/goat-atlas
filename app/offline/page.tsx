import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "离线",
  description: "当前离线，这个页面还没有被缓存。",
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/offline/") },
};

export default function OfflinePage() {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="eyebrow">OFFLINE</div>
        <h1>
          现在
          <br />
          <span>离线了</span>
        </h1>
        <p style={{ marginTop: "1.5rem", maxWidth: "34rem" }}>
          这个页面还没有被缓存。已经访问过的页面在断网时仍能打开；恢复网络后刷新即可。
        </p>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/">回到首页</Link>
        </p>
      </div>
    </section>
  );
}
