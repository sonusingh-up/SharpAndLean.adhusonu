import type { Review } from './types';
import { findIngredientByName, type IngredientPage, type StudiedDose } from './ingredients';
import { scoreCriteria } from './scoring';
import { canonicalCompareSlug, comparePath, splitCompareSlug } from './compare-path';

/*
 * The comparison engine. Everything here is arithmetic over data the reviews
 * already publish — scores, disclosed doses, dated prices — plus the studied
 * ranges on the ingredient pages. It adds no new claims: a comparison page can
 * only say what the two reviews and the ingredient pages already say, lined up.
 */

// ---------------------------------------------------------------------------
// Which products may be compared
// ---------------------------------------------------------------------------

/**
 * Same category, or one review names the other as an alternative. The second
 * rule exists because an editor linking two products across categories (a
 * theanine capsule and a sleep blend, say) has already judged them comparable.
 */
export function canCompare(a: Review, b: Review): boolean {
  if (a.id === b.id || a.is_sample || b.is_sample) return false;
  // A slug containing the separator could not be told apart in a URL.
  if (a.slug.includes('-vs-') || b.slug.includes('-vs-')) return false;
  if (a.category_slug === b.category_slug) return true;
  return Boolean(a.alternative_slugs?.includes(b.slug) || b.alternative_slugs?.includes(a.slug));
}

export function canCompareAll(reviews: Review[]): boolean {
  return reviews.every((a, i) => reviews.slice(i + 1).every((b) => canCompare(a, b)));
}

export function comparePartners(review: Review, all: Review[]): Review[] {
  return all.filter((other) => canCompare(review, other));
}

/** Every comparable pair, each once, in a stable order. */
export function allComparePairs(all: Review[]): Review[][] {
  const pairs: Review[][] = [];
  all.forEach((a, i) =>
    all.slice(i + 1).forEach((b) => {
      if (canCompare(a, b)) pairs.push([a, b].sort((x, y) => x.slug.localeCompare(y.slug)));
    }),
  );
  return pairs.sort((x, y) =>
    canonicalCompareSlug(x.map((r) => r.slug)).localeCompare(
      canonicalCompareSlug(y.map((r) => r.slug)),
    ),
  );
}

/**
 * Resolve a /compare/ slug to its products. Returns the canonical slug too,
 * so the caller can redirect when the address was written in another order.
 */
export function resolveComparison(
  slug: string,
  all: Review[],
): { reviews: Review[]; canonical: string } | null {
  const slugs = splitCompareSlug(slug);
  if (!slugs) return null;
  const reviews = slugs.map((s) => all.find((r) => r.slug === s));
  if (reviews.some((r) => !r)) return null;
  const found = reviews as Review[];
  if (!canCompareAll(found)) return null;
  const canonical = canonicalCompareSlug(slugs);
  return {
    reviews: [...found].sort((a, b) => a.slug.localeCompare(b.slug)),
    canonical,
  };
}

// ---------------------------------------------------------------------------
// Doses
// ---------------------------------------------------------------------------

type Unit = StudiedDose['unit'];
export type Amount = { value: number; unit: Unit };

const PER_MCG: Record<Unit, number> = { mcg: 1, mg: 1_000, g: 1_000_000 };

/**
 * The amount per labelled serving at the start of a dose string, e.g.
 * "1,725 mg per 3-capsule serving" → 1725 mg. Anything that does not open
 * with a number and a mass unit — "Not disclosed", "100 million AFU" — is
 * null, because guessing at it would put a figure on the page nobody printed.
 */
export function parseAmount(dose: string): Amount | null {
  const m = dose.trim().match(/^(\d[\d,]*(?:\.\d+)?)\s*(mcg|µg|mg|g)\b/i);
  if (!m) return null;
  const value = Number(m[1].replace(/,/g, ''));
  if (!Number.isFinite(value) || value <= 0) return null;
  const raw = m[2].toLowerCase();
  return { value, unit: raw === 'µg' ? 'mcg' : (raw as Unit) };
}

function inMcg(a: { value: number; unit: Unit }) {
  return a.value * PER_MCG[a.unit];
}

export function formatAmount(value: number, unit: Unit): string {
  // Show the figure in the unit a reader would expect: 0.276 g reads worse
  // than 276 mg, and 1725 mg reads worse than 1.7 g.
  const mcg = value * PER_MCG[unit];
  const [v, u] =
    mcg >= 1_000_000 ? [mcg / 1_000_000, 'g'] : mcg >= 1_000 ? [mcg / 1_000, 'mg'] : [mcg, 'mcg'];
  const rounded = v >= 100 ? Math.round(v) : Math.round(v * 10) / 10;
  return `${rounded.toLocaleString('en-US')} ${u}`;
}

