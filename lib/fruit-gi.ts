/*
 * Glycaemic index and load for common fruits: the single source for the fruit
 * and diabetes article's table and for its chart (scripts/fruit-gl-chart.ts).
 * Change a figure here, re-run `npm run chart:fruit-gl`, and both stay in step.
 *
 * GI: published averages (international GI tables, as summarised by Harvard
 * Health and the University of Sydney). Carbohydrate and fibre per 100 g: USDA
 * FoodData Central, raw fruit unless named. Net carbohydrate and GL are our
 * calculations — GL = GI × net carbohydrate in a serving ÷ 100.
 *
 * Serving: 120 g for fresh fruit, the standard serving in the GI tables; 30 g
 * for dried fruit, one portion of dried fruit in NHS 5 A Day guidance.
 */

export type FruitGroup =
  'berries' | 'citrus' | 'orchard' | 'stone' | 'tropical' | 'melon' | 'grapes' | 'dried';

export type Fruit = {
  name: string;
  group: FruitGroup;
  gi: number;
  /** Shown beside the GI when a value is approximate or varies widely. */
  approximate?: boolean;
  carbsPer100g: number;
  fibrePer100g: number;
  servingG: number;
  /** A /learn article about this fruit, when one exists. */
  href?: string;
};

export const fruits: Fruit[] = [
  {
    name: 'Strawberries',
    group: 'berries',
    gi: 40,
    carbsPer100g: 7.7,
    fibrePer100g: 2.0,
    servingG: 120,
  },
  {
    name: 'Blueberries',
    group: 'berries',
    gi: 53,
    carbsPer100g: 14.5,
    fibrePer100g: 2.4,
    servingG: 120,
  },
  {
    name: 'Cherries',
    group: 'stone',
    gi: 22,
    carbsPer100g: 16.0,
    fibrePer100g: 2.1,
    servingG: 120,
  },
  { name: 'Peach', group: 'stone', gi: 42, carbsPer100g: 9.5, fibrePer100g: 1.5, servingG: 120 },
  {
    name: 'Grapefruit',
    group: 'citrus',
    gi: 25,
    carbsPer100g: 10.7,
    fibrePer100g: 1.6,
    servingG: 120,
    href: '/learn/half-a-grapefruit-before-meals',
  },
  { name: 'Orange', group: 'citrus', gi: 43, carbsPer100g: 11.8, fibrePer100g: 2.4, servingG: 120 },
  {
    name: 'Apple',
    group: 'orchard',
    gi: 36,
    carbsPer100g: 13.8,
    fibrePer100g: 2.4,
    servingG: 120,
    href: '/learn/eating-apples-every-day-for-a-week',
  },
  {
    name: 'Pear',
    group: 'orchard',
    gi: 38,
    carbsPer100g: 15.2,
    fibrePer100g: 3.1,
    servingG: 120,
    href: '/learn/eating-pears-every-day-for-a-week',
  },
  {
    name: 'Kiwi',
    group: 'tropical',
    gi: 50,
    approximate: true,
    carbsPer100g: 14.7,
    fibrePer100g: 3.0,
    servingG: 120,
  },
  {
    name: 'Mango',
    group: 'tropical',
    gi: 51,
    carbsPer100g: 15.0,
    fibrePer100g: 1.6,
    servingG: 120,
  },
  {
    name: 'Pineapple',
    group: 'tropical',
    gi: 59,
    carbsPer100g: 13.1,
    fibrePer100g: 1.4,
    servingG: 120,
  },
  {
    name: 'Banana',
    group: 'tropical',
    gi: 51,
    carbsPer100g: 22.8,
    fibrePer100g: 2.6,
    servingG: 120,
  },
  {
    name: 'Watermelon',
    group: 'melon',
    gi: 76,
    carbsPer100g: 7.6,
    fibrePer100g: 0.4,
    servingG: 120,
  },
  { name: 'Grapes', group: 'grapes', gi: 59, carbsPer100g: 18.1, fibrePer100g: 0.9, servingG: 120 },
  {
    name: 'Prunes',
    group: 'dried',
    gi: 29,
    carbsPer100g: 63.9,
    fibrePer100g: 7.1,
    servingG: 30,
    href: '/learn/eating-prunes-every-day-for-a-week',
  },
  { name: 'Raisins', group: 'dried', gi: 64, carbsPer100g: 79.2, fibrePer100g: 3.7, servingG: 30 },
];

export type Band = 'low' | 'medium' | 'high';

/** Carbohydrate minus fibre in one serving, in grams. */
export function netCarbs(f: Fruit): number {
  return ((f.carbsPer100g - f.fibrePer100g) * f.servingG) / 100;
}

export function glycaemicLoad(f: Fruit): number {
  return (f.gi * netCarbs(f)) / 100;
}

/** GI: 55 or under low, 56–69 medium, 70 or over high. */
export function giBand(gi: number): Band {
  return gi <= 55 ? 'low' : gi < 70 ? 'medium' : 'high';
}

/** GL: 10 or under low, 11–19 medium, 20 or over high (bands apply to the rounded figure). */
export function glBand(gl: number): Band {
  const r = Math.round(gl);
  return r <= 10 ? 'low' : r < 20 ? 'medium' : 'high';
}

/** Lowest glycaemic load first; ties broken by GI, then name. */
export function rankedFruits(list: Fruit[] = fruits): Fruit[] {
  return [...list].sort(
    (a, b) =>
      Math.round(glycaemicLoad(a)) - Math.round(glycaemicLoad(b)) ||
      a.gi - b.gi ||
      a.name.localeCompare(b.name),
  );
}

/** The ranked table for the fruit and diabetes article, as HTML. */
export function fruitTableHtml(list: Fruit[] = fruits): string {
  const rows = rankedFruits(list)
    .map((f) => {
      const name = f.href ? `<a href="${f.href}">${f.name}</a>` : f.name;
      const gi = `${f.approximate ? 'About ' : ''}${f.gi} (${giBand(f.gi)})`;
      const gl = Math.round(glycaemicLoad(f));
      return `<tr><td>${name}</td><td>${f.servingG} g</td><td>${gi}</td><td>${Math.round(netCarbs(f))} g</td><td>${gl} (${glBand(gl)})</td></tr>`;
    })
    .join('\n');
  return `<table>
<thead><tr><th>Fruit</th><th>Serving</th><th>Glycaemic index</th><th>Net carbs per serving</th><th>Glycaemic load per serving</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>`;
}
