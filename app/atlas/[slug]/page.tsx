import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getEra,
  getMomentBySlug,
  getMomentNeighbors,
  getRelatedMoments,
  moments,
} from "@/lib/data";
import { KIND_META } from "@/lib/kinds";
import { formatDateLong, getYear } from "@/lib/format";
import { tagLabel } from "@/lib/tags";
import { MomentCard } from "@/components/MomentCard";
import { ShareCard } from "@/components/ShareCard";
import { ArrowLeft, ArrowUpRight, SourceIcon } from "@/components/Icons";
import {
  correctionIssueUrl,
  SOURCE_TIER_META,
  sourceHost,
  sourceTier,
  sourceTierCounts,
} from "@/lib/sources";
import { absoluteUrl, siteConfig, withBasePath } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return moments.map((moment) => ({ slug: moment.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const moment = getMomentBySlug(slug);

  if (!moment) return {};

  return {
    title: moment.title,
    description: moment.summary,
    alternates: { canonical: absoluteUrl(`/atlas/${moment.slug}/`) },
    openGraph: {
      type: "article",
      title: `${moment.title} | GOAT Atlas`,
      description: moment.summary,
      publishedTime: `${moment.date}T00:00:00.000Z`,
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1200,
          height: 630,
          alt: moment.title,
        },
      ],
    },
  };
}