export function formatRange(d: StudiedDose): string {
  return `${d.min.toLocaleString('en-US')}–${d.max.toLocaleString('en-US')} ${d.unit}${
    d.per === 'day' ? ' a day' : ' a dose'
  }`;
}

export type Placement = 'below' | 'within' | 'above';

export function placeAmount(amount: Amount, range: StudiedDose): Placement {
  const v = inMcg(amount);
  if (v < inMcg({ value: range.min, unit: range.unit })) return 'below';
  if (v > inMcg({ value: range.max, unit: range.unit })) return 'above';
  return 'within';
}

/** What one product's label says about one ingredient. */
export type DoseCell =
  | { status: 'absent' }
  | {
      status: 'present';
      /** The label rows that matched, as the review printed them. */
      lines: { name: string; dose: string }[];
      /** Set only when a single row gives a mass we can place against a range. */
      amount: Amount | null;
      placement: Placement | null;
      undisclosed: boolean;
    };

export type DoseRow = {
  ingredient: IngredientPage;
  cells: DoseCell[];
  shared: boolean;
};

const UNDISCLOSED = /not disclosed|advertised but not quantified/i;
const PROPRIETARY = /proprietary blend/i;
/** Capsule shells and flow agents have a page, but no dose worth comparing. */
const SKIP_INGREDIENTS = new Set(['capsule-excipients']);

export function doseRows(reviews: Review[]): DoseRow[] {
  const bySlug = new Map<
    string,
    { page: IngredientPage; lines: { name: string; dose: string }[][] }
  >();
  reviews.forEach((r, idx) => {
    for (const ing of r.ingredients) {
      const page = findIngredientByName(ing.name);
      if (!page || SKIP_INGREDIENTS.has(page.slug)) continue;
      if (!bySlug.has(page.slug)) {
        bySlug.set(page.slug, { page, lines: reviews.map(() => []) });
      }
      bySlug.get(page.slug)!.lines[idx].push({ name: ing.name, dose: ing.dose });
    }
  });
  const rows: DoseRow[] = [...bySlug.values()].map(({ page, lines }) => {
    const cells: DoseCell[] = lines.map((ls) => {
      if (!ls.length) return { status: 'absent' };
      const amount = ls.length === 1 ? parseAmount(ls[0].dose) : null;
      return {
        status: 'present',
        lines: ls,
        amount,
        placement: amount && page.studiedDose ? placeAmount(amount, page.studiedDose) : null,
        undisclosed: ls.every((l) => UNDISCLOSED.test(l.dose)),
      };
    });
    return {
      ingredient: page,
      cells,
      shared: cells.filter((c) => c.status === 'present').length > 1,
    };
  });
  // Shared ingredients first, since those are the like-for-like rows; then
  // anything with a studied range; then the rest in label order.
  const rank = (row: DoseRow) => (row.shared ? 0 : row.ingredient.studiedDose ? 1 : 2);
  return rows
    .map((row, i) => ({ row, i }))
    .sort((a, b) => rank(a.row) - rank(b.row) || a.i - b.i)
    .map(({ row }) => row);
}

// ---------------------------------------------------------------------------
// Cost
// ---------------------------------------------------------------------------

export type ServingCost = {
  perServing: number;
  currency: string;
  price: number;
  servings: number;
  source: string;
  checkedAt: string;
} | null;

export function servingCost(r: Review): ServingCost {
  const m = r.marketplace;
  if (!m || !m.servings || m.servings <= 0 || !(m.price > 0)) return null;
  return {
    perServing: m.price / m.servings,
    currency: m.currency,
    price: m.price,
    servings: m.servings,
    source: m.source,
    checkedAt: m.checkedAt,
  };
}

/**
 * What it costs to reach the bottom of the studied range for one ingredient,
 * taking as many servings as that needs. This is the number a per-bottle price
 * hides: a cheap bottle that needs four servings to reach a studied amount is
 * not cheap.
 */
export type StudiedCost = {
  servingsNeeded: number;
  cost: number;
  currency: string;
} | null;

