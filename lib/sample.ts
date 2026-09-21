import type { Review } from './types';
export const categories = [
  {
    slug: 'fat-burners',
    name: 'Fat Burners',
    description:
      'Thermogenics, fibres and appetite formulas. We check the stimulant total, the serving size behind the front-label number, and whether the evidence covers the dose in the bottle.',
    label: 'Weight management',
    tagline: 'Read the panel first.',
  },
  {
    slug: 'nootropics',
    name: 'Nootropics',
    description:
      'Focus, calm and memory formulas read through the panel. What each active actually contains, whether the research used that form and dose, and what the marketing quietly leaves out.',
    label: 'Mind & focus',
    tagline: 'Dose over adjective.',
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    description:
      'Vitamins, minerals and omega-3s where the number on the front is rarely the number that matters. Elemental amounts, EPA and DHA totals, and what a serving really costs.',
    label: 'Everyday wellbeing',
    tagline: 'The number that counts.',
  },
] as const;
export const sampleReviews: Review[] = [];
