import type { Category, FAQ, Ingredient } from '../types';
import type { Citation } from '../ingredients';
import type { HistoryEntry } from '@/components/article-footer';

/**
 * One product article.
 *
 * This is the single source of truth for a page. There is no separate base
 * entry to keep in sync — everything a page needs lives in one file, so adding
 * an article means writing one file and adding one line to the registry.
 *
 * Short pages supply `facts`, `caution` and `takeaway` and let the standard
 * body template assemble them. Long-form pages supply `body` instead and the
 * template is skipped.
 */
export type ProductArticle = {
  /** URL segment. Must be unique across all articles. */
  slug: string;
  name: string;
  category: Category;
  summary: string;
  /** Manufacturer page every label figure is taken from. */
  source: string;

  /** Overrides the default "figures taken from this page" line. */
  sourceNote?: string;

  /** Template body inputs. Ignored when `body` is set. */
  facts?: string;
  caution?: string;
  takeaway?: string;
  /** Hand-written prose. Replaces the template body entirely. */
  body?: string;

  /**
   * What kind of page this is. Defaults to 'review' when `body` is supplied
   * and 'label-overview' otherwise, which is right for every article so far —
   * set it explicitly only to override that.
   */
  kind?: 'review' | 'label-overview';
  /**
   * Whose desk byline the page carries. The clinician is credited separately
   * as the evidence reviewer either way, so this is only about who wrote it.
   */
  writtenBy?: 'team' | 'clinician';
  /**
   * Author slug of someone who used the product themselves, credited beside the
   * writer. Set this only when the page genuinely rests on first-hand use: it
   * is the one claim on a page here that a reader cannot check against a label.
   */
  testedBy?: string;

  /**
   * Commercial link for this page, used by the sidebar and "Where to buy"
   * buttons. Point it at a site redirect under /recommended/ rather than a
   * retailer URL, so the destination can be changed without editing the
   * article. Products linked by ASIN do not need this.
   */
  affiliateUrl?: string;
  /** Names the destination on the button, e.g. "Amazon" or "Holland & Barrett". */
  affiliateNetwork?: string;

  brand?: string;
  asin?: string;
  /** Which pack the commercial link points at, e.g. "90 veg capsules". */
  listing?: string;
  image?: string;
  /** Figure published below the body, e.g. a summary of the ingredient research. */
  resultImage?: { src: string; alt: string; caption: string };

  /** Figures observed on a retailer listing on a given date. */
  marketplace?: {
    source: string;
    price: number;
    currency: string;
    servings?: number;
    rating?: number;
    ratingCount?: number;
    checkedAt: string;
  };

  whoFor?: string;
  whoAvoid?: string;
  pros?: string[];
  cons?: string[];
  ingredients?: Ingredient[];
  faqs?: FAQ[];
  references?: Citation[];
  history?: HistoryEntry[];

  seoTitle?: string;
  seoDescription?: string;
  verdict?: string;
  /**
   * Per-criterion product scores, keyed by the criterion names published on
   * /evidence-grading. Supplying this derives the overall score as the mean,
   * so the number on the page is always reproducible from the breakdown.
   */
  scoreBreakdown?: Record<string, number>;
  /**
   * Overrides the derived score. Null means no score assigned, which is the
   * default for label overviews.
   */
  score?: number | null;
  thirdPartyTested?: boolean;
  price?: string;
  guarantee?: string;

  published?: string;
  updated?: string;
};
