import Link from "next/link";
import { erasWithMoments, featuredMoments, stats } from "@/lib/data";
import { eraCopy, localizedHome, type Locale } from "@/lib/i18n";
import { formatDateEn, getYear } from "@/lib/format";
import { SetHtmlLang } from "./SetHtmlLang";
import { ArrowRight, ArrowUpRight, GithubIcon } from "./Icons";
import { siteConfig } from "@/lib/site";

export function LocalizedHome({ locale }: { locale: Locale }) {
  const copy = localizedHome[locale];
  const eras = eraCopy[locale];
  const selected = featuredMoments.slice(0, 3);
  const proofValues = [stats.moments, stats.eras, stats.sources];

  return (
    <>
      <SetHtmlLang lang={locale} />

      <section className="localized-hero">
        <div className="localized-hero-grid" aria-hidden="true" />
        <div className="container">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1>
            <span>{copy.kicker}</span>
            <strong>{copy.name}</strong>
          </h1>

          <div className="localized-hero-bottom">
            <p className="localized-lede">{copy.lede}</p>
            <div className="localized-actions">
              <Link className="button button-gold" href="/atlas">
                {copy.primary}
                <ArrowRight />
              </Link>
              <Link className="button button-ghost" href="/story">
                {copy.secondary}
                <ArrowUpRight />
              </Link>
            </div>
          </div>

          <div className="localized-proof">
            {proofValues.map((value, index) => (
              <div key={copy.proof[index]}>
                <strong>{value}</strong>
                <span>{copy.proof[index]}</span>
              </div>
            ))}
          </div>

          <p className="localized-note">{copy.note}</p>
        </div>
      </section>

      <section className="localized-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">WHAT&apos;S INSIDE</p>
              <h2>{copy.insideTitle}</h2>
            </div>
            <p className="section-intro">{copy.insideIntro}</p>
          </div>

          <div className="localized-card-grid">
            {copy.cards.map((card) => (
              <Link className="localized-card" href={card.href} key={card.index}>
                <div className="localized-card-top">
                  <span>{card.index}</span>
                  <em>{card.cta}</em>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="localized-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">SIX CHAPTERS</p>
              <h2>{copy.chaptersTitle}</h2>
            </div>
            <p className="section-intro">{copy.chaptersIntro}</p>
          </div>

          <div className="localized-era-grid">
            {erasWithMoments.map((era) => {
              const text = eras[era.id];
              return (
                <Link
                  className="localized-era"
                  href={`/story#era-${era.id}`}
                  key={era.id}
                >
                  <div>
                    <span>{era.index}</span>
                    <em>{era.range}</em>
                  </div>
                  <h3>{text?.name ?? era.name}</h3>
                  <p>{text?.description ?? era.description}</p>
                  <small>
                    {era.moments.length} {locale === "pt" ? "momentos" : "moments"}
                  </small>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="localized-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">SELECTED MOMENTS</p>
              <h2>{copy.momentsTitle}</h2>
            </div>
            <p className="section-intro">{copy.momentsIntro}</p>
          </div>

          <div className="localized-moment-grid">
            {selected.map((moment) => (
              <Link
                className="localized-moment"
                href={`/atlas/${moment.slug}`}
                key={moment.id}
              >
                <div className="localized-moment-top">
                  <span>{getYear(moment.date)}</span>
                  <em>{formatDateEn(moment.date)}</em>
                </div>
                <h3>{moment.titleEn}</h3>
                <p>
                  {moment.club} · {moment.competition}
                </p>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="localized-cta">
        <div className="container">
          <p className="eyebrow">START ANYWHERE</p>
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaBody}</p>
          <div className="localized-actions">
            <Link className="button button-gold" href="/atlas">
              {copy.primary}
              <ArrowRight />
            </Link>
            <Link className="button button-ghost" href="/play">
              {locale === "pt" ? "Jogar" : "Play"}
              <ArrowUpRight />
            </Link>
            {siteConfig.githubUrl ? (
              <a
                className="button button-quiet"
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon />
                GitHub
              </a>
            ) : null}
          </div>
          <p className="localized-note">{copy.languageNote}</p>
        </div>
      </section>
    </>
  );
}
