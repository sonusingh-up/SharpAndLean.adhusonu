import type { Collection } from '../types';

/*
 * Are raisins good for diabetes? The portion angle: dried fruit concentrates
 * the sugar, so the question is how much, not whether. Written for readers
 * anywhere. Nutrition figures are USDA FoodData Central values for seedless
 * raisins and raw grapes and must match the chart; the raisin row in
 * lib/fruit-gi.ts uses GI 64, the upper end of the published range.
 * The lead image is an illustration, not a photograph.
 */
export const raisinsAndDiabetes: Collection = {
  id: 'raisins-and-diabetes',
  kind: 'articles',
  slug: 'are-raisins-good-for-diabetes',
  topic: 'food',
  title: 'Are raisins good for diabetes?',
  seo_title: 'Raisins and Diabetes: Portions, Blood Sugar and Research',
  seo_desc:
    'Are raisins OK with diabetes? Their GI is low to medium, but 30 g holds the sugar of 120 g of grapes. What trials found, the right portion, and how to eat them.',
  summary:
    'Yes, in small portions. Raisins have a low-to-medium glycaemic index — 49 to 64 in different studies — and in trials they did not worsen blood sugar control, and did better than processed snacks. But drying concentrates the sugar: a 30 g handful carries about as much carbohydrate as 120 g of grapes. The portion, not the fruit, is what matters.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-29T00:00:00Z',
  updated_at: '2026-09-29T00:00:00Z',
  figure: {
    src: '/images/illustration-raisins.jpg',
    alt: 'Illustration of a bunch of green grapes beside a bowl heaped with raisins.',
    caption:
      'The same grapes, dried: a small bowl of raisins holds the sugar of a whole bunch. SharpAndLean illustration.',
  },
  takeaways: [
    'A 30 g portion of raisins — about a heaped tablespoon — has about 24 g of carbohydrate and 18 g of sugar, roughly the same as 120 g of fresh grapes.',
    'Their glycaemic index is low to medium (49 to 64 in different studies), and their glycaemic load per 30 g is medium, at about 11 to 14.',
    'In a 12-week trial, raisins as a snack lowered after-meal blood sugar and HbA1c slightly more than processed snacks did; in people with type 2 diabetes, 36 g a day for 24 weeks did not worsen blood sugar control.',
    'Stick to one measured portion, eat it with a meal or with protein, and avoid yoghurt- or chocolate-coated raisins.',
  ],
  body: `
<h2>The short answer</h2>
<p><strong>Yes — in small, measured portions.</strong> Raisins are dried grapes, and like most fruit they have a low-to-medium glycaemic index: studies have measured it at between 49 and 64. In trials, raisins eaten as a snack did not worsen blood sugar control, and did slightly better than processed snacks.</p>
<p>The catch is concentration. Drying removes the water but keeps the sugar, so a small handful packs a lot of carbohydrate: <strong>30 g of raisins carries about as much as 120 g of fresh grapes</strong>, in a quarter of the space and without the water that makes grapes filling. With raisins, the portion matters more than the fruit.</p>
<p>This article is general information, not medical advice. If you take insulin or medicines that can cause low blood sugar, your diabetes team can help you fit raisins into your carbohydrate plan.</p>

<h2>Raisins against grapes</h2>
<figure>
<img src="/images/raisins-vs-grapes.jpg" alt="Chart comparing 30 g of raisins with 120 g of grapes: total carbohydrate 23.8 g and 21.7 g, sugars 17.8 g and 18.6 g, fibre 1.1 g each, calories 90 and 83 kcal. Glycaemic index: raisins 49 to 64 by study, grapes 59. Glycaemic load per portion: raisins about 11 to 14, grapes about 12, both medium." width="2400" height="1440">
<figcaption>SharpAndLean chart. Nutrients from USDA FoodData Central; glycaemic load is our calculation from published glycaemic index values.</figcaption>
</figure>
<p>Per 100 g, seedless raisins have about 299 kcal, 79 g of carbohydrate (59 g of it sugars), 3.7 g of fibre and 749 mg of potassium, according to USDA FoodData Central. A 30 g portion — one portion of dried fruit in NHS 5 A Day guidance, about a heaped tablespoon — therefore gives about 90 kcal, 24 g of carbohydrate and 18 g of sugar. That is close to a 120 g serving of grapes.</p>
<p>The glycaemic load per 30 g works out at about 11 using the lower published GI and 14 using the higher one: medium either way, like a serving of grapes. In our <a href="/learn/fruit-and-diabetes-glycaemic-index">fruit and diabetes guide</a>, only bananas and grapes sit close to raisins; prunes, another dried fruit, come out much lower.</p>

<h2>What the research shows</h2>
<h3>Glycaemic index: low to medium</h3>
<p>An early test in six healthy people put the GI of raisins at 64, which is medium. A <a href="https://www.sciencedirect.com/science/article/abs/pii/S0271531708000432">2008 study</a> measured about 49 — low — in both healthy adults and adults with prediabetes, and found a correspondingly low insulin response. The difference probably reflects the variety of raisin, the people tested and the method. Either way, raisins raise blood sugar more gently than their sugar content suggests, thanks to their fibre and a high share of fructose.</p>
<h3>Raisins against processed snacks</h3>
<p>In a <a href="https://www.tandfonline.com/doi/abs/10.3810/pgm.2014.01.2723">12-week randomised trial published in 2014</a>, adults were asked to snack on raisins or on common processed snacks. Compared with the snack group, the raisin group had lower blood sugar after meals (a fall of about 13 mg/dL, or 0.7 mmol/L), a slightly lower HbA1c (a fall of 0.12 percentage points) and lower systolic blood pressure. The trial was small — 46 people — and it compared raisins with other snacks rather than with no snack at all. The honest reading is that raisins are a better snack than processed ones, not that they lower blood sugar on their own.</p>
<h3>Raisins in type 2 diabetes</h3>
<p>A <a href="https://www.sciencedirect.com/science/article/abs/pii/S0899900713003730">2014 pilot trial</a> gave 48 people with well-controlled type 2 diabetes 36 g of Corinthian raisins a day, or their usual diet, for 24 weeks. Eating raisins every day did not worsen fasting blood sugar or HbA1c, and the authors reported some favourable changes in other markers. It was a small study, but it supports including a modest daily portion.</p>

<h2>How to eat raisins with diabetes</h2>
<ul>
<li><strong>Measure the portion.</strong> 30 g is about a heaped tablespoon and about 24 g of carbohydrate. Small snack boxes are usually 14 g, about 11 g of carbohydrate. Eating straight from the bag is where raisins go wrong.</li>
<li><strong>Count them as carbohydrate.</strong> If you count carbohydrates for insulin, treat a 30 g portion as about 24 g.</li>
<li><strong>Pair them with protein or fat.</strong> Sprinkled on plain yoghurt, porridge or a salad, or eaten with a handful of nuts, they raise blood sugar more gently than on their own.</li>
<li><strong>Eat them with meals.</strong> That is NHS advice for all dried fruit, because its sticky sugars can harm teeth when eaten between meals.</li>
<li><strong>Skip coated raisins.</strong> Yoghurt- and chocolate-coated raisins add sugar and fat, and count as confectionery rather than fruit.</li>
<li><strong>Choose fresh grapes when you can.</strong> For the same sugar, 120 g of grapes is far more filling than 30 g of raisins.</li>
<li><strong>Check your own response.</strong> Your meter or sensor reading two hours after eating is the best guide to the portion that suits you.</li>
</ul>

<h2>Who should take extra care</h2>
<ul>
<li><strong>People on insulin or sulfonylureas.</strong> Count raisins in your carbohydrate plan, and ask your diabetes team if you are unsure how.</li>
<li><strong>People treating a low.</strong> Raisins are not a reliable treatment for hypoglycaemia: their sugar is partly fructose and comes with fibre, so it acts more slowly. Use fast-acting glucose as your team advises.</li>
<li><strong>People with kidney disease on a low-potassium diet.</strong> Raisins are relatively high in potassium — about 225 mg in 30 g. Check portions with your dietitian.</li>
<li><strong>Dog owners.</strong> Raisins and grapes are poisonous to dogs, even in small amounts. Keep them out of reach.</li>
</ul>

<h2>The bottom line</h2>
<p>Raisins can be part of a diet for diabetes. Their glycaemic index is low to medium, they did better than processed snacks in a trial, and a modest daily portion did not worsen blood sugar control in type 2 diabetes. Just measure them: a heaped tablespoon, with a meal or with protein, counted as about 24 g of carbohydrate.</p>
<p>For more fruit comparisons, see our <a href="/learn/fruit-and-diabetes-glycaemic-index">fruit and diabetes guide</a>, <a href="/learn/apples-vs-pears-for-diabetes">apples vs pears for diabetes</a> and <a href="/learn/eating-prunes-every-day-for-a-week">prunes every day for a week</a>.</p>
`,
  faqs: [
    {
      question: 'Can people with diabetes eat raisins?',
      answer:
        'Yes, in measured portions. A 30 g portion (about a heaped tablespoon) has about 24 g of carbohydrate. Raisins have a low-to-medium glycaemic index, and in trials a modest daily portion did not worsen blood sugar control in type 2 diabetes.',
    },
    {
      question: 'How many raisins can a diabetic eat?',
      answer:
        'A sensible portion is about 30 g — a heaped tablespoon, or roughly two small 14 g snack boxes — counted as about 24 g of carbohydrate. One portion a day, with a meal or with protein, fits most plans; your own meter or sensor readings are the best guide.',
    },
    {
      question: 'Do raisins raise blood sugar?',
      answer:
        'Yes, like any carbohydrate, but less sharply than their sugar content suggests. Their glycaemic index has been measured at 49 to 64, which is low to medium. The size of the portion matters most, because drying concentrates the sugar.',
    },
    {
      question: 'Are raisins or grapes better for diabetes?',
      answer:
        'Grapes, slightly. 30 g of raisins and 120 g of grapes carry about the same carbohydrate and sugar, but the grapes are far more filling because of their water. Both are fine in measured portions.',
    },
    {
      question: 'Are raisins good for treating a hypo?',
      answer:
        'No. Their sugar is partly fructose and comes with fibre, so it acts too slowly and unpredictably to treat low blood sugar. Use fast-acting glucose tablets or gel, or the treatment your diabetes team advises.',
    },
    {
      question: 'Are golden raisins or sultanas different?',
      answer:
        'Nutritionally they are very similar to dark raisins: about 24 g of carbohydrate per 30 g. Golden raisins are often treated with sulphur dioxide to keep their colour, which matters only if you are sensitive to sulphites.',
    },
  ],
  references: [
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central. Raisins, seedless — per 100 g: 299 kcal, 79.2 g carbohydrate, 59.2 g sugars, 3.7 g fibre, 749 mg potassium. Grapes, raw — per 100 g: 69 kcal, 18.1 g carbohydrate, 15.5 g sugars, 0.9 g fibre.',
      url: 'https://fdc.nal.usda.gov/',
    },
    {
      id: 'kim-2008',
      text: 'Kim Y et al. (2008). Raisins are a low to moderate glycemic index food with a correspondingly low insulin index. Nutrition Research 28.',
      url: 'https://www.sciencedirect.com/science/article/abs/pii/S0271531708000432',
    },
    {
      id: 'anderson-2014',
      text: 'Anderson JW et al. (2014). Raisins compared with other snack effects on glycemia and blood pressure: a randomized, controlled trial. Postgraduate Medicine 126.',
      url: 'https://www.tandfonline.com/doi/abs/10.3810/pgm.2014.01.2723',
    },
    {
      id: 'kanellos-2014',
      text: 'Kanellos PT et al. (2014). A pilot, randomized controlled trial to examine the health outcomes of raisin consumption in patients with diabetes. Nutrition 30.',
      url: 'https://www.sciencedirect.com/science/article/abs/pii/S0899900713003730',
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
      note: 'First published, with an illustration and a chart comparing 30 g of raisins with 120 g of grapes. Nutrition figures from USDA FoodData Central; evidence from the trials listed. Not yet reviewed by a clinician.',
    },
  ],
};
