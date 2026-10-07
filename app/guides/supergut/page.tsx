import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowDown, BookOpen } from 'lucide-react';
import { SiteShell, Breadcrumb } from '@/components/site';
import { RichText } from '@/components/rich-text';
import { AffiliateButton } from '@/components/review-page';
import { ReferenceBox, PageHistory } from '@/components/article-footer';
import { pageMeta, JsonLd, BreadcrumbSchema, WebPageSchema, FaqSchema } from '@/components/seo';
import { getReviews } from '@/lib/data';
import { siteUrl, demoMode } from '@/lib/config';
import type { Review } from '@/lib/types';
import { supergut as brand } from '@/lib/brands/supergut';
import s from './supergut-guide.module.css';

export const revalidate = 86400;

export const metadata = pageMeta(brand.seoTitle, brand.seoDescription, brand.path, brand.figure.src, {
  type: 'article',
  publishedTime: brand.published,
  modifiedTime: brand.updated,
});

type Topic = (typeof brand.stages)[number]['topics'][number];
const slotOf = (t: Topic) => ('slot' in t ? t.slot : undefined);

const dateLabel = new Date(brand.updated).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * The Supergut guide. A stage-based hub: chapter tiles and quick answers up
 * front, then four stages with a sticky bar to move between them. Reviews are
 * read live from the catalogue, so scores and images cannot drift from the
 * review pages; everything else comes from lib/brands/supergut.ts.
 */
