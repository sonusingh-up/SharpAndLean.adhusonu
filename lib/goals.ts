export type GoalProfile = {
  id: string;
  label: string;
  searchTerms: string[];
  note: string;
  ingredients: { title: string; href: string }[];
  categoryLink?: { title: string; href: string };
};

/** Editorial routes curated for a reader's intent, not ranked recommendations. */
export const goalProfiles: GoalProfile[] = [
  {
    id: 'weight-loss',
    label: 'Weight loss',
    searchTerms: [
      'weight loss',
      'weightloss',
      'weight management',
      'lose weight',
      'fat loss',
      'fatloss',
      'slimming',
      'appetite',
      'glucomannan',
      'green tea extract',
      'psyllium',
    ],
    note: 'These are reviews of products marketed for weight management—not a promise of weight loss. Check what the evidence can and cannot support before buying.',
    ingredients: [
      { title: 'Glucomannan', href: '/ingredients/glucomannan' },
      { title: 'Green tea extract', href: '/ingredients/green-tea-extract' },
    ],
    categoryLink: { title: 'Browse all weight-management reviews', href: '/fat-burners' },
  },
  {
    id: 'weight-gain',
    label: 'Build muscle / gain weight',
    searchTerms: [
      'weight gain',
      'weightgain',
      'gain weight',
      'muscle gain',
      'gain muscle',
      'build muscle',
      'bulk',
      'bulking',
      'whey',
      'protein',
    ],
    note: 'Whey can make protein easier to add; it does not cause weight gain by itself. Overall food intake and resistance training matter more than choosing a particular tub.',
    ingredients: [{ title: 'Whey protein blend', href: '/ingredients/whey-protein-blend' }],
    categoryLink: { title: 'Browse all wellness reviews', href: '/wellness' },
  },
  {
    id: 'probiotics',
    label: 'Probiotics & gut health',
    searchTerms: ['probiotic', 'probiotics', 'gut health', 'gut bacteria', 'digestive', 'akkermansia'],
    note: 'Probiotic effects depend on the strain, dose and use being studied. A probiotic label alone does not establish that a product will help.',
    ingredients: [{ title: 'Akkermansia muciniphila', href: '/ingredients/akkermansia-muciniphila' }],
    categoryLink: { title: 'Browse all wellness reviews', href: '/wellness' },
  },
  {
    id: 'sleep',
    label: 'Sleep',
    searchTerms: ['sleep', 'sleep support', 'fall asleep', 'sleep quality', 'gaba', 'melatonin'],
    note: 'Our coverage helps you inspect the formula and evidence; supplements are not a substitute for assessment of persistent sleep problems.',
    ingredients: [
      { title: 'GABA', href: '/ingredients/gaba' },
      { title: 'L-theanine', href: '/ingredients/l-theanine' },
    ],
    categoryLink: { title: 'Browse all wellness reviews', href: '/wellness' },
  },
  {
    id: 'focus',
    label: 'Focus & calm',
    searchTerms: ['focus', 'concentration', 'alertness', 'calm', 'stress', 'theanine', 'l-theanine'],
    note: 'Evidence varies by ingredient and context; some attention findings apply to combinations with caffeine, not a supplement on its own.',
    ingredients: [{ title: 'L-theanine', href: '/ingredients/l-theanine' }],
    categoryLink: { title: 'Browse all nootropic reviews', href: '/nootropics' },
  },
  {
    id: 'heart-health',
    label: 'Heart health',
    searchTerms: [
      'heart health',
      'heart',
      'cholesterol',
      'triglycerides',
      'cardiovascular',
      'omega-3',
      'omega 3',
      'psyllium',
    ],
    note: 'These reviews cover specific nutrients and claims—not treatment for heart disease. Keep prescribed care and clinician advice central.',
    ingredients: [
      { title: 'Omega-3 (EPA and DHA)', href: '/ingredients/omega-3' },
      { title: 'Psyllium husk', href: '/ingredients/psyllium-husk' },
    ],
    categoryLink: { title: 'Browse all wellness reviews', href: '/wellness' },
  },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

export function findGoalProfile(query: string): GoalProfile | undefined {
  const term = normalize(query);
  if (term.length < 2) return undefined;

  return goalProfiles
    .flatMap((goal) => goal.searchTerms.map((searchTerm) => ({ goal, normalized: normalize(searchTerm) })))
    .filter(({ normalized }) => term.includes(normalized))
    .sort((a, b) => b.normalized.length - a.normalized.length)[0]?.goal;
}
