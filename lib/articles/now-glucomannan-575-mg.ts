import type { ProductArticle } from './types';

export const nowGlucomannan575Mg: ProductArticle = {
  slug: 'now-glucomannan-575-mg',
  name: 'NOW Glucomannan 575 mg',
  category: 'fat-burners',
  summary:
    'Sold for weight management, priced per bottle, and labelled with a number that is not the serving. A good test of whether you read panels.',
  asin: 'B000MGWI02',
  listing: '180 veg capsules',
  image: 'https://www.nowfoods.com/sites/default/files/2024-08/6512_v7.png',
  source: 'https://www.nowfoods.com/products/supplements/glucomannan-575-mg-veg-capsules',
  facts:
    'The front of the bottle says 575 mg. The Supplement Facts panel says a serving is three capsules, providing 1,725 mg of glucomannan from konjac root and 2 g of dietary fibre. The 180-capsule bottle is therefore 60 servings, not 180 — roughly two months, not six.',
  caution:
    'Bulk-forming fibres swell on contact with liquid and carry a choking risk if taken with too little. Anyone with swallowing difficulty, a history of bowel obstruction, diabetes medication or scheduled surgery should take advice first. Fibre can also affect how other medicines are absorbed, so doses are usually spaced apart.',
  takeaway:
    'Work out the cost per serving, not per capsule, and check the claim against the evidence for the ingredient rather than the category it is shelved in.',
  whoFor:
    'Someone comparing fibre supplements who wants to see how a front-label number differs from a labelled serving before deciding what a bottle actually costs to use.',
  pros: [
    'Full serving disclosed: 1,725 mg glucomannan and 2 g dietary fibre, no proprietary blend',
    'Konjac root is named as the source, with the botanical species given',
    'Single ingredient, so the panel can be checked against research directly',
  ],
  cons: [
    'The front label reads 575 mg; a serving is three capsules at 1,725 mg',
    '180 capsules looks like a long supply but is 60 servings',
    'Marketed for healthy weight management, where the evidence for glucomannan is weak',
  ],
  ingredients: [
    {
      name: 'Glucomannan (from konjac root)',
      dose: '1,725 mg per 3-capsule serving',
      evidence_rating: 'weak',
      note: 'A soluble fibre that absorbs water and adds bulk, which is the basis of the satiety claim. NIH’s Office of Dietary Supplements concludes glucomannan has little to no effect on weight loss. It can cause gastrointestinal symptoms and must be taken with adequate fluid.',
    },
  ],
  faqs: [
    {
      question: 'Why does the label say 575 mg if a serving is 1,725 mg?',
      answer:
        'Because 575 mg is the amount in one capsule and the labelled serving is three. Both numbers are truthful; only one tells you what you are taking. This is the most common way a supplement label misleads without lying.',
    },
    {
      question: 'How long does a 180-capsule bottle last?',
      answer:
        'Sixty servings, so about two months at the labelled serving. Comparing it on bottle price against a product with a one-capsule serving would be comparing two months against six.',
    },
    {
      question: 'Does glucomannan cause weight loss?',
      answer:
        'The NIH Office of Dietary Supplements concludes it has little to no effect on weight loss. Promoting fullness is a plausible mechanism, but a plausible mechanism is not a demonstrated outcome, and the category it is shelved in does not change that.',
    },
  ],
};