export default async function SupergutGuidePage() {
  const all = await getReviews();
  const reviews = brand.reviewedSlugs
    .map((slug) => all.find((r) => r.slug === slug))
    .filter((r): r is Review => !!r);
  const pageUrl = `${siteUrl}${brand.path}`;
  const topicCount = brand.stages.reduce((n, st) => n + st.topics.length, 0);

  const slot = (name: string | undefined) => {
    if (name === 'chart') {
      return (
        <figure className={s.figure}>
          <Image
            src={brand.figure.src}
            alt={brand.figure.alt}
            width={1200}
            height={720}
            sizes="(max-width: 900px) 92vw, 780px"
            quality={90}
          />
          <figcaption>{brand.figure.caption}</figcaption>
        </figure>
      );
    }
    if (name === 'reviews') {
      return reviews.map((r) => (
        <article className={s.review} key={r.id}>
          <Link className={s.reviewMedia} href={`/${r.category_slug}/${r.slug}`} aria-hidden="true" tabIndex={-1}>
            {r.featured_image_url && (
              <Image src={r.featured_image_url} alt="" fill sizes="180px" />
            )}
          </Link>
          <div>
            {r.score !== null && (
              <span className={s.score}>
                {r.score.toFixed(1)}
                <small>/ 10</small>
              </span>
            )}
            <h4>{r.title}</h4>
            <p>{r.summary}</p>
            <div className={s.reviewActions}>
              <Link className="text-link" href={`/${r.category_slug}/${r.slug}`}>
                Read the full review <ArrowUpRight size={16} />
              </Link>
              <AffiliateButton review={r} />
            </div>
          </div>
        </article>
      ));
    }
    if (name === 'range') {
      if (brand.unreviewed.length === 0) return null;
      return (
        <>
          <div className={s.range}>
            {brand.unreviewed.map((p) => (
              <article className={s.product} key={p.name}>
                <span className={s.fibre}>Fibre · {p.fibre}</span>
                <h4>{p.name}</h4>
                <p>{p.note}</p>
                <span className={s.unreviewed}>Not yet reviewed or scored</span>
                <a
                  className={s.productLink}
                  href={brand.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                >
                  Check the current price
                </a>
              </article>
            ))}
          </div>
          <p className={s.disclosure}>
            Affiliate links: we may earn a commission at no extra cost to you. It never changes a
            score.
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <SiteShell>
      <article className="page-section">
        <BreadcrumbSchema
          items={[
            { label: 'Guides', path: '/guides' },
            { label: brand.name, path: brand.path },
          ]}
        />
        <Breadcrumb items={[{ label: 'Guides', href: '/guides' }, { label: brand.name }]} />

        {/* Hero: the promise on the left, the four numbers that sum it up on the right. */}
        <header className={s.hero}>
          <div>
            <p className={s.kicker}>
              <span className={s.pill}>
                <BookOpen size={13} /> Brand guide
              </span>
              <span>
                {brand.stages.length} stages · {topicCount} topics · {brand.references.length} sources
              </span>
            </p>
            <h1 className={s.title}>
              The complete Supergut guide: reviews, research and what it <em>adds up to</em>
            </h1>
            <p className={s.dek}>{brand.intro}</p>
            <div className={s.byline}>
              <span>
                Written by <strong>SLN Team</strong>
              </span>
              <span>
                Updated <strong>{dateLabel}</strong>
              </span>
              <span>Independent: commissions never change a score</span>
            </div>
          </div>
          <div className={s.stats} aria-label="At a glance">
            {brand.stats.map((st) => (
              <div className={s.stat} key={st.label}>
                <span className={s.statValue}>
                  {st.value === 'live-score' ? (
                    <>
                      {('reviewSlug' in st ? all.find((r) => r.slug === st.reviewSlug)?.score?.toFixed(1) : null) ?? '—'}
                      <small>/ 10</small>
                    </>
                  ) : (
                    st.value
                  )}
                </span>
                <span className={s.statLabel}>{st.label}</span>
                <span className={s.statNote}>{st.note}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Chapter tiles */}
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>In this guide</span>
            <h2>
              Every stage, from first look to <em>daily use</em>
            </h2>
          </div>
          <p>
            Start at the beginning, or jump to the question you came with. Each stage links to the
            topics inside it.
          </p>
        </div>
        <nav className={s.chapters} aria-label="Guide stages">
          {brand.stages.map((st) => (
            <div className={s.chapter} key={st.id}>
              <span className={s.chapterNumber}>{st.number}</span>
              <h3>
                <a href={`#${st.id}`}>{st.title}</a>
              </h3>
              <p>{st.summary}</p>
              <ul className={s.chapterTopics}>
                {st.topics.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Quick answers */}
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>Quick answers</span>
            <h2>
              The four questions people <em>ask first</em>
            </h2>
          </div>
          <p>Short answers, each linked to the part of the guide that shows the working.</p>
        </div>
        <div className={s.answers}>
          {brand.quickAnswers.map((q) => (
            <div className={s.answer} key={q.question}>
              <h3>{q.question}</h3>
              <p>{q.answer}</p>
              <a href={`#${q.anchor}`}>
                Read more <ArrowDown size={13} />
              </a>
            </div>
          ))}
        </div>

        {/* Sticky stage bar and the four stages */}
        <nav className={s.stageBar} aria-label="Jump to a stage">
          {brand.stages.map((st) => (
            <a href={`#${st.id}`} key={st.id}>
              <span>{st.number}</span>
              {st.title}
            </a>
          ))}
        </nav>

        <div className={s.layout}>
          {brand.stages.map((st) => (
            <section className={s.stage} id={st.id} key={st.id} aria-labelledby={`${st.id}-title`}>
              <div className={s.stageHead}>
                <span className={s.stageNumber}>{st.number}</span>
                <div>
                  <h2 id={`${st.id}-title`}>{st.title}</h2>
                  <p>{st.summary}</p>
                </div>
              </div>
              {st.topics.map((t) => (
                <div className={s.topic} id={t.id} key={t.id}>
                  <h3>{t.title}</h3>
                  <RichText html={t.html} />
                  {slotOf(t) && <div className={s.slot}>{slot(slotOf(t))}</div>}
                </div>
              ))}
            </section>
          ))}

          <section className={s.verdict} id="verdict">
            <span className={s.eyebrow}>Our verdict</span>
            <h2>
              Judge it as fibre, <em>not as GLP-1</em>
            </h2>
            <RichText html={brand.verdict} />
          </section>
        </div>

        {/* Further reading */}
        <div className={s.sectionHead}>
          <div>
            <span className={s.eyebrow}>Further reading</span>
            <h2>
              Where Supergut comes up <em>elsewhere</em>
            </h2>
          </div>
          <p>The articles on this site that discuss the brand, and what each one adds.</p>
        </div>
        <div className={s.reading}>
          {brand.articles.map((a) => (
            <Link className={s.readingCard} href={a.href} key={a.href}>
              <strong>{a.title}</strong>
              <span>{a.note}</span>
              <em>
                Read the article <ArrowUpRight size={14} />
              </em>
            </Link>
          ))}
        </div>

        <div className={s.footer}>
          <section className="reading-section" id="faqs">
            <h2>Your questions</h2>
            <div className="faq-list">
              {brand.faqs.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <ReferenceBox references={brand.references} />
          <PageHistory entries={brand.history} />
        </div>
      </article>

      {!demoMode && (
        <>
          <WebPageSchema
            name={brand.seoTitle}
            description={brand.seoDescription}
            path={brand.path}
            datePublished={brand.published}
            dateModified={brand.updated}
            reviewedBy={null}
            lastReviewed={null}
            mainEntity={`${pageUrl}#article`}
            image={brand.figure.src}
          />
          <FaqSchema faqs={brand.faqs} />
          <JsonLd
            data={{
              '@type': 'Article',
              '@id': `${pageUrl}#article`,
              headline: brand.seoTitle,
              description: brand.seoDescription,
              url: pageUrl,
              image: `${siteUrl}${brand.figure.src}`,
              datePublished: brand.published,
              dateModified: brand.updated,
              inLanguage: 'en-GB',
              author: { '@id': `${siteUrl}/#organization` },
              publisher: { '@id': `${siteUrl}/#organization` },
              about: { '@type': 'Brand', name: brand.name, url: 'https://supergut.com/' },
              hasPart: brand.stages.map((st) => ({
                '@type': 'WebPageElement',
                name: st.title,
                url: `${pageUrl}#${st.id}`,
              })),
              mentions: reviews.map((r) => ({
                '@type': 'Product',
                name: r.product_name || r.title,
                url: `${siteUrl}/${r.category_slug}/${r.slug}`,
              })),
            }}
          />
        </>
      )}
    </SiteShell>
  );
}
