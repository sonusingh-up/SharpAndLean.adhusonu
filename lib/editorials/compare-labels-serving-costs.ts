import type { Collection } from '../types';

/*
 * The calculator on this page runs on lib/serving-cost.ts, and
 * tests/serving-cost.test.ts pins the worked example quoted below (61p a
 * serving, £2.52 per 100 g of protein). Change one and change the other.
 *
 * Every product figure here comes from one of our full reviews; each is linked
 * where it is used, so the numbers can be checked against their sources.
 */
export const compareLabelsServingCosts: Collection = {
  id: 'label-comparison',
  kind: 'comparisons',
  slug: 'compare-labels-and-serving-costs',
  title: 'How to compare supplements: doses, labels and the real cost per serving',
  seo_title: 'How to Compare Supplements by Dose and Cost per Serving',
  seo_desc:
    'The price on the tub misleads. Compare supplements by cost per serving, per 100 g of protein or per day — with a free calculator and worked UK examples.',
  summary:
    'The price on the tub is the least useful number on it. Two products can hold the same ingredient at the same dose and differ threefold in what you actually pay for it — or look cheaper only because the serving is bigger, the powder is weaker or the pack is smaller. Here is how to read the four numbers that matter, pick the right unit for each kind of supplement, and compare two listings in a minute.',
  is_published: true,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-20T00:00:00Z',
  updated_at: '2026-09-28T00:00:00Z',
  figure: {
    src: '/images/label-cost-per-serving.jpg',
    alt: 'Diagram of a nutrition label with four numbered figures — serving size 30 g, servings per pack 33, protein per serving 24 g, and a delivered price of £19.99 — and two sums: £19.99 divided by 33 servings is 61p a serving, and 61p divided by 24 g, times 100, is £2.52 per 100 g of protein.',
    caption:
      'SharpAndLean diagram. Worked example: Myprotein Impact Vegan Protein, 1 kg on offer, from our full review.',
  },
  takeaways: [
    'Four numbers decide value: serving size, servings per pack, the amount of the active ingredient per serving, and the delivered price.',
    'Compare in the unit that matches the job: per 100 g of protein for protein powders, per 1,000 kcal for gainers, per day at the labelled dose for vitamins.',
    'Among the protein powders we have reviewed, the same 24 g scoop ranges from about £2.16 to £6.94 per 100 g of protein — roughly threefold.',
    'Match the form and dose before the price, and keep evidence and testing as separate questions: cheaper per gram says nothing about whether it works.',
  ],
  body: `
<h2>Why the price on the tub misleads</h2>
<p>A supplement’s shelf price tells you what one container costs. It does not tell you how many days it lasts, how much of the ingredient you are getting, or whether the pack next to it is a better deal. Every one of those questions needs a different number from the label — and sometimes the label itself is the problem.</p>
<p>Some examples from products we have reviewed in full:</p>
<ul>
<li><strong>A serving bigger than the evidence needs.</strong> <a href="/wellness/bulk-creatine-monohydrate-review">Bulk Creatine Monohydrate</a> lists its 500 g pouch as 100 servings — a 5 g scoop. The research and the label’s own claim are built on 3 g of creatine a day, about 3.4 g of powder. Use that, and the same pouch lasts about 147 days, not 100.</li>
<li><strong>Two different daily doses for one product.</strong> Listings for <a href="/wellness/myprotein-alpha-men-review">Myprotein Alpha Men</a> disagree on whether to take two tablets a day or four. The first costs roughly 13p to 20p a day; the second doubles it.</li>
<li><strong>A bigger pack that costs more per kilo.</strong> The 5 kg listing we found for <a href="/wellness/myprotein-impact-weight-gainer-review">Myprotein Impact Weight Gainer</a> was £104.49 — more than twice the price of the 2.5 kg for twice the powder.</li>
<li><strong>A small pack on a high-street shelf.</strong> <a href="/wellness/myprotein-impact-creatine-review">Myprotein Impact Creatine</a> cost £5.33 to £8.00 per 100 g in 150 g and 170 g supermarket and pharmacy tubs, against about £2.60 to £3.50 per 100 g for the 1 kg pack of the same powder.</li>
</ul>
<p>None of these is visible from the price tag. All of them come out of a few minutes with the label and a calculator.</p>

<h2>The four numbers to find on every label</h2>
<p>Before comparing anything, write down four figures for each product. The diagram at the top of this page shows where they sit.</p>
<table>
<thead><tr><th>Number</th><th>Where to find it</th><th>What to check</th></tr></thead>
<tbody>
<tr><td>1. Serving size</td><td>Top of the nutrition panel, e.g. “per 30 g (1 scoop)” or “per 2 capsules”</td><td>Whether it matches the dose you will actually take, and the directions elsewhere on the pack</td></tr>
<tr><td>2. Servings per pack</td><td>Near the net weight, or worked out as pack weight ÷ serving size</td><td>That the two agree — if they do not, the label is inconsistent</td></tr>
<tr><td>3. Active ingredient per serving</td><td>The nutrition panel row for the ingredient you are buying</td><td>The form and unit (g, mg, µg, kcal) and whether it is the ingredient itself or a compound of it</td></tr>
<tr><td>4. Delivered price</td><td>The checkout, not the product page</td><td>Offers, postage, subscription terms and whether the offer ends soon</td></tr>
</tbody>
</table>
<p>The second row is a quick honesty check. Our <a href="/wellness/optimum-nutrition-micronised-creatine-review">Optimum Nutrition creatine review</a> found the brand’s own page describing one serving three ways: a 3.6 g serving on the panel, 3.4 g once you divide the pack by its servings, and “3g of creatine monohydrate” in the headline. When the numbers do not agree with each other, trust the arithmetic and treat the rest with caution.</p>

<h2>Choose the right unit for the product</h2>
<p>Cost per serving is only a fair comparison when two servings contain the same amount of the same thing. Usually they do not, so convert to a unit that reflects what you are actually buying.</p>
<table>
<thead><tr><th>Product</th><th>Compare by</th><th>The sum</th></tr></thead>
<tbody>
<tr><td>Protein powder</td><td>Cost per 100 g of protein</td><td>Price ÷ (servings × protein per serving) × 100</td></tr>
<tr><td>Creatine (unflavoured)</td><td>Cost per 100 g, or per 3 g day</td><td>Price ÷ pack weight in grams × 100</td></tr>
<tr><td>Weight gainer</td><td>Cost per 1,000 kcal</td><td>Price ÷ (servings × kcal per serving) × 1,000</td></tr>
<tr><td>Multivitamin</td><td>Cost per day at the labelled dose</td><td>Price ÷ days the pack lasts</td></tr>
<tr><td>Single vitamin, e.g. vitamin D</td><td>Cost per day at the dose you need</td><td>Price ÷ days, after checking the strength matches</td></tr>
<tr><td>Caffeine drinks and pre-workouts</td><td>Cost per 100 mg of caffeine</td><td>Price ÷ (servings × mg per serving) × 100</td></tr>
</tbody>
</table>
<p>The reason is density. A protein powder can be 80 per cent protein or 69 per cent — our <a href="/wellness/bulk-vegan-protein-powder-review">Bulk Vegan Protein review</a> found the latter — so a price per kilo of powder flatters the weaker one. A weight gainer’s job is calories, so 1,000 kcal is the honest unit; our <a href="/wellness/optimum-nutrition-serious-mass-review">Serious Mass review</a> priced it at about £3.30 to £5.00 per 1,000 kcal against roughly £1.30 for a home-made shake.</p>

<h2>Compare two listings</h2>
<p>Enter the four numbers for any two products. The calculator opens on the comparison from our vegan protein reviews; change the unit for creatine, caffeine, vitamins or gainers.</p>
<div data-tool="serving-cost-calculator"></div>
<p>Two tips. If a pack gives only its weight, divide it by the serving size to get the servings. And if two products use different forms of an ingredient — creatine monohydrate against creatine HCl, say — the calculator will give you a number, but it will not be a like-for-like comparison. The next sections cover how to spot that.</p>

<h2>Worked example: six protein powders</h2>
<p>Every protein powder below gives 23 to 24 g of protein a scoop. On the price per 100 g of protein, the cheapest costs about a third of the dearest.</p>
<figure><img src="/images/protein-cost-per-100g.jpg" width="2400" height="1440" alt="Range chart of cost per 100 g of protein for six powders, from lowest offer to full price in UK listings in September 2026: Myprotein Impact Vegan £2.16 to £3.16; Bulk Vegan Protein about £2.26, our estimate for the 5 kg bag; Myprotein Slow-Release Casein £2.56 to £5.48; Optimum Nutrition Gold Standard Casein £4.26 to £5.80; Gold Standard 100% Plant £4.36 to £5.56; Gold Standard 100% Whey £5.55 to £6.94."/><figcaption>SharpAndLean chart. Figures from our full reviews of each product; the Bulk figure assumes the tracker’s price is per 100 g of powder.</figcaption></figure>
<p>Two things stand out. The first is how wide some ranges are: <a href="/wellness/myprotein-slow-release-casein-review">Myprotein Slow-Release Casein</a> runs from £2.56 on offer to £5.48 at full price, so for that brand, <em>when</em> you buy matters as much as <em>what</em>. The second is that the brand premium is real but not fixed. <a href="/wellness/optimum-nutrition-gold-standard-plant-protein-review">Gold Standard 100% Plant</a> and <a href="/wellness/myprotein-impact-vegan-protein-review">Myprotein Impact Vegan</a> give the same 24 g of plant protein a scoop; on our figures, one costs roughly twice as much per gram as the other. Our <a href="/compare/optimum-nutrition-vs-myprotein-impact-whey">Gold Standard against Impact Whey comparison</a> works through the same question for whey.</p>
<p>What the chart does not show is that the research supporting all six is about total daily protein, not about any brand. If the cheaper powder suits your diet and stomach, it does the same job.</p>

<h2>Worked example: a day of multivitamin</h2>
<p>For vitamins, the fair unit is a day at the labelled dose, because the tablets are designed to be taken as a set. Across the four multivitamins we have reviewed, that ranges more than tenfold.</p>
<figure><img src="/images/multivitamin-cost-per-day.jpg" width="2400" height="1440" alt="Range chart of the daily cost of four multivitamins at the dose on the pack, UK listings September 2026: Tesco A–Z Multivitamins 5.5p; Myprotein Alpha Men 13 to 20p at two tablets a day; Vitabiotics Wellman Original 14 to 23p; Optimum Nutrition Opti-Men 50 to 67p at three tablets a day."/><figcaption>SharpAndLean chart. Figures from our full reviews of each product.</figcaption></figure>
<p>At about 5.5p a day, <a href="/wellness/tesco-a-z-multivitamins-minerals-review">Tesco A–Z</a> costs roughly a tenth of <a href="/wellness/optimum-nutrition-opti-men-review">Opti-Men</a> at 50p to 67p. The dearer products add more ingredients, larger doses or botanical extras, but our reviews found no good evidence that those extras help someone who already eats reasonably. For most adults in the UK, the one supplement worth taking is vitamin D in autumn and winter — and a plain 10 µg tablet costs a few pence a day. Our guide to <a href="/learn/which-vitamins-should-you-take-daily">which vitamins to take daily</a> sets out the exceptions.</p>

<h2>Match the formula before you compare the price</h2>
<p>A price comparison is only meaningful between products that deliver the same thing. Check these before you trust a cheaper number.</p>
<h3>The form of the ingredient</h3>
<p>Creatine monohydrate is the form used in the research; newer forms such as creatine HCl cost more and have far less evidence behind them. Pea, rice, soya and whey are all complete enough proteins when total intake is adequate, but a fava bean blend is a caution for people with G6PD deficiency, and a soya blend for people with a soya allergy.</p>
<h3>The ingredient, or a compound of it</h3>
<p>Some ingredients carry bound molecules that add weight. Creatine monohydrate is about 12 per cent water, so 3.4 g of it provides 3 g of creatine. Minerals are the bigger trap: “500 mg magnesium citrate” is the weight of the compound, and gives far less magnesium itself. UK nutrition panels state the amount of the vitamin or mineral, so compare the panel figures, not the headline on the front.</p>
<h3>The unit</h3>
<p>Vitamin D is sold in both micrograms and international units: 1 µg is 40 IU, so the NHS’s recommended 10 µg is 400 IU and a 1,000 IU tablet is 25 µg. Convert before comparing, or you will think one product is 40 times stronger than another. Our <a href="/ingredients/vitamin-d3">vitamin D3 page</a> covers how much you need.</p>
<h3>The market</h3>
<p>The same product name can hide different formulas in different countries. Our <a href="/wellness/optimum-nutrition-opti-men-review">Opti-Men review</a> found the American version — 10,000 IU of vitamin A and 75 mg of thiamin — widely copied onto UK retail pages that sell the lower-dose European tub. Read the panel on the pack you are buying, not a retailer’s transcription.</p>
<h3>The flavour</h3>
<p>Flavoured powders carry cocoa, flavouring and sweetener, so the same tub weight holds less of the active ingredient, and servings per pack often change with the flavour. Compare the figures for the flavour in your basket.</p>

<h2>Label traps that break a comparison</h2>
<ul>
<li><strong>Proprietary blends.</strong> A “5 g amino blend” tells you the total, not how much of each ingredient. Our <a href="/nootropics/optimum-nutrition-amino-energy-review">Amino Energy review</a> could confirm only the 2 g of BCAAs inside it. You cannot compare what is not disclosed.</li>
<li><strong>Extract ratios.</strong> “Ginkgo extract 50:1” describes how concentrated the extract is, not how much of it is in the tablet. A long list of ratios usually means small amounts of each.</li>
<li><strong>“Up to”.</strong> A protein figure of “up to 27 g” is the best flavour, not yours. Our Bulk Vegan Protein review found the same product described as up to 27 g, 24.2 g and 23 g per serving in different places.</li>
<li><strong>Servings that do not add up.</strong> If pack weight ÷ serving size does not match the servings printed on the pack, one of the numbers is wrong.</li>
</ul>
<p>Our guide to <a href="/guides/what-a-supplement-label-hides">what a supplement label hides</a> covers these in more depth.</p>

<h2>More is not better: check %NRV and the upper limits</h2>
<p>The %NRV column shows each vitamin or mineral as a percentage of its nutrient reference value — roughly, the amount most healthy adults need a day. It is a reference, not a target to beat. A tablet with 800 per cent of the NRV of a B vitamin is not eight times as useful; above what you need, it is mostly excreted.</p>
<p>For some nutrients, more can do harm. The <a href="https://www.nhs.uk/conditions/vitamins-and-minerals/">NHS</a> advises not taking more than 10 mg of vitamin B6 a day from supplements unless a doctor advises it, and gives limits for zinc, vitamin A, iron and others. Our <a href="/wellness/vitabiotics-wellman-original-review">Wellman Original review</a> found 9 mg of B6 in a single tablet — within the limit on its own, but easy to exceed with a pre-workout on top. When you compare two multivitamins, a higher percentage is not a point in its favour.</p>

<h2>Keep evidence and testing separate from price</h2>
<p>A lower cost per serving says nothing about whether an ingredient works. Decide that first, from the research on the ingredient at the dose on the label; then compare prices among the products that pass. Our <a href="/evidence-grading">evidence grading</a> explains how we score both.</p>
<p>Testing claims deserve the same care, especially if you compete under anti-doping rules. Three quite different claims turn up on UK labels:</p>
<ul>
<li><strong>A registered manufacturing site</strong> — the factory has been inspected. Optimum Nutrition says this of its Middlesbrough site, where it says its powders are made.</li>
<li><strong>Informed Choice</strong> — the product is tested through regular sampling. <a href="/wellness/myprotein-impact-creatine-review">Myprotein Impact Creatine</a> is listed with this.</li>
<li><strong>Informed Sport</strong> — every batch is tested before release, and you can look up your batch number. Optimum Nutrition names <a href="/wellness/optimum-nutrition-gold-standard-plant-protein-review">Gold Standard 100% Plant</a> among the few products it says are registered.</li>
</ul>
<p>For a drug-tested athlete, only the last is enough, and a cheaper product without it is not a like-for-like saving.</p>

<h2>Offers, pack sizes and timing</h2>
<p>For sports nutrition in particular, when you buy can matter more than which brand. Site-wide offers of 25 per cent or more are common, which is why our reviews quote a range from the lowest offer to full price. A few habits help:</p>
<ul>
<li>Compare the price per unit on the day, including postage, rather than remembering a price from last month.</li>
<li>Check larger packs are actually cheaper per gram — usually they are, but not always.</li>
<li>Only buy a size you will finish before its best-before date; at 3 g of creatine a day, a 1 kg pack lasts about ten months.</li>
<li>Be wary of listings far below the going rate, which can be short-dated or past their best-before date.</li>
<li>Read subscription terms before accepting a subscribe-and-save price.</li>
</ul>

<h2>A two-minute checklist</h2>
<ol>
<li>Decide what the product is for, and whether the ingredient has good evidence at the dose on the label.</li>
<li>Find the four numbers for each product: serving size, servings per pack, active amount per serving, delivered price.</li>
<li>Check the servings add up, and that the form, unit, market and flavour match.</li>
<li>Choose the right unit — per 100 g of protein, per 1,000 kcal, per day — and run the sum or the calculator above.</li>
<li>Check %NRV and upper limits, especially if you take anything else.</li>
<li>If you are drug-tested, keep only products with batch testing.</li>
<li>Buy the cheapest that is left, on offer, in a size you will finish.</li>
</ol>
<p>If you are narrowing down a whole category rather than comparing two products, our guide to <a href="/best/build-a-supplement-shortlist">building a supplement shortlist</a> applies the same method at the start of the search.</p>
`,
  faqs: [
    {
      question: 'How do I work out the cost per serving of a supplement?',
      answer:
        'Divide the delivered price by the number of servings in the pack. If the pack gives only its weight, divide the weight by the serving size first. A £19.99 pouch with 33 servings costs about 61p a serving. Then divide by the amount of the active ingredient to compare products fairly.',
    },
    {
      question: 'Is price per 100 g of powder the same as price per 100 g of protein?',
      answer:
        'No. Protein powders range from about 69 to 80 per cent protein, so a price per 100 g of powder flatters the weaker one. Work out the price per 100 g of protein instead: price ÷ (servings × protein per serving) × 100.',
    },
    {
      question: 'Are bigger tubs always cheaper?',
      answer:
        'Usually, but not always. In our reviews, a 5 kg weight gainer listing cost more than twice the 2.5 kg for twice the powder, and small supermarket creatine tubs cost over twice as much per gram as a 1 kg pack. Check the price per unit rather than assuming.',
    },
    {
      question: 'What does %NRV mean on a supplement label?',
      answer:
        'It shows each vitamin or mineral as a percentage of its nutrient reference value, roughly the daily amount most healthy adults need. It is a reference, not a target: more than 100 per cent is not more useful, and for some nutrients, such as vitamin B6, the NHS advises limits on how much to take from supplements.',
    },
    {
      question: 'How do I convert IU to micrograms for vitamin D?',
      answer:
        'Divide the IU by 40. So 400 IU is 10 µg, the amount the NHS advises in autumn and winter, and 1,000 IU is 25 µg. Convert both products to the same unit before comparing their price per day.',
    },
    {
      question: 'Does a cheaper supplement work as well as an expensive one?',
      answer:
        'If it contains the same ingredient, in the same form and at the same dose, it will do the same job — the research is about the ingredient, not the brand. Price differences usually reflect brand, flavour, pack size and testing rather than effectiveness. Testing matters if you are drug-tested.',
    },
    {
      question: 'What is a proprietary blend?',
      answer:
        'A group of ingredients listed with one total weight and no individual amounts. It makes a product impossible to compare fairly, because you cannot tell whether any ingredient is present at a dose that has been studied.',
    },
  ],
  references: [
    {
      id: 'nhs-vitamins-minerals-cmp',
      text: 'NHS. Vitamins and minerals — guidance on how much of each nutrient from supplements is unlikely to cause harm, including vitamin B6.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/',
    },
    {
      id: 'nhs-vitamin-d-cmp',
      text: 'NHS. Vitamin D — the advice to consider 10 µg a day in autumn and winter.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/',
    },
    {
      id: 'fic-regulation-cmp',
      text: 'Regulation (EU) No 1169/2011 on the provision of food information to consumers, as retained in Great Britain — the rules for nutrition declarations and reference intakes.',
      url: 'https://www.legislation.gov.uk/eur/2011/1169/contents',
    },
    {
      id: 'gb-nhc-register-cmp',
      text: 'Great Britain nutrition and health claims register — the authorised claims and their conditions of use.',
      url: 'https://www.gov.uk/government/publications/great-britain-nutrition-and-health-claims-nhc-register',
    },
    {
      id: 'on-informed-sport-cmp',
      text: 'Optimum Nutrition customer service. Which products are Informed Sport registered, and the distinction between a registered site and product-level certification.',
      url: 'https://service.optimumnutrition.com/en/support/solutions/articles/80000542976-are-you-products-informed-sport-tested-',
    },
  ],
  history: [
    {
      date: '2026-09-28',
      note: 'Rewritten and expanded: the four label numbers, the right unit for each kind of supplement, a two-listing cost calculator, worked examples with charts from our full reviews of protein powders and multivitamins, and sections on ingredient forms, units, label traps, upper limits and testing claims.',
    },
    {
      date: '2026-09-20',
      note: 'First published as a short method note.',
    },
  ],
};
