import type { Collection } from '../types';

/*
 * Prunes every day for a week. Written for readers anywhere. Nutrition figures
 * are USDA FoodData Central values for uncooked prunes and must match the
 * chart; the glycaemic figures come from lib/fruit-gi.ts via the fruit and
 * diabetes guide. The lead image is an illustration, not a photograph.
 */
export const prunesForAWeek: Collection = {
  id: 'prunes-for-a-week',
  kind: 'articles',
  slug: 'eating-prunes-every-day-for-a-week',
  topic: 'food',
  title: 'What happens if you eat prunes every day for a week?',
  seo_title: 'Prunes Every Day for a Week: What Changes, How Many to Eat',
  seo_desc:
    'Prunes daily for 7 days: softer, more regular bowels (they beat psyllium in a trial), early wind, more vitamin K. How many to eat, and who should be careful.',
  summary:
    'The change almost everyone notices is in their bowels: prunes combine fibre with sorbitol, and in trials they increased stool output and beat psyllium for mild constipation. Expect softer, more frequent stools within days, some wind at first, and a useful dose of vitamin K and potassium. Five a day is a good start; the bone benefits people read about took a year.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-29T00:00:00Z',
  updated_at: '2026-09-29T00:00:00Z',
  figure: {
    src: '/images/illustration-prunes.jpg',
    alt: 'Illustration of five dark, glossy prunes on a cream plate.',
    caption:
      'Five prunes — about 50 g, the daily amount in the year-long bone study. SharpAndLean illustration.',
  },
  takeaways: [
    'Prunes are one of the few foods with trial evidence for constipation: they increased stool output against water and beat psyllium for mild constipation.',
    'Five prunes (about 50 g) give about 120 kcal, 3.6 g of fibre, a tenth of a day’s potassium and around 40 per cent of a day’s vitamin K.',
    'Expect softer, more frequent stools within a few days, often with wind at first. Build up gradually; more is not always better.',
    'Bone density will not change in a week: the prune bone study ran for 12 months. People on warfarin should keep their prune intake steady because of the vitamin K.',
  ],
  body: `
<h2>The short answer</h2>
<p>Eat prunes every day for a week and the change you will notice is in your bowels. Prunes pair fibre with <strong>sorbitol</strong>, a natural sugar alcohol that draws water into the gut, and they are one of the few foods tested in trials for constipation. For most people, a daily handful means <strong>softer, more frequent stools within a few days</strong> — often with some wind while the gut adjusts.</p>
<p>You also get a useful dose of vitamin K and potassium, in a sweet snack with a low glycaemic index. What a week will not do is change your bone density, cholesterol or weight; the bone results that made prunes newsworthy came from a year-long study.</p>
<p>We assume <strong>five prunes a day, about 50 g</strong>. That is the amount in the bone study, and a sensible starting point. The constipation trials used more — 80 to 100 g, or roughly 8 to 10 prunes — and we say below when it is worth going that high.</p>

<h2>What five prunes a day give you</h2>
<figure>
<img src="/images/prunes-a-day-nutrition.jpg" alt="Bar chart of what five prunes (about 50 g) add as a share of a typical adult daily reference: vitamin K 40 per cent (about 30 of 75 micrograms), fibre 12 per cent (about 3.6 of 30 g), potassium 10 per cent (about 370 of 3,500 mg) and calories 6 per cent (120 of 2,000 kcal). A note says the 19 g of sugar comes with sorbitol, concentrated by drying." width="2400" height="1440">
<figcaption>SharpAndLean chart from USDA FoodData Central values for uncooked prunes. References are typical adult figures.</figcaption>
</figure>
<p>Per 100 g, uncooked prunes have about 240 kcal, 64 g of carbohydrate (38 g of it sugars), 7.1 g of fibre, 732 mg of potassium and 60 micrograms of vitamin K, according to USDA FoodData Central. A pitted prune weighs about 10 g, so five prunes give roughly half those amounts.</p>
<p>Two things set prunes apart from fresh fruit. Drying concentrates everything, so a small handful carries as much sugar as a large apple — portions matter more. And prunes are high in <strong>sorbitol</strong>, which the gut absorbs poorly, so it pulls water into the bowel. That, together with the fibre, is why prunes work for constipation in a way most fruits do not.</p>

<h2>Day by day: what to expect</h2>
<table>
<thead><tr><th>When</th><th>What is likely</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Days 1–2</td><td>A sweet snack that fills a gap, and for some people an early change in bowel habit.</td><td>Sorbitol starts drawing water into the bowel from the first day.</td></tr>
<tr><td>Days 2–4</td><td>Softer, more frequent stools. More wind and, for some, bloating or cramps.</td><td>Sorbitol plus fermentation of the new fibre by gut bacteria.</td></tr>
<tr><td>Days 5–7</td><td>Bowels usually settle into a more regular pattern; wind eases.</td><td>Your gut adapts to a steady intake.</td></tr>
<tr><td>Months, not days</td><td>Possibly better-preserved bone density in postmenopausal women.</td><td>Found after 12 months of 50 g a day.</td></tr>
</tbody>
</table>
<p>If your stools become loose, cut back. Five prunes suit most people; eight to ten are a dose for constipation, not a daily target for everyone.</p>

<h2>The 7 changes, and what the research shows</h2>
<h3>1. You are likely to become more regular — this is the one with trial evidence</h3>
<p>In a <a href="https://pubmed.ncbi.nlm.nih.gov/29398337/">2019 randomised trial at King’s College London</a>, 120 healthy adults who ate little fibre were given 80 g of prunes a day, 120 g a day, or water alone for four weeks. Stool weight rose in both prune groups compared with water — by about 22 g a day at 80 g, and 33 g a day at 120 g — and people went a little more often.</p>
<p>In people who were already constipated, a <a href="https://pubmed.ncbi.nlm.nih.gov/21323688/">2011 crossover trial</a> gave 40 adults 50 g of prunes twice a day or psyllium husk with the same amount of fibre, for three weeks each. Prunes improved the number of complete, unassisted bowel movements and stool consistency more than psyllium did. A <a href="https://onlinelibrary.wiley.com/doi/10.1111/apt.17782">2023 review of foods for chronic constipation</a> lists prunes among the few foods with trial evidence, alongside kiwifruit and psyllium.</p>

<h3>2. Wind and bloating, especially at first</h3>
<p>The same sorbitol and fibre are fermented by gut bacteria, producing gas. <a href="https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/">Monash University’s FODMAP testing</a> rates prunes as high in sorbitol. For most people the wind eases within the week. Starting with two or three prunes a day and building up makes it gentler.</p>

<h3>3. More fibre, from a small handful</h3>
<p>Five prunes add about 3.6 g of fibre; eight to ten add 6 to 7 g. That is less than two pears, but prunes deliver it in a small, portable portion that keeps for months. Guidance around the world asks adults for 25 to 30 g or more a day, and most fall short.</p>

<h3>4. A big dose of vitamin K and useful potassium</h3>
<p>Five prunes give about 30 micrograms of vitamin K — around 40 per cent of the EU and UK reference intake — and about 370 mg of potassium, a tenth of a day’s reference. Vitamin K helps blood clot and plays a part in bone health; potassium helps control blood pressure. That vitamin K matters if you take warfarin: see who should be careful, below.</p>

<h3>5. A sweet snack with a low glycaemic index</h3>
<p>Prunes have a glycaemic index of about 29, which is low, and five prunes have a glycaemic load of about 8 — also low. Swapping a biscuit or sweets for prunes gives a slower rise in blood sugar. People with diabetes can include prunes, counting five as about 30 g of carbohydrate; our <a href="/learn/fruit-and-diabetes-glycaemic-index">fruit and diabetes guide</a> compares them with other fruits.</p>

<h3>6. One of your 5 A Day</h3>
<p>The NHS counts 30 g of dried fruit — about three prunes — as one portion of your <a href="https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/">5 A Day</a>, and advises eating dried fruit at mealtimes rather than as a snack between meals, because its sticky sugars can harm teeth.</p>

<h3>7. The scales should not move much</h3>
<p>Five prunes are about 120 kcal. If they replace another snack, your weight should not change; if they are added on top, it is a small daily surplus. In a week, any change on the scales will mostly be water and what is passing through your gut. Dried fruit is easy to overeat, so count them out rather than eating from the bag.</p>

<h2>What won’t change in a week</h2>
<ul>
<li><strong>Bone density.</strong> In the <a href="https://www.sciencedirect.com/science/article/pii/S0002916523036092">Prune Study</a>, 235 postmenopausal women ate 50 g of prunes a day, 100 g a day, or none, for 12 months. Hip bone density fell much less with 50 g than without prunes (−0.27 per cent against −1.1 per cent). The 100 g group did not show the same benefit, and 41 per cent of its participants dropped out. Promising, but it took a year, in one group of women.</li>
<li><strong>Cholesterol and blood pressure.</strong> Fibre and potassium help over weeks to months, not days.</li>
<li><strong>“Detox”.</strong> Prunes help your bowels move; they do not clean your body of toxins, which your liver and kidneys handle.</li>
</ul>

<h2>How to get the most from it</h2>
<ul>
<li><strong>Start with five, and build up if you need to.</strong> For constipation, the trials used 80 to 100 g a day — about 8 to 10 prunes, split into two servings.</li>
<li><strong>Drink water.</strong> Fibre works best with enough fluid; the King’s College trial added 300 ml of water a day to the prune groups.</li>
<li><strong>Eat them with meals.</strong> That is the NHS advice for dried fruit, to protect your teeth.</li>
<li><strong>Whole prunes over prune juice.</strong> Prune juice keeps the sorbitol, so it still helps constipation, but loses most of the fibre and its sugars count as free sugars.</li>
<li><strong>Choose prunes without added sugar or syrup,</strong> and check the label for sulphites if you are sensitive to them.</li>
<li><strong>Mix them in.</strong> Chopped into porridge or yoghurt, or eaten with a handful of nuts, prunes make a more filling snack.</li>
</ul>

<h2>Who should be careful</h2>
<ul>
<li><strong>People taking warfarin.</strong> Warfarin works against vitamin K. You do not have to avoid prunes, but keep your intake of vitamin K–rich foods steady from week to week, and tell your anticoagulation clinic before making a big change.</li>
<li><strong>People with IBS or a sensitive gut.</strong> Prunes are high in sorbitol and a common trigger for wind, bloating and loose stools.</li>
<li><strong>Anyone who already has loose stools or diarrhoea.</strong> Prunes will make it worse.</li>
<li><strong>People with kidney disease on a low-potassium diet.</strong> Prunes are relatively high in potassium; check portions with your dietitian.</li>
<li><strong>People with diabetes.</strong> Prunes are fine in portions — count five as about 30 g of carbohydrate.</li>
<li><strong>Constipation that is new, severe or comes with bleeding, weight loss or pain.</strong> See a doctor rather than treating it yourself.</li>
</ul>

<h2>The bottom line</h2>
<p>A week of prunes is one of the most reliable food-based ways to get your bowels moving, backed by trials that most fruits do not have. Start with five a day, drink water, expect some wind, and go up to eight to ten only if you need to. The bone and heart benefits people hope for take months, not days.</p>
<p>For other fruits, see what happens when you eat <a href="/learn/eating-apples-every-day-for-a-week">two apples</a> or <a href="/learn/eating-pears-every-day-for-a-week">two pears</a> a day for a week.</p>
`,
  faqs: [
    {
      question: 'How many prunes should I eat a day?',
      answer:
        'About five (roughly 50 g) is a sensible daily amount; it was the dose in the year-long bone study. For constipation, trials used 80 to 100 g a day — about 8 to 10 prunes, split into two servings. Start low and build up to limit wind.',
    },
    {
      question: 'How long do prunes take to work for constipation?',
      answer:
        'Many people notice softer, more frequent stools within one to three days. In trials, the effects were measured over three to four weeks of daily prunes. Drink enough water alongside.',
    },
    {
      question: 'Are prunes better than psyllium for constipation?',
      answer:
        'In a 2011 trial of 40 adults with mild to moderate constipation, 50 g of prunes twice a day improved complete bowel movements and stool consistency more than psyllium with the same amount of fibre. Both are reasonable options; prunes also bring sorbitol, which psyllium does not.',
    },
    {
      question: 'Is prune juice as good as prunes?',
      answer:
        'For constipation it still helps, because it keeps the sorbitol, but it loses most of the fibre, and its sugars count as free sugars. Whole prunes are the better everyday choice.',
    },
    {
      question: 'Are prunes good for your bones?',
      answer:
        'Possibly. In a 12-month trial of 235 postmenopausal women, 50 g of prunes a day slowed the loss of hip bone density compared with no prunes. A week will not change bone density, and more research is needed in other groups.',
    },
    {
      question: 'Can people with diabetes eat prunes?',
      answer:
        'Yes, in portions. Prunes have a low glycaemic index of about 29, and five prunes have a low glycaemic load of about 8. Count five as about 30 g of carbohydrate and eat them with a meal.',
    },
    {
      question: 'Can I eat prunes if I take warfarin?',
      answer:
        'Yes, but keep your intake steady. Prunes are rich in vitamin K, which works against warfarin. Sudden big changes in how much vitamin K you eat can affect your INR, so talk to your anticoagulation clinic before starting a daily habit.',
    },
  ],
  references: [
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central. Plums, dried (prunes), uncooked — per 100 g: 240 kcal, 63.9 g carbohydrate, 38.1 g sugars, 7.1 g fibre, 732 mg potassium, 59.5 µg vitamin K.',
      url: 'https://fdc.nal.usda.gov/',
    },
    {
      id: 'lever-2019',
      text: 'Lever E et al. (2019). The effect of prunes on stool output, gut transit time and gastrointestinal microbiota: a randomised controlled trial. Clinical Nutrition 38(1):165-173.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29398337/',
    },
    {
      id: 'attaluri-2011',
      text: 'Attaluri A et al. (2011). Randomised clinical trial: dried plums (prunes) vs. psyllium for constipation. Alimentary Pharmacology & Therapeutics 33:822-828.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21323688/',
    },
    {
      id: 'constipation-2023',
      text: 'van der Schoot A et al. (2023). Systematic review and meta-analysis: foods, drinks and diets and their effect on chronic constipation in adults. Alimentary Pharmacology & Therapeutics.',
      url: 'https://onlinelibrary.wiley.com/doi/10.1111/apt.17782',
    },
    {
      id: 'desouza-2022',
      text: 'De Souza MJ et al. (2022). Prunes preserve hip bone mineral density in a 12-month randomized controlled trial in postmenopausal women: the Prune Study. American Journal of Clinical Nutrition.',
      url: 'https://www.sciencedirect.com/science/article/pii/S0002916523036092',
    },
    {
      id: 'monash-fodmap',
      text: 'Monash University. High and low FODMAP foods — prunes are high in sorbitol.',
      url: 'https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/',
    },
    {
      id: 'nhs-5-a-day',
      text: 'NHS. 5 A Day portion sizes — 30 g of dried fruit is one portion; eat dried fruit at mealtimes to protect teeth.',
      url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/',
    },
  ],
  history: [
    {
      date: '2026-09-29',
      note: 'First published, with an illustration and a chart of what five prunes a day add. Nutrition figures from USDA FoodData Central; evidence from the trials listed. Not yet reviewed by a clinician.',
    },
  ],
};
