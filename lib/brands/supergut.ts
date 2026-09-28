import type { Citation } from '../ingredients';
import type { HistoryEntry } from '@/components/article-footer';
import type { FAQ } from '../types';

/*
 * Content for /guides/supergut, the brand guide. Kept as data, like the articles, so
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
  path: '/guides/supergut',
  name: 'Supergut',
  seoTitle: 'Supergut Guide: Reviews, Research and Evidence (2026)',
  seoDescription:
    'Everything we know about Supergut: our product reviews, the company’s own trial, what resistant-starch research shows, and where to buy it.',
  title: 'The complete Supergut guide: reviews, research and what it adds up to',
  intro:
    'Supergut makes resistant-starch fibre powders, bars and shakes, and markets much of the range on GLP-1 and appetite. This page brings together everything we have published on the brand — full reviews, the articles that cover it, a plain reading of the company’s own trial and the wider research on resistant starch — so you can judge the range in one place.',
  published: '2026-09-28T00:00:00Z',
  updated: '2026-09-28T00:00:00Z',
  affiliateUrl: 'https://sharpandlean.com/recommended/supergut',
  figure: {
    src: '/images/supergut-fibre-per-serving.jpg',
    alt: 'Chart of fibre per serving across Supergut’s range: GLP-1 Daily Support 6 g a scoop, or 12 g at two scoops; Foundational Daily Fiber 6 g; Prebiotic Bar 10 g; Prebiotic Shake 15 g, or 20 g in higher-fibre versions. Reference lines mark a typical adult target of 30 g of fibre a day from all foods and the 40 g a day of resistant starch used in a weight-loss trial.',
    caption:
      'SharpAndLean chart. Figures from Supergut’s product pages, retail listings and our GLP-1 Daily Support review. The resistant starch in each product is an undisclosed share of its fibre.',
  },
  /** Every Supergut product we have reviewed in full, by review slug. */
  reviewedSlugs: [
    'supergut-foundational-daily-fiber-review',
    'supergut-prebiotic-shakes-review',
    'supergut-prebiotic-bars-review',
    'supergut-glp-1-booster-review',
  ],
  /** The rest of the range, named and described but not yet reviewed. */
  unreviewed: [] as BrandProduct[],
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
  /**
   * The guide, in the order a reader's questions arrive: what is it, does it
   * work, which one, how to use it. Each topic renders as an anchored block; a
   * `slot` places a live component (the review cards, the range, the chart)
   * after the topic's prose.
   */
  stages: [
    {
      id: 'understand',
      number: '01',
      title: 'Understanding Supergut',
      summary: 'What the brand sells, who is behind it, and the idea every product is built on.',
      topics: [
        {
          id: 'what-it-sells',
          title: 'What Supergut sells',
          html: `<p>Supergut sells fibre. Its powders, bars and shakes are built around a blend of resistant starch — from green bananas and potatoes — with oat beta-glucan and soluble corn fibre. The range splits into everyday fibre products and a GLP-1-branded line marketed on appetite and cravings.</p><p>The distinction matters, because the fibre inside is broadly the same. On the figures we could read, <a href="/fat-burners/supergut-glp-1-booster-review">GLP-1 Daily Support</a> and <a href="/wellness/supergut-foundational-daily-fiber-review">Foundational Daily Fiber</a> both give 6 g of fibre a scoop; the GLP-1 version costs about $10 more per tub.</p>`,
        },
        { id: 'company', title: 'Who is behind it', html: `<p>Supergut was founded in Los Angeles by Marc Washington, launching in 2020 as Muniq and rebranding as Supergut in 2022. Its science lead is Dr Chris Damman, a gastroenterologist who joined in 2021 as chief medical and science officer. The company started direct to consumer and now sells through US retailers including Target, Sprouts, GNC and Vitamin Shoppe.</p>
<p>In March 2025 it announced new funding led by Full Frame Growth Partners and appointed Tracey Warner Halama, formerly chief executive of Vital Proteins, as CEO, with Washington moving to executive chairman. Coverage of the round credited much of the brand’s 2024 growth to its GLP-1 product.</p>
<p>That commercial context matters for a reader. The GLP-1 framing is the brand’s growth engine, which is a reason to read its claims carefully rather than a reason to dismiss them.</p>` },
        { id: 'how-it-works', title: 'How resistant starch is meant to work', html: `<p>Resistant starch is starch that escapes digestion in the small intestine and is fermented by bacteria in the colon. Fermentation produces short-chain fatty acids — acetate, propionate and butyrate — which act on the L-cells of the gut that release GLP-1 and other appetite hormones. It is the best-described route by which a food ingredient can nudge GLP-1, and our <a href="/learn/glp-1">GLP-1 explainer</a> covers it in detail.</p>` },
      ],
    },
    {
      id: 'evidence',
      number: '02',
      title: 'What the evidence shows',
      summary: 'The company’s own trial, and what the wider research on resistant starch does and does not support.',
      topics: [
        { id: 'own-trial', title: 'The company’s own trial', html: `<p>Supergut’s headline evidence is a randomised, double-blind, placebo-controlled trial <a href="https://pubmed.ncbi.nlm.nih.gov/36594522/">published in 2023 in <em>Diabetes, Obesity and Metabolism</em></a>. It enrolled 192 adults with type 2 diabetes — average HbA1c 7.8 per cent and BMI 35.9 — and gave them a fibre-enriched nutritional shake containing resistant starch and oat beta-glucan, a matching shake without the fibre, or dietary advice alone, for 12 weeks. Participants built up to two shake packets a day, with at least one replacing a meal.</p>
<p>The fibre shake beat the placebo shake on its primary outcome, a diabetes-distress score, and lowered HbA1c by 0.64 percentage points more than placebo. Two butyrate-producing bacterial species increased. For people with type 2 diabetes, that is a meaningful result.</p>
<p>What it does not show is just as important:</p>
<ul>
<li>It tested a meal-replacement shake, taken in place of a meal — not the GLP-1 powder, and not as an addition to a normal diet.</li>
<li>It enrolled people with type 2 diabetes, not the general buyer.</li>
<li>Its published abstract reports no GLP-1 measurement and no appetite outcome.</li>
<li>Four of its nine authors were Supergut employees, including its chief medical officer, alongside academic co-authors from Stanford and UCLA.</li>
</ul>
<p>Supergut’s product pages also cite a 2026 pilot and observational study run with Tiny Health, noting that some results are self-reported. We could not find it published.</p>` },
        { id: 'glp-1-appetite', title: 'A GLP-1 rise is not the same as eating less', html: `<p>A <a href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2026.1880500/full">2026 scoping review in <em>Frontiers in Endocrinology</em></a> pooled 52 studies with 1,085 participants. Only some fibre types raised GLP-1 consistently, and studies that did find a rise showed only a non-significant tendency towards feeling fuller. A higher reading on a blood test did not reliably translate into eating less.</p>` },
        { id: 'dose', title: 'The dose gap', html: `<p>The strongest human evidence that resistant starch helps with weight is <a href="https://www.nature.com/articles/s42255-024-00988-y">a 2024 randomised crossover trial in <em>Nature Metabolism</em></a>: 37 people with excess weight took 40 g a day of resistant starch from high-amylose maize for eight weeks and lost a mean of 2.8 kg against a control starch, with better insulin sensitivity. That is roughly seven times the total fibre in a scoop of GLP-1 Daily Support, and the scoop’s resistant starch is only part of that.</p>`, slot: 'chart' },
        { id: 'solnul', title: 'One ingredient has its own trial', html: `<p>Supergut’s blends include Solnul, a resistant potato starch. In <a href="https://pubmed.ncbi.nlm.nih.gov/37049425/">a 2023 randomised trial</a> run for the ingredient’s maker, 3.5 g a day for four weeks increased <em>Bifidobacterium</em> and <em>Akkermansia</em> and improved stool consistency against placebo. That is a genuine prebiotic effect at a low dose. It did not measure GLP-1, appetite or weight, and the amount of Solnul in Supergut’s products is not disclosed.</p>` },
        { id: 'fibre', title: 'Fibre itself is well supported', html: `<p>None of this makes fibre a bad idea. A <a href="https://pubmed.ncbi.nlm.nih.gov/30638909/">2019 series of meta-analyses in <em>The Lancet</em></a> found that people eating 25 to 29 g of fibre a day had lower rates of heart disease, stroke, type 2 diabetes and bowel cancer than those eating less. Guidance is similar around the world: the <a href="https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/">NHS recommends 30 g a day</a>, and US dietary guidelines advise about 14 g per 1,000 kcal, roughly 25 to 34 g for most adults, and most people eat well short of either. Adding fibre, from any source, is sound advice. What the evidence does not support is paying a premium for fibre sold as a GLP-1 product.</p>` },
      ],
    },
    {
      id: 'choose',
      number: '03',
      title: 'Choosing a product',
      summary: 'Our scored reviews of the range, and where to buy it.',
      topics: [
        {
          id: 'our-review',
          title: 'What we have reviewed',
          html: `<p>We score every product against the five published criteria on our <a href="/evidence-grading">evidence grading</a> page. We have reviewed four Supergut products in full — every product in the core range: the everyday fibre powder, the meal-replacement shakes, the snack bars and the GLP-1-branded powder.</p>`,
          slot: 'reviews',
        },
        { id: 'where-to-buy', title: 'Where to buy Supergut', html: `<p>Supergut is sold across the US — on its own store, Amazon.com and at retailers including Walmart, Target, GNC and Vitamin Shoppe. Outside the US, its help centre says it ships to most countries with some products restricted, and some local retailers stock part of the range — Healf in the UK, for example. If you are ordering from abroad, add international postage and any import charges to the dollar price before comparing it with fibre products sold where you live.</p>
<p>For most buyers, wherever they live, the cheaper and better-evidenced route to the same goal is food: oats, beans, lentils, slightly green bananas, and potatoes or rice cooked and cooled, which forms more resistant starch. If you want a powder, compare the price per gram of fibre with a plain fibre supplement such as psyllium — and if the low-FODMAP certification matters to you because of irritable bowel syndrome, that is a genuine reason to consider Supergut specifically.</p>` },
      ],
    },
    {
      id: 'use',
      number: '04',
      title: 'Using it well',
      summary: 'How to start, what to expect, who should be careful, and cheaper ways to the same fibre.',
      topics: [
        {
          id: 'starting',
          title: 'Starting slowly',
          html: `<p>Supergut’s own directions tell you to start with one scoop and build up, and that is sound advice for any fermentable fibre. Take one scoop a day, mixed into water or another drink, for the first week or two, and move to two only if your gut is comfortable. Drink plenty of fluid as you raise your fibre intake.</p><p>The directions on the GLP-1 Daily Support page disagree slightly — one section says one scoop, another says “just two scoops a day” — and the servings on the tub are counted at one scoop. At two a day, a 40-serving tub lasts 20 days.</p>`,
        },
        {
          id: 'side-effects',
          title: 'Side effects',
          html: `<p>Expect some wind and bloating in the first weeks while your gut bacteria adjust; it usually settles. GLP-1 Daily Support carries Monash University low-FODMAP certification, which makes it gentler than many fibre products for people with irritable bowel syndrome, who often react badly to fibres such as inulin.</p><p>If you have new or persistent gut symptoms — a change in bowel habit, pain, or blood — see your GP rather than adjusting a supplement.</p>`,
        },
        {
          id: 'medicines',
          title: 'Medicines and medical conditions',
          html: `<p>Fibre can slow or reduce the absorption of some medicines taken at the same time, so ask a pharmacist how to space it from anything you take regularly. The company’s trial lowered HbA1c in type 2 diabetes, so anyone on diabetes medicines should mention it to their prescriber before starting.</p><p>If you take a prescription GLP-1 medicine, which slows the stomach and often causes constipation, raising fibre gradually can help — but that is advice about fibre in general, and no substitute for the prescribing team’s advice.</p>`,
        },
        {
          id: 'what-to-expect',
          title: 'What to expect',
          html: `<p>Judge Supergut as fibre, over a few weeks: regularity, fullness after meals, how your gut feels. Do not expect the effects of a GLP-1 medicine, or much weight loss on its own — the resistant-starch trial that produced weight loss used 40 g a day, several times what a scoop contains.</p>`,
        },
        {
          id: 'alternatives',
          title: 'Cheaper routes to the same fibre',
          html: `<p>Most of what Supergut offers can be had from ordinary food: oats, beans, lentils, slightly green bananas, and potatoes, rice or pasta cooked and then cooled, which increases their resistant starch. Our guide to <a href="/learn/natural-glp-1-alternatives">natural GLP-1 alternatives</a> ranks the food-based options by evidence.</p><p>If you want a supplement, a plain fibre such as <a href="/fat-burners/now-psyllium-husk-powder">psyllium husk</a> has strong evidence for regularity and cholesterol at a fraction of the price per gram. The case for Supergut specifically is its low-FODMAP certification and the format — not a GLP-1 effect.</p>`,
        },
      ],
    },
  ],
  /** Short answers at the top of the guide, each pointing to the topic that expands on it. */
  quickAnswers: [
    { question: 'Is Supergut legit?', answer: 'Yes, as a company — it has a medical lead and a published randomised trial. The marketing is the weak point.', anchor: 'own-trial' },
    { question: 'Does it boost GLP-1?', answer: 'Fermentable fibre can raise GLP-1 a little, but its trial did not measure GLP-1, and a rise does not reliably mean eating less.', anchor: 'glp-1-appetite' },
    { question: 'Will it help me lose weight?', answer: 'Not much on its own. The weight trial used 40 g of resistant starch a day; a scoop has 6 g of fibre in total.', anchor: 'dose' },
    { question: 'Which product is the best value?', answer: 'Per gram of fibre, the Prebiotic Shakes, which also add 15 g of protein. Among the powders, Foundational Daily Fiber: the same 6 g a scoop as the GLP-1 version for about $10 less a tub, and it scores 5.4 against 3.8.', anchor: 'our-review' },
  ],
  /** The at-a-glance figures under the hero. `live` values are read from the review at render. */
  stats: [
    { value: 'live-score', reviewSlug: 'supergut-glp-1-booster-review', label: 'Our score for GLP-1 Daily Support', note: 'on five published criteria' },
    { value: '6 g', label: 'Fibre in a scoop of GLP-1 Daily Support', note: 'all four fibres combined' },
    { value: '−0.64', label: 'HbA1c points against placebo', note: 'company trial, type 2 diabetes' },
    { value: '40 g', label: 'Resistant starch a day in the weight trial', note: 'Nature Metabolism, 2024' },
  ],
  /** Closing verdict, shown after the four stages. */
  verdict: `<p>Supergut is more credible than most brands in the GLP-1 supplement aisle: it has a medical lead, a published randomised trial and products built on well-tolerated fibres. Its problem is the gap between that evidence and the name on the tub. The trial tested a meal-replacement shake in type 2 diabetes and measured blood sugar; the GLP-1 products are sold on appetite and GLP-1, at a fibre dose far below the weight research.</p>
<p>Judge the range as fibre, and it is reasonable. Judge it as a GLP-1 treatment, and the evidence does not yet support the claim. Our full review of <a href="/fat-burners/supergut-glp-1-booster-review">GLP-1 Daily Support</a> scores it accordingly.</p>`,
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
        'Both give 6 g of prebiotic fibre per scoop and share three of their four fibres; Foundational uses Sunfiber guar where GLP-1 Daily Support uses oat beta-glucan. GLP-1 Daily Support costs about $10 more per 40-serving tub. We have reviewed both in full: Foundational scores 5.4 and GLP-1 Daily Support 3.8.',
    },
    {
      question: 'Where can I buy Supergut?',
      answer:
        'In the US, on Supergut’s own store, Amazon.com and at retailers including Walmart, Target, GNC and Vitamin Shoppe. Elsewhere, Supergut says it ships to most countries with some products restricted, and some local retailers stock part of the range, such as Healf in the UK. Add postage and import charges when ordering from abroad.',
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
      note: 'Added our full review of the Prebiotic Shakes (5.2). Every product in the core range is now reviewed, so the unreviewed-range section is removed.',
    },
    {
      date: '2026-09-28',
      note: 'Added our full review of the Prebiotic Bars (4.6), which move from the unreviewed range to the reviewed products.',
    },
    {
      date: '2026-09-28',
      note: 'Made the buying notes global rather than UK-only: where Supergut is sold in the US, how it ships internationally, and local stockists.',
    },
    {
      date: '2026-09-28',
      note: 'Added our full review of Foundational Daily Fiber (5.4), which moves from the unreviewed range to the reviewed products.',
    },
    {
      date: '2026-09-28',
      note: 'Rebuilt as a four-stage guide — understanding, evidence, choosing, using — with quick answers, headline figures and a new section on using fibre well, and moved to /guides/supergut.',
    },
    {
      date: '2026-09-28',
      note: 'First published, bringing together our GLP-1 Daily Support review, the articles that cover Supergut, the company’s trial, the resistant-starch research and buying notes. Foundational Daily Fiber, the bars and the shakes are listed but not yet reviewed.',
    },
  ] satisfies HistoryEntry[],
};
