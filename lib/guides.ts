import type { FAQ } from './types';
import type { Citation } from './ingredients';
import type { HistoryEntry } from '@/components/article-footer';

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  /** Tables are disproportionately picked up by AI answers and rich results. */
  | { type: 'table'; caption: string; head: string[]; rows: string[][] }
  | { type: 'expert'; text: string }
  /** An inline link to a review or ingredient page, woven into the body. */
  | { type: 'callout'; text: string; href: string; label: string }
  /**
   * An illustrative Supplement Facts panel with numbered markers, and a key
   * explaining each one. Always labelled as an illustration: it must never be
   * mistaken for a real product's panel.
   */
  | {
      type: 'anatomy';
      caption: string;
      rows: { label: string; value?: string; marker?: number; indent?: boolean }[];
      notes: { marker: number; title: string; text: string }[];
    };

export type Guide = {
  slug: string;
  title: string;
  /** The <title> tag, when the on-page title is too long for a search result. */
  seoTitle?: string;
  /** Meta description, when the summary is not the best search snippet. */
  seoDescription?: string;
  /** 100-150 word opening. A specific scenario, never "in today's world". */
  hook: string;
  summary: string;
  takeaways: string[];
  /** Short topic label shown above the title, e.g. "Label literacy". */
  topic?: string;
  /** The checks a reader can run in the shop, shown in the sidebar. */
  checklist?: string[];
  blocks: GuideBlock[];
  faqs: FAQ[];
  related: string[];
  published: string;
  updated: string;
  /** What actually changed, when this is an update rather than a first publish. */
  changelog?: string;
  references?: Citation[];
  history?: HistoryEntry[];
};

