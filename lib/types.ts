export type Category = 'fat-burners' | 'nootropics' | 'wellness';
export type FAQ = { question: string; answer: string };
export type Ingredient = {
  name: string;
  dose: string;
  evidence_rating: 'strong' | 'moderate' | 'weak' | 'none';
  note: string;
};
export type Review = {
  id: string;
  title: string;
  slug: string;
  category_slug: Category;
  category_id?: string;
  author_id?: string;
  score: number | null;
  verdict: string;
  summary: string;
  body: string;
  pros: string[];
  cons: string[];
  ingredients: Ingredient[];
  faqs: FAQ[];
  affiliate_url: string;
  affiliate_network: string;
  product_price: string;
  price_amount: number | null;
  currency: string;
  third_party_tested: boolean;
  money_back_guarantee: string;
  featured_image_url: string;
  og_image_url: string;
  seo_title: string;
  seo_desc: string;
  is_published: boolean;
  published_at: string | null;
  updated_at: string;
  who_for: string;
  who_avoid: string;
  score_breakdown: Record<string, number>;
  brand?: string;
  result_image?: { src: string; alt: string; caption: string };
  asin?: string;
  is_sample?: boolean;
  /** Defined in code rather than stored in the database. */
  is_editorial?: boolean;
  /** Records what a manufacturer published; explicitly not a review. */
  is_label_overview?: boolean;
  /** Desk byline: the team, or the clinician writing in her own name. */
  written_by?: 'team' | 'clinician';
  /**
   * Author slug of someone who used the product themselves. Credited beside the
   * writer, never instead of them: using a product and assessing its evidence
   * are different jobs.
   */
  tested_by?: string;
  /**
   * Figures observed on a retailer listing on a given date. Namespaced because
   * these are somebody else's numbers: the rating is the marketplace's, not an
   * assessment by this site, and it must never be published as aggregateRating.
   */
  marketplace?: {
    source: string;
    price: number;
    currency: string;
    servings?: number;
    rating?: number;
    ratingCount?: number;
    checkedAt: string;
  };
  /** Sources and publication history, populated for built-in overviews. */
  references?: { id: string; text: string; url?: string }[];
  history?: { date: string; note: string }[];
  product_name: string;
};
export type Collection = {
  id: string;
  kind: 'best_lists' | 'comparisons' | 'articles';
  title: string;
  slug: string;
  summary: string;
  body: string;
  verdict?: string;
  /**
   * Short points a reader should leave with, rendered above the body. Used by
   * /learn/ articles, which carry prose rather than a ranked list; best-of and
   * comparison pages normally lead with their table instead.
   */
  takeaways?: string[];
  category_id?: string;
  is_published: boolean;
  seo_title: string;
  seo_desc: string;
  updated_at: string;
  published_at: string | null;
  items?: { review_id: string; rank: number; why_it_made_the_list: string }[];
  faqs?: FAQ[];
  product_a_id?: string;
  product_b_id?: string;
};
