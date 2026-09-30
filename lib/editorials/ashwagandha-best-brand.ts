import type { Collection } from '../types';
import { ashwagandhaShortlist } from '../ashwagandha-brands';

/*
 * Which ashwagandha to buy in the US: a /best/ guide. The products, label
 * figures and prices live in lib/ashwagandha-brands.ts as a `shortlist`, which
 * gives the page the best-guide layout (components/best-guide.tsx): top pick,
 * award tiles, comparison table and a card per product. None of them is
 * scored; each card says so. If one is later reviewed in full, set its
 * reviewSlug in that file.
 *
 * The body is the buying guide that follows the picks, so it starts at the
 * method rather than restating the answer the layout already gives.
 */
export const ashwagandhaBestBrand: Collection = {
  id: 'ashwagandha-best-brand',
  kind: 'best_lists',
  slug: 'ashwagandha-which-brand-is-the-best-to-buy-in-2026',
  title: 'Ashwagandha: Which brand is the best to buy in 2026?',
  seo_title: 'Best Ashwagandha Brand to Buy in 2026: 6 Labels Compared',
  seo_desc:
    'Which ashwagandha to buy in the US: six labels compared on extract, dose, withanolides and cost a day. Our pick is a 600 mg KSM-66 root extract for about 37¢ a day.',
  summary:
    'The best ashwagandha is the one that matches the trials: a named root extract, 300 to 600 mg a day, with nothing hidden. We read six US labels. NOW’s 600 mg KSM-66 is our pick at about 37 cents a day; Jarrow’s 300 mg capsules suit a split dose; NOW’s 450 mg extract is the budget choice. Gummies cost four times as much a day and add sugar and vitamin D.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
  figure: {
    src: '/images/illustration-ashwagandha.jpg',
    alt: 'Illustration of dried ashwagandha roots on a cream plate beside a bowl of root powder and two capsules, with a sprig of green leaves and red berries in papery husks.',
    caption:
      'The same root, sold as powder, extract capsules, liquid capsules and gummies — and they are not equivalent. SharpAndLean illustration.',
  },
  takeaways: [
    'Buy a named root extract — KSM-66 is the one most trials used — at 300 to 600 mg a day. A label that just says “ashwagandha 500 mg” may be much weaker powder.',
    'Our pick: NOW KSM-66 Ashwagandha 600 mg, one capsule a day, about 37 cents a day at list price. Jarrow’s 300 mg KSM-66 matches the twice-daily trial pattern.',
    'Budget: NOW Ashwagandha 450 mg, a standardised extract at about 19 cents a day — but not one of the extracts the trials tested.',
    'Gummies can cost four times as much a day and add sugar and vitamin D. No brand makes ashwagandha safe in pregnancy or with liver or thyroid problems.',
  ],
  body: `
<h2>How we chose</h2>
<p>We started with the evidence, not the brands. The trials that support ashwagandha for stress and sleep mostly used <strong>250 to 600 mg a day of a standardised root extract</strong> for eight weeks, and several used KSM-66. A product earns a place here by getting close to that — and loses ground for anything that makes the dose unclear or adds something you did not ask for.</p>
<p>For each product we read the Supplement Facts panel on the <strong>manufacturer’s own website</strong> on 1 October 2026, not a retailer listing — which matters: Jarrow’s capsule is still described as a Sensoril product on some retail sites, but its current label is KSM-66. We recorded the extract, plant part, amount per capsule, suggested use, withanolide content where stated, and the maker’s list price, then worked out the daily dose and cost a day at the suggested use.</p>
<p>What we did <strong>not</strong> do: test the capsules ourselves, or check each company’s batch certificates. We did not find a USP Verified or NSF Certified mark for any of these six products on the makers’ pages. The evidence behind every claim is on our <a href="/ingredients/ashwagandha">ashwagandha ingredient page</a>.</p>

<h2>What to check on any label</h2>
<p>Whether you buy one of these or something else, six checks sort a sensible ashwagandha from a poor one.</p>
<div data-tool="ashwagandha-buy-checklist"></div>

<h2>KSM-66, Sensoril or plain root: which extract?</h2>
<table>
<thead><tr><th>Extract</th><th>What it is</th><th>Studied daily dose</th><th>Best for</th></tr></thead>
<tbody>
<tr><td><strong>KSM-66</strong></td><td>Root only, marketed as at least 5% withanolides</td><td>300–600 mg</td><td>Most people: it is the extract behind many of the stress and sleep trials</td></tr>
<tr><td><strong>Sensoril</strong></td><td>Root and leaf, 10% withanolide glycosides</td><td>125–500 mg</td><td>Starting low; more concentrated, so smaller doses</td></tr>
<tr><td><strong>Generic standardised extract</strong></td><td>Root, or root and leaf, with a stated withanolide %</td><td>Follow the label</td><td>Budget buyers who accept a less direct link to the trials</td></tr>
<tr><td><strong>Root powder</strong></td><td>Dried ground root, not concentrated</td><td>Several grams (traditional)</td><td>Traditional use; weaker than trial extracts per capsule</td></tr>
</tbody>
</table>
<p>A higher milligram number is not a stronger product. Gaia’s capsule contains 350 mg but only 2.5 mg of withanolides; a 600 mg KSM-66 capsule has roughly 30 mg. Compare extracts and withanolides, not the big number on the front.</p>

<h2>What to avoid</h2>
<ul>
<li><strong>Proprietary blends.</strong> “Stress blend 800 mg” with ashwagandha somewhere inside tells you nothing about how much you are taking.</li>
<li><strong>Stacked extras.</strong> Sleep and “cortisol” formulas often add melatonin, magnesium, L-theanine or rhodiola. Fine if you want them — but then you are not taking ashwagandha, you are taking a mixture.</li>
<li><strong>Megadose claims.</strong> A capsule advertising 1,000 mg or more is often root powder or a less concentrated extract — check which. A bigger number is not what the trials tested.</li>
<li><strong>Gummies as a daily habit.</strong> They can reach the trial dose, but with sugar, extra vitamins and a much higher cost a day.</li>
<li><strong>“Clinically proven” on the front.</strong> The trials tested specific extracts at specific doses for eight weeks. A clinical claim only transfers if the label matches.</li>
</ul>

<h2>Before you buy any brand</h2>
<p>A better label does not make ashwagandha suitable for everyone. <strong>Do not take any brand if you are pregnant or breastfeeding</strong>, and check with your doctor first if you have a thyroid or liver condition, an autoimmune disease, or take sedatives, thyroid, diabetes, blood-pressure or immune-suppressing medicines. Rare liver injury has been reported with ashwagandha, usually 2 to 12 weeks after starting — see <a href="/learn/ashwagandha-what-happens-if-you-take-it-daily">what happens if you take it daily</a>. Plan an eight-week trial, and stop by about three months.</p>

<h2>The bottom line</h2>
<p>Buy the extract, not the brand. For most people, that means a KSM-66 root extract at 600 mg a day — NOW’s one-a-day capsule is the simplest and cheapest way to get it, and Jarrow’s is the best two-a-day version. If budget matters most, NOW’s standardised 450 mg extract is a sensible compromise. Whatever you buy, check the panel against the six points above, and compare the cost a day at the full dose rather than the price of the bottle, and remember that no brand changes who should not take ashwagandha at all.</p>
<p>Not sure you need it? Start with <a href="/learn/ashwagandha-why-you-need-to-take">why people take ashwagandha</a>, and what the evidence does and does not support.</p>
`,
  productsIntro: {
    label: 'The picks in detail',
    heading: 'Why each one made the list',
    text: 'Read from each maker’s label on 1 October 2026. Prices are the maker’s list price — Amazon’s will differ, so compare the cost a day at the full dose. KSM-66 is sold as at least 5% withanolides, so about 30 mg in 600 mg.',
  },
  shortlist: ashwagandhaShortlist,
  faqs: [
    {
      question: 'Which brand of ashwagandha is best?',
      answer:
        'The best kind is a named root extract at 300 to 600 mg a day, the dose and form used in the trials. In the US, NOW KSM-66 Ashwagandha 600 mg is our pick: one capsule a day of KSM-66 for about 37 cents a day at list price. Jarrow’s 300 mg KSM-66 capsules suit a twice-daily dose.',
    },
    {
      question: 'Is KSM-66 the best form of ashwagandha?',
      answer:
        'It is the best studied. KSM-66 is a root-only extract used in many of the stress, sleep and strength trials, typically at 300 to 600 mg a day. Sensoril is another trial-tested extract, more concentrated and dosed lower. Plain root powder is much weaker per capsule.',
    },
    {
      question: 'What should I look for on an ashwagandha label?',
      answer:
        'A named extract or a withanolide percentage, 250 to 600 mg of extract a day at the suggested serving, root rather than leaf unless you choose otherwise, no proprietary blend hiding the amount, and clear warnings about pregnancy, thyroid and liver conditions.',
    },
    {
      question: 'Are ashwagandha gummies as good as capsules?',
      answer:
        'Some use the same extract and can reach the same dose, but you need several a day. Goli’s suggested four gummies give 600 mg of KSM-66 along with 8 g of sugar and 2,000 IU of vitamin D, and cost about four times as much a day as capsules at list price.',
    },
    {
      question: 'Does more milligrams mean a stronger ashwagandha?',
      answer:
        'No. The extract matters more than the number. A 350 mg whole-root capsule can contain 2.5 mg of withanolides, while a 600 mg KSM-66 capsule contains about 30 mg. Compare the extract and the withanolide content.',
    },
    {
      question: 'Is organic ashwagandha better?',
      answer:
        'Organic describes how the plant was grown, not how strong the product is. NOW’s KSM-66 is both organic and a trial-tested extract; Gaia’s organic root capsules are far less concentrated. Check the extract and dose first.',
    },
  ],
  references: [
    ...ashwagandhaShortlist.map((p) => ({
      id: `label-${p.id}`,
      text: `${p.brand}. ${p.name} — product page and Supplement Facts, read 1 October 2026.`,
      url: p.source,
    })),
    {
      id: 'akhgarjand-2022',
      text: 'Akhgarjand C et al. (2022). Does ashwagandha supplementation have a beneficial effect on the management of anxiety and stress? A systematic review and meta-analysis of randomized controlled trials. Phytotherapy Research — 12 trials, 1,002 participants; 300–600 mg a day did best for stress.',
      url: 'https://onlinelibrary.wiley.com/doi/10.1002/ptr.7598',
    },
    {
      id: 'chandrasekhar-2012',
      text: 'Chandrasekhar K, Kapoor J, Anishetty S (2012). A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults. Indian Journal of Psychological Medicine 34(3):255-262 — 300 mg twice a day.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23439798/',
    },
    {
      id: 'cheah-2021',
      text: 'Cheah KL et al. (2021). Effect of ashwagandha (Withania somnifera) extract on sleep: a systematic review and meta-analysis. PLoS One 16(9):e0257843.',
      url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257843',
    },
    {
      id: 'ods-ashwagandha',
      text: 'NIH Office of Dietary Supplements. Ashwagandha: is it helpful for stress, anxiety, or sleep? — Fact Sheet for Health Professionals.',
      url: 'https://ods.od.nih.gov/factsheets/Ashwagandha-HealthProfessional/',
    },
    {
      id: 'medlineplus-vitamin-d',
      text: 'MedlinePlus. Vitamin D — 600 IU (15 mcg) a day for adults up to 70; upper limit 4,000 IU (100 mcg).',
      url: 'https://medlineplus.gov/ency/article/002405.htm',
    },
  ],
  history: [
    {
      date: '2026-10-01',
      note: 'First published. Six US products compared from the manufacturers’ own labels and list prices, read on 1 October 2026. No product is scored; none has been reviewed in full. Not yet reviewed by a clinician.',
    },
  ],
};
