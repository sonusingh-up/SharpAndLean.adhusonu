import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel } from './site';
import { BreadcrumbSchema, FaqSchema, JsonLd } from './seo';
import { ComparisonReport } from './comparison';
import {
  buildComparison,
  comparePartners,
  formatMoney,
  isIndexableComparison,
  productName,
} from '@/lib/compare';
import { comparePath } from '@/lib/compare-path';
import { siteUrl } from '@/lib/config';
import type { Review } from '@/lib/types';

/**
 * A generated comparison: /compare/a-vs-b or /compare/a-vs-b-vs-c.
 *
 * No editorial prose stands behind these pages, so the intro says plainly what
 * the page is — the published reviews lined up — rather than dressing the
 * arithmetic up as a new assessment.
 */
export function ComparePairPage({
  reviews,
  all,
  title,
}: {
  reviews: Review[];
  all: Review[];
  title: string;
}) {
  const names = reviews.map(productName);
  const comparison = buildComparison(reviews);
  const path = comparePath(reviews.map((r) => r.slug));
  const updated = reviews
    .map((r) => r.updated_at)
    .filter(Boolean)
    .sort()
    .at(-1);
  const pageUrl = new URL(path, siteUrl).href;
  const versus = names.join(' or ');
  // Questions answered by text that is visible on the page: the short answer
  // and score headline at the top, and the cost section. Answer engines lift
  // these whole, so each answer stands on its own.
  const faqs = [
    {
      question: `Which is better, ${versus}?`,
      answer: [comparison.verdict, comparison.headline].filter(Boolean).join(' '),
    },
    ...(comparison.costs.every((c) => c !== null) &&
    new Set(comparison.costs.map((c) => c!.currency)).size === 1
      ? [
          {
            question: `Which costs less per serving, ${versus}?`,
            answer: `${comparison.costs
              .map(
                (c, i) =>
                  `${names[i]} costs ${formatMoney(c!.perServing, c!.currency)} a serving (${formatMoney(c!.price, c!.currency)} for ${c!.servings} servings, ${c!.source}, checked ${c!.checkedAt.slice(0, 10)})`,
              )
              .join('; ')}. Prices change, so confirm on the listing before buying.`,
          },
        ]
      : []),
  ];
  const here = new Set(reviews.map((r) => r.slug));
  // Other comparisons that share a product with this one, for readers whose
  // real question is "what else should I weigh this against".
  const more = reviews
    .flatMap((r) =>
      comparePartners(r, all)
        .filter((o) => !here.has(o.slug) && isIndexableComparison([r, o]))
        .map((o) => [r, o]),
    )
    .slice(0, 6);

  return (
    <SiteShell>
      <article className="page-section">
        <Breadcrumb
          items={[{ label: 'Comparisons', href: '/compare' }, { label: names.join(' vs ') }]}
        />
        <BreadcrumbSchema
          items={[
            { label: 'Comparisons', path: '/compare' },
            { label: names.join(' vs '), path },
          ]}
        />
        <header className="page-top">
          <SectionLabel>Side by side</SectionLabel>
          <h1 className="page-title">
            {names.map((n, i) => (
              <span key={n}>
                {i > 0 && <em> vs </em>}
                {n}
              </span>
            ))}
          </h1>
          {comparison.verdict && (
            <p className="page-verdict">
              <strong>Short answer:</strong> {comparison.verdict}
            </p>
          )}
          <p className="page-intro">
            The published reviews of {names.slice(0, -1).join(', ')} and {names.at(-1)}, lined up:
            the five scores, what one serving delivers against the studied dose, the real cost per
            serving and what each label leaves out.
            {updated &&
              ` Figures as of ${new Date(updated).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}.`}
          </p>
        </header>
        <ComparisonReport reviews={reviews} />
        {more.length > 0 && (
          <section className="reading-section">
            <h2>Other comparisons</h2>
            <ul className="compare-with-list">
              {more.map(([a, b]) => (
                <li key={`${a.slug}-${b.slug}`}>
                  <Link href={comparePath([a.slug, b.slug])}>
                    {productName(a)} <em>vs</em> {productName(b)}
                    <ArrowUpRight size={15} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <JsonLd
        data={{
          '@type': 'WebPage',
          '@id': `${siteUrl}${path}#webpage`,
          name: title,
          description: comparison.verdict ?? comparison.headline,
          ...(comparison.verdict ? { abstract: comparison.verdict } : {}),
          url: pageUrl,
          mainEntityOfPage: pageUrl,
          // The products compared, by name and review, so a parser knows what
          // the page is about without reading the tables.
          about: reviews.map((r, i) => ({
            '@type': 'Thing',
            name: names[i],
            url: new URL(`/${r.category_slug}/${r.slug}`, siteUrl).href,
          })),
          inLanguage: 'en-US',
          ...(updated ? { dateModified: updated } : {}),
          isPartOf: { '@id': `${siteUrl}/#website` },
          publisher: { '@id': `${siteUrl}/#organization` },
          // Plain list items pointing at the reviews. Product nodes live on the
          // review pages, where they carry offers and a review; repeating them
          // here without either is what Search Console rejects.
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: reviews.length,
            itemListElement: reviews.map((r, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: names[i],
              url: new URL(`/${r.category_slug}/${r.slug}`, siteUrl).href,
              ...(r.score !== null
                ? {
                    description: `Scored ${r.score.toFixed(1)} out of 10 in its SharpAndLean review.`,
                  }
                : {}),
            })),
          },
        }}
      />
      <FaqSchema faqs={faqs.filter((f) => f.answer)} />
    </SiteShell>
  );
}
