import Link from 'next/link';
import Image from 'next/image';
import { Check, Minus, ArrowUpRight } from 'lucide-react';
import type { Review } from '@/lib/types';
import { categories } from '@/lib/sample';
import { SiteShell, Breadcrumb, SectionLabel } from './site';
import { RichText } from './rich-text';
import { ReviewCard } from './review-card';
import { JsonLd, BreadcrumbSchema, FaqSchema, publisherRef } from './seo';
import { authorProfile, teamProfile } from '@/lib/author';
import { findIngredientByName } from '@/lib/ingredients';
import { Brain, Leaf, Flame } from 'lucide-react';
import { TrustBar } from './evidence';
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
        {review.affiliate_network === 'Amazon'
          ? 'Search this product on Amazon'
          : 'Visit official website'}{' '}
        <ArrowUpRight size={16} />
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
  // A label overview records what a manufacturer published; it is not a
  // clinical assessment, so it must not be attributed to the clinician.
  const isLabelOverview = r.id.startsWith('editorial-product-');
  const writtenBy = isLabelOverview
    ? teamProfile
    : { slug: authorProfile.slug, name: author?.name || authorProfile.name };
  // The clinician reviews rather than writes the label overviews, so she is
  // credited separately instead of replacing the desk byline.
  const reviewedBy =
    writtenBy.slug === authorProfile.slug
      ? null
      : {
          slug: authorProfile.slug,
          name: author?.name || authorProfile.name,
          title: authorProfile.title,
          photo_url: author?.photo_url || authorProfile.photo_url,
        };
  // Lead with the ingredient the page is really about: the first active with a
  // disclosed amount, skipping carrier weights graded as no evidence.
  const HeroIcon =
    r.category_slug === 'fat-burners' ? Flame : r.category_slug === 'nootropics' ? Brain : Leaf;
  const headline = r.ingredients.find((i) => i.evidence_rating !== 'none') || r.ingredients[0];
  const keyFigure = headline ? `${headline.dose}` : '';
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
          <div className="review-hero-main">
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

            {/* Two distinct roles, shown separately: the desk compiles the page,
                the clinician reviews it. Collapsing them into one byline is what
                created the misattribution this replaces. */}
            <div className="byline-block">
              <div className="byline-person">
                <span className="byline-role">Written by</span>
                <Link href={`/author/${writtenBy.slug}`}>{writtenBy.name}</Link>
              </div>
              {reviewedBy && (
                <div className="byline-person byline-reviewer">
                  {reviewedBy.photo_url && (
                    <Image
                      className="byline-avatar"
                      src={reviewedBy.photo_url}
                      alt=""
                      width={34}
                      height={34}
                    />
                  )}
                  <span>
                    <span className="byline-role">Medically reviewed by</span>
                    <Link href={`/author/${reviewedBy.slug}`}>{reviewedBy.name}</Link>
                    <span className="byline-credential">{reviewedBy.title}</span>
                  </span>
                </div>
              )}
              <div className="byline-person">
                <span className="byline-role">Last reviewed</span>
                <span className="byline-date">
                  {r.is_sample
                    ? 'Awaiting verified content'
                    : new Date(r.updated_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                </span>
              </div>
            </div>
          </div>

          <aside className="featured-product" aria-label="Product at a glance">
            <div className={`featured-product-art art-${r.category_slug}`}>
              {r.featured_image_url ? (
                <Image
                  src={r.featured_image_url}
                  alt={r.product_name || r.title}
                  fill
                  sizes="320px"
                />
              ) : (
                <>
                  <span>{category.name}</span>
                  <HeroIcon strokeWidth={1} size={62} />
                </>
              )}
              <div className="score-ring">
                <strong>{r.score === null ? '—' : r.score.toFixed(1)}</strong>
                <span>{r.score === null ? 'Not rated' : 'OUT OF 10'}</span>
              </div>
            </div>
            <div className="featured-product-body">
              <span className="featured-product-label">At a glance</span>
              <h2>{r.product_name || r.title}</h2>
              <dl>
                {keyFigure && (
                  <div>
                    <dt>Key figure</dt>
                    <dd>{keyFigure}</dd>
                  </div>
                )}
                <div>
                  <dt>Ingredients checked</dt>
                  <dd>{r.ingredients.length || '—'}</dd>
                </div>
                <div>
                  <dt>Third-party tested</dt>
                  <dd>{r.third_party_tested ? 'Yes' : 'Not published'}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>{r.product_price || 'Not listed'}</dd>
                </div>
              </dl>
              <a className="button featured-product-cta" href="#where-to-buy">
                Where to buy <ArrowUpRight size={15} />
              </a>
            </div>
          </aside>
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
                r.ingredients.map((ingredient, i) => {
                  // Link the panel row to its reference page where one exists.
                  // This is the backbone that connects commercial pages to the
                  // evidence pages in both directions.
                  const ref = findIngredientByName(ingredient.name);
                  return (
                    <div className="ingredient" key={i}>
                      <div>
                        <h3>
                          {ref ? (
                            <Link href={`/ingredients/${ref.slug}`}>{ingredient.name}</Link>
                          ) : (
                            ingredient.name
                          )}
                        </h3>
                        <span className="tag">{ingredient.evidence_rating} evidence</span>
                      </div>
                      <strong>{ingredient.dose}</strong>
                      <p>{ingredient.note}</p>
                      {ref && (
                        <Link
                          className="text-link ingredient-ref-link"
                          href={`/ingredients/${ref.slug}`}
                        >
                          Full evidence on {ref.name} <ArrowUpRight size={13} />
                        </Link>
                      )}
                    </div>
                  );
                })
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
        <TrustBar published={all.length} years={15} />
      </article>
      {/* Label overviews carry no score and are explicitly not reviews, so they
          get Product and FAQ schema but never Review schema. */}
      {!r.is_sample && (
        <>
          <JsonLd
            data={{
              '@type': 'Product',
              name: r.product_name || r.title,
              description: r.summary,
              // Mirrors the visible byline so the structured data makes the
              // same attribution the page does.
              ...(reviewedBy
                ? {
                    reviewedBy: {
                      '@type': 'Person',
                      '@id': `${siteUrl}/author/${reviewedBy.slug}#person`,
                      name: reviewedBy.name,
                      jobTitle: reviewedBy.title,
                      url: `${siteUrl}/author/${reviewedBy.slug}`,
                    },
                  }
                : {}),
              url: new URL(`/${r.category_slug}/${r.slug}`, siteUrl).href,
              ...(r.featured_image_url ? { image: r.featured_image_url } : {}),
              ...(r.ingredients.length
                ? {
                    additionalProperty: r.ingredients.map((i) => ({
                      '@type': 'PropertyValue',
                      name: i.name,
                      value: i.dose,
                    })),
                  }
                : {}),
            }}
          />
          <FaqSchema faqs={r.faqs} />
        </>
      )}
      {!r.is_sample && !r.id.startsWith('editorial-product-') && (
        <>
          <JsonLd
            data={{
              '@type': 'Review',
              headline: r.title,
              publisher: publisherRef,
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
        </>
      )}
    </SiteShell>
  );
}
