/**
 * The product score.
 *
 * Separate from the A–F evidence grade in lib/ingredients.ts, which describes
 * the published research for one claim. This scores a *product*: whether this
 * tub, at this price, with this label, is a sensible purchase.
 *
 * Five criteria, each out of 10, equally weighted. Equal weighting is a
 * deliberate choice rather than an oversight — a product whose active
 * ingredient works but which hides its panel and charges six times the going
 * rate should not be rescued by its chemistry.
 *
 * The overall score is the mean, so it is always reproducible from the
 * breakdown printed on the page.
 */
export type ScoreCriterion = {
  name: string;
  what: string;
  /** What a 10 and a 0 look like, so the bands can be audited. */
  high: string;
  low: string;
};

export const scoreCriteria: ScoreCriterion[] = [
  {
    name: 'Evidence for the marketed claim',
    what: 'How strong the research is for what the product is actually sold to do — not for the ingredient in general.',
    high: 'The headline claim carries an A-grade body of evidence in the studied population.',
    low: 'The headline claim is unsupported, or the supporting research is for a different outcome.',
  },
  {
    name: 'Dose against the studied amount',
    what: 'Whether one serving delivers the amount used in the research behind the claim.',
    high: 'A serving sits inside the studied range without taking extra scoops.',
    low: 'A serving is a fraction of the studied amount, or the amount is not disclosed at all.',
  },
  {
    name: 'Label transparency',
    what: 'Whether the Supplement Facts panel is published in readable text and every active amount is disclosed.',
    high: 'A readable panel on the manufacturer’s own site, every active quantified.',
    low: 'No readable panel, or a proprietary blend hiding the individual amounts.',
  },
  {
    name: 'Value against the generic equivalent',
    what: 'Cost per gram or per dose of the active ingredient, compared with the plainest version of the same thing.',
    high: 'At or near the cost of the generic equivalent.',
    low: 'A large multiple of the generic price with no functional difference to show for it.',
  },
  {
    name: 'Safety and tolerability',
    what: 'Known risks and interactions, how well characterised they are, and whether the label warns about them.',
    high: 'A well-characterised ingredient with clearly communicated precautions.',
    low: 'Poorly characterised risks, known interactions, or precautions the label omits.',
  },
];

export const scoreCriterionNames = scoreCriteria.map((c) => c.name);

/** The overall score is the mean of the breakdown, to one decimal place. */
export function overallScore(breakdown: Record<string, number>): number | null {
  const values = Object.values(breakdown);
  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
