import type { Metadata } from "next";
import Link from "next/link";
import { moments, player } from "@/lib/data";
import { absoluteUrl, withBasePath } from "@/lib/site";

export const metadata: Metadata = {
  title: "素材与许可",
  description:
    "GOAT Atlas 的代码、策展数据与第三方素材各自适用什么许可，以及站内图片和视频的使用规则。",
  alternates: { canonical: absoluteUrl("/credits/") },
};

export default function CreditsPage() {
  const mediaMoments = moments.filter((moment) => moment.media);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">CREDITS &amp; LICENSES</div>
          <h1>
            素材与
            <br />
            <span>许可。</span>
          </h1>
          <div className="page-hero-bottom">
            <p>
              代码 MIT，策展数据 CC BY-SA 4.0。第三方图片和视频各自保留原许可，
              站内只做标注，不重新授权。没有明确许可的素材不会上线。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">PROJECT ARTWORK</p>
              <h2>项目原创插画</h2>
            </div>
            <p className="section-intro">
              六张章节线稿由 <code>scripts/generate-era-art.mjs</code> 生成，
              不包含任何第三方照片，随项目以 CC BY-SA 4.0 发布。
            </p>
          </div>

          <div className="credits-grid">
            {player.eras.map((era) => (
              <article className="credit-card" key={era.id}>
                <img
                  src={withBasePath(`/art/era-${era.id}.svg`)}
                  alt={`${era.label} 章节原创插画`}
                  loading="lazy"
                />
                <h3>
                  {era.index} · {era.label} / {era.name}
                </h3>
                <p>
                  {era.range} · {era.club} · 项目原创
                </p>
                <span>CC BY-SA 4.0</span>
              </article>
            ))}
          </div>

          <div className="data-note credits-policy">
            <h3>第三方素材政策</h3>
            <p>
              这个项目不托管比赛照片、转播画面或俱乐部官方素材。原因是版权，
              也因为“每条记录都有出处”不该靠一张来路不明的图。
            </p>
            <ul>
              <li>图片必须能追溯到作者、原始页面和明确许可（CC BY / CC BY-SA / CC0 或已获授权）。</li>
              <li>CC BY-SA 素材如经裁剪、调色等修改，衍生图继续以 CC BY-SA 发布。</li>
              <li>视频只外链官方频道，不下载、不转播、不自动播放。</li>
              <li>不使用俱乐部徽章、赞助商标识或未授权肖像做装饰。</li>
              <li>发现素材许可有问题，请带着链接开 issue，我们会先下线再核对。</li>
            </ul>
          </div>

          <div className="data-note credits-policy">
            <h3>当前第三方图片 / 视频</h3>
            {mediaMoments.length ? (
              <ul>
                {mediaMoments.map((moment) => (
                  <li key={moment.slug}>
                    <Link href={`/atlas/${moment.slug}`}>{moment.title}</Link>
                    {" — "}
                    {moment.media?.credit} · {moment.media?.license}
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                目前没有第三方图片或视频。详情页的 <code>media</code>{" "}
                字段已经就绪，只有在许可、作者和来源都齐全时才会启用。
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
