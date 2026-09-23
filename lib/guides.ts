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
  | { type: 'callout'; text: string; href: string; label: string };

export type Guide = {
  slug: string;
  title: string;
  /** 100-150 word opening. A specific scenario, never "in today's world". */
  hook: string;
  summary: string;
  takeaways: string[];
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
    title: 'Four numbers a supplement label hides in plain sight',
    hook: 'A bottle of glucomannan on a shop shelf says 575 mg on the front and 180 capsules on the side. Both numbers are true. Neither tells you that a serving is three capsules, that the bottle is therefore 60 servings rather than 180, or that you are looking at two months of supply rather than six. Nothing here is a lie. The arithmetic is simply left for you to do, and most people do not do it, because the front of a bottle is designed so that you do not have to.',
    summary:
      'Serving sizes, blend totals, stimulant maths and unit switches: four places where a supplement label is accurate and still misleading, with real numbers from products on the shelf.',
    takeaways: [
      'The number on the front is usually per capsule; the number that matters is per serving.',
      'A proprietary blend tells you the order of ingredients and nothing about any single dose.',
      'Caffeine arrives under several names on one panel and only the total matters.',
      'mcg and IU differ by a factor of 40 for vitamin D, and labels switch between them.',
    ],
    blocks: [
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
        text: 'A proprietary blend lists several ingredients and gives one combined weight. Regulations require ingredients to appear in descending order by quantity, so you learn the ranking. You do not learn any single amount. If an ingredient has good evidence at 400 mg, and it sits third in a 500 mg blend, it is arithmetically impossible for it to be present at the studied dose — and the label will never say so.',
      },
      {
        type: 'p',
        text: 'This matters most precisely where dose is the whole question. For ingredients whose evidence is dose-dependent, a blend converts a checkable claim into an unfalsifiable one. That is why an undisclosed blend caps an assessment on this site regardless of how good the rest of the formula looks.',
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
        type: 'ul',
        items: [
          'Add every stimulant-bearing ingredient on the panel, not just the line marked caffeine.',
          'Check whether an extract is decaffeinated — some are, and the label will say so if it is.',
          'Count your own intake from coffee and tea in the same total.',
        ],
      },
      {
        type: 'h2',
        id: 'units',
        text: '4. Units that switch mid-label',
      },
      {
        type: 'p',
        text: 'Vitamin D is measured in both micrograms and International Units, and they differ by a factor of forty: 25 mcg is 1,000 IU. A product page can lead with one figure in the title and the other in the description, and we have found manufacturer pages that contradict themselves between the two. A reader comparing a mcg number against an IU number can be forty times wrong about relative strength.',
      },
      {
        type: 'p',
        text: 'The same trap appears with minerals, where compound weight and elemental weight are different numbers for the same capsule. A magnesium product quoting the weight of magnesium bisglycinate is not quoting the amount of magnesium.',
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
        text: 'Turn the bottle over before you look at the front. Find the serving size and the servings per container, then divide the price by the servings. Check whether every active has its own number. Add the stimulants. If those four checks pass, the product is at least honestly presented, which is a lower bar than being effective but a necessary one.',
      },
    ],
    faqs: [
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
          'Both are valid units and regulations have shifted toward mcg over time, so packaging and marketing copy have not fully converged. For vitamin D, 1 mcg equals 40 IU. Always compare in the same unit.',
      },
    ],
    related: ['/ingredients/glucomannan', '/ingredients/vitamin-d3', '/best'],
    published: '2026-09-21',
    updated: '2026-09-21',
    references: [
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
        date: '2026-09-21',
        note: 'First published, using label figures from products covered on this site.',
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
