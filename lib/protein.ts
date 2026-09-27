/**
 * Daily protein targets for the calculator on
 * /learn/how-much-protein-should-a-beginner-eat.
 *
 * Every rate is traced in that article's references. Change one here and the
 * article's text, table and FAQs must change with it — the tests pin the
 * numbers the article quotes.
 */

export type ProteinGoal = 'health' | 'muscle' | 'fat-loss';
export type AgeGroup = 'under-65' | '65-plus';
export type WeightUnit = 'kg' | 'lb';

export const LB_PER_KG = 2.20462;

/** Grams of protein per kilogram of body weight per day. */
export type ProteinRates = { low: number; target: number; high: number };

export const proteinRates: Record<ProteinGoal, ProteinRates> = {
  // From the 0.8 g/kg RDA minimum to the top of the 1.2–1.6 g/kg range in the
  // 2025–2030 Dietary Guidelines for Americans.
  health: { low: 0.8, target: 1.2, high: 1.6 },
  // Morton 2018: no further average gain in fat-free mass above ~1.6 g/kg,
  // with the confidence interval reaching 2.2. ISSN 2017: 1.4–2.0 g/kg.
  muscle: { low: 1.4, target: 1.6, high: 2.2 },
  // Leidy 2015: 1.2–1.6 g/kg in weight-loss diets. Up to 2.2 g/kg for someone
  // lifting in an energy deficit (ISSN 2017; Longland 2016 used 2.4).
  'fat-loss': { low: 1.2, target: 1.6, high: 2.2 },
};

/** PROT-AGE: at least 1.0–1.2 g/kg a day over 65, and 1.2 or more when active. */
const OLDER_LOW = 1.0;
const OLDER_TARGET = 1.2;

/** The range of body weights the calculator accepts, in kilograms. */
export const WEIGHT_LIMITS_KG = { min: 30, max: 250 } as const;

export type ProteinInput = {
  weight: number;
  unit: WeightUnit;
  goal: ProteinGoal;
  age: AgeGroup;
  meals: number;
};

export type ProteinResult = {
  weightKg: number;
  rates: ProteinRates;
  /** Grams a day, rounded to the nearest 5 g. */
  low: number;
  target: number;
  high: number;
  /** Grams per meal at the target, rounded to the nearest 5 g. */
  perMeal: number;
};

export function toKg(weight: number, unit: WeightUnit): number {
  return unit === 'kg' ? weight : weight / LB_PER_KG;
}

export function fromKg(weightKg: number, unit: WeightUnit): number {
  return unit === 'kg' ? weightKg : weightKg * LB_PER_KG;
}

/** Rounded to the nearest 5 g: a target more precise than that is false precision. */
export const roundTo5 = (grams: number) => Math.round(grams / 5) * 5;

export function ratesFor(goal: ProteinGoal, age: AgeGroup): ProteinRates {
  const base = proteinRates[goal];
  if (age === 'under-65') return base;
  return {
    low: Math.max(base.low, OLDER_LOW),
    target: Math.max(base.target, OLDER_TARGET),
    high: base.high,
  };
}

/** Null when the weight is missing or outside the range the rates were studied in. */
export function proteinTarget(input: ProteinInput): ProteinResult | null {
  const weightKg = toKg(input.weight, input.unit);
  if (
    !Number.isFinite(weightKg) ||
    weightKg < WEIGHT_LIMITS_KG.min ||
    weightKg > WEIGHT_LIMITS_KG.max
  ) {
    return null;
  }
  const meals = Math.min(Math.max(Math.round(input.meals), 1), 6);
  const rates = ratesFor(input.goal, input.age);
  const target = rates.target * weightKg;
  return {
    weightKg,
    rates,
    low: roundTo5(rates.low * weightKg),
    target: roundTo5(target),
    high: roundTo5(rates.high * weightKg),
    perMeal: roundTo5(target / meals),
  };
}