export const guides: Guide[] = [
  {
    slug: 'what-a-supplement-label-hides',
    title: 'How to read a supplement label: four numbers it hides in plain sight',
    seoTitle: 'How to Read a Supplement Label: 4 Hidden Numbers',
    seoDescription:
      'How to read a Supplement Facts panel: serving size, proprietary blends, stimulant totals and mcg vs IU, with real examples and a 30-second checklist.',
    hook: 'A bottle of glucomannan on a shop shelf says 575 mg on the front and 180 capsules on the side. Both numbers are true. Neither tells you that a serving is three capsules, that the bottle is therefore 60 servings rather than 180, or that you are looking at two months of supply rather than six. Nothing here is a lie. The arithmetic is simply left for you to do, and most people do not do it, because the front of a bottle is designed so that you do not have to.',
    summary:
      'Serving sizes, blends, stimulants and units: four places a supplement label is accurate yet misleading — with real numbers from products on the shelf.',
    takeaways: [
      'The number on the front is usually per capsule; the number that matters is per serving.',
      'A proprietary blend tells you the order of ingredients and nothing about any single dose.',
      'Caffeine arrives under several names on one panel and only the total matters.',
      'mcg and IU differ by a factor of 40 for vitamin D, and labels switch between them.',
    ],
    topic: 'Label literacy',
    checklist: [
      'Find the serving size and servings per container, then divide the price by servings — never by capsules.',
      'Check that every active ingredient has its own amount. No amount, no comparison.',
      'Add up every stimulant line on the panel, plus the coffee you already drink.',
      'Convert to one unit before comparing: for vitamin D, 1 mcg is 40 IU.',
    ],
    blocks: [
      {
        type: 'h2',
        id: 'where-they-hide',
        text: 'Where the four numbers hide',
      },
      {
        type: 'p',
        text: 'To read a supplement label, turn the bottle over and start with the Supplement Facts panel: the box whose layout US federal rules set down line by line. Four numbers on it decide whether the front of the bottle means what it seems to — the serving size, the blend total, the stimulant lines and the units. Outside the US the table looks different, but the same four questions apply.',
      },
      {
        type: 'p',
        text: 'The panel below is an illustration built to show all four together; it is not any real product. The numbered markers match the four sections that follow.',
      },
      {
        type: 'anatomy',
        caption: 'An illustrative Supplement Facts panel — not a real product',
        rows: [
          { label: 'Serving Size', value: '3 Capsules', marker: 1 },
          { label: 'Servings Per Container', value: '60', marker: 1 },
          { label: 'Proprietary Fat-Burning Blend', value: '1,200 mg', marker: 2 },
          { label: 'Green tea extract (leaf)', indent: true },
          { label: 'Garcinia cambogia extract (fruit)', indent: true },
          { label: 'Raspberry ketones', indent: true },
          { label: 'Caffeine (as caffeine anhydrous)', value: '100 mg', marker: 3 },
          { label: 'Guarana extract (seed)', value: '200 mg', marker: 3 },
          { label: 'Vitamin D3 (as cholecalciferol)', value: '25 mcg (1,000 IU)', marker: 4 },
        ],
        notes: [
          {
            marker: 1,
            title: 'The serving',
            text: 'Three capsules make one serving, so a 180-capsule bottle is 60 servings. Divide the price by 60, not 180.',
          },
          {
            marker: 2,
            title: 'The blend',
            text: 'One total for three ingredients. The order tells you which is heaviest; nothing tells you how much of any one is inside.',
          },
          {
            marker: 3,
            title: 'The stimulants',
            text: 'Two lines deliver caffeine — guarana carries its own. The panel never adds them up for you.',
          },
          {
            marker: 4,
            title: 'The units',
            text: '25 mcg and 1,000 IU are the same amount of vitamin D. Compare two products in the same unit or not at all.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'serving-size',
        text: '1. The serving size, not the capsule size',
      },
      {
        type: 'p',
        text: 'The most common gap between what a label says and what a buyer understands is the serving. A front label states the amount in one unit; the Supplement Facts panel states how many units make a serving. When those differ, every downstream calculation changes — the strength you are taking, how long the bottle lasts, and what it costs per day.',
      },
      {
        type: 'p',
        text: 'The good news is that the figure is always there. US rules require "Serving Size" and "Servings Per Container" as the first two lines under the heading, so the numbers you need sit at the top of the panel on every bottle sold there — they are just not the numbers printed on the front.',
      },
      {
        type: 'table',
        caption: 'The same bottle, read two ways',
        head: ['What the label says', 'What it means', 'Real figure'],
        rows: [
          ['575 mg', 'Per capsule, not per serving', '1,725 mg per 3-capsule serving'],
          ['180 capsules', 'Not 180 doses', '60 servings'],
          ['Looks like six months', 'At the labelled serving', 'About two months'],
        ],
      },
      {
        type: 'callout',
        text: 'This is a real product, and the figures come straight from the manufacturer panel.',
        href: '/fat-burners/now-glucomannan-575-mg',
        label: 'Read the full review',
      },
      {
        type: 'h2',
        id: 'blends',
        text: '2. What a proprietary blend actually withholds',
      },
      {
        type: 'p',
        text: 'A proprietary blend lists several ingredients and gives one combined weight. US rules require the blend’s ingredients to be listed in descending order by weight under that single total, so you learn the ranking. You do not learn any single amount. If an ingredient has good evidence at 400 mg, and it sits third in a 500 mg blend, it is arithmetically impossible for it to be present at the studied dose — and the label will never say so.',
      },
      {
        type: 'p',
        text: 'This matters most precisely where dose is the whole question. For ingredients whose evidence is dose-dependent, a blend converts a checkable claim into an unfalsifiable one. That is why an undisclosed blend caps an assessment on this site regardless of how good the rest of the formula looks.',
      },
      {
        type: 'callout',
        text: 'SodaMelt names twelve ingredients inside a proprietary blend — including three stimulant laxatives — and publishes an amount for none of them.',
        href: '/fat-burners/sodamelt-review',
        label: 'Read the SodaMelt review',
      },
      {
        type: 'h2',
        id: 'stimulants',
        text: '3. Caffeine arrives under several names',
      },
      {
        type: 'p',
        text: 'Guarana, yerba mate, green tea extract and plain caffeine anhydrous can all appear on one panel, each contributing to a total the label never adds up for you. Then there is the coffee you already drank. The number that affects your sleep and heart rate is the sum, not the largest single line.',
      },
      {
        type: 'p',
        text: 'For scale, the FDA cites 400 mg a day — two to three 12-ounce cups of coffee — as an amount not generally associated with negative effects in most adults. A fat burner at 200 mg a serving, taken twice, reaches that before the first coffee. And when a stimulant sits inside a proprietary blend with no amount of its own, you cannot add it up at all.',
      },
      {
        type: 'ul',
        items: [
          'Add every stimulant-bearing ingredient on the panel, not just the line marked caffeine.',
          'Check whether an extract is decaffeinated — some are, and the label will say so if it is.',
          'Treat a stimulant inside a blend as an unknown amount, not as a small one.',
          'Count your own intake from coffee and tea in the same total.',
        ],
      },
      {
        type: 'callout',
        text: 'SlimSet names five ingredients and gives an amount for exactly one of them: 138 mg of caffeine. The stimulant is the only dose you can check.',
        href: '/fat-burners/slimset-review',
        label: 'Read the SlimSet review',
      },
      {
        type: 'h2',
        id: 'units',
        text: '4. Units that switch mid-label',
      },
      {
        type: 'p',
        text: 'Vitamin D is measured in both micrograms and International Units, and they differ by a factor of forty: 25 mcg is 1,000 IU. A product page can lead with one figure in the title and the other in the description, and we have found manufacturer pages that contradict themselves between the two. A reader comparing a mcg number against an IU number can be forty times wrong about relative strength. On a US Supplement Facts panel, mcg is now the required unit and IU may only appear in brackets after it — so when two figures disagree, the panel is the one to trust.',
      },
      {
        type: 'p',
        text: 'Minerals have the same trap with a different pair of numbers. US rules make the panel declare the weight of the mineral itself, naming the compound it comes from in brackets. The front of the pack and the product name are not bound by that, so "magnesium glycinate 1,000 mg" on the front can describe the whole compound, of which only a fraction is magnesium. Read the amount on the panel, not the one in the product name.',
      },
      {
        type: 'callout',
        text: 'Vitamin D is the clearest case, including a manufacturer page that states two different strengths.',
        href: '/ingredients/vitamin-d3',
        label: 'Read the vitamin D3 evidence page',
      },
      {
        type: 'expert',
        text: 'None of this requires a company to lie, which is exactly why it persists. Every figure I have described is accurate in isolation. The gap is between what is disclosed and what is understood, and that gap is where most supplement money gets spent. Learn to read the panel and you stop needing anybody, including us, to tell you whether a product is reasonable.',
      },
      {
        type: 'h2',
        id: 'habit',
        text: 'The thirty-second habit',
      },
      {
        type: 'p',
        text: 'Turn the bottle over before you look at the front. Find the serving size and the servings per container, then divide the price by the servings. Check whether every active has its own number. Add the stimulants. Put any figure you want to compare into one unit. If those four checks pass, the product is at least honestly presented, which is a lower bar than being effective but a necessary one.',
      },
      {
        type: 'p',
        text: 'The 30-second check on this page is the same four checks, short enough to run in the shop aisle.',
      },
    ],
    faqs: [
      {
        question: 'How do you read a supplement label?',
        answer:
          'Ignore the front and go to the Supplement Facts panel. Read the serving size and servings per container first, then check that every active ingredient has its own amount, add up any stimulants, and convert units before comparing products. Those four checks show whether the product is honestly presented; they do not show whether it works.',
      },
      {
        question: 'Is a proprietary blend always a bad sign?',
        answer:
          'Not always, but it is always a limitation. For ingredients where the evidence is dose-dependent, a blend makes the central claim impossible to check. Where an ingredient is present for flavour or as a minor component, it matters much less.',
      },
      {
        question: 'How do I work out cost per serving?',
        answer:
          'Divide the price by the servings per container from the Supplement Facts panel, never by the capsule count. A 180-capsule bottle with a three-capsule serving is 60 servings, so a $27 bottle is about 45 cents per serving rather than 15.',
      },
      {
        question: 'Why do labels use both mcg and IU?',
        answer:
          'Both are valid units. US rules now require vitamin D in mcg on the Supplement Facts panel, with IU optional in brackets after it, but product titles and marketing copy have not fully caught up. For vitamin D, 1 mcg equals 40 IU. Always compare in the same unit.',
      },
      {
        question: 'What should I check first on a supplement label?',
        answer:
          'The serving size and the servings per container, on the Supplement Facts panel on the back. Every other figure — the strength you take, how long the bottle lasts, the cost per day — depends on them, and the front of the bottle usually quotes a single capsule instead.',
      },
      {
        question: 'Does "clinically studied" on a label mean the product was tested?',
        answer:
          'Usually not. It normally means an ingredient was studied somewhere, often at a different dose, in a different population, or for a different outcome. Check whether the amount on the panel matches the amount in the research — which is impossible when the ingredient sits inside a proprietary blend.',
      },
    ],
    related: [
      '/fat-burners/now-glucomannan-575-mg',
      '/fat-burners/slimset-review',
      '/ingredients/vitamin-d3',
      '/best',
    ],
    published: '2026-09-21',
    updated: '2026-09-27',
    changelog: 'Updated 27 September 2026',
    references: [
      {
        id: 'cfr-101-36-g',
        text: '21 CFR 101.36, Nutrition labeling of dietary supplements — the required Serving Size and Servings Per Container lines (b)(1), declaration by the weight of the nutrient rather than its source (b)(2)(ii), vitamin D in mcg with IU optional in brackets, and proprietary blends listed in descending order of weight under one total (c).',
        url: 'https://www.law.cornell.edu/cfr/text/21/101.36',
      },
      {
        id: 'fda-caffeine-g',
        text: 'US Food and Drug Administration. Spilling the beans: how much caffeine is too much? — 400 mg a day cited as not generally associated with negative effects for most adults.',
        url: 'https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much',
      },
      {
        id: 'ods-weightloss-g',
        text: 'NIH Office of Dietary Supplements. Dietary Supplements for Weight Loss — Fact Sheet for Consumers.',
        url: 'https://ods.od.nih.gov/factsheets/WeightLoss-Consumer/',
      },
      {
        id: 'ods-vitd-g',
        text: 'NIH Office of Dietary Supplements. Vitamin D — Fact Sheet for Health Professionals, on mcg and IU units.',
        url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
      },
      {
        id: 'now-gluco-g',
        text: 'NOW Foods. Glucomannan 575 mg Veg Capsules — Supplement Facts panel, source of the serving figures used here.',
        url: 'https://www.nowfoods.com/products/supplements/glucomannan-575-mg-veg-capsules',
      },
    ],
    history: [
      {
        date: '2026-09-27',
        note: 'Retitled "How to read a supplement label" and redesigned. Added an illustrative Supplement Facts panel showing where each number sits; the US labelling rules behind each one (21 CFR 101.36); the FDA’s 400 mg caffeine benchmark; two real examples from our SodaMelt and SlimSet reviews; a 30-second checklist; and three questions. Corrected the magnesium example: the panel must give the mineral’s own weight, so the compound weight appears on the front of the pack or in the product name, not on the panel.',
      },
      {
        date: '2026-09-21',
        note: 'First published, using label figures from products covered on this site.',
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
