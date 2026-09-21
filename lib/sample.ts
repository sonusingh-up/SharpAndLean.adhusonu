import type { Review } from './types';
export const categories = [
  {
    slug: 'fat-burners',
    name: 'Fat Burners',
    description:
      'Thermogenics, fibres and appetite formulas. We check the stimulant total, the serving size behind the front-label number, and whether the evidence covers the dose in the bottle.',
    label: 'Weight management',
    tagline: 'Read the panel first.',
    seoTitle: 'Fat Burner Supplements: Labels and Evidence',
    seoDescription:
      'Thermogenics, fibres and appetite formulas read through the Supplement Facts panel: stimulant totals, real serving sizes, and what the evidence supports.',
  },
  {
    slug: 'nootropics',
    name: 'Nootropics',
    description:
      'Focus, calm and memory formulas read through the panel. What each active actually contains, whether the research used that form and dose, and what the marketing quietly leaves out.',
    label: 'Mind & focus',
    tagline: 'Dose over adjective.',
    seoTitle: 'Nootropics: Ingredient Doses and Evidence',
    seoDescription:
      'Focus and calm formulas checked against the panel: what each active contains, whether the research used that dose, and what the marketing leaves out.',
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    description:
      'Vitamins, minerals and omega-3s where the number on the front is rarely the number that matters. Elemental amounts, EPA and DHA totals, and what a serving really costs.',
    label: 'Everyday wellbeing',
    tagline: 'The number that counts.',
    seoTitle: 'Wellness Supplements: Labels and Doses',
    seoDescription:
      'Vitamins, minerals and omega-3s where the number on the front rarely matters. Elemental amounts, EPA and DHA totals, and the real cost of a serving.',
  },
] as const;
export const sampleReviews: Review[] = [];
