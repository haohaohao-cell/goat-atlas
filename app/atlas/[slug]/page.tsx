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
import { absoluteUrl } from "@/lib/site";

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

  return (
    <article className="detail">
      <header className="detail-hero">
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
            </div>
            <p>
              这条记录由社区整理，尽量保留可核验的原始来源。发现事实错误，
              欢迎带着链接来纠正。
            </p>
            <ul>
              {moment.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                    <ArrowUpRight />
                  </a>
                </li>
              ))}
            </ul>
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
