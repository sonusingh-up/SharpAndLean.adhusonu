import Link from 'next/link';
import Image from 'next/image';
import { Check, Minus, ArrowUpRight } from 'lucide-react';
import type { Review } from '@/lib/types';
import { categories } from '@/lib/sample';
import { SiteShell, Breadcrumb, SectionLabel } from './site';
import { RichText } from './rich-text';
import { ReviewCard } from './review-card';
import {
  JsonLd,
  BreadcrumbSchema,
  FaqSchema,
  publisherRef,
  ExtendedAccess,
  WebPageSchema,
  absoluteUrl,
} from './seo';
import { authorProfile, teamProfile, getAuthorBySlug } from '@/lib/author';
import { findIngredientByName } from '@/lib/ingredients';
import { hasSupabase } from '@/lib/config';
import { Brain, Leaf, Flame } from 'lucide-react';
import { TrustBar } from './evidence';
import { ReferenceBox, PageHistory } from './article-footer';
import { CommunityForm } from './community-form';
import { articleContent, safeUrl } from '@/lib/content';
import { getAuthor, getCommunity } from '@/lib/data';
import { siteUrl } from '@/lib/config';
import { amazonLink } from '@/lib/amazon';
import { CompareToggle } from './compare-tray';
import { comparePartners, productName } from '@/lib/compare';
import { comparePath } from '@/lib/compare-path';
/**
 * What a commercial button says.
 *
 * Named here rather than inline because a review carries the same link in three
 * places, and they disagreed when each wrote its own text. "Search this product
 * on Amazon" was written for a keyword-search fallback that no longer exists.
 */
function affiliateLabel(network: string) {
  if (network === 'Amazon') return 'View on Amazon';
  return network ? `Check the price at ${network}` : 'Check the current price';
}

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
        {/* Only name a destination the page actually knows. A redirect under
            /recommended/ can be repointed in the CMS, so claiming it lands on
            an "official website" would be an assertion the page cannot back. */}
        {affiliateLabel(review.affiliate_network)} <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
