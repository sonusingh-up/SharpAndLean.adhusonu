/**
 * Rules behind the "compare two listings" calculator on
 * /compare/compare-labels-and-serving-costs. Pure functions, so
 * tests/serving-cost.test.ts can pin the worked examples the article quotes.
 */

/** What the "active" amount per serving is measured in. */
export type ActiveUnit = 'g' | 'mg' | 'µg' | 'kcal';

/**
 * The amount each unit is priced per. Grams of protein or creatine compare per
 * 100 g, energy per 1,000 kcal; milligrams and micrograms per 1,000, which is
 * 1 g and 1 mg respectively.
 */
export const STANDARD_AMOUNT: Record<ActiveUnit, number> = {
  g: 100,
  mg: 1000,
  µg: 1000,
  kcal: 1000,
};

export type Listing = {
  /** Delivered price of the pack, in pounds. */
  price: number;
  /** Servings in the pack, as labelled or worked out from weight ÷ serving size. */
  servings: number;
  /** Amount of the active ingredient in one serving. */
  perServing: number;
  /** Servings taken a day. */
  perDay: number;
};

export type ListingCost = {
  /** Pounds per serving. */
  perServing: number;
  /** Pounds per day at the stated servings a day. */
  perDay: number;
  /** How many days the pack lasts. */
  days: number;
};

const positive = (n: number) => Number.isFinite(n) && n > 0;

/** Costs for one listing, or null if any input is missing or not positive. */
export function listingCost(l: Listing): ListingCost | null {
  if (![l.price, l.servings, l.perServing, l.perDay].every(positive)) return null;
  const perServing = l.price / l.servings;
  return { perServing, perDay: perServing * l.perDay, days: l.servings / l.perDay };
}

/** Pounds per standard amount of the active ingredient, in the given unit. */
export function costPerStandard(l: Listing, unit: ActiveUnit): number | null {
  const c = listingCost(l);
  if (!c) return null;
  return (c.perServing / l.perServing) * STANDARD_AMOUNT[unit];
}

export type Comparison = {
  cheaper: 'a' | 'b' | 'same';
  /** How much more the dearer listing costs per standard amount, as a percentage. */
  percentMore: number;
};

/**
 * Which listing is cheaper per unit of the active ingredient. Listings within
 * 1 per cent of each other are treated as the same price, since prices quoted
 * to the penny cannot separate them more finely than that.
 */
export function compareListings(a: Listing, b: Listing, unit: ActiveUnit): Comparison | null {
  const ca = costPerStandard(a, unit);
  const cb = costPerStandard(b, unit);
  if (ca === null || cb === null) return null;
  const low = Math.min(ca, cb);
  const high = Math.max(ca, cb);
  const difference = ((high - low) / low) * 100;
  if (difference < 1) return { cheaper: 'same', percentMore: 0 };
  return { cheaper: ca < cb ? 'a' : 'b', percentMore: Math.round(difference) };
}

/** "61p" under a pound, "£2.52" from a pound up. */
export function formatMoney(pounds: number): string {
  if (pounds < 1) {
    const pence = pounds * 100;
    return `${pence < 10 ? pence.toFixed(1).replace(/\.0$/, '') : Math.round(pence)}p`;
  }
  return `£${pounds.toFixed(2)}`;
}

/** "100 g of the active ingredient" etc., for labels. */
export function standardLabel(unit: ActiveUnit): string {
  return unit === 'kcal' ? '1,000 kcal' : unit === 'g' ? '100 g' : `1,000 ${unit}`;
}
