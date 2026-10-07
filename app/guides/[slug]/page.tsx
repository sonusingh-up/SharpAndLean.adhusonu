import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { SiteShell, Breadcrumb } from '@/components/site';
import { ExpertNote } from '@/components/evidence';
import {
  pageMeta,
  JsonLd,
  BreadcrumbSchema,
  FaqSchema,
  publisherRef,
  ExtendedAccess,
  WebPageSchema,
  absoluteUrl,
  defaultOgImage,
  personRef,
} from '@/components/seo';
import { ReferenceBox, PageHistory } from '@/components/article-footer';
import { guides, getGuide, type Guide, type GuideBlock } from '@/lib/guides';
import { siteUrl } from '@/lib/config';
import { teamProfile, authorProfile } from '@/lib/author';
import { articles } from '@/lib/articles';
import { ingredients } from '@/lib/ingredients';
import s from './guide.module.css';

export const revalidate = 86400;

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return pageMeta('Guide', 'Guide', `/guides/${slug}`);
  return pageMeta(
    g.seoTitle ?? g.title,
    g.seoDescription ?? g.summary,
    `/guides/${g.slug}`,
    undefined,
    {
      type: 'article',
      publishedTime: g.published,
      modifiedTime: g.updated,
    },
  );
}

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function readingMinutes(g: Guide) {
  const text = [
    g.hook,
    ...g.blocks.flatMap((b) => {
      if (b.type === 'ul') return b.items;
      if (b.type === 'table') return [b.caption, ...b.head, ...b.rows.flat()];
      if (b.type === 'anatomy') return b.notes.map((n) => `${n.title} ${n.text}`);
      return 'text' in b ? [b.text] : [];
    }),
    ...g.faqs.map((f) => `${f.question} ${f.answer}`),
  ].join(' ');
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

/** Names a related link by what it points at, rather than printing its slug. */
function describeLink(href: string) {
  const review = articles.find((a) => `/${a.category}/${a.slug}` === href);
  if (review) return `${review.name} ${review.body ? 'review' : 'label overview'}`;
  const ing = ingredients.find((i) => `/ingredients/${i.slug}` === href);
  if (ing) return `${ing.name}: the evidence, claim by claim`;
  if (href === '/best') return 'Best-of guides, ranked by evidence';
  if (href === '/evidence-grading') return 'How we grade evidence';
  return href.replace(/^\//, '').replace(/[-/]/g, ' ');
}

/** The Supplement Facts illustration. Kept from the redesign: its own styles. */
function Anatomy({ block }: { block: Extract<GuideBlock, { type: 'anatomy' }> }) {
  return (
    <figure className={s.anatomy}>
      <div className={s.panelWrap}>
        <div className={s.panel}>
          <span className={s.panelTag}>Illustration</span>
          <p className={s.panelTitle}>Supplement Facts</p>
          <dl className={s.panelRows}>
            {block.rows.map((row) => (
              <div
                key={row.label}
                className={cx(
                  s.panelRow,
                  row.indent && s.panelIndent,
                  row.marker !== undefined && s.marked,
                )}
              >
                <dt>{row.label}</dt>
                {row.value ? <dd>{row.value}</dd> : <dd className={s.panelBlank}>—</dd>}
                {row.marker ? (
                  <span className={s.marker} aria-label={`Marker ${row.marker}`}>
                    {row.marker}
                  </span>
                ) : null}
              </div>
            ))}
          </dl>
        </div>
      </div>
      <ol className={s.anatomyKey}>
        {block.notes.map((n) => (
          <li key={n.marker}>
            <span className={s.marker} aria-hidden="true">
              {n.marker}
            </span>
            <span>
              <strong>{n.title}</strong>
              {n.text}
            </span>
          </li>
        ))}
      </ol>
      <figcaption>{block.caption}</figcaption>
    </figure>
  );
}

/** Body blocks use the same classes as every other long-form page on the site. */
function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 id={block.id}>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'p':
      return <p>{block.text}</p>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <figure className="guide-table">
          {/* A figcaption rather than <caption>: the rounded-corner clip on
              article tables would otherwise cut into a caption's first letter. */}
          <figcaption className={s.tableCaption}>{block.caption}</figcaption>
          <table>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join()}>
                  {row.map((cell, n) =>
                    n === 0 ? (
                      <th key={n} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={n}>{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      );
    case 'callout':
      return (
        <aside className="guide-callout">
          <p>{block.text}</p>
          <Link className="text-link" href={block.href}>
            {block.label} <ArrowUpRight size={14} />
          </Link>
        </aside>
      );
    case 'expert':
      return <ExpertNote>{block.text}</ExpertNote>;
    case 'anatomy':
      return <Anatomy block={block} />;
    default:
      return null;
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const path = `/guides/${g.slug}`;
  const url = new URL(path, siteUrl).href;
  const articleId = `${url}#article`;
  const toc = g.blocks
    .filter((b): b is Extract<GuideBlock, { type: 'h2' }> => b.type === 'h2')
    .map((b) => ({ id: b.id, title: b.text }));
  const minutes = readingMinutes(g);
  const team = { name: teamProfile.name, slug: teamProfile.slug, type: 'Organization' as const };

  return (
    <SiteShell>
      <ExtendedAccess
        id={articleId}
        headline={g.title}
        path={path}
        datePublished={g.published}
        dateModified={g.updated}
        image={defaultOgImage}
        author={team}
      />
      <article className="page-section">
        <BreadcrumbSchema
          items={[
            { label: 'Guides', path: '/guides' },
            { label: g.title, path },
          ]}
        />
        <WebPageSchema
          name={g.title}
          description={g.seoDescription ?? g.summary}
          path={path}
          datePublished={g.published}
          dateModified={g.updated}
          mainEntity={articleId}
          image={defaultOgImage}
        />
        <JsonLd
          data={{
            '@type': 'BlogPosting',
            '@id': articleId,
            headline: g.title,
            description: g.seoDescription ?? g.summary,
            url,
            mainEntityOfPage: url,
            image: absoluteUrl(defaultOgImage),
            inLanguage: 'en-US',
            datePublished: g.published,
            dateModified: g.updated,
            author: {
              '@type': 'Organization',
              '@id': `${siteUrl}/author/${teamProfile.slug}#team`,
              name: teamProfile.name,
              url: `${siteUrl}/author/${teamProfile.slug}`,
            },
            // The editorial note in the body is hers, so she is credited as a
            // contributor rather than as the author of the whole guide.
            contributor: personRef({
              slug: authorProfile.slug,
              name: authorProfile.name,
              title: authorProfile.title,
            }),
            ...(g.references?.length
              ? { citation: g.references.filter((c) => c.url).map((c) => c.url) }
              : {}),
            publisher: publisherRef,
            isPartOf: { '@id': `${siteUrl}/#website` },
          }}
        />
        <FaqSchema faqs={g.faqs} />

        <Breadcrumb items={[{ label: 'Guides', href: '/guides' }, { label: g.title }]} />

        <header className={s.hero}>
          <div className={s.heroText}>
            <p className={s.kicker}>
              <span className={s.pill}>
                <BookOpen size={14} aria-hidden="true" /> Guide
              </span>
              {g.topic && <span>{g.topic}</span>}
              <span className={s.kickerTime}>
                <Clock size={14} aria-hidden="true" /> {minutes} min read
              </span>
            </p>
            <h1 className={s.title}>{g.title}</h1>
            <p className={s.dek}>{g.hook}</p>
            <div className={s.byline}>
              <span className={s.avatars} aria-hidden="true">
                <Image src="/images/logo.png" alt="" width={44} height={44} />
                {authorProfile.photo_url && (
                  <Image src={authorProfile.photo_url} alt="" width={44} height={44} />
                )}
              </span>
              <span className={s.bylineText}>
                <span>
                  By <Link href={`/author/${teamProfile.slug}`}>{teamProfile.name}</Link> ·
                  Editorial note by{' '}
                  <Link href={`/author/${authorProfile.slug}`}>{authorProfile.name}</Link>
                </span>
                <span className={s.bylineDates}>
                  Published {longDate(g.published)}
                  {g.updated !== g.published && <> · Updated {longDate(g.updated)}</>}
                </span>
              </span>
            </div>
          </div>
          {g.takeaways.length > 0 && (
            <aside className={s.heroCard} aria-label="Key takeaways">
              <span className={s.heroCardLabel}>
                The {g.takeaways.length === 4 ? 'four' : g.takeaways.length} numbers
              </span>
              <ol>
                {g.takeaways.map((t, i) => {
                  const target = toc.find((item) => item.title.startsWith(`${i + 1}.`));
                  return (
                    <li key={t}>
                      <span className={s.heroNum}>{String(i + 1).padStart(2, '0')}</span>
                      {target ? <a href={`#${target.id}`}>{t}</a> : <span>{t}</span>}
                    </li>
                  );
                })}
              </ol>
            </aside>
          )}
        </header>

        <div className={cx('review-layout collection-layout', s.layout)}>
          <aside className="review-sidebar">
            {g.checklist?.length ? (
              <div className="summary-box">
                <span className="eyebrow">The 30-second check</span>
                <h3>Before you buy</h3>
                <ol className={s.checks}>
                  {g.checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ol>
              </div>
            ) : null}
            {toc.length > 3 && (
              <nav className="toc" aria-label="Table of contents">
                <h4>On this page</h4>
                {toc.map((t) => (
                  <a key={t.id} href={`#${t.id}`}>
                    {t.title}
                  </a>
                ))}
                {g.faqs.length > 0 && <a href="#faqs">Your questions</a>}
                <a href="#authors">Who wrote this</a>
              </nav>
            )}
          </aside>

          <div className="collection-body">
            <div className="prose">
              {g.blocks.map((b, i) => (
                <Block block={b} key={i} />
              ))}
            </div>

            {g.faqs.length > 0 && (
              <section className="reading-section" id="faqs">
                <h2>Your questions</h2>
                <div className="faq-list">
                  {g.faqs.map((f) => (
                    <details key={f.question}>
                      <summary>{f.question}</summary>
                      <p>{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Same 780px column as the prose and FAQs above and below it. */}
            <div className={s.column}>
              <section className="about-authors" id="authors">
                <h2>Who wrote this guide</h2>
                <div className="author-cards">
                  <Link className="author-card" href={`/author/${teamProfile.slug}`}>
                    <span className="author-card-mark" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="author-card-body">
                      <strong>{teamProfile.name}</strong>
                      <span className="author-card-title">Written and compiled by</span>
                      <span className="author-card-role">{teamProfile.role}</span>
                    </span>
                    <ArrowUpRight size={16} />
                  </Link>
                  <Link className="author-card" href={`/author/${authorProfile.slug}`}>
                    {authorProfile.photo_url && (
                      <Image
                        className="author-card-photo"
                        src={authorProfile.photo_url}
                        alt={authorProfile.name}
                        width={72}
                        height={72}
                      />
                    )}
                    <span className="author-card-body">
                      <strong>{authorProfile.name}</strong>
                      <span className="author-card-title">
                        Editorial note · {authorProfile.title}
                      </span>
                      <span className="author-card-role">{authorProfile.role}</span>
                    </span>
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </section>

              <ReferenceBox references={g.references || []} />
              <PageHistory entries={g.history || [{ date: g.published, note: 'Published.' }]} />
            </div>

            {g.related.length > 0 && (
              <section className="reading-section">
                <h2>Keep reading</h2>
                <div className="index-category-links">
                  {g.related.map((href) => (
                    <Link className="text-link" href={href} key={href}>
                      {describeLink(href)}
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
