import type { ProductArticle } from './types';

export const nowLTheanine100Mg: ProductArticle = {
  slug: 'now-l-theanine-100-mg',
  name: 'NOW L-Theanine 100 mg',
  category: 'nootropics',
  summary:
    'A closer look at a relaxation-labelled formula containing both L-theanine and decaffeinated green tea.',
  asin: 'B0013OXESM',
  listing: '90 veg capsules',
  source: 'https://www.nowfoods.com/products/supplements/l-theanine-100-mg-veg-capsules',
  facts:
    'The manufacturer lists 100 mg L-theanine and 250 mg decaffeinated green tea per capsule, with 90 capsules per bottle. This is not a single-ingredient L-theanine capsule. The label markets relaxation; that claim should not be stretched into a promise of better memory.',
  caution:
    'The manufacturer says to take with food, avoid an empty stomach and not exceed its recommended dose. It advises medical consultation for pregnancy, nursing, medicines or medical conditions, including liver disease.',
  takeaway:
    'Read the full ingredient panel when comparing the 100 mg and 200 mg versions. A shared brand name does not establish an identical formula.',
  whoFor:
    'Someone comparing theanine products who wants to see both actives itemised before deciding whether the green tea content belongs in their routine.',
  pros: [
    'Both actives carry their own amounts — 100 mg L-theanine, 250 mg green tea extract',
    'The green tea is decaffeinated, so the capsule is not an unlabelled stimulant',
    '90 capsules per bottle makes cost per serving straightforward to calculate',
  ],
  cons: [
    'The product name says L-theanine; the panel shows a two-ingredient formula',
    'Marketed for relaxation, which is not evidence of better memory, focus or productivity',
    'Concentrated green tea extract carries documented liver-injury reports in some people',
  ],
  ingredients: [
    {
      name: 'L-theanine',
      dose: '100 mg per capsule',
      evidence_rating: 'moderate',
      note: 'An amino acid found in tea, most studied alongside caffeine for short-term alertness and subjective calm. Trials commonly use 100–200 mg. Evidence for broader or longer-term cognitive benefit is much thinner than the category marketing suggests.',
    },
    {
      name: 'Decaffeinated green tea extract',
      dose: '250 mg per capsule',
      evidence_rating: 'weak',
      note: 'Present in addition to the theanine rather than instead of it. NIH notes concentrated green tea extract can cause adverse effects and has been linked to liver injury in some people — a different risk profile from drinking tea. Worth knowing if you also take a separate green tea product.',
    },
  ],
  faqs: [
    {
      question: 'Is this pure L-theanine?',
      answer:
        'No. Each capsule also contains 250 mg of decaffeinated green tea extract. If you specifically want a single-ingredient theanine capsule, this is not it, and the product name alone will not tell you that.',
    },
    {
      question: 'Will it make me more focused?',
      answer:
        'The label markets relaxation, not focus. Most theanine research pairs it with caffeine and measures short-term alertness or subjective calm. Treating that as proof of improved memory or concentration goes well beyond what was tested.',
    },
    {
      question: 'Does the 200 mg version just contain double?',
      answer:
        'Do not assume so. A shared brand name does not guarantee the same formula — the accompanying ingredients can differ between strengths. Compare the full panels side by side rather than the front labels.',
    },
  ],
};
