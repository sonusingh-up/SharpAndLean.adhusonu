import type { Collection } from '../types';

/*
 * The fruit-and-diabetes hub: glycaemic index and load for 12 common fruits,
 * with links out to the single-fruit and comparison articles. Written for
 * readers anywhere. GI values are published averages; GL per 120 g (the
 * standard serving in the international GI tables) is our calculation from
 * USDA carbohydrate and fibre, and must match the chart and table.
 */
export const fruitAndDiabetes: Collection = {
  id: 'fruit-and-diabetes',
  kind: 'articles',
  slug: 'fruit-and-diabetes-glycaemic-index',
  topic: 'food',
  title: 'Fruit and diabetes: the glycaemic index and load of 12 common fruits',
  seo_title: 'Fruit and Diabetes: GI and GL of 12 Common Fruits, Ranked',
  seo_desc:
    'Glycaemic index and load of 12 fruits, ranked for diabetes: berries, cherries, apples and pears lowest; bananas and grapes to portion. What research shows.',
  summary:
    'Almost every whole fruit is a reasonable choice with diabetes. Ranked by glycaemic load — how much a normal serving raises blood sugar — strawberries, cherries, oranges, apples and pears come out lowest, and bananas and grapes highest. Watermelon has a high glycaemic index but a low load, because a serving holds little carbohydrate. Portion, pairing and eating fruit whole matter more than picking a winner.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-29T00:00:00Z',
  updated_at: '2026-09-29T00:00:00Z',
  figure: {
    src: '/images/fruit-glycaemic-load.jpg',
    alt: 'Bar chart of 12 fruits ranked by glycaemic load per 120 g serving, lowest first: strawberries 3, cherries 4, orange 5, apple 5, pear 6, watermelon 7, kiwi 7, blueberries 8, mango 8, pineapple 8, grapes 12, banana 12. Glycaemic index alongside: 40, 22, 43, 36, 38, 76, 50, 53, 51, 59, 59, 51. Ten fruits have a low load of 10 or under; grapes and banana are medium.',
    caption:
      'SharpAndLean chart. Glycaemic index: published averages from the international GI tables. Glycaemic load per 120 g: our calculation from USDA FoodData Central carbohydrate and fibre. Values vary with variety, ripeness and portion.',
  },
  takeaways: [
    'Ten of these 12 fruits have a low glycaemic load per 120 g serving. Strawberries, cherries, oranges, apples and pears are the lowest; bananas and grapes are medium.',
    'Glycaemic load matters more than glycaemic index: watermelon has a high GI of about 76, but a 120 g serving has a low load because it is mostly water.',
    'People with type 2 diabetes do not need to cut back on whole fruit: in a 12-week trial, advice to eat less fruit made no difference to HbA1c.',
    'Eat fruit whole, spread through the day and paired with protein. Juice and large portions of dried fruit are the forms to limit.',
  ],
  body: `
<h2>The short answer</h2>
<p><strong>Almost every whole fruit is a reasonable choice if you have diabetes.</strong> Most fruits have a low glycaemic index, and in a normal serving most have a low glycaemic load, which is the better guide to how much a portion will raise your blood sugar. Of the 12 common fruits in this guide, <strong>strawberries, cherries, oranges, apples and pears</strong> have the lowest load; <strong>bananas and grapes</strong> the highest, though still only medium.</p>
<p>That does not make any fruit off-limits, or any one a cure. How much you eat, what you eat it with and whether you eat it whole matter more than which fruit you choose. This guide ranks the fruits, explains what the numbers mean and sets out what the research says about fruit and diabetes.</p>
<p>It is general information, not medical advice. If you take insulin or medicines that can cause low blood sugar, your diabetes team can help you fit fruit into your carbohydrate plan.</p>

<h2>GI and GL: what the two numbers mean</h2>
<p>The <strong>glycaemic index (GI)</strong> ranks carbohydrate foods by how quickly they raise blood sugar compared with pure glucose, which scores 100. A GI of 55 or under is low, 56 to 69 medium and 70 or over high. It compares foods gram of carbohydrate for gram of carbohydrate, so it says nothing about how much carbohydrate a normal portion contains.</p>
<p>The <strong>glycaemic load (GL)</strong> fixes that. It multiplies the GI by the carbohydrate in a serving (not counting fibre) and divides by 100. A GL of 10 or under is low, 11 to 19 medium and 20 or over high. Because it accounts for portion size, it is the better guide to what a serving will actually do to your blood sugar.</p>
<p>Watermelon shows why the difference matters. Its GI is high, at about 76, but it is mostly water: 120 g holds under 9 g of carbohydrate, so its glycaemic load is only about 7 — low.</p>

<h2>12 common fruits, ranked</h2>
<table>
<thead><tr><th>Fruit</th><th>Glycaemic index</th><th>Net carbs per 120 g</th><th>Glycaemic load per 120 g</th></tr></thead>
<tbody>
<tr><td>Strawberries</td><td>40 (low)</td><td>7 g</td><td>3 (low)</td></tr>
<tr><td>Cherries</td><td>22 (low)</td><td>17 g</td><td>4 (low)</td></tr>
<tr><td>Orange</td><td>43 (low)</td><td>11 g</td><td>5 (low)</td></tr>
<tr><td><a href="/learn/eating-apples-every-day-for-a-week">Apple</a></td><td>36 (low)</td><td>14 g</td><td>5 (low)</td></tr>
<tr><td><a href="/learn/eating-pears-every-day-for-a-week">Pear</a></td><td>38 (low)</td><td>15 g</td><td>6 (low)</td></tr>
<tr><td>Watermelon</td><td>76 (high)</td><td>9 g</td><td>7 (low)</td></tr>
<tr><td>Kiwi</td><td>About 50 (low)</td><td>14 g</td><td>7 (low)</td></tr>
<tr><td>Blueberries</td><td>53 (low)</td><td>15 g</td><td>8 (low)</td></tr>
<tr><td>Mango</td><td>51 (low)</td><td>16 g</td><td>8 (low)</td></tr>
<tr><td>Pineapple</td><td>59 (medium)</td><td>14 g</td><td>8 (low)</td></tr>
<tr><td>Grapes</td><td>59 (medium)</td><td>21 g</td><td>12 (medium)</td></tr>
<tr><td>Banana</td><td>51 (low)</td><td>24 g</td><td>12 (medium)</td></tr>
</tbody>
</table>
<p>The glycaemic index figures are published averages drawn from the <a href="https://pubmed.ncbi.nlm.nih.gov/18835944/">international GI tables</a>, as summarised in <a href="https://www.health.harvard.edu/diseases-and-conditions/glycemic-index-and-glycemic-load-for-100-foods">Harvard Health’s table</a>. Net carbohydrate and glycaemic load are our calculations from USDA FoodData Central carbohydrate and fibre figures, for 120 g — the standard serving the GI tables use for fruit, and roughly one medium apple, a large handful of grapes or a cup of berries. Real values move with variety and ripeness: a riper banana has a higher GI than a greener one, for example.</p>

<h2>What the research says about fruit and diabetes</h2>
<h3>Cutting back on fruit does not help</h3>
<p>The most direct evidence is a <a href="https://pubmed.ncbi.nlm.nih.gov/23497350/">2013 randomised trial</a> in 63 adults with newly diagnosed type 2 diabetes. Half were advised to eat at least two pieces of fruit a day, half to eat no more than two. After 12 weeks, HbA1c — the main measure of long-term blood sugar — had fallen by the same amount in both groups, and weight and waist size did not differ. The researchers concluded that fruit should not be restricted in type 2 diabetes.</p>
<h3>Whole fruit is linked with lower risk; juice with higher</h3>
<p>In a <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4073481/">2013 analysis of three large US cohorts</a> — more than 187,000 people followed for decades — eating more whole fruit, especially blueberries, grapes and raisins, and apples and pears, was linked with a lower risk of developing type 2 diabetes. Drinking more fruit juice was linked with a higher risk. In a <a href="https://pubmed.ncbi.nlm.nih.gov/28399126/">study of half a million adults in China</a>, people with diabetes who ate fresh fruit more often had lower rates of death and of complications affecting the heart and blood vessels. These are observational studies, so they show links rather than proof, but they point the same way.</p>
<h3>Fruit before a meal may soften the rise</h3>
<p>Small trials have found that eating an apple before a rice meal lowered the blood-sugar peak afterwards by a third to a half, compared with the rice meal alone. They were in people without diabetes and have not been repeated for most fruits, so treat this as a strategy to test with your own meter or sensor. We cover them in <a href="/learn/apples-vs-pears-for-diabetes">apples vs pears for diabetes</a>.</p>
<h3>Guidelines agree</h3>
<p>Both the <a href="https://diabetes.org/food-nutrition/reading-food-labels/fruit">American Diabetes Association</a> and <a href="https://www.diabetes.org.uk/living-with-diabetes/eating/fruit-and-diabetes">Diabetes UK</a> encourage fruit as part of a healthy diet with diabetes, favour whole fruit over juice and suggest spreading it through the day.</p>

<h2>The best picks, and the ones to portion</h2>
<h3>Lowest load: berries, cherries, citrus, apples and pears</h3>
<p>Strawberries are the lowest of all, at a glycaemic load of about 3 per 120 g. Cherries have the lowest glycaemic index here, at 22. Oranges, apples and pears all sit around 5 to 6, and add useful fibre — pears the most. These are easy everyday choices.</p>
<h3>Still low: kiwi, blueberries, mango, pineapple and watermelon</h3>
<p>All have a low load in a 120 g serving. Keep an eye on portions of mango and pineapple, which are easy to eat in larger amounts, and watermelon, whose high GI means a big slice raises blood sugar faster than its low load suggests.</p>
<h3>Medium: bananas and grapes</h3>
<p>A 120 g serving — roughly one medium banana, or a large handful of grapes — has a medium glycaemic load of about 12. They are still fine to eat: choose a smaller banana, or one that is less ripe, and count out a portion of grapes rather than eating from the bunch.</p>

<h2>How to eat fruit with diabetes</h2>
<ul>
<li><strong>Count it as carbohydrate.</strong> A small piece of fruit, or about half a cup of chopped fruit, is roughly 15 g of carbohydrate. If you count carbohydrates for insulin, weigh a few portions to learn your usual sizes.</li>
<li><strong>Eat it whole.</strong> Keep the skin on where you can; it holds much of the fibre that slows the sugar down.</li>
<li><strong>Pair it with protein or fat.</strong> Fruit with plain yoghurt, a handful of nuts or some cheese gives a gentler rise and keeps you fuller.</li>
<li><strong>Spread it through the day.</strong> One portion at a time, rather than several at once.</li>
<li><strong>Limit juice and smoothies.</strong> They lose much of the fibre, raise blood sugar faster and their sugars count as free sugars. Blending can also make it easy to consume several portions of fruit in one drink.</li>
<li><strong>Go easy on dried fruit.</strong> Drying concentrates the sugar: a small box of raisins carries far more carbohydrate than the same volume of grapes. Keep portions to about a tablespoon.</li>
<li><strong>Choose tinned fruit in juice or water, not syrup,</strong> and drain it.</li>
<li><strong>Check your own response.</strong> People vary. Your meter or sensor readings two hours after eating are the best guide to which fruits and portions suit you.</li>
</ul>

<h2>Who should take extra care</h2>
<ul>
<li><strong>People on insulin or sulfonylureas.</strong> Count fruit in your carbohydrate plan, and ask your diabetes team if you are unsure how.</li>
<li><strong>People treating a low.</strong> Whole fruit is too slow and too variable to treat hypoglycaemia. Use fast-acting glucose as your team advises.</li>
<li><strong>People with kidney disease.</strong> Bananas, oranges and kiwi are relatively high in potassium. If you have been told to limit potassium, check which fruits and portions suit you with your dietitian.</li>
<li><strong>People with IBS.</strong> Apples, pears, mango and watermelon are high in FODMAPs. Strawberries, oranges, kiwi and firm bananas are usually better tolerated.</li>
</ul>

<h2>Read more</h2>
<ul>
<li><a href="/learn/apples-vs-pears-for-diabetes">Apples vs pears: which is better for diabetes?</a> — a side-by-side comparison, and the evidence for each.</li>
<li><a href="/learn/eating-apples-every-day-for-a-week">What happens if you eat two apples a day for a week?</a></li>
<li><a href="/learn/eating-pears-every-day-for-a-week">What happens if you eat two pears a day for a week?</a></li>
</ul>
`,
  faqs: [
    {
      question: 'What is the best fruit for diabetes?',
      answer:
        'There is no single best fruit. By glycaemic load per 120 g serving, strawberries (about 3), cherries (4), oranges and apples (5) and pears (6) are lowest. Most whole fruits are good choices; portion size and eating them whole matter more than which one you pick.',
    },
    {
      question: 'Which fruits should diabetics avoid?',
      answer:
        'No whole fruit needs to be avoided. Bananas and grapes have a medium glycaemic load, so keep portions moderate. The forms to limit are fruit juice, smoothies, large portions of dried fruit and fruit tinned in syrup.',
    },
    {
      question: 'Can diabetics eat bananas?',
      answer:
        'Yes. A medium banana has a low glycaemic index of about 51 but a medium glycaemic load of about 12, because it carries more carbohydrate than most fruits. Choose a smaller or slightly less ripe banana, and pair it with protein such as yoghurt or nuts.',
    },
    {
      question: 'Is watermelon bad for diabetes?',
      answer:
        'Not in a normal portion. Watermelon has a high glycaemic index of about 76, but it is mostly water, so a 120 g serving has a low glycaemic load of about 7. Large slices add up, so keep to a portion and pair it with protein.',
    },
    {
      question: 'How much fruit can a diabetic eat a day?',
      answer:
        'There is no fixed limit. In a trial of people with newly diagnosed type 2 diabetes, eating at least two pieces of fruit a day did not worsen HbA1c. Count each portion as roughly 15 to 25 g of carbohydrate, spread fruit through the day and follow your diabetes team’s plan.',
    },
    {
      question: 'What is the difference between glycaemic index and glycaemic load?',
      answer:
        'Glycaemic index ranks how quickly a food’s carbohydrate raises blood sugar, gram for gram. Glycaemic load also accounts for how much carbohydrate a normal serving contains, so it is the better guide to what a portion will actually do. A GL of 10 or under is low.',
    },
    {
      question: 'Is fruit juice OK for diabetes?',
      answer:
        'Best avoided except to treat a low if your team suggests it. Juice has lost most of the fibre, raises blood sugar faster and its sugars count as free sugars. In long-term studies, more juice was linked with a higher risk of type 2 diabetes, while whole fruit was linked with a lower one.',
    },
  ],
  references: [
    {
      id: 'atkinson-2008',
      text: 'Atkinson FS, Foster-Powell K, Brand-Miller JC (2008). International tables of glycemic index and glycemic load values: 2008. Diabetes Care 31(12):2281-2283.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18835944/',
    },
    {
      id: 'harvard-gi',
      text: 'Harvard Health Publishing. Glycemic index for 60+ foods — average GI values drawn from the international tables.',
      url: 'https://www.health.harvard.edu/diseases-and-conditions/glycemic-index-and-glycemic-load-for-100-foods',
    },
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central. Raw fruit — carbohydrate and fibre per 100 g, used for our net carbohydrate and glycaemic load calculations.',
      url: 'https://fdc.nal.usda.gov/',
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
      id: 'ada-fruit',
      text: 'American Diabetes Association. Best fruit choices for diabetes — whole fruit over juice; about 15 g of carbohydrate in a small piece of fruit.',
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
      note: 'First published, ranking 12 common fruits by glycaemic load per 120 g, with a chart. GI values are published averages; net carbohydrate and GL are our calculations from USDA FoodData Central. Not yet reviewed by a clinician.',
    },
  ],
};
