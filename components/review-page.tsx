import Link from 'next/link';
import { Check, Minus, ArrowUpRight } from 'lucide-react';
import type { Review } from '@/lib/types';
import { categories } from '@/lib/sample';
import { SiteShell, Breadcrumb, SectionLabel } from './site';
import { RichText } from './rich-text';
import { ReviewCard } from './review-card';
import { JsonLd, BreadcrumbSchema } from './seo';
import { CommunityForm } from './community-form';
import { articleContent, safeUrl } from '@/lib/content';
import { getAuthor, getCommunity } from '@/lib/data';
import { siteUrl } from '@/lib/config';
export function AffiliateButton({
  review,
  fallback = null,
}: {
  review: Review;
  fallback?: React.ReactNode;
}) {
  if (!review.affiliate_url || !safeUrl(review.affiliate_url)) return fallback;
  return (
    <div className="affiliate-block">
      <p>Affiliate link: we may earn a commission at no extra cost to you.</p>
      <a
        className="button"
        href={review.affiliate_url}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
      >
        Visit official website <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
export async function ReviewPage({ review: r, all }: { review: Review; all: Review[] }) {
  const category = categories.find((c) => c.slug === r.category_slug)!;
  const related = all
    .filter((v) => v.category_slug === r.category_slug && v.id !== r.id)
    .slice(0, 3);
  const { toc } = articleContent(r.body);
  // Body headings are anchored with a positional suffix, so resolve the sources
  // section from the generated table of contents rather than guessing its id.
  const sources = toc.find((t) => /sources|shopping|where to buy/i.test(t.title));
  const sourcesLink = sources ? (
    <a className="text-link" href={`#${sources.id}`}>
      Sources and shopping options
    </a>
  ) : (
    <p className="muted">No purchase link has been published for this product yet.</p>
  );
  const [author, community] = await Promise.all([getAuthor(), getCommunity(r.id)]);
  return (
    <SiteShell>
      <article className="page-section">
        <Breadcrumb
          items={[{ label: category.name, href: `/${category.slug}` }, { label: r.title }]}
        />
        <BreadcrumbSchema
          items={[
            { label: category.name, path: `/${category.slug}` },
            { label: r.title, path: `/${r.category_slug}/${r.slug}` },
          ]}
        />
        {r.is_sample ? (
          <div className="notice">
            Fictional sample · This page demonstrates the review format. It is not a product
            recommendation.
          </div>
        ) : (
          <div className="disclosure">
            This page may contain affiliate links. We may earn a commission at no extra cost to you.
          </div>
        )}
        <div className="review-page-hero">
          <div>
            <SectionLabel>{category.name} / A closer look</SectionLabel>
            <h1 className="page-title">
              {r.title}
              {r.id.startsWith('editorial-product-')
                ? ' — label overview'
                : !r.title.toLowerCase().includes('review')
                  ? ' review'
                  : ''}
            </h1>
            <p className="page-intro">{r.summary}</p>
            <div className="byline">
              <Link href="/author/sumita-bhatti">
                {r.is_sample
                  ? 'Editorial layout preview'
                  : `By ${r.id.startsWith('editorial-product-') ? 'SharpAndLean editorial team' : author?.name || 'SharpAndLean editorial team'}`}
              </Link>
              <span>
                {r.is_sample
                  ? 'Awaiting verified content'
                  : `Last reviewed ${new Date(r.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </span>
            </div>
          </div>
          <div className="score-ring">
            <strong>{r.score === null ? '—' : r.score.toFixed(1)}</strong>
            <span>{r.score === null ? 'Not rated' : 'OUT OF 10'}</span>
          </div>
        </div>
        <div className="review-layout">
          <aside className="review-sidebar">
            <div className="summary-box">
              <span className="eyebrow">THE SHORT VERSION</span>
              <h3>{r.verdict || 'Our assessment'}</h3>
              <p>{r.summary}</p>
              <dl>
                <div>
                  <dt>Price</dt>
                  <dd>{r.product_price || 'Not listed'}</dd>
                </div>
                <div>
                  <dt>Guarantee</dt>
                  <dd>{r.money_back_guarantee || 'Not verified'}</dd>
                </div>
              </dl>
              <AffiliateButton review={r} fallback={sourcesLink} />
            </div>
            <nav className="toc" aria-label="Table of contents">
              <h4>In this review</h4>
              {toc.map((t) => (
                <a key={t.id} href={`#${t.id}`}>
                  {t.title}
                </a>
              ))}
              <a href="#ingredients">Ingredient analysis</a>
              <a href="#considerations">Who it’s for</a>
              <a href="#where-to-buy">Where to buy</a>
              <a href="#faqs">Your questions</a>
            </nav>
          </aside>
          <div className="review-body">
            <RichText html={r.body} />
            <section id="ingredients">
              <h2>Ingredient analysis</h2>
              {r.ingredients.length ? (
                r.ingredients.map((ingredient, i) => (
                  <div className="ingredient" key={i}>
                    <div>
                      <h3>{ingredient.name}</h3>
                      <span className="tag">{ingredient.evidence_rating} evidence</span>
                    </div>
                    <strong>{ingredient.dose}</strong>
                    <p>{ingredient.note}</p>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Ingredient doses, research sources and evidence assessments will appear here once
                  verified.
                </p>
              )}
            </section>
            <section id="considerations">
              <h2>Who it’s for. What to consider.</h2>
              <div className="pros-cons">
                <div>
                  <h3>Who it may suit</h3>
                  <p>{r.who_for}</p>
                </div>
                <div>
                  <h3>Who should avoid it</h3>
                  <p>{r.who_avoid}</p>
                </div>
              </div>
              <div className="pros-cons">
                <div>
                  <h3>What stands out</h3>
                  {r.pros.map((s, i) => (
                    <p key={i}>
                      <Check size={15} />
                      {s}
                    </p>
                  ))}
                </div>
                <div>
                  <h3>Worth considering</h3>
                  {r.cons.map((s, i) => (
                    <p key={i}>
                      <Minus size={15} />
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            </section>
            {Object.keys(r.score_breakdown || {}).length > 0 && (
              <section>
                <h2>Score breakdown</h2>
                {Object.entries(r.score_breakdown).map(([name, score]) => (
                  <div className="rating-row" key={name}>
                    <span>{name}</span>
                    <meter value={score} min={0} max={10} />
                    <strong>{score}/10</strong>
                  </div>
                ))}
              </section>
            )}
            <section>
              <h2>How does it compare?</h2>
              {related.length ? (
                <ul>
                  {related.map((v) => (
                    <li key={v.id}>
                      <Link className="text-link" href={`/${v.category_slug}/${v.slug}`}>
                        {v.title} <ArrowUpRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Related reviews will appear as this category grows.</p>
              )}
            </section>
            <section id="where-to-buy">
              <h2>Where to buy</h2>
              <AffiliateButton review={r} fallback={sourcesLink} />
            </section>
            <section id="faqs">
              <h2>Your questions, answered.</h2>
              <div className="faq-list">
                {r.faqs.map((f, i) => (
                  <details key={i}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
            {!r.is_sample && (
              <section>
                <h2>Community experiences</h2>
                {community.map((c) => (
                  <div className="community-entry" key={c.id}>
                    <strong>{c.reviewer_name}</strong>
                    <span>{c.rating}/5 · Personal experience</span>
                    <p>{c.review_text}</p>
                  </div>
                ))}
                <CommunityForm reviewId={r.id} />
              </section>
            )}
          </div>
        </div>
        {related.length > 0 && (
          <section className="related">
            <h2>Keep asking good questions.</h2>
            <div className="review-grid">
              {related.map((v) => (
                <ReviewCard key={v.id} review={v} />
              ))}
            </div>
          </section>
        )}
      </article>
      {!r.is_sample && !r.id.startsWith('editorial-product-') && (
        <>
          <JsonLd
            data={{
              '@type': 'Review',
              headline: r.title,
              reviewBody: r.summary,
              datePublished: r.published_at,
              dateModified: r.updated_at,
              author: author
                ? {
                    '@type': 'Person',
                    name: author.name,
                    url: new URL('/author/sumita-bhatti', siteUrl).href,
                  }
                : { '@type': 'Organization', name: 'SharpAndLean' },
              itemReviewed: {
                '@type': 'Product',
                name: r.product_name || r.title,
                ...(r.featured_image_url ? { image: r.featured_image_url } : {}),
              },
              ...(r.score !== null
                ? {
                    reviewRating: {
                      '@type': 'Rating',
                      ratingValue: r.score,
                      bestRating: 10,
                      worstRating: 0,
                    },
                  }
                : {}),
            }}
          />
          {r.faqs.length > 0 && (
            <JsonLd
              data={{
                '@type': 'FAQPage',
                mainEntity: r.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: { '@type': 'Answer', text: f.answer },
                })),
              }}
            />
          )}
        </>
      )}
    </SiteShell>
  );
}
