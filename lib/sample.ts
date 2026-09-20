import type { Review } from './types';
export const categories = [
  {
    slug: 'fat-burners',
    name: 'Fat Burners',
    description: 'A closer look at weight-management supplements. Ingredients first. Hype last.',
    label: 'Weight management',
  },
  {
    slug: 'nootropics',
    name: 'Nootropics',
    description: 'Explore what goes into supplements for focus, clarity and cognitive health.',
    label: 'Mind & focus',
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    description: 'Make sense of everyday supplements and the evidence behind their ingredients.',
    label: 'Everyday wellbeing',
  },
] as const;
const products = [
  [
    'Daily Balance',
    'fat-burners',
    'An ingredient-by-ingredient look at a weight-management formula.',
  ],
  [
    'Clear Mind',
    'nootropics',
    'Inside a daily focus formula: labels, doses and the questions to ask.',
  ],
  ['Essential Greens', 'wellness', 'What to look for beyond the greens on the front of the label.'],
  [
    'Metabolic Support',
    'fat-burners',
    'A closer look at transparency in a multi-ingredient formula.',
  ],
  [
    'Focus Complex',
    'nootropics',
    'A sample review showing how we assess a cognitive-health supplement.',
  ],
  ['Daily Essentials', 'wellness', 'A sample review of an everyday wellness formula.'],
  [
    'Active Balance',
    'fat-burners',
    'A sample assessment of label clarity and practical considerations.',
  ],
  ['Clarity Blend', 'nootropics', 'A sample guide to the questions behind a focus supplement.'],
  [
    'Rest Essentials',
    'wellness',
    'An example of our structured approach to reviewing a wellness product.',
  ],
  ['Core Nutrition', 'wellness', 'An example review layout for everyday nutrition.'],
] as const;
export const sampleReviews: Review[] = products.map(([title, category_slug, summary], i) => ({
  id: `sample-${i + 1}`,
  title,
  product_name: title,
  slug: title.toLowerCase().replaceAll(' ', '-') + '-review',
  category_slug,
  score: null,
  verdict: 'Sample review',
  summary,
  body: '<h2>What is this product?</h2><p>This is a fictional product used to demonstrate the SharpAndLean review layout. It is not a product recommendation.</p><h2>What the research says</h2><p>A published review will link to the research used in its assessment, explain its limitations and distinguish ingredient evidence from evidence for the finished formula.</p><h2>Our verdict</h2><p>This sample is not rated. The final assessment, evidence sources and reviewer sign-off will be added before publication.</p>',
  pros: ['Space for a substantiated product strength', 'Space for label transparency findings'],
  cons: ['Space for an evidence limitation', 'Space for a practical consideration'],
  ingredients: [],
  faqs: [
    {
      question: 'Is this a real product recommendation?',
      answer:
        'No. This is a fictional sample used to demonstrate the site. Verified reviews will replace this content before launch.',
    },
  ],
  affiliate_url: '',
  affiliate_network: '',
  product_price: 'Not listed',
  price_amount: null,
  currency: 'USD',
  third_party_tested: false,
  money_back_guarantee: 'Not verified',
  featured_image_url: '',
  og_image_url: '',
  seo_title: title + ' — Sample Review',
  seo_desc: summary,
  is_published: false,
  published_at: null,
  updated_at: '2026-09-19T00:00:00Z',
  who_for: 'To be assessed in the published review.',
  who_avoid: 'To be assessed in the published review.',
  score_breakdown: {},
  is_sample: true,
}));
