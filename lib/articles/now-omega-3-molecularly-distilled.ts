import type { ProductArticle } from './types';

export const nowOmega3MolecularlyDistilled: ProductArticle = {
  slug: 'now-omega-3-molecularly-distilled',
  name: 'NOW Omega-3 Molecularly Distilled',
  category: 'wellness',
  summary:
    'The number on the front is fish oil. The number that matters is EPA and DHA, and it is about a third as large.',
  asin: 'B001GCU6KA',
  listing: '200 softgels',
  source: 'https://www.nowfoods.com/products/supplements/omega-3-molecularly-distilled-softgels',
  facts:
    'A serving is two softgels: 2,000 mg of fish oil concentrate providing 360 mg EPA and 240 mg DHA. The front of the bottle leads with 1,000 mg per softgel, but only about 30 per cent of that weight is the omega-3 the product is bought for. The 200-softgel bottle is 100 servings.',
  caution:
    'Omega-3s can affect bleeding, which matters if you take an anticoagulant or have surgery scheduled. This is a fish-derived product and unsuitable for anyone with a fish allergy. Discuss higher intakes with a healthcare professional rather than estimating.',
  takeaway:
    'Compare products on their EPA and DHA totals per serving, never on the fish oil milligrams printed on the front.',
  whoFor:
    'Someone comparing fish oil products who wants the actual EPA and DHA amounts rather than the headline oil weight.',
  pros: [
    'EPA and DHA are itemised separately — 360 mg and 240 mg — not merged into one omega-3 figure',
    'Molecular distillation is named on the label, and the serving is stated as two softgels',
    'Sold in four bottle counts, so cost per serving can be compared directly',
  ],
  cons: [
    'The prominent 1,000 mg figure is fish oil weight, not omega-3 content',
    'Only about 600 mg of a 2,000 mg serving is EPA plus DHA',
    'No batch-level oxidation or purity certificate is published beside the product',
  ],
  ingredients: [
    {
      name: 'EPA (eicosapentaenoic acid)',
      dose: '360 mg per 2-softgel serving',
      evidence_rating: 'moderate',
      note: 'Evidence is outcome-specific rather than general. EPA and DHA are genuinely important nutrients, but a fish-oil capsule is not an established all-purpose health or memory product, and observational links to eating fish do not transfer automatically to supplements.',
    },
    {
      name: 'DHA (docosahexaenoic acid)',
      dose: '240 mg per 2-softgel serving',
      evidence_rating: 'moderate',
      note: 'Listed separately from EPA, which is what makes cross-brand comparison possible. Products quoting only a combined omega-3 number, or only fish oil weight, cannot be compared like for like.',
    },
    {
      name: 'Fish oil concentrate',
      dose: '2,000 mg per 2-softgel serving',
      evidence_rating: 'none',
      note: 'The carrier weight, not an active dose. Roughly 1,400 mg of each serving is oil other than EPA and DHA. Treating this figure as the strength of the product is the central mistake this category invites.',
    },
  ],
  faqs: [
    {
      question: 'Is 1,000 mg of fish oil the same as 1,000 mg of omega-3?',
      answer:
        'No, and the gap is large. Two softgels give 2,000 mg of fish oil but 600 mg of EPA plus DHA. Any comparison between fish oil products has to use the EPA and DHA lines or it is measuring the wrong thing.',
    },
    {
      question: 'How many softgels is a serving?',
      answer:
        'Two. So the 200-softgel bottle is 100 servings. Compare that against a competitor’s one-softgel serving before concluding which bottle is better value.',
    },
    {
      question: 'What does molecularly distilled mean?',
      answer:
        'It is a processing method used to reduce contaminants such as heavy metals. It describes the process, not a verified result for the bottle in your hand — a batch-specific certificate of analysis from a named laboratory would be the evidence for that.',
    },
  ],
};
