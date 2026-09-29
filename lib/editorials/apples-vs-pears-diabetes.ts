import type { Collection } from '../types';

/*
 * Apples vs pears for people with diabetes (and prediabetes). Written for
 * readers anywhere: ADA and Diabetes UK guidance side by side. Nutrition
 * figures are USDA FoodData Central values for a medium raw fruit with skin
 * (apple 182 g, pear 178 g) and must match the chart; the glycaemic load is
 * our calculation from the GI and net carbohydrate.
 */
export const applesVsPearsDiabetes: Collection = {
  id: 'apples-vs-pears-diabetes',
  kind: 'articles',
  slug: 'apples-vs-pears-for-diabetes',
  topic: 'food',
  title: 'Apples vs pears: which is better for diabetes?',
  seo_title: 'Best Fruit for Diabetes: Apples vs Pears, Compared',
  seo_desc:
    'Apples vs pears for diabetes: carbs, fibre, glycaemic index and what the research shows. Why it is a near tie, and how to eat either for steady blood sugar.',
  summary:
    'Close to a tie. A medium apple and a medium pear carry almost the same carbohydrate (about 21 g once fibre is taken off), both have a low glycaemic index and both are linked with lower diabetes risk. Pears have a little more fibre; apples have more research, including trials showing an apple before a meal softens the blood-sugar rise. Portion, timing and eating the fruit whole matter far more than which one you pick.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-29T00:00:00Z',
  updated_at: '2026-09-29T00:00:00Z',
  figure: {
    src: '/images/apple-and-pear.webp',
    alt: 'A red apple and a green Conference pear side by side on white fabric.',
    caption: 'A medium apple and a medium pear carry almost the same carbohydrate.',
  },
  takeaways: [
    'For blood sugar, apples and pears are close to identical: about 21 g of net carbohydrate per medium fruit, a low glycaemic index (36 and about 38) and a low glycaemic load.',
    'Pears have a little more fibre (5.5 g against 4.4 g); apples have more research, including trials in which an apple eaten before a meal softened the blood-sugar rise.',
    'Fruit does not need to be cut back in type 2 diabetes: in a 12-week trial, advice to eat less fruit made no difference to HbA1c.',
    'Eat either whole, with the skin, and count it as about 20 to 25 g of carbohydrate. Juice is the one form to avoid.',
  ],
  body: `
<h2>The short answer</h2>
<p><strong>Neither is clearly better — pick the one you enjoy, and eat it whole.</strong> A medium apple and a medium pear weigh about the same and carry almost the same carbohydrate: roughly 21 g once the fibre is taken off. Both have a low glycaemic index, so they raise blood sugar slowly, and in large long-term studies both are linked with a lower risk of type 2 diabetes.</p>
<p>If you want a tie-breaker: <strong>pears</strong> have a little more fibre, which slows digestion and helps fullness; <strong>apples</strong> have more research behind them, including trials showing that an apple eaten before a meal softens the rise in blood sugar afterwards. For most people with diabetes, how much fruit you eat, when you eat it and whether it is whole or juiced matter far more than which of the two you choose.</p>
<p>This article is general information, not medical advice. If you take insulin or medicines that can cause low blood sugar, your diabetes team can help you fit fruit into your carbohydrate plan.</p>

<h2>Apple vs pear: the numbers side by side</h2>
<figure>
<img src="/images/apple-vs-pear-blood-sugar.jpg" alt="Chart comparing one medium apple (182 g) and one medium pear (178 g): total carbohydrate 25 g and 27 g, net carbohydrate 20.6 g and 21.5 g, sugars 19 g and 17 g, fibre 4.4 g and 5.5 g. Glycaemic index 36 for apple and about 38 for pear; glycaemic load about 7 and 8. Both are low." width="2400" height="1440">
<figcaption>SharpAndLean chart. Nutrients from USDA FoodData Central; glycaemic index from the international GI tables; glycaemic load is our calculation. Values vary with variety, size and ripeness.</figcaption>
</figure>
<table>
<thead><tr><th>Per medium fruit</th><th>Apple (182 g)</th><th>Pear (178 g)</th></tr></thead>
<tbody>
<tr><td>Calories</td><td>95 kcal</td><td>101 kcal</td></tr>
<tr><td>Total carbohydrate</td><td>25 g</td><td>27 g</td></tr>
<tr><td>Fibre</td><td>4.4 g</td><td>5.5 g</td></tr>
<tr><td>Net carbohydrate (total minus fibre)</td><td>20.6 g</td><td>21.5 g</td></tr>
<tr><td>Sugars</td><td>19 g</td><td>17 g</td></tr>
<tr><td>Glycaemic index</td><td>36 (low)</td><td>About 38 (low)</td></tr>
<tr><td>Glycaemic load, one fruit</td><td>About 7 (low)</td><td>About 8 (low)</td></tr>
</tbody>
</table>
<p>Nutrients are from USDA FoodData Central for raw fruit with the skin. The glycaemic index figures come from the <a href="https://pubmed.ncbi.nlm.nih.gov/18835944/">international GI tables</a>, which average many tests; individual varieties and ripeness move them a few points either way. The glycaemic load, which combines how fast a food raises blood sugar with how much carbohydrate a portion contains, is our calculation from those figures.</p>
<p>The differences are small enough to be swamped by fruit size. A large apple can easily carry more carbohydrate than a small pear, and the other way round. Weighing or comparing sizes a few times is more useful than choosing between the two fruits.</p>

<h2>Why both are good choices for blood sugar</h2>
<h3>Low glycaemic index and load</h3>
<p>Foods with a glycaemic index of 55 or under are classed as low, and apples and pears sit well below that. Three things keep them there: their fibre, especially soluble pectin, slows digestion; a large share of their sugar is fructose, which raises blood glucose far less than glucose does; and the fruit has to be chewed and broken down. Their glycaemic load per fruit — about 7 to 8 — is also low, where 10 or under counts as low.</p>
<h3>Fibre, and the skin</h3>
<p>Much of the fibre in both fruits is in or just under the skin, so peeling them removes a good share of what slows the sugar down. Pears also contain gritty “stone cells”, which add insoluble fibre. Guidance around the world asks adults for 25 to 30 g or more of fibre a day, and people with diabetes are encouraged to aim at least as high.</p>
<h3>They are linked with lower diabetes risk</h3>
<p>In a <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4073481/">2013 analysis of three large US cohorts</a> — more than 187,000 people followed for decades — eating more whole apples and pears was linked with a slightly lower risk of type 2 diabetes, while more fruit juice was linked with a higher risk. In a <a href="https://pubmed.ncbi.nlm.nih.gov/28399126/">study of half a million adults in China</a>, people with diabetes who ate fresh fruit more often had lower rates of death and of complications affecting the heart and blood vessels. These are observational studies: they show links, not proof that fruit caused the benefit, but none of them suggests whole fruit is harmful.</p>

<h2>Where apples edge ahead: the evidence</h2>
<p>Apples have been tested directly for their effect on blood sugar after meals. In a <a href="https://pubmed.ncbi.nlm.nih.gov/31810219/">2019 randomised crossover study</a>, eating an apple before a rice meal roughly halved the rise in blood sugar compared with the rice meal on its own, and a <a href="https://pubmed.ncbi.nlm.nih.gov/36631706/">2023 follow-up</a> found an apple first lowered the peak by about a third at breakfast, lunch and supper. Both studies were small and in people without diabetes, so they suggest a strategy rather than prove it — but pears have not been tested this way at all.</p>
<p>Apples also have a longer-term trial behind them: in a <a href="https://pubmed.ncbi.nlm.nih.gov/31840162/">2020 study</a>, two apples a day for eight weeks lowered LDL cholesterol a little in adults with mildly raised cholesterol. Heart health matters in diabetes, because the condition raises the risk of heart disease.</p>

<h2>Where pears edge ahead</h2>
<p>Pears have about a quarter more fibre per fruit and slightly less sugar. Their main trial, a <a href="https://pubmed.ncbi.nlm.nih.gov/30720034/">2019 study in adults with metabolic syndrome</a> — a cluster of risk factors that often comes before type 2 diabetes — found that two pears a day for 12 weeks lowered systolic blood pressure from where it started, while a calorie-matched drink did not. Blood pressure control is one of the most important parts of diabetes care.</p>
<p>Pears also contain more sorbitol, a sugar alcohol with little effect on blood glucose. It helps keep bowels regular, but it can cause wind and loose stools in some people.</p>

<h2>Do you need to cut back on fruit?</h2>
<p>Usually not. In a <a href="https://pubmed.ncbi.nlm.nih.gov/23497350/">2013 randomised trial</a>, 63 adults with newly diagnosed type 2 diabetes were advised either to eat at least two pieces of fruit a day or no more than two. After 12 weeks, HbA1c — the main measure of long-term blood sugar — fell by the same amount in both groups, and weight and waist size did not differ. The researchers concluded that fruit should not be restricted in type 2 diabetes.</p>
<p>Both the <a href="https://diabetes.org/food-nutrition/reading-food-labels/fruit">American Diabetes Association</a> and <a href="https://www.diabetes.org.uk/living-with-diabetes/eating/fruit-and-diabetes">Diabetes UK</a> encourage fruit as part of a healthy diet for people with diabetes, favour whole fruit over juice, and suggest spreading fruit through the day rather than eating a lot at once.</p>

<h2>How to eat apples and pears with diabetes</h2>
<ul>
<li><strong>Count it as carbohydrate.</strong> A small apple or pear is about 15 g of carbohydrate; a medium one about 20 to 25 g; a large one more. If you count carbohydrates for insulin, weigh a few to learn your usual sizes.</li>
<li><strong>Eat it whole, with the skin.</strong> The skin holds much of the fibre. Wash the fruit well instead of peeling it.</li>
<li><strong>Pair it with protein or fat.</strong> An apple or pear with a handful of nuts, some cheese or plain yoghurt raises blood sugar more gently than the fruit alone and keeps you fuller.</li>
<li><strong>Try it before or with a meal.</strong> The apple studies suggest fruit eaten first can soften the rise after a starchy meal. Check your own response with your meter or sensor.</li>
<li><strong>Spread it out.</strong> One piece at a time, across the day, rather than several at once.</li>
<li><strong>Skip the juice, and go easy on dried and tinned fruit.</strong> Juice has lost the fibre and its sugars count as free sugars. Dried fruit concentrates the sugar into a small portion, and tinned fruit in syrup adds more — choose fruit tinned in juice or water, drained.</li>
</ul>

<h2>Who should take extra care</h2>
<ul>
<li><strong>People on insulin or sulfonylureas.</strong> Fruit is carbohydrate and should be counted in your plan; ask your diabetes team if you are unsure how.</li>
<li><strong>People treating a low.</strong> Apples and pears are too slow to treat hypoglycaemia. Use fast-acting glucose as your team advises.</li>
<li><strong>People with IBS.</strong> Both fruits are high in fructose and sorbitol and are common triggers. Smaller portions, or lower-FODMAP fruit such as oranges, kiwi or berries, may suit you better.</li>
<li><strong>People with kidney disease.</strong> Apples and pears are relatively low in potassium, but if you have been told to limit potassium, check portion sizes with your dietitian.</li>
</ul>

<h2>The bottom line</h2>
<p>For diabetes, apples and pears are close to a tie: similar carbohydrate, both low glycaemic index and load, and both linked with better outcomes. Choose pears for a little more fibre, apples for the stronger evidence on after-meal blood sugar — or, better, eat both. Keep them whole, count them in your carbohydrate plan, and pair them with protein.</p>
<p>To see how apples and pears compare with other fruits, read <a href="/learn/fruit-and-diabetes-glycaemic-index">fruit and diabetes: the glycaemic index and load of 12 common fruits</a>. For more on each fruit, see what happens when you eat <a href="/learn/eating-apples-every-day-for-a-week">two apples a day for a week</a> and <a href="/learn/eating-pears-every-day-for-a-week">two pears a day for a week</a>.</p>
`,
  faqs: [
    {
      question: 'Is an apple or a pear better for diabetes?',
      answer:
        'Neither is clearly better. A medium apple and pear have almost the same net carbohydrate (about 21 g), both have a low glycaemic index and both are linked with lower diabetes risk. Pears have a little more fibre; apples have more research on blood sugar after meals.',
    },
    {
      question: 'How many apples or pears can a diabetic eat a day?',
      answer:
        'There is no fixed limit. In a trial of people with newly diagnosed type 2 diabetes, eating at least two pieces of fruit a day did not worsen HbA1c. Count each medium fruit as about 20 to 25 g of carbohydrate, spread fruit through the day, and follow your own diabetes team’s plan.',
    },
    {
      question: 'Do apples raise blood sugar?',
      answer:
        'A little, and slowly. Apples have a glycaemic index of about 36, which is low, thanks to their fibre and high share of fructose. In small studies, eating an apple before a starchy meal actually lowered the blood-sugar peak after the meal.',
    },
    {
      question: 'Are pears high in sugar?',
      answer:
        'A medium pear has about 17 g of natural sugar — slightly less than a medium apple — along with 5.5 g of fibre. Its glycaemic index is low, at about 38. The sugar inside whole fruit is not counted as free sugar.',
    },
    {
      question: 'Is apple juice or pear juice OK for diabetes?',
      answer:
        'Best avoided except to treat a low if your team suggests it. Juice has lost most of the fibre, raises blood sugar faster and its sugars count as free sugars. In long-term studies, more fruit juice was linked with a higher risk of type 2 diabetes, while whole apples and pears were linked with a lower one.',
    },
    {
      question: 'Should people with diabetes peel apples and pears?',
      answer:
        'No. Much of the fibre that slows the sugar down is in or just under the skin. Wash the fruit well instead.',
    },
    {
      question: 'What is the best time to eat fruit with diabetes?',
      answer:
        'With or just before a meal, or with some protein as a snack, tends to give the gentlest rise. Spreading fruit across the day works better than eating several pieces at once. Your own meter or sensor readings are the best guide.',
    },
  ],
  references: [
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central. Apples, raw, with skin (medium, 182 g) and pears, raw (medium, 178 g) — calories, carbohydrate, fibre and sugars.',
      url: 'https://fdc.nal.usda.gov/',
    },
    {
      id: 'atkinson-2008',
      text: 'Atkinson FS, Foster-Powell K, Brand-Miller JC (2008). International tables of glycemic index and glycemic load values: 2008. Diabetes Care 31(12):2281-2283.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18835944/',
    },
    {
      id: 'christensen-2013',
      text: 'Christensen AS et al. (2013). Effect of fruit restriction on glycemic control in patients with type 2 diabetes — a randomized trial. Nutrition Journal 12:29.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23497350/',
    },
    {
      id: 'muraki-2013',
      text: 'Muraki I et al. (2013). Fruit consumption and risk of type 2 diabetes: results from three prospective longitudinal cohort studies. BMJ 347:f5001.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4073481/',
    },
    {
      id: 'du-2017',
      text: 'Du H et al. (2017). Fresh fruit consumption in relation to incident diabetes and diabetic vascular complications: a 7-y prospective study of 0.5 million Chinese adults. PLOS Medicine 14(4):e1002279.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28399126/',
    },
    {
      id: 'apple-preload-2019',
      text: 'Apple preload halved the postprandial glycaemic response of rice meal in healthy subjects (2019). Nutrients 11(12):2912.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31810219/',
    },
    {
      id: 'apple-preload-2023',
      text: 'Apple preload increased postprandial insulin sensitivity of a high glycemic rice meal only at breakfast (2023). European Journal of Nutrition.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/36631706/',
    },
    {
      id: 'koutsos-2020',
      text: 'Koutsos A et al. (2020). Two apples a day lower serum cholesterol and improve cardiometabolic biomarkers in mildly hypercholesterolemic adults: a randomized, controlled, crossover trial. American Journal of Clinical Nutrition 111:307-318.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31840162/',
    },
    {
      id: 'navaei-2019',
      text: 'Navaei N et al. (2019). Influence of daily fresh pear consumption on biomarkers of cardiometabolic health in middle-aged/older adults with metabolic syndrome: a randomized controlled trial. Food & Function 10(2):1062-1072.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30720034/',
    },
    {
      id: 'ada-fruit',
      text: 'American Diabetes Association. Best fruit choices for diabetes — whole fruit over juice; portion sizes.',
      url: 'https://diabetes.org/food-nutrition/reading-food-labels/fruit',
    },
    {
      id: 'diabetes-uk-fruit',
      text: 'Diabetes UK. Fruit, vegetables and diabetes — portion sizes, whole fruit over juice, spreading fruit through the day.',
      url: 'https://www.diabetes.org.uk/living-with-diabetes/eating/fruit-and-diabetes',
    },
  ],
  history: [
    {
      date: '2026-09-29',
      note: 'Added a photograph of an apple and a pear as the lead image, and moved the comparison chart into the side-by-side section.',
    },
    {
      date: '2026-09-29',
      note: 'Linked our fruit and diabetes guide, which ranks common fruits by glycaemic load.',
    },
    {
      date: '2026-09-29',
      note: 'First published, with a side-by-side chart of apple and pear carbohydrate, fibre, glycaemic index and load. Nutrition figures from USDA FoodData Central. Not yet reviewed by a clinician.',
    },
  ],
};