export function studiedDoseCost(r: Review, cell: DoseCell, range: StudiedDose): StudiedCost {
  const cost = servingCost(r);
  if (!cost || cell.status !== 'present' || !cell.amount) return null;
  const servingsNeeded = Math.max(
    1,
    inMcg({ value: range.min, unit: range.unit }) / inMcg(cell.amount),
  );
  return { servingsNeeded, cost: servingsNeeded * cost.perServing, currency: cost.currency };
}

export function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat(currency === 'GBP' ? 'en-GB' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ---------------------------------------------------------------------------
// Scores
// ---------------------------------------------------------------------------

export type CriterionRow = {
  name: string;
  what: string;
  scores: (number | null)[];
  /** Indexes of the products with the top score; empty when level or unscored. */
  leaders: number[];
  /** Top score minus the next score down. */
  margin: number;
};

export function criterionRows(reviews: Review[]): CriterionRow[] {
  return scoreCriteria.map((c) => {
    const scores = reviews.map((r) => {
      const v = r.score_breakdown?.[c.name];
      return typeof v === 'number' ? v : null;
    });
    const known = scores.filter((s): s is number => s !== null);
    if (known.length < 2) return { name: c.name, what: c.what, scores, leaders: [], margin: 0 };
    const top = Math.max(...known);
    const below = known.filter((s) => s < top);
    const leaders = scores.flatMap((s, i) => (s === top ? [i] : []));
    return {
      name: c.name,
      what: c.what,
      scores,
      leaders: below.length ? leaders : [],
      margin: below.length ? top - Math.max(...below) : 0,
    };
  });
}

/** Plain-English reason to pick a product that leads on each criterion. */
const PICK_REASON: Record<string, string> = {
  'Evidence for the marketed claim': 'you want the stronger evidence behind what it is sold to do',
  'Dose against the studied amount': 'you want a serving that matches the amount used in research',
  'Label transparency': 'you want every amount on the label disclosed',
  'Value against the generic equivalent': 'you want better value against the plain generic version',
  'Safety and tolerability': 'tolerability and a well-characterised safety record come first',
};

// ---------------------------------------------------------------------------
// Label flags
// ---------------------------------------------------------------------------

export type Flag = { tone: 'good' | 'warn' | 'bad'; text: string };

export function labelFlags(r: Review, doses: DoseRow[], idx: number): Flag[] {
  const flags: Flag[] = [];
  const actives = r.ingredients.filter((i) => !/^not quantified$/i.test(i.dose.trim()));
  const hidden = actives.filter((i) => UNDISCLOSED.test(i.dose));
  if (r.ingredients.some((i) => PROPRIETARY.test(i.dose))) {
    flags.push({ tone: 'bad', text: 'Proprietary blend: individual amounts are hidden' });
  }
  if (hidden.length) {
    flags.push({
      tone: 'bad',
      text: `${hidden.length} of ${actives.length} listed ingredients have no stated amount`,
    });
  } else if (actives.length) {
    flags.push({ tone: 'good', text: 'Every active ingredient has a stated amount' });
  }
  flags.push(
    r.third_party_tested
      ? { tone: 'good', text: 'Carries a third-party certification' }
      : { tone: 'warn', text: 'No third-party certification' },
  );
  for (const row of doses) {
    const cell = row.cells[idx];
    const range = row.ingredient.studiedDose;
    if (cell.status !== 'present' || !cell.amount || !range || cell.placement === 'within')
      continue;
    flags.push({
      tone: 'warn',
      text: `${row.ingredient.name}: a serving gives ${formatAmount(cell.amount.value, cell.amount.unit)}, ${
        cell.placement
      } the ${formatRange(range)} ${range.basis.toLowerCase()}`,
    });
  }
  const safety = r.score_breakdown?.['Safety and tolerability'];
  if (typeof safety === 'number' && safety <= 3) {
    flags.push({ tone: 'bad', text: `Scored ${safety}/10 for safety and tolerability` });
  }
  if (r.score === null) {
    flags.push({ tone: 'warn', text: 'Not scored: a label overview rather than a review' });
  }
  return flags;
}

// ---------------------------------------------------------------------------
// The whole comparison
// ---------------------------------------------------------------------------

export type Comparison = {
  reviews: Review[];
  path: string;
  names: string[];
  crossCategory: boolean;
  headline: string;
  picks: { reasons: string[] }[];
  criteria: CriterionRow[];
  doses: DoseRow[];
  costs: ServingCost[];
  /** Cost to reach a studied dose, for shared ingredients with a range. */
  studiedCosts: { row: DoseRow; costs: StudiedCost[] }[];
  flags: Flag[][];
};

export function formatScore(score: number) {
  return score.toFixed(1);
}

export function productName(r: Review) {
  return r.product_name || r.title;
}

function list(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function headlineFor(reviews: Review[], names: string[], criteria: CriterionRow[]): string {
  const scored = reviews
    .map((r, i) => ({ score: r.score, name: names[i] }))
    .filter((x): x is { score: number; name: string } => x.score !== null)
    .sort((a, b) => b.score - a.score);
  const unscored = names.filter((_, i) => reviews[i].score === null);
  if (scored.length < 2) {
    return scored.length === 1
      ? `${scored[0].name} scores ${formatScore(scored[0].score)}/10. ${list(unscored)} ${
          unscored.length > 1 ? 'are' : 'is'
        } a label overview without a score, so this comparison lines up the labels, doses and cost rather than a verdict.`
      : 'Neither product has been scored yet, so this comparison lines up the labels, doses and cost rather than a verdict.';
  }
  const [first, second] = scored;
  const widest = [...criteria]
    .filter((c) => c.scores.every((s) => s !== null))
    .sort((a, b) => spread(b) - spread(a))[0];
  const gap =
    widest && spread(widest) > 0
      ? ` The widest gap is ${widest.name.toLowerCase()}: ${widest.scores
          .map((s, i) => `${s} for ${names[i]}`)
          .join(', ')}.`
      : '';
  if (first.score === second.score) {
    return `${list(scored.map((s) => s.name))} score level on ${formatScore(first.score)}/10, so the choice turns on the criteria below rather than the total.${gap}`;
  }
  const rest = scored.slice(1).map((s) => `${s.name}'s ${formatScore(s.score)}`);
  return `${first.name} scores ${formatScore(first.score)}/10 against ${list(rest)}.${gap}`;
}

function spread(c: CriterionRow) {
  const known = c.scores.filter((s): s is number => s !== null);
  return known.length ? Math.max(...known) - Math.min(...known) : 0;
}

export function buildComparison(reviews: Review[]): Comparison {
  const names = reviews.map(productName);
  const criteria = criterionRows(reviews);
  const doses = doseRows(reviews);
  const costs = reviews.map(servingCost);

  const studiedCosts = doses
    .filter((row) => row.shared && row.ingredient.studiedDose)
    .map((row) => ({
      row,
      costs: reviews.map((r, i) => studiedDoseCost(r, row.cells[i], row.ingredient.studiedDose!)),
    }));

  const picks = reviews.map((r, i) => {
    // Ranked by how decisive each lead is, so a product that wins everything
    // shows its three clearest reasons rather than a wall of them.
    const ranked: { reason: string; weight: number }[] = [];
    for (const c of criteria) {
      if (c.leaders.length === 1 && c.leaders[0] === i && c.margin >= 1) {
        ranked.push({
          reason: PICK_REASON[c.name] ?? `you weigh ${c.name.toLowerCase()} most`,
          weight: c.margin,
        });
      }
    }
    if (r.third_party_tested && reviews.some((o) => !o.third_party_tested)) {
      ranked.push({ reason: 'you want a product with a third-party certification', weight: 2.5 });
    }
    for (const { row, costs: sc } of studiedCosts) {
      const priced = sc.filter((c): c is NonNullable<StudiedCost> => c !== null);
      const mine = sc[i];
      if (!mine || priced.length < 2 || new Set(priced.map((c) => c.currency)).size > 1) continue;
      if (priced.every((c) => c === mine || mine.cost < c.cost * 0.9)) {
        ranked.push({
          reason: `you want the cheaper route to a studied dose of ${row.ingredient.name}`,
          weight: 2.5,
        });
      }
    }
    return {
      reasons: ranked
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map((x) => x.reason),
    };
  });

  return {
    reviews,
    path: comparePath(reviews.map((r) => r.slug)),
    names,
    crossCategory: new Set(reviews.map((r) => r.category_slug)).size > 1,
    headline: headlineFor(reviews, names, criteria),
    picks,
    criteria,
    doses,
    costs,
    studiedCosts,
    flags: reviews.map((r, i) => labelFlags(r, doses, i)),
  };
}

export function comparisonTitle(names: string[]) {
  // Search results cut titles at around 60 characters, so the descriptive
  // suffix steps down as the product names get longer.
  const base = names.join(' vs ');
  for (const suffix of [': Dose, Cost and Label Compared', ' Compared']) {
    if (base.length + suffix.length <= 62) return base + suffix;
  }
  return base;
}
