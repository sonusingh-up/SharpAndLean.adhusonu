import type { Collection } from '../types';
import { reviewIdFor as reviewId } from './review-id';

/*
 * The rates quoted here are the ones lib/protein.ts uses for the calculator,
 * and tests/protein.test.ts pins the worked 70 kg example. Change them together.
 */
export const proteinForBeginners: Collection = {
  id: 'protein-for-beginners',
  kind: 'articles',
  slug: 'how-much-protein-should-a-beginner-eat',
  title: 'How much protein should a beginner eat in a day?',
  seo_title: 'How Much Protein Should a Beginner Eat a Day? (Calculator)',
  seo_desc:
    'Most beginners need 1.2–1.6 g of protein per kg a day, and about 1.6 g/kg once lifting — 110 g at 70 kg. Work out your own target with our free calculator.',
  summary:
    'About 1.2 to 1.6 g per kilogram of body weight a day, and about 1.6 g/kg once you start lifting — roughly 110 g for a 70 kg adult. Here is where those numbers come from, how to spread them across your meals, and a calculator that works out your own.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-27T00:00:00Z',
  updated_at: '2026-09-27T00:00:00Z',
  figure: {
    src: '/images/protein-per-day.jpg',
    alt: 'Chart of daily protein in grams per kilogram of body weight: 0.8 as the minimum; 1.2 to 1.6 for general health; 1.0 to 1.2 or more over 65; 1.4 to 2.2 for building muscle, with gains levelling off near 1.6; and 1.2 to 2.2 for losing fat while keeping muscle.',
    caption:
      'SharpAndLean chart, drawn from the sources in this article. Ranges are grams per kilogram of body weight per day; they describe what the research supports for groups of people, not a personal prescription.',
  },
  takeaways: [
    'Most beginners do well on 1.2 to 1.6 g of protein per kilogram of body weight a day; once you are lifting, about 1.6 g/kg is the useful target — roughly 110 g at 70 kg.',
    'The 0.8 g/kg minimum prevents deficiency; it was not set for training. At the other end, "1 g per pound" is 2.2 g/kg — the top of the useful range, not the place to start.',
    'Spread it over three to five meals of roughly 25 to 40 g. The total across the day matters more than eating it straight after a workout.',
    'Ordinary food covers it for most people; protein powder is a convenience. Kidney disease, pregnancy and under-18s need a personal figure.',
  ],
  body: `
<h2>The short answer</h2>
<p>For most beginners, <strong>1.2 to 1.6 g of protein per kilogram of body weight a day</strong> is a sensible range, and about <strong>1.6 g/kg is the useful target once you start strength training</strong>. For a 70 kg adult that is roughly 85 to 110 g a day. In pounds, it is about 0.54 to 0.73 g per pound of body weight.</p>
<p>The official minimum, the Recommended Dietary Allowance, is 0.8 g/kg — 56 g at 70 kg. It was set to prevent deficiency in almost everyone, not to support training, and the 2025–2030 US Dietary Guidelines now suggest 1.2 to 1.6 g/kg for adults. At the other end, the gym rule of "1 g per pound" is 2.2 g/kg: the top of the range the research supports, not where a beginner needs to start.</p>

<h2>Work out your number</h2>
<p>Enter your weight, pick the goal closest to yours, and the calculator gives a daily target, a range and a figure for each meal. It uses the same rates as the rest of this article and rounds to the nearest 5 g, because a target more precise than that is false precision.</p>
<div data-tool="protein-calculator"></div>
<p>If you have a lot of weight to lose, enter a realistic goal weight rather than your current one. Protein needs follow muscle, not body fat, and multiplying a high body weight by 1.6 gives a figure that is higher than useful and hard to eat.</p>

<h2>Daily protein by body weight</h2>
<p>If you would rather read it off a table, here are the same rates at common body weights, rounded to the nearest 5 g.</p>
<table><thead><tr><th>Body weight</th><th>Minimum (0.8 g/kg)</th><th>General health (1.2–1.6 g/kg)</th><th>Building muscle (1.6 g/kg)</th></tr></thead><tbody>
<tr><td>50 kg (110 lb)</td><td>40 g</td><td>60–80 g</td><td>80 g</td></tr>
<tr><td>60 kg (132 lb)</td><td>50 g</td><td>70–95 g</td><td>95 g</td></tr>
<tr><td>70 kg (154 lb)</td><td>55 g</td><td>85–110 g</td><td>110 g</td></tr>
<tr><td>80 kg (176 lb)</td><td>65 g</td><td>95–130 g</td><td>130 g</td></tr>
<tr><td>90 kg (198 lb)</td><td>70 g</td><td>110–145 g</td><td>145 g</td></tr>
<tr><td>100 kg (220 lb)</td><td>80 g</td><td>120–160 g</td><td>160 g</td></tr>
</tbody></table>

<h2>Where the numbers come from</h2>
<h3>0.8 g/kg: the minimum</h3>
<p>The Recommended Dietary Allowance of 0.8 g/kg comes from the US National Academies’ 2005 reference intakes. It is the amount that meets the needs of nearly all healthy adults — enough to prevent deficiency. It says nothing about what supports muscle growth, and it was never meant to.</p>
<h3>1.2 to 1.6 g/kg: the new US guidelines</h3>
<p>The 2025–2030 Dietary Guidelines for Americans, released in January 2026, set a goal of 1.2 to 1.6 g/kg a day for adults — 50 to 100 per cent above the RDA. Not everyone agrees with the change. Nutrition researchers at Harvard point out that many Americans already eat more than enough protein, and that the guidelines do not say which sources to favour: a steak and a bowl of lentils carry very different amounts of saturated fat and fibre along with their protein. Both points are worth keeping in mind. The range is reasonable; where the protein comes from still matters.</p>
<h3>About 1.6 g/kg: what muscle-building research found</h3>
<p>The most useful single study for anyone starting strength training is a 2018 meta-analysis by Morton and colleagues: 49 randomised trials and 1,863 people doing resistance training for at least six weeks. Adding protein increased gains in strength and muscle, and <strong>above a total intake of about 1.6 g/kg a day, muscle gains stopped increasing</strong> on average. The uncertainty around that figure ran up to about 2.2 g/kg, which is why the calculator’s range for building muscle goes that high.</p>
<p>The International Society of Sports Nutrition reached a similar conclusion in its 2017 position stand: 1.4 to 2.0 g/kg a day is sufficient for most people who exercise and want to build or keep muscle.</p>

<h2>Do beginners need as much as experienced lifters?</h2>
<p>Not quite — and it is one of the more reassuring findings for anyone starting out. In the Morton analysis, extra protein made a bigger difference in people who were already resistance-trained than in beginners. When you first start lifting, the training itself drives most of your early progress.</p>
<p>That does not make protein irrelevant: it is the raw material your body builds with, and too little will hold you back. It means a beginner who lands between 1.2 and 1.6 g/kg most days, and trains consistently, is doing what matters. Missing the target by 20 g on a Tuesday will not undo a week of training.</p>

<h2>If you are trying to lose fat</h2>
<p>Protein earns its keep when you eat less. A 2015 review in the <em>American Journal of Clinical Nutrition</em> found that higher-protein diets during weight loss led to more fat lost and more lean mass kept, along with a modest boost in fullness. Its authors suggested <strong>1.2 to 1.6 g/kg a day</strong>, with about 25 to 30 g at each meal.</p>
<p>If you are lifting while eating less, more can help. In one small trial, young men on a steep calorie deficit with six days a week of hard training gained 1.2 kg of lean mass on 2.4 g/kg a day, against almost none on 1.2 g/kg, and lost more fat. That was an extreme programme over four weeks, not a beginner’s plan, but it is why the calculator’s range for fat loss runs up to 2.2 g/kg.</p>
<p>The goal-weight rule matters most here. Base the figure on the weight you are working towards, not the one you are starting from.</p>

<h2>How to spread protein across the day</h2>
<p>The idea that the body can only use about 30 g of protein at a time is a myth: larger servings are partly burned for energy, but not wasted outright. Muscle building does respond to protein arriving several times a day. A 2018 review by Schoenfeld and Aragon suggested about <strong>0.4 g/kg per meal across at least four meals</strong> to reach 1.6 g/kg; at 70 kg, that is about 28 g a meal. The International Society of Sports Nutrition puts it as 20 to 40 g a serving, every three to four hours.</p>
<p>Timing around your workout matters less than it is often made out to. A 2013 meta-analysis found that once total daily protein was accounted for, eating it immediately before or after training made no significant difference to strength or muscle. Total protein was the strongest predictor of results. Eat a meal with protein somewhere either side of a session, and do not rush to a shake.</p>

<h2>What 110 g of protein looks like</h2>
<p>Here is how much protein is in common foods, from the USDA’s FoodData Central database. Values are for the cooked or ready-to-eat food, and brands vary, so check labels for anything packaged.</p>
<table><thead><tr><th>Food</th><th>Portion</th><th>Protein</th></tr></thead><tbody>
<tr><td>Chicken breast, roasted</td><td>100 g</td><td>31 g</td></tr>
<tr><td>Eggs, large</td><td>2 eggs</td><td>13 g</td></tr>
<tr><td>Greek yogurt, plain, fat-free</td><td>170 g pot</td><td>16 g</td></tr>
<tr><td>Cottage cheese, 2% fat</td><td>113 g (½ cup)</td><td>12 g</td></tr>
<tr><td>Milk, 2% fat</td><td>244 g (1 cup)</td><td>8 g</td></tr>
<tr><td>Lentils, boiled</td><td>198 g (1 cup)</td><td>18 g</td></tr>
<tr><td>Chickpeas, boiled</td><td>164 g (1 cup)</td><td>15 g</td></tr>
<tr><td>Peanut butter</td><td>32 g (2 tbsp)</td><td>7 g</td></tr>
<tr><td>Whey protein powder</td><td>1 scoop</td><td>20–24 g, by label</td></tr>
</tbody></table>
<p>A day built from those foods for a 70 kg beginner might be: a pot of Greek yogurt and two eggs at breakfast (29 g); a cup of lentils with a glass of milk at lunch (26 g); 100 g of chicken at dinner (31 g); and cottage cheese with peanut butter on toast as a snack (19 g). That is about 105 g before counting the protein in the bread, oats, rice and vegetables that go with it, which takes it past 110 g. Tofu is a good plant option too, but its protein varies a lot between soft and firm varieties, so go by the label.</p>

<h2>Plant-based beginners</h2>
<p>You can reach these targets without meat. A 2018 meta-analysis of nine trials found that people who supplemented with soy protein during resistance training gained as much strength and lean mass as those using whey or other animal proteins. Plant foods tend to carry less protein per portion and more fibre, so it takes a little more planning: combine beans, lentils, soy foods, grains and nuts across the day, and lean on the higher-protein options such as tofu, tempeh and soy milk.</p>

<h2>Do you need protein powder?</h2>
<p>No. The International Society of Sports Nutrition notes that active people can meet their protein needs from whole foods, and describes supplements as a practical convenience. A shake is useful when food leaves a gap — a busy lunch, a vegetarian day that came up short. It does nothing that the same amount of protein from food would not.</p>
<p>If you do buy one, compare products by the cost per 100 g of protein rather than the price of the tub, and read the protein per scoop on the flavour you actually buy. Our <a href="/ingredients/whey-protein-blend">whey protein guide</a> covers what the evidence supports, and the <a href="/compare/optimum-nutrition-vs-myprotein-impact-whey">Optimum Nutrition vs Myprotein comparison</a> lines two of the biggest brands up side by side.</p>

<h2>Is too much protein harmful?</h2>
<p>For people with healthy kidneys, the evidence is reassuring. A 2018 meta-analysis of 28 trials, with 1,358 adults, found that higher-protein diets — at least 1.5 g/kg a day, or 100 g or more — did not harm kidney function compared with normal or lower intakes. There is no official upper limit for protein; the US reference intakes suggest getting 10 to 35 per cent of your calories from it, which leaves plenty of room.</p>
<p>Kidney disease is the important exception. The kidney nutrition guideline from the US National Kidney Foundation recommends that many people with moderate to advanced chronic kidney disease who are not on dialysis restrict protein, under medical supervision. If you have kidney disease, do not use this calculator — ask your kidney team for your figure.</p>
<p>The other consideration is the rest of the plate. Protein arrives with whatever else is in the food, and diets built on plant proteins and fish are associated with better long-term health than diets high in red meat.</p>

<h2>Who should get a personal figure</h2>
<ul>
<li><strong>Kidney or liver disease.</strong> Protein targets are part of treatment and can differ sharply from these ranges, in either direction.</li>
<li><strong>Pregnancy and breastfeeding.</strong> Needs rise — the US reference intakes set higher allowances for both — so ask your midwife, doctor or a dietitian.</li>
<li><strong>Under 18.</strong> Growing teenagers have their own reference intakes; these adult ranges do not apply.</li>
<li><strong>Adults over 65.</strong> An expert group on protein in older age recommends at least 1.0 to 1.2 g/kg a day, and 1.2 g/kg or more for those who are active; the calculator raises its floor accordingly.</li>
<li><strong>A history of disordered eating.</strong> Chasing a number can do more harm than good; a dietitian can help set one safely.</li>
</ul>
<p>For everyone else, pick a target in the right range, spread it over your meals, and put your energy into training consistently. If you are just starting, our 8-week beginner plans for <a href="/learn/how-to-get-in-shape-fast-men">men</a> and <a href="/learn/how-to-get-in-shape-fast-women">women</a> cover the training side.</p>
`,
  productsIntro: {
    label: 'If you use a protein powder',
    heading: 'The whey powders we have reviewed.',
    text: 'Food covers the target for most beginners. If a shake makes it easier, these are the three we have reviewed in full, each with its score and what a gram of protein actually costs. Prices are UK.',
  },
  items: [
    {
      review_id: reviewId('kinetica-whey-protein-review'),
      rank: 1,
      why_it_made_the_list:
        'The most completely labelled whey we have looked at: 23 g of protein and 2.47 g of leucine per 30 g scoop, with every amino acid published. About £5.17 per 100 g of protein in the 2.27 kg bag, and less in the 4.5 kg.',
    },
    {
      review_id: reviewId('myprotein-impact-whey-review'),
      rank: 2,
      why_it_made_the_list:
        'The cheapest defensible whey we have reviewed, at about £1.10 a serving and roughly £5.00 per 100 g of protein in the UK. Protein per scoop varies across its flavours, so check the one you buy.',
    },
    {
      review_id: reviewId('optimum-nutrition-uk-review-2026'),
      rank: 3,
      why_it_made_the_list:
        'The best-known name: 24 g of protein in a 30 g scoop, from a blend led by whey isolate. You pay for it, at about £5.55 to £6.94 per 100 g of protein against roughly £5.00 for the value brands.',
    },
  ],
  faqs: [
    {
      question: 'How much protein should a beginner eat a day?',
      answer:
        'About 1.2 to 1.6 g per kilogram of body weight a day, and about 1.6 g/kg once you start strength training. For a 70 kg adult that is roughly 85 to 110 g. The 0.8 g/kg minimum prevents deficiency but was not set for people who train.',
    },
    {
      question: 'Is 100 g of protein a day enough for a beginner?',
      answer:
        'It depends on your weight. 100 g is 1.6 g/kg for someone weighing about 63 kg, and 1.2 g/kg at about 83 kg. For beginners under about 83 kg, 100 g a day is within the useful range; heavier beginners who lift may want a little more.',
    },
    {
      question: 'Should I use my current weight or my goal weight?',
      answer:
        'If you have a lot of weight to lose, use a realistic goal weight. Protein needs track muscle rather than body fat, so multiplying a high body weight by 1.6 gives a target that is higher than useful. Otherwise your current weight is fine.',
    },
    {
      question: 'Do I need to eat protein straight after a workout?',
      answer:
        'No. A 2013 meta-analysis found that once total daily protein was taken into account, eating it immediately before or after training made no significant difference to strength or muscle gains. Getting enough across the day matters far more.',
    },
    {
      question: 'How much protein can the body absorb in one meal?',
      answer:
        'There is no fixed cut-off; the "30 g at a time" rule is a myth. Muscle building does respond to protein spread across the day, so about 0.4 g/kg per meal over three to five meals — roughly 25 to 40 g for most adults — is a practical way to reach your total.',
    },
    {
      question: 'Can I get enough protein without meat?',
      answer:
        'Yes. A 2018 meta-analysis found soy protein produced the same gains in strength and lean mass as whey or other animal proteins during resistance training. Combine beans, lentils, soy foods, grains and nuts through the day to reach your target.',
    },
    {
      question: 'Is too much protein bad for your kidneys?',
      answer:
        'Not if your kidneys are healthy: a 2018 meta-analysis of 28 trials found higher-protein diets did not harm kidney function in healthy adults. People with chronic kidney disease are often advised to limit protein, and should get their target from their kidney team.',
    },
    {
      question: 'Do women need less protein than men?',
      answer:
        'Per kilogram, the targets are the same; women usually need fewer grams in total because they tend to weigh less. Pregnancy and breastfeeding raise protein needs, so get a personal figure if either applies.',
    },
  ],
  references: [
    {
      id: 'iom-dri-2005',
      text: 'Institute of Medicine (2005). Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. National Academies Press — the 0.8 g/kg adult RDA, higher allowances in pregnancy and lactation, and the 10–35% of energy acceptable range.',
      url: 'https://nap.nationalacademies.org/catalog/10490',
    },
    {
      id: 'dga-2025',
      text: 'US Departments of Agriculture and Health and Human Services. Dietary Guidelines for Americans, 2025–2030 (January 2026) — protein goal of 1.2 to 1.6 g/kg a day for adults.',
      url: 'https://cdn.realfood.gov/DGA.pdf',
    },
    {
      id: 'medlineplus-dga',
      text: 'MedlinePlus. Dietary Guidelines for Americans 2025–2030 (reviewed 9 February 2026) — summary of the protein goal and protein sources.',
      url: 'https://medlineplus.gov/ency/article/002093.htm',
    },
    {
      id: 'harvard-dga',
      text: 'Harvard T.H. Chan School of Public Health, The Nutrition Source. Dietary Guidelines for Americans 2025–2030: progress on added sugar, protein hype, saturated fat contradictions (9 January 2026).',
      url: 'https://nutritionsource.hsph.harvard.edu/2026/01/09/dietary-guidelines-for-americans-2025-2030/',
    },
    {
      id: 'morton-2018',
      text: 'Morton RW et al. (2018). A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. British Journal of Sports Medicine 52(6):376-384 — 49 trials, 1,863 participants; no further gain in fat-free mass above about 1.62 g/kg a day.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28698222/',
    },
    {
      id: 'issn-2017',
      text: 'Jäger R et al. (2017). International Society of Sports Nutrition Position Stand: protein and exercise. Journal of the International Society of Sports Nutrition 14:20 — 1.4–2.0 g/kg a day; 20–40 g per serving every 3–4 hours.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28642676/',
    },
    {
      id: 'schoenfeld-aragon-2018',
      text: 'Schoenfeld BJ, Aragon AA (2018). How much protein can the body use in a single meal for muscle-building? Journal of the International Society of Sports Nutrition 15:10 — 0.4 g/kg per meal across at least four meals.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29497353/',
    },
    {
      id: 'schoenfeld-2013',
      text: 'Schoenfeld BJ, Aragon AA, Krieger JW (2013). The effect of protein timing on muscle strength and hypertrophy: a meta-analysis. Journal of the International Society of Sports Nutrition 10:53.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24299050/',
    },
    {
      id: 'leidy-2015',
      text: 'Leidy HJ et al. (2015). The role of protein in weight loss and maintenance. American Journal of Clinical Nutrition 101(6):1320S-1329S — 1.2–1.6 g/kg a day and about 25–30 g per meal.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25926512/',
    },
    {
      id: 'longland-2016',
      text: 'Longland TM et al. (2016). Higher compared with lower dietary protein during an energy deficit combined with intense exercise promotes greater lean mass gain and fat mass loss. American Journal of Clinical Nutrition 103(3):738-746 — 2.4 vs 1.2 g/kg a day for four weeks.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26817506/',
    },
    {
      id: 'prot-age-2013',
      text: 'Bauer J et al. (2013). Evidence-based recommendations for optimal dietary protein intake in older people: a position paper from the PROT-AGE Study Group. Journal of the American Medical Directors Association 14(8):542-559 — at least 1.0–1.2 g/kg a day over 65.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23867520/',
    },
    {
      id: 'devries-2018',
      text: 'Devries MC et al. (2018). Changes in kidney function do not differ between healthy adults consuming higher- compared with lower- or normal-protein diets: a systematic review and meta-analysis. Journal of Nutrition 148(11):1760-1775 — 28 trials, 1,358 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30383278/',
    },
    {
      id: 'kdoqi-2020',
      text: 'Ikizler TA et al. (2020). KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update. American Journal of Kidney Diseases 76(3 Suppl 1):S1-S107.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/32829751/',
    },
    {
      id: 'messina-2018',
      text: 'Messina M et al. (2018). No difference between the effects of supplementing with soy protein versus animal protein on gains in muscle mass and strength in response to resistance exercise. International Journal of Sport Nutrition and Exercise Metabolism 28(6):674-685 — nine trials, 266 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29722584/',
    },
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central, SR Legacy entries 171477 (chicken breast, roasted), 171287 (egg, whole), 171312 (Greek yogurt, plain, nonfat), 172182 (cottage cheese, 2%), 171267 (milk, 2%), 172421 (lentils, boiled), 173757 (chickpeas, boiled) and 172470 (peanut butter), checked on 27 September 2026.',
      url: 'https://fdc.nal.usda.gov/',
    },
  ],
  history: [
    {
      date: '2026-09-27',
      note: 'First published, with the protein calculator. Rates checked against the sources listed, including the 2025–2030 Dietary Guidelines for Americans; food values from USDA FoodData Central. Not yet reviewed by a clinician.',
    },
  ],
};