export default async function MomentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const moment = getMomentBySlug(slug);

  if (!moment) notFound();

  const era = getEra(moment.era);
  const { previous, next } = getMomentNeighbors(moment.slug);
  const related = getRelatedMoments(moment, 3);
  const tierCounts = sourceTierCounts(moment.sources);
  const correctionUrl = siteConfig.githubUrl
    ? correctionIssueUrl({
        githubUrl: siteConfig.githubUrl,
        slug: moment.slug,
        title: moment.title,
        date: moment.date,
        sources: moment.sources,
      })
    : null;

  return (
    <article className="detail">
      <header className="detail-hero">
        <div
          className="detail-era-art"
          aria-hidden="true"
          style={{
            backgroundImage: `url("${withBasePath(`/art/era-${moment.era}.svg`)}")`,
          }}
        />
        <div className="container">
          <div className="detail-top">
            <Link className="detail-back" href="/atlas">
              <ArrowLeft />
              Atlas
            </Link>
            <span>
              {era?.name} / {era?.range}
            </span>
          </div>

          <div className="detail-year" aria-hidden="true">
            {getYear(moment.date)}
          </div>

          <div className="detail-heading">
            <div className="eyebrow detail-kicker">
              <span className="kind-badge" data-kind={moment.kind}>
                <span className="kind-dot" aria-hidden="true" />
                {KIND_META[moment.kind].label}
                <em>{KIND_META[moment.kind].en}</em>
              </span>
              <span>{formatDateLong(moment.date)}</span>
            </div>
            <h1>{moment.title}</h1>
            <p className="detail-en">{moment.titleEn}</p>
            <p className="detail-summary">{moment.summary}</p>
          </div>
        </div>
      </header>

      <div className="container detail-grid">
        <div className="detail-main">
          {moment.media ? (
            <figure className="detail-media">
              {moment.media.type === "image" ? (
                <img
                  src={withBasePath(moment.media.src)}
                  alt={moment.media.alt}
                  width={moment.media.width}
                  height={moment.media.height}
                  loading="lazy"
                />
              ) : (
                <a
                  className="detail-media-video"
                  href={moment.media.src}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span aria-hidden="true">▶</span>
                  <strong>{moment.media.alt}</strong>
                  <em>在官方频道观看 · 不在站内托管</em>
                </a>
              )}
              <figcaption>
                {moment.media.credit} · {moment.media.license} ·{" "}
                <a href={moment.media.sourceUrl} target="_blank" rel="noreferrer">
                  素材来源
                </a>
              </figcaption>
            </figure>
          ) : null}

          <section className="detail-block">
            <p className="eyebrow">THE STORY</p>
            <h2>发生了什么</h2>
            <p>{moment.context}</p>
          </section>

          <section className="detail-block">
            <p className="eyebrow">WHY IT MATTERS</p>
            <h2>为什么被记住</h2>
            <p>{moment.why}</p>
          </section>

          <div className="detail-tags" aria-label="标签">
            {moment.tags.map((tag) => (
              <Link key={tag} href={`/atlas?tag=${encodeURIComponent(tag)}`}>
                #{tagLabel(tag)}
              </Link>
            ))}
          </div>


          <div className="detail-sources">
            <div className="detail-source-head">
              <SourceIcon />
              <h2>来源与校验</h2>
              <span className="detail-source-count">
                {moment.sources.length} 个来源
              </span>
            </div>
            <p>
              这条记录由社区整理，尽量保留可核验的原始来源。发现事实错误，
              欢迎带着链接来纠正。
            </p>
            <ul className="source-list">
              {moment.sources.map((source) => {
                const tier = sourceTier(source.url, source.tier);
                const meta = SOURCE_TIER_META[tier];
                return (
                  <li key={source.url} className="source-item">
                    <span
                      className={`source-tier ${meta.className}`}
                      title={meta.hint}
                    >
                      {meta.label}
                    </span>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.label}
                      <ArrowUpRight />
                    </a>
                    <span className="source-host">{sourceHost(source.url)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="source-legend">
              来源分级：官方（赛事组织 / 俱乐部 / 联赛）&gt; 媒体（通讯社与媒体报道）&gt;
              百科（维基百科等索引，用于交叉核对）。
              {tierCounts.official > 0
                ? ` 本条含 ${tierCounts.official} 个官方来源。`
                : " 本条暂无官方来源，欢迎补充。"}
              {moment.sources.length === 1
                ? " 本条目前只有 1 个来源，属于单源记录。"
                : ""}
            </p>
            {correctionUrl ? (
              <a
                className="text-button"
                href={correctionUrl}
                target="_blank"
                rel="noreferrer"
              >
                发现错误？带着来源提 issue
                <ArrowUpRight />
              </a>
            ) : null}
            <Link className="text-button" href="/about#contribute">
              参与纠错 / 补充来源
            </Link>
          </div>
        </div>

        <aside className="detail-aside">
          <div className="fact-card">
            <div className="fact-card-head">
              <p className="eyebrow">FACT SHEET</p>
              <span>NO. {moment.id.replace("m", "")}</span>
            </div>

            <dl>
              <div className="fact-row">
                <dt>日期</dt>
                <dd>{formatDateLong(moment.date)}</dd>
              </div>
              <div className="fact-row">
                <dt>俱乐部</dt>
                <dd>{moment.clubZh}</dd>
              </div>
              <div className="fact-row">
                <dt>赛事</dt>
                <dd>{moment.competition}</dd>
              </div>
              {moment.opponent ? (
                <div className="fact-row">
                  <dt>对手</dt>
                  <dd>{moment.opponent}</dd>
                </div>
              ) : null}
              {moment.score ? (
                <div className="fact-row">
                  <dt>比分</dt>
                  <dd>{moment.score}</dd>
                </div>
              ) : null}
              {moment.minute ? (
                <div className="fact-row">
                  <dt>时间</dt>
                  <dd>{moment.minute}</dd>
                </div>
              ) : null}
              {moment.venue ? (
                <div className="fact-row">
                  <dt>球场</dt>
                  <dd>{moment.venue}</dd>
                </div>
              ) : null}
              {moment.city ? (
                <div className="fact-row">
                  <dt>城市</dt>
                  <dd>{moment.city}</dd>
                </div>
              ) : null}
              {moment.stat ? (
                <div className="fact-row is-highlight">
                  <dt>{moment.stat.label}</dt>
                  <dd>{moment.stat.value}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <ShareCard moment={moment} />
        </aside>
      </div>

      {related.length ? (
        <section className="detail-related">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">KEEP EXPLORING</p>
                <h2>继续逛。</h2>
              </div>
            </div>
            <div className="moment-grid">
              {related.map((item) => (
                <MomentCard key={item.id} moment={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <nav className="container detail-pager" aria-label="上一篇 / 下一篇">
        {previous ? (
          <Link className="pager-item" href={`/atlas/${previous.slug}`}>
            <span>← PREVIOUS</span>
            <strong>{previous.title}</strong>
            <em>{getYear(previous.date)}</em>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pager-item is-next" href={`/atlas/${next.slug}`}>
            <span>NEXT →</span>
            <strong>{next.title}</strong>
            <em>{getYear(next.date)}</em>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
