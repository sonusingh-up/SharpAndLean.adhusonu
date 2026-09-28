import type { Citation } from '../ingredients';
import type { HistoryEntry } from '@/components/article-footer';
import type { FAQ } from '../types';

/*
 * Content for /supergut, the brand guide. Kept as data, like the articles, so
 * the page component only lays it out.
 *
 * Product figures for GLP-1 Daily Support come from its full review
 * (lib/articles/supergut-glp-1-booster-review.ts), and the page reads that
 * review's live score rather than restating it. When another Supergut product
 * gets a full review, set its `reviewSlug` below and the card links to it.
 */

export type BrandProduct = {
  name: string;
  /** What it is, in one or two sentences, with the figures we could confirm. */
  note: string;
  /** Fibre per serving, as quoted in the note, for quick scanning. */
  fibre: string;
  /** "<category>/<slug>" of a full review, once one exists. */
  reviewSlug?: string;
};

export const supergut = {
  path: '/supergut',
  name: 'Supergut',
  seoTitle: 'Supergut Review: Products, Research and Evidence',
  seoDescription:
    'Everything we know about Supergut: our product reviews, the company’s own trial, what resistant-starch research shows, and UK buying notes.',
  title: 'Supergut: our reviews, the research and what it adds up to',
  intro:
    'Supergut makes resistant-starch fibre powders, bars and shakes, and markets much of the range on GLP-1 and appetite. This page brings together everything we have published on the brand — full reviews, the articles that cover it, a plain reading of the company’s own trial and the wider research on resistant starch — so you can judge the range in one place.',
  published: '2026-09-28T00:00:00Z',
  updated: '2026-09-28T00:00:00Z',
  affiliateUrl: 'https://sharpandlean.com/recommended/supergut',
  figure: {
    src: '/images/supergut-fibre-per-serving.jpg',
    alt: 'Chart of fibre per serving across Supergut’s range: GLP-1 Daily Support 6 g a scoop, or 12 g at two scoops; Foundational Daily Fiber 6 g; Prebiotic Bar 10 g; Prebiotic Shake 15 g, or 20 g in higher-fibre versions. Reference lines mark the UK target of 30 g of fibre a day from all foods and the 40 g a day of resistant starch used in a weight-loss trial.',
    caption:
      'SharpAndLean chart. Figures from Supergut’s product pages, retail listings and our GLP-1 Daily Support review. The resistant starch in each product is an undisclosed share of its fibre.',
  },
  takeaways: [
    'Supergut sells fibre — mainly resistant starch from green banana, potato and oats — in powders, bars and shakes. As fibre, the products are sensible and low-FODMAP where certified.',
    'The company’s own randomised trial found a fibre-enriched shake lowered HbA1c by 0.64 points against placebo in type 2 diabetes. It did not measure GLP-1 or appetite, and it tested a meal-replacement shake, not the GLP-1 powder.',
    'The resistant-starch trial that showed weight loss used 40 g a day. A scoop of GLP-1 Daily Support has 6 g of fibre in total, so the “GLP-1” framing promises more than the dose delivers.',
    'Supergut is a US brand priced in dollars. UK buyers pay import costs, and should compare it with ordinary high-fibre foods, which do most of the same job.',
  ],
  /** Every Supergut product we have reviewed in full, by review slug. */
  reviewedSlugs: ['supergut-glp-1-booster-review'],
  /** The rest of the range, named and described but not yet reviewed. */
  unreviewed: [
    {
      name: 'Foundational Daily Fiber',
      fibre: '6 g a scoop',
      note: 'The same 6 g of prebiotic fibre per scoop as GLP-1 Daily Support, without the GLP-1 name, for $50 for 40 servings on Supergut’s store in September 2026 — $10 less a tub. On the figures we could read, it is the better-value way to buy the same fibre.',
    },
    {
      name: 'Prebiotic Bars',
      fibre: '10 g a bar',
      note: 'Snack bars with about 10 g of prebiotic fibre and 10 g of protein each, in flavours including chocolate brownie, peanut butter chocolate and strawberry almond. Sold in boxes of 12; we saw prices from about $27 to $30 a box in US listings.',
    },
    {
      name: 'Prebiotic Shakes',
      fibre: '15–20 g a shake',
      note: 'Meal-replacement shakes with about 15 g of prebiotic fibre and 15 g of protein, and higher-fibre versions with 20 g. This is the format closest to the product in Supergut’s published trial, which tested a fibre-enriched meal-replacement shake — though we could not confirm the formula is identical.',
    },
  ] satisfies BrandProduct[],
  /** Articles on this site that discuss Supergut, with what each one adds. */
  articles: [
    {
      href: '/best/glp-1-supplements-for-weight-loss',
      title: 'The best GLP-1 supplements for weight loss in 2026, ranked',
      note: 'Where GLP-1 Daily Support sits against Calocurb, Lemme, Pendulum and others, ranked by published score.',
    },
    {
      href: '/learn/glp-1',
      title: 'GLP-1, explained properly',
      note: 'How the hormone works, what the drugs do, and why fibre’s effect on GLP-1 is a different order of magnitude.',
    },
    {
      href: '/learn/natural-glp-1-alternatives',
      title: 'The best natural GLP-1 alternatives, ranked by what actually works',
      note: 'The foods and habits with better evidence than any capsule, including resistant starch from ordinary food.',
    },
  ],
  /** Research and background, rendered as article prose. */
  body: `
<h2>The company</h2>
<p>Supergut was founded in Los Angeles by Marc Washington, launching in 2020 as Muniq and rebranding as Supergut in 2022. Its science lead is Dr Chris Damman, a gastroenterologist who joined in 2021 as chief medical and science officer. The company started direct to consumer and now sells through US retailers including Target, Sprouts, GNC and Vitamin Shoppe.</p>
<p>In March 2025 it announced new funding led by Full Frame Growth Partners and appointed Tracey Warner Halama, formerly chief executive of Vital Proteins, as CEO, with Washington moving to executive chairman. Coverage of the round credited much of the brand’s 2024 growth to its GLP-1 product.</p>
<p>That commercial context matters for a reader. The GLP-1 framing is the brand’s growth engine, which is a reason to read its claims carefully rather than a reason to dismiss them.</p>

<h2>The company’s own trial</h2>
<p>Supergut’s headline evidence is a randomised, double-blind, placebo-controlled trial <a href="https://pubmed.ncbi.nlm.nih.gov/36594522/">published in 2023 in <em>Diabetes, Obesity and Metabolism</em></a>. It enrolled 192 adults with type 2 diabetes — average HbA1c 7.8 per cent and BMI 35.9 — and gave them a fibre-enriched nutritional shake containing resistant starch and oat beta-glucan, a matching shake without the fibre, or dietary advice alone, for 12 weeks. Participants built up to two shake packets a day, with at least one replacing a meal.</p>
<p>The fibre shake beat the placebo shake on its primary outcome, a diabetes-distress score, and lowered HbA1c by 0.64 percentage points more than placebo. Two butyrate-producing bacterial species increased. For people with type 2 diabetes, that is a meaningful result.</p>
<p>What it does not show is just as important:</p>
<ul>
<li>It tested a meal-replacement shake, taken in place of a meal — not the GLP-1 powder, and not as an addition to a normal diet.</li>
<li>It enrolled people with type 2 diabetes, not the general buyer.</li>
<li>Its published abstract reports no GLP-1 measurement and no appetite outcome.</li>
<li>Four of its nine authors were Supergut employees, including its chief medical officer, alongside academic co-authors from Stanford and UCLA.</li>
</ul>
<p>Supergut’s product pages also cite a 2026 pilot and observational study run with Tiny Health, noting that some results are self-reported. We could not find it published.</p>

<h2>What the research on resistant starch shows</h2>
<h3>The mechanism is real</h3>
<p>Resistant starch is starch that escapes digestion in the small intestine and is fermented by bacteria in the colon. Fermentation produces short-chain fatty acids — acetate, propionate and butyrate — which act on the L-cells of the gut that release GLP-1 and other appetite hormones. It is the best-described route by which a food ingredient can nudge GLP-1, and our <a href="/learn/glp-1">GLP-1 explainer</a> covers it in detail.</p>
<h3>But a GLP-1 rise is not the same as eating less</h3>
<p>A <a href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full">2026 scoping review in <em>Frontiers in Endocrinology</em></a> pooled 52 studies with 1,085 participants. Only some fibre types raised GLP-1 consistently, and studies that did find a rise showed only a non-significant tendency towards feeling fuller. A higher reading on a blood test did not reliably translate into eating less.</p>
<h3>The weight trial used far more</h3>
<p>The strongest human evidence that resistant starch helps with weight is <a href="https://www.nature.com/articles/s42255-024-00988-y">a 2024 randomised crossover trial in <em>Nature Metabolism</em></a>: 37 people with excess weight took 40 g a day of resistant starch from high-amylose maize for eight weeks and lost a mean of 2.8 kg against a control starch, with better insulin sensitivity. That is roughly seven times the total fibre in a scoop of GLP-1 Daily Support, and the scoop’s resistant starch is only part of that.</p>
<h3>One ingredient has its own prebiotic trial</h3>
<p>Supergut’s blends include Solnul, a resistant potato starch. In <a href="https://pubmed.ncbi.nlm.nih.gov/37049425/">a 2023 randomised trial</a> run for the ingredient’s maker, 3.5 g a day for four weeks increased <em>Bifidobacterium</em> and <em>Akkermansia</em> and improved stool consistency against placebo. That is a genuine prebiotic effect at a low dose. It did not measure GLP-1, appetite or weight, and the amount of Solnul in Supergut’s products is not disclosed.</p>
<h3>Fibre itself is well supported</h3>
<p>None of this makes fibre a bad idea. A <a href="https://pubmed.ncbi.nlm.nih.gov/30638909/">2019 series of meta-analyses in <em>The Lancet</em></a> found that people eating 25 to 29 g of fibre a day had lower rates of heart disease, stroke, type 2 diabetes and bowel cancer than those eating less. The <a href="https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/">NHS recommends 30 g a day</a> for adults, and says most people eat about 20 g. Adding fibre, from any source, is sound advice. What the evidence does not support is paying a premium for fibre sold as a GLP-1 product.</p>

<h2>Buying Supergut in the UK</h2>
<p>Supergut is a US brand priced in dollars. Its help centre says it can ship to most addresses worldwide, with some products restricted, and it is not stocked by UK retailers we checked. Expect international postage and possible import charges on top of the dollar price, and check the delivered cost before ordering.</p>
<p>For most UK buyers, the cheaper and better-evidenced route to the same goal is food: oats, beans, lentils, slightly green bananas, and potatoes or rice cooked and cooled, which forms more resistant starch. If you want a powder, compare the price per gram of fibre with a plain fibre supplement such as psyllium — and if the low-FODMAP certification matters to you because of irritable bowel syndrome, that is a genuine reason to consider Supergut specifically.</p>

<h2>Our verdict on the brand</h2>
<p>Supergut is more credible than most brands in the GLP-1 supplement aisle: it has a medical lead, a published randomised trial and products built on well-tolerated fibres. Its problem is the gap between that evidence and the name on the tub. The trial tested a meal-replacement shake in type 2 diabetes and measured blood sugar; the GLP-1 products are sold on appetite and GLP-1, at a fibre dose far below the weight research.</p>
<p>Judge the range as fibre, and it is reasonable. Judge it as a GLP-1 treatment, and the evidence does not yet support the claim. Our full review of <a href="/fat-burners/supergut-glp-1-booster-review">GLP-1 Daily Support</a> scores it accordingly.</p>
`,
  faqs: [
    {
      question: 'Is Supergut legit?',
      answer:
        'Yes, as a company: it has a medical lead, a randomised trial published in a peer-reviewed diabetes journal, and products made from well-tolerated food fibres. The weakness is the marketing — its GLP-1 products are sold on appetite and GLP-1, while its trial tested a different product in type 2 diabetes and measured blood sugar.',
    },
    {
      question: 'Does Supergut actually raise GLP-1?',
      answer:
        'Fermentable fibre such as resistant starch can raise GLP-1 through the short-chain fatty acids gut bacteria produce. But Supergut’s published trial did not measure GLP-1, and a 2026 review of 52 studies found fibre-driven GLP-1 rises did not reliably make people eat less. It is not comparable to GLP-1 medicines.',
    },
    {
      question: 'Will Supergut help me lose weight?',
      answer:
        'We would not expect much on its own. The resistant-starch trial that showed weight loss used 40 g a day for eight weeks; a scoop of GLP-1 Daily Support has 6 g of fibre in total. Fibre can help with fullness as part of a diet, but Supergut is not a weight-loss treatment.',
    },
    {
      question: 'What is the difference between GLP-1 Daily Support and Foundational Daily Fiber?',
      answer:
        'On the figures we could read, both give 6 g of prebiotic fibre per scoop. GLP-1 Daily Support costs about $10 more per 40-serving tub. We have reviewed GLP-1 Daily Support in full; Foundational Daily Fiber is not yet reviewed.',
    },
    {
      question: 'Can I buy Supergut in the UK?',
      answer:
        'It is a US brand. Supergut says it ships to most countries with some product restrictions, and we did not find it stocked by UK retailers. Expect international postage and possible import charges, and compare the delivered cost with UK fibre supplements.',
    },
    {
      question: 'Is Supergut good for IBS?',
      answer:
        'GLP-1 Daily Support carries Monash University low-FODMAP certification, which is a genuine advantage for people with irritable bowel syndrome who react badly to fibres such as inulin. Start with a small amount, because resistant starch still causes wind and bloating while your gut adjusts, and speak to your GP if symptoms are new.',
    },
  ] satisfies FAQ[],
  references: [
    {
      id: 'sg-frias-2023',
      text: 'Frias JP et al. (2023). A microbiome-targeting fibre-enriched nutritional formula is well tolerated and improves quality of life and haemoglobin A1c in type 2 diabetes: a double-blind, randomized, placebo-controlled trial. Diabetes, Obesity and Metabolism 25(5):1203-1212.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36594522/',
    },
    {
      id: 'sg-li-2024',
      text: 'Li H et al. (2024). Resistant starch intake facilitates weight loss in humans by reshaping the gut microbiota. Nature Metabolism 6(3):578-597.',
      url: 'https://www.nature.com/articles/s42255-024-00988-y',
    },
    {
      id: 'sg-solnul-2023',
      text: 'Bush JR et al. (2023). Consumption of Solnul resistant potato starch produces a prebiotic effect in a randomized, placebo-controlled clinical trial. Nutrients 15(7):1582.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/37049425/',
    },
    {
      id: 'sg-fibre-glp1-review',
      text: 'Dietary fibers to boost endogenous GLP-1 secretion and satiety: a scoping review (2026). Frontiers in Endocrinology — 52 studies, 1,085 participants.',
      url: 'https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full',
    },
    {
      id: 'sg-reynolds-2019',
      text: 'Reynolds A et al. (2019). Carbohydrate quality and human health: a series of systematic reviews and meta-analyses. The Lancet 393(10170):434-445.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30638909/',
    },
    {
      id: 'sg-nhs-fibre',
      text: 'NHS. How to get more fibre into your diet — the 30 g a day recommendation for adults.',
      url: 'https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/',
    },
    {
      id: 'sg-funding-2025',
      text: 'AgFunderNews (2025). Supergut raises new capital, hires CEO as GLP-1 booster takes off — the Full Frame Growth Partners round, Tracey Warner Halama as CEO and Marc Washington as executive chairman.',
      url: 'https://agfundernews.com/supergut-raises-capital-hires-new-ceo-as-glp-1-nutrition-trend-takes-off-we-want-to-own-the-digestive-health-category',
    },
    {
      id: 'sg-products',
      text: 'Supergut. Product range — fibre powders, GLP-1 Daily Support, bars and shakes, read via search on 28 September 2026.',
      url: 'https://supergut.com/collections/all',
    },
    {
      id: 'sg-shipping',
      text: 'Supergut help centre. Do you ship internationally?',
      url: 'https://help.supergut.com/kb/orders-shipping-and-returns/do-you-ship-internationally',
    },
  ] satisfies Citation[],
  history: [
    {
      date: '2026-09-28',
      note: 'First published, bringing together our GLP-1 Daily Support review, the articles that cover Supergut, the company’s trial, the resistant-starch research and UK buying notes. Foundational Daily Fiber, the bars and the shakes are listed but not yet reviewed.',
    },
  ] satisfies HistoryEntry[],
};