export async function ReviewPage({ review: r, all }: { review: Review; all: Review[] }) {
  const category = categories.find((c) => c.slug === r.category_slug)!;
  // A page can name its own comparisons. Falling back to "same category" puts
  // fish oil beside a whey protein, which compares nothing a reader can use.
  const related = // Checked for presence rather than length: an article that sets an empty list
    // is saying it has no comparable product, which is different from not having
    // been asked the question.
    (
      r.alternative_slugs
        ? r.alternative_slugs
            .map((slug) => all.find((v) => v.slug === slug && v.id !== r.id))
            .filter((v): v is Review => Boolean(v))
        : all.filter((v) => v.category_slug === r.category_slug && v.id !== r.id)
    ).slice(0, 3);
  // That same empty list leaves the comparison block out altogether. The "will
  // appear as this category grows" placeholder only fits the same-category
  // fallback; here it would promise reviews the article has ruled out.
  const showComparison = !(Array.isArray(r.alternative_slugs) && r.alternative_slugs.length === 0);
  // Every product this one can be lined up against, for the compare section
  // and the tray button. Crawlable links, so each comparison page is reachable.
  const partners = r.is_sample ? [] : comparePartners(r, all);
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
  const isLabelOverview = Boolean(r.is_label_overview);
  // A submission can only be stored against a real database row. Built-in label
  // overviews exist only in code, so their ids are not UUIDs and the API rejects
  // them before it ever reaches the database. Showing a form that cannot succeed
  // is worse than showing none.
  const canAcceptSubmissions =
    hasSupabase && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.id);
  const writtenBy =
    (r.written_by ?? (isLabelOverview ? 'team' : 'clinician')) === 'team'
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
  // First-hand use is credited as its own role. It is deliberately separate
  // from the desk byline and the evidence review: someone who drank the product
  // for three years can describe it, and that is not the same as assessing it.
  const testedBy = r.tested_by ? getAuthorBySlug(r.tested_by) : undefined;
  // Lead with the ingredient the page is really about: the first active with a
  // disclosed amount, skipping carrier weights graded as no evidence.
  const HeroIcon =
    r.category_slug === 'fat-burners' ? Flame : r.category_slug === 'nootropics' ? Brain : Leaf;
  const headline = r.ingredients.find((i) => i.evidence_rating !== 'none') || r.ingredients[0];
  const keyFigure = headline ? `${headline.dose}` : '';
  const market = r.marketplace;
  // Product rich results need offers, review or aggregateRating; these gate
  // the two we can state honestly.
  const hasOffer = Boolean(market && r.affiliate_url);
  const hasReview = !isLabelOverview && r.score !== null;
  const pagePath = `/${r.category_slug}/${r.slug}`;
  const pageUrl = new URL(pagePath, siteUrl).href;
  const productId = `${pageUrl}#product`;
  const perServing =
    market?.servings && market.servings > 0
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: market.currency }).format(
          market.price / market.servings,
        )
      : null;
  return (
    <SiteShell>
      <ExtendedAccess
        id={`${pageUrl}#article`}
        headline={r.seo_title || r.title}
        path={pagePath}
        datePublished={r.published_at}
        dateModified={r.updated_at}
        image={r.featured_image_url || undefined}
        author={{
          name: writtenBy.name,
          slug: writtenBy.slug,
          type: writtenBy.slug === teamProfile.slug ? 'Organization' : 'Person',
        }}
      />
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
              {/* The suffix is the heading's one italic serif word. The text is
                  unchanged, so the title reads the same to search engines. */}
              {isLabelOverview ? (
                <>
                  {' — '}
                  <em>label overview</em>
                </>
              ) : !r.title.toLowerCase().includes('review') ? (
                <>
                  {' '}
                  <em>review</em>
                </>
              ) : null}
            </h1>
            <p className="page-intro">{r.summary}</p>

            {/* Two distinct roles, shown separately: the desk compiles the page,
                the clinician reviews the evidence behind it. "Evidence reviewed"
                rather than "medically reviewed" because she is a clinical
                nutritionist rather than a physician, and because the medical
                disclaimer states this site does not give medical advice. The
                schema property stays reviewedBy, which is correct either way. */}
            <div className="byline-block">
              <div className="byline-person">
                <span className="byline-role">Written by</span>
                <Link href={`/author/${writtenBy.slug}`}>{writtenBy.name}</Link>
              </div>
              {testedBy && (
                <div className="byline-person byline-reviewer">
                  {testedBy.photo_url && (
                    <Image
                      className="byline-avatar"
                      src={testedBy.photo_url}
                      alt=""
                      width={34}
                      height={34}
                    />
                  )}
                  <span>
                    <span className="byline-role">Personally tested by</span>
                    <Link href={`/author/${testedBy.slug}`}>{testedBy.name}</Link>
                    <span className="byline-credential">{testedBy.title}</span>
                  </span>
                </div>
              )}
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
                    <span className="byline-role">Evidence reviewed by</span>
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
                  sizes="(max-width: 900px) 420px, 320px"
                />
              ) : (
                <>
                  <span>{category.name}</span>
                  <HeroIcon strokeWidth={1} size={62} />
                </>
              )}
            </div>
            <div className="featured-product-body">
              <span className="featured-product-label">At a glance</span>
              <h2>{r.product_name || r.title}</h2>

              {market && (
                <div className="glance-headline">
                  <div className="glance-price">
                    <strong>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: market.currency,
                      }).format(market.price)}
                    </strong>
                    {perServing && <span>{perServing} per serving</span>}
                  </div>
                  {market.rating != null && (
                    <div className="glance-rating">
                      <span
                        className="stars"
                        style={{ '--fill': `${(market.rating / 5) * 100}%` } as React.CSSProperties}
                        aria-hidden="true"
                      >
                        ★★★★★
                      </span>
                      <span>
                        <strong>{market.rating.toFixed(1)}</strong> on {market.source}
                        {market.ratingCount
                          ? ` · ${market.ratingCount.toLocaleString()} ratings`
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <dl className="glance-facts">
                {keyFigure && (
                  <div>
                    <dt>{headline?.name || 'Key ingredient'}</dt>
                    <dd>{keyFigure}</dd>
                  </div>
                )}
                {market?.servings && (
                  <div>
                    <dt>Servings</dt>
                    <dd>{market.servings}</dd>
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
              </dl>

              {/* An article that names its own commercial link wins here, exactly as
                  it does in the sidebar and the comparison cards. This button used
                  to read `asin` alone, so a page carrying both would send the top
                  CTA to Amazon and the other two somewhere else. */}
              {r.affiliate_url && safeUrl(r.affiliate_url) ? (
                <>
                  <a
                    className="button featured-product-cta"
                    href={r.affiliate_url}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                  >
                    {affiliateLabel(r.affiliate_network)} <ArrowUpRight size={15} />
                  </a>
                  <p className="glance-affiliate">Affiliate link · We may earn a commission.</p>
                </>
              ) : r.asin ? (
                <>
                  <a
                    className="button featured-product-cta"
                    href={amazonLink(r.asin)}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                  >
                    View on Amazon <ArrowUpRight size={15} />
                  </a>
                  <p className="glance-affiliate">Affiliate link · We may earn a commission.</p>
                </>
              ) : (
                <a className="button featured-product-cta" href="#where-to-buy">
                  Where to buy <ArrowUpRight size={15} />
                </a>
              )}
              {!r.is_sample && partners.length > 0 && (
                <div className="glance-compare">
                  <CompareToggle slug={r.slug} name={productName(r)} category={r.category_slug} />
                  <a href="#compare-with">See comparisons</a>
                </div>
              )}

              {market && (
                /* Somebody else's figures, dated, so a stale price is visibly
                   stale rather than quietly wrong. */
                <p className="glance-footnote">
                  {market.source} price and rating checked{' '}
                  {new Date(market.checkedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  . Both change — confirm on the listing before buying.
                </p>
              )}
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
            {r.result_image && (
              <figure className="research-result-figure">
                <Image
                  src={r.result_image.src}
                  alt={r.result_image.alt}
                  width={1200}
                  height={720}
                  sizes="(max-width: 900px) 90vw, 900px"
                  style={{ width: '100%', height: 'auto' }}
                />
                <figcaption>{r.result_image.caption}</figcaption>
              </figure>
            )}
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
                <p className="muted">
                  Five criteria, each out of 10, averaged to the overall score. See{' '}
                  <Link href="/evidence-grading#product-scores">how we score products</Link>.
                </p>
                {Object.entries(r.score_breakdown).map(([name, score]) => (
                  <div className="rating-row" key={name}>
                    <span>{name}</span>
                    {/* low/high match the site's score bands (7+ good, 5-6.9 fair, under 5
                        poor), so the browser colours each state and the theme maps them. */}
                    <meter value={score} min={0} max={10} low={5} high={7} optimum={10} />
                    <strong>{score}/10</strong>
                  </div>
                ))}
              </section>
            )}
            {showComparison && (
              <section id="compare" aria-labelledby="compare-heading">
                <h2 id="compare-heading">How does it compare?</h2>
                {related.length ? (
                  <>
                    <p className="comparison-intro">
                      A closer look at the alternatives. Compare the ingredients and serving sizes,
                      then explore the full review.
                    </p>
                    <div className="comparison-grid">
                      {related.map((v) => {
                        const name = v.product_name || v.title;
                        const ingredient = v.ingredients.find(
                          (item) => item.evidence_rating !== 'none',
                        );
                        return (
                          <article className="comparison-card" key={v.id}>
                            <Link
                              className="comparison-image"
                              href={`/${v.category_slug}/${v.slug}`}
                              aria-label={`Read review of ${name}`}
                            >
                              {v.featured_image_url ? (
                                <Image
                                  src={v.featured_image_url}
                                  alt={name}
                                  fill
                                  sizes="(max-width: 700px) 80vw, 400px"
                                />
                              ) : (
                                <span className="comparison-placeholder">
                                  <HeroIcon size={48} strokeWidth={1} />
                                  Product overview
                                </span>
                              )}
                            </Link>
                            <div className="comparison-content">
                              <span className="comparison-eyebrow">An alternative to consider</span>
                              <h3>{name}</h3>
                              <p>{v.summary}</p>
                              {ingredient && (
                                <div className="comparison-dose">
                                  <span>Per serving</span>
                                  <strong>{ingredient.dose}</strong>
                                </div>
                              )}
                              <div className="comparison-actions">
                                {/* Only offer a commercial link the alternative
                                  actually has. The old fallback sent every card
                                  to an amazon.com search, which is the wrong
                                  marketplace for a product sold in the UK. */}
                                {v.affiliate_url && safeUrl(v.affiliate_url) ? (
                                  <a
                                    className="button"
                                    href={v.affiliate_url}
                                    target="_blank"
                                    rel="sponsored nofollow noopener noreferrer"
                                    aria-label={`Check the price of ${name}`}
                                  >
                                    Check the price <ArrowUpRight size={15} />
                                  </a>
                                ) : v.asin ? (
                                  <a
                                    className="button"
                                    href={amazonLink(v.asin)}
                                    target="_blank"
                                    rel="sponsored nofollow noopener noreferrer"
                                    aria-label={`Buy ${name} on Amazon`}
                                  >
                                    Buy on Amazon <ArrowUpRight size={15} />
                                  </a>
                                ) : null}
                                <Link
                                  className="text-link"
                                  href={`/${v.category_slug}/${v.slug}`}
                                  aria-label={`Read review of ${name}`}
                                >
                                  Read review <ArrowUpRight size={15} />
                                </Link>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                    {related.some((v) => v.affiliate_url || v.asin) && (
                      <p className="comparison-disclosure">
                        Affiliate links: we may earn a commission at no extra cost to you. Prices
                        and availability change — check the seller before buying.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="muted">Related reviews will appear as this category grows.</p>
                )}
              </section>
            )}
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
                {canAcceptSubmissions ? (
                  <CommunityForm reviewId={r.id} />
                ) : (
                  <p className="community-closed">
                    Reader submissions open once a page is published from the editorial database.
                    This overview is maintained in code, so there is nothing to attach a submission
                    to yet. If you have used this product, send it through the{' '}
                    <Link href="/contact">contact page</Link> and it will be considered when
                    submissions open.
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
        <ReferenceBox references={r.references || []} />
        <PageHistory
          entries={
            r.history || [
              { date: r.published_at || r.updated_at, note: 'Published.' },
              ...(r.updated_at && r.updated_at !== r.published_at
                ? [{ date: r.updated_at, note: 'Reviewed and updated.' }]
                : []),
            ]
          }
        />

        {partners.length > 0 && (
          <section className="reading-section compare-with" id="compare-with">
            <h2>Compare it with</h2>
            <p>
              Side by side on the five scores, the dose against the studied amount, the cost per
              serving and what each label discloses.
            </p>
            <ul className="compare-with-list">
              {partners.map((p) => (
                <li key={p.id}>
                  <Link href={comparePath([r.slug, p.slug])}>
                    {productName(r)} <em>vs</em> {productName(p)}
                    <ArrowUpRight size={15} />
                  </Link>
                  <span>{p.score === null ? 'Not scored' : `${p.score.toFixed(1)}/10`}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
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
          get Product and FAQ schema but never a nested Review. */}
      {!r.is_sample && (
        <>
          {/* The page itself, carrying the evidence-review credit the byline
              shows. schema.org defines reviewedBy and lastReviewed on WebPage
              only; on the Product or the Review they were invalid properties. */}
          <WebPageSchema
            name={r.seo_title || r.title}
            description={r.seo_desc || r.summary}
            path={pagePath}
            datePublished={r.published_at}
            dateModified={r.updated_at}
            reviewedBy={reviewedBy}
            lastReviewed={reviewedBy ? r.updated_at : null}
            about={hasOffer || hasReview ? productId : undefined}
            mainEntity={`${pageUrl}#article`}
            image={r.featured_image_url || undefined}
          />
          {/* Google rejects a Product with none of offers, review or
              aggregateRating, so an unpriced, unscored page gets no Product. */}
          {(hasOffer || hasReview) && (
            <JsonLd
              data={{
                '@type': 'Product',
                '@id': productId,
                name: r.product_name || r.title,
                description: r.summary,
                url: pageUrl,
                // Absolute: images under /images/ are stored relative, and a
                // relative image URL is invalid in structured data.
                ...(r.featured_image_url ? { image: absoluteUrl(r.featured_image_url) } : {}),
                ...(r.brand ? { brand: { '@type': 'Brand', name: r.brand } } : {}),
                ...(r.asin ? { sku: r.asin, productID: `asin:${r.asin}` } : {}),
                ...(r.ingredients.length
                  ? {
                      additionalProperty: r.ingredients.map((i) => ({
                        '@type': 'PropertyValue',
                        name: i.name,
                        value: i.dose,
                      })),
                    }
                  : {}),
                // Priced from the retailer listing on a known date. priceValidUntil
                // bounds it so a stale figure expires rather than being asserted
                // indefinitely. No aggregateRating: the rating is the retailer's,
                // not ours, and marking it up would misstate who collected it.
                ...(market && hasOffer
                  ? {
                      offers: {
                        '@type': 'Offer',
                        price: market.price,
                        priceCurrency: market.currency,
                        url: r.affiliate_url,
                        availability: 'https://schema.org/InStock',
                        priceValidUntil: new Date(new Date(market.checkedAt).getTime() + 30 * 864e5)
                          .toISOString()
                          .slice(0, 10),
                        seller: { '@type': 'Organization', name: market.source },
                      },
                    }
                  : {}),
                // The review sits inside the Product rather than beside it. A
                // separate Review node needs its own itemReviewed Product, and
                // that second Product, carrying neither offers nor a rating, is
                // what Search Console flagged as an invalid product snippet.
                // Label overviews carry no score, so they get no review here.
                ...(hasReview
                  ? {
                      review: {
                        '@type': 'Review',
                        headline: r.title,
                        publisher: publisherRef,
                        reviewBody: r.summary,
                        datePublished: r.published_at,
                        dateModified: r.updated_at,
                        // Mirrors the visible byline rather than crediting the clinician
                        // for prose she reviewed but did not write.
                        author:
                          writtenBy.slug === teamProfile.slug
                            ? {
                                '@type': 'Organization',
                                '@id': `${siteUrl}/author/${teamProfile.slug}#team`,
                                name: teamProfile.name,
                                url: new URL(`/author/${teamProfile.slug}`, siteUrl).href,
                              }
                            : {
                                '@type': 'Person',
                                '@id': `${siteUrl}/author/${writtenBy.slug}#person`,
                                name: writtenBy.name,
                                url: new URL(`/author/${writtenBy.slug}`, siteUrl).href,
                              },
                        // contributor rather than a second author: he supplied the use
                        // notes, he did not write or sign off the assessment.
                        ...(testedBy
                          ? {
                              contributor: {
                                '@type': 'Person',
                                '@id': `${siteUrl}/author/${testedBy.slug}#person`,
                                name: testedBy.name,
                                jobTitle: testedBy.title,
                                url: `${siteUrl}/author/${testedBy.slug}`,
                              },
                            }
                          : {}),
                        reviewRating: {
                          '@type': 'Rating',
                          ratingValue: r.score,
                          bestRating: 10,
                          worstRating: 0,
                        },
                      },
                    }
                  : {}),
              }}
            />
          )}
          <FaqSchema faqs={r.faqs} />
        </>
      )}
    </SiteShell>
  );
}
