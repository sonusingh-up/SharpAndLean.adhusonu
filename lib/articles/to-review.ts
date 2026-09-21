import type { Review } from '../types';
import type { ProductArticle } from './types';
import { overallScore } from '../scoring';

/**
 * Turns an article into the `Review` shape the page components render.
 *
 * Everything optional on `ProductArticle` gets its default here, so an article
 * file only has to state what is true of that product. A short label overview
 * supplies `facts`, `caution` and `takeaway`; a long-form review supplies
 * `body` and the template is skipped.
 */

const DEFAULT_PUBLISHED = '2026-09-20T00:00:00Z';

function templateBody(a: ProductArticle): string {
  const sourceNote = a.sourceNote
    ? ` — ${a.sourceNote}`
    : ' — the label figures above are taken from this page.';

  return [
    '<h2>What this page covers</h2>',
    '<p>This is a source-based product overview, not a hands-on test or a clinical endorsement. No effectiveness score has been assigned.</p>',
    `<h2>Read the label</h2><p>${a.facts ?? ''}</p>`,
    `<h2>Before use</h2><p>${a.caution ?? ''}</p>`,
    `<h2>What to compare</h2><p>${a.takeaway ?? ''}</p>`,
    '<h2>Sources and shopping</h2>',
    `<p><a href="${a.source}" target="_blank" rel="noopener noreferrer">Manufacturer product information</a>${sourceNote}</p>`,
    `<p>The commercial link on this page points to the ${a.listing} listing, checked against the manufacturer label above. Other pack sizes and strengths exist, so confirm the seller, strength and package size on arrival. Prices and stock change and are not quoted here.</p>`,
  ].join('');
}

export function toReview(a: ProductArticle, index: number): Review {
  const isLabelOverview = (a.kind ?? (a.body ? 'review' : 'label-overview')) === 'label-overview';

  return {
    id: `editorial-product-${index + 1}`,
    product_name: a.name,
    title: a.name,
    slug: a.slug,
    category_slug: a.category,
    // Derived from the breakdown so the printed number always adds up.
    score: a.score ?? (a.scoreBreakdown ? overallScore(a.scoreBreakdown) : null),
    // 'Manufacturer-label overview' is the right heading for a label page and
    // the wrong one for a review, so the fallback follows the kind.
    verdict: a.verdict ?? (isLabelOverview ? 'Manufacturer-label overview' : ''),
    summary: a.summary,
    body: a.body ?? templateBody(a),
    pros: a.pros ?? [],
    cons: a.cons ?? [],
    ingredients: a.ingredients ?? [],
    faqs: a.faqs ?? [],
    affiliate_url: '',
    affiliate_network: '',
    product_price: a.price ?? 'Check current seller price',
    price_amount: null,
    currency: 'USD',
    third_party_tested: a.thirdPartyTested ?? false,
    money_back_guarantee: a.guarantee ?? 'Check seller return policy',
    featured_image_url: a.image ?? '',
    result_image: a.resultImage,
    marketplace: a.marketplace,
    asin: a.asin ?? '',
    og_image_url: '',
    seo_title: a.seoTitle ?? `${a.name} — ${isLabelOverview ? 'Label Overview' : 'Review'}`,
    seo_desc: a.seoDescription ?? a.summary,
    brand: a.brand ?? '',
    is_published: true,
    published_at: a.published ?? DEFAULT_PUBLISHED,
    updated_at: a.updated ?? a.published ?? DEFAULT_PUBLISHED,
    who_for: a.whoFor ?? '',
    who_avoid: a.whoAvoid ?? a.caution ?? '',
    score_breakdown: a.scoreBreakdown ?? {},
    is_editorial: true,
    // A page that carries hand-written prose is a review; one assembled from
    // the label template is an overview of what the manufacturer published.
    is_label_overview: isLabelOverview,
    written_by: a.writtenBy ?? 'team',
    // The manufacturer page is the source every figure on an overview is taken
    // from, so it is cited rather than only linked inside the body copy.
    references: a.references ?? [
      {
        id: `manufacturer-${a.slug}`,
        text: `${a.name} — manufacturer product information and Supplement Facts panel, the source of every figure on this page.`,
        url: a.source,
      },
    ],
    history: a.history ?? [
      { date: '2026-09-20', note: 'First published as a manufacturer-label overview.' },
      {
        date: '2026-09-21',
        note: 'Ingredient rows linked to their evidence pages; commercial link changed from a keyword search to the verified listing.',
      },
    ],
  };
}
