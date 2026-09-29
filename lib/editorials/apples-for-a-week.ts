import type { Collection } from '../types';

/*
 * Two apples a day for seven days: what changes, day by day, and what does not.
 * Written for readers anywhere — fibre and sugar guidance cites WHO, US and NHS
 * figures side by side. Nutrition figures are USDA FoodData Central values for a
 * medium raw apple with skin (182 g) and must match the chart.
 */
export const applesForAWeek: Collection = {
  id: 'apples-for-a-week',
  kind: 'articles',
  slug: 'eating-apples-every-day-for-a-week',
  topic: 'food',
  title: 'What happens if you eat two apples a day for a week?',
  seo_title: 'Eating 2 Apples a Day for a Week: 7 Changes to Expect',
  seo_desc:
    '2 apples a day for 7 days: more fibre, fuller meals, smaller sugar spikes, early gut changes. What changes day by day, what does not, and who should be careful.',
  summary:
    'About 9 g more fibre a day from the first day, meals that fill you up sooner, smaller blood-sugar spikes when an apple comes first, and the first stirrings in your gut bacteria by the end of the week — plus some wind while you adjust. Cholesterol and weight take longer. Here is what to expect, day by day, and what the research behind each change actually shows.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-29T00:00:00Z',
  updated_at: '2026-09-29T00:00:00Z',
  figure: {
    src: '/images/two-apples-a-day-nutrition.jpg',
    alt: 'Bar chart of what two medium apples a day add as a share of a typical adult daily reference: fibre 29 per cent (8.8 g of 30 g), vitamin C 21 per cent (about 17 mg of 80 mg), potassium 11 per cent (390 mg of 3,500 mg) and calories 10 per cent (190 of 2,000 kcal). A note says the 38 g of sugar is inside whole fruit, so it does not count towards free-sugar limits.',
    caption:
      'SharpAndLean chart from USDA FoodData Central values for a medium raw apple with skin. References are typical adult figures; your own needs depend on age, size and activity.',
  },
  takeaways: [
    'Two medium apples give about 9 g of fibre, 190 kcal and a fifth of a day’s vitamin C — close to a third of a typical 30 g fibre target.',
    'Within a week you can expect more regular digestion, meals that fill you up sooner and smaller blood-sugar spikes if you eat an apple before a starchy meal. Early wind and bloating are common while your gut adjusts.',
    'Cholesterol, blood pressure and body weight will not measurably change in seven days. The two-apple cholesterol trial took eight weeks to show a small fall.',
    'Eat them whole and with the skin; juice loses the fibre and the fullness. People with IBS may need smaller portions.',
  ],
  body: `
<h2>The short answer</h2>
<p>Eat two apples a day for a week and the first change is simple arithmetic: <strong>about 9 g more fibre a day</strong>, for around 190 kcal. From there, the changes you are most likely to notice are in your digestion — more regular, and often windier at first — and in how full you feel, especially if an apple comes before a meal. By the end of the week, the bacteria in your gut have started to respond to the extra fibre.</p>
<p>What a week will <em>not</em> do is lower your cholesterol, change your blood pressure or produce real weight loss. Those are the benefits people most often hope for, and the research shows they take weeks to months, if they come at all. This article goes through what to expect day by day, then each change and the evidence for it.</p>
<p>We assume two medium apples a day, eaten whole with the skin, on top of or in place of an existing snack. That matches the best trial of daily apples, and it is a realistic amount to keep up.</p>

<h2>What two apples a day give you</h2>
<p>A medium apple (about 182 g, with skin) has 95 kcal, 4.4 g of fibre, 19 g of natural sugar, about 8 mg of vitamin C and 195 mg of potassium, according to USDA FoodData Central. Double that, and you get the figures in the chart above.</p>
<p>The fibre is the part that matters most. Guidance is similar around the world: the <a href="https://www.who.int/news/item/17-07-2023-who-updates-guidelines-on-fats-and-carbohydrates">World Health Organization advises at least 25 g a day</a>, the NHS 30 g, and US guidelines about 14 g per 1,000 kcal — roughly 25 to 34 g for most adults. Most people fall well short, so 9 g is a meaningful top-up. Much of an apple’s fibre is soluble pectin, which forms a gel in the gut and feeds gut bacteria; much of the rest, and many of its polyphenols, sit in or just under the skin.</p>
<p>The sugar sounds like a lot at 38 g, but it is not the sugar health guidelines warn about. The <a href="https://www.ncbi.nlm.nih.gov/books/NBK285523/">World Health Organization’s limits on free sugars</a> exclude sugars inside whole fresh fruit, because there is no evidence they cause harm; the fibre and the chewing slow how quickly they reach your blood. Apple juice is different: its sugars count as free sugars.</p>

<h2>Day by day: what to expect</h2>
<table>
<thead><tr><th>When</th><th>What is likely</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Days 1–2</td><td>Meals that fill you up sooner if an apple comes first. Smaller blood-sugar rise after a starchy meal eaten after an apple. Snacks swapped out, if you use apples to replace them.</td><td>The fibre, water and chewing of a whole apple take up room and slow digestion from the first day.</td></tr>
<tr><td>Days 2–4</td><td>More wind and, for some people, bloating. Often softer or more frequent stools.</td><td>Gut bacteria ferment the new fibre, and apples are high in fructose and sorbitol, which some guts handle poorly.</td></tr>
<tr><td>Days 5–7</td><td>Digestion usually settles into a more regular pattern. Early shifts in gut bacteria, such as more bifidobacteria.</td><td>Your gut adapts to a steady fibre intake; pectin-loving bacteria multiply.</td></tr>
<tr><td>Weeks, not days</td><td>A small fall in cholesterol, possibly a little weight lost if apples replace other snacks.</td><td>These need weeks of steady intake, and the effects are modest.</td></tr>
</tbody>
</table>
<p>Everyone starts from a different place. If you already eat plenty of fruit, vegetables and whole grains, you will notice less. If your diet is low in fibre, the digestive changes will be more obvious — and it is worth building up to two apples over a few days rather than starting there.</p>

<h2>The 7 changes, and what the research shows</h2>
<h3>1. You eat about 9 g more fibre a day</h3>
<p>This happens on day one and is the change everything else follows from. Two medium apples cover close to a third of a 30 g fibre target. Food-first fibre also comes with water, vitamin C, potassium and polyphenols that a fibre powder does not provide — though a powder such as <a href="/ingredients/psyllium-husk">psyllium husk</a> is a reasonable option for anyone who cannot eat enough fibre from food.</p>

<h3>2. Your digestion changes — first windier, then more regular</h3>
<p>Extra fibre adds bulk and water to stools, which for most people means more regular, easier bowel movements within a few days. The trade-off comes first: gut bacteria ferment the fibre and produce gas, and apples are high in two FODMAPs — excess fructose and sorbitol — that can cause wind, bloating and loose stools in sensitive people. <a href="https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/">Monash University’s FODMAP testing</a> rates a whole apple as high in both. For most people this settles within the week; for people with irritable bowel syndrome, two apples a day may simply be too much.</p>

<h3>3. You feel fuller, especially when an apple comes before a meal</h3>
<p>In a <a href="https://pubmed.ncbi.nlm.nih.gov/19110020/">2009 study at Penn State</a>, 58 adults ate an apple, apple sauce, apple juice or nothing 15 minutes before lunch. After a whole apple, they ate 15 per cent fewer calories at the meal overall — about 187 kcal less, counting the apple itself — and the whole apple beat both the sauce and the juice. The fibre, water and chewing of whole fruit are what make the difference, which is why juice does not have the same effect.</p>

<h3>4. Smaller blood-sugar spikes when an apple comes first</h3>
<p>Eating an apple before a starchy meal blunts the rise in blood sugar after it. In a <a href="https://pubmed.ncbi.nlm.nih.gov/31810219/">2019 randomised crossover study in healthy adults</a>, an apple eaten before a rice meal roughly halved the blood-sugar response compared with the rice meal on its own. A <a href="https://pubmed.ncbi.nlm.nih.gov/36631706/">2023 follow-up</a> found an apple first lowered the peak by about a third at breakfast, lunch and supper. These are short, small studies in healthy people, but the effect appears from the first meal.</p>
<p>This is not the same as “apples lower blood sugar”. An apple contains about 25 g of carbohydrate, so people with diabetes should count it like any other carbohydrate — though whole apples are a sensible fruit choice.</p>

<h3>5. Your gut bacteria start to respond</h3>
<p>Apple pectin feeds several beneficial gut bacteria. In a <a href="https://www.sciencedirect.com/science/article/abs/pii/S1075996410000314">2010 study</a>, eight healthy adults who ate two apples a day had more bifidobacteria in their stools by day 7, and more still by day 14. It was a tiny study, and a bigger change in the bacteria does not in itself prove a health benefit, but it fits what is known about how gut bacteria respond to fibre within days.</p>

<h3>6. Your fruit and vitamin C intake goes up without much effort</h3>
<p>The NHS counts one medium apple as one of your <a href="https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/">5 A Day</a>, so two apples cover two portions — and the WHO recommends at least 400 g of fruit and vegetables a day. Two apples also give about a fifth of a day’s vitamin C and around a tenth of the potassium. None of that is dramatic on its own, but apples are cheap, portable and keep for weeks, which makes them one of the easiest ways to lift a low fruit intake.</p>

<h3>7. The scales may move a little — or not at all</h3>
<p>In a week, any change on the scales will mostly be water, food in your gut and normal day-to-day swings. Over longer periods, apples can help with weight only by replacing higher-calorie foods. In a <a href="https://pubmed.ncbi.nlm.nih.gov/12620529/">12-week trial of 411 overweight women</a>, those given three apples or pears a day lost about 1.2 kg — only a little more than the 0.9 kg lost by women given oat biscuits instead. Two apples added on top of everything else you eat are 190 extra calories a day.</p>

<h2>What won’t change in a week</h2>
<ul>
<li><strong>Cholesterol.</strong> The best evidence here is a <a href="https://pubmed.ncbi.nlm.nih.gov/31840162/">2020 randomised crossover trial</a> in 40 adults with mildly raised cholesterol. Two apples a day for eight weeks lowered total and LDL cholesterol by a few per cent compared with a sugar-matched apple drink. That is a real but modest effect, and it took eight weeks, not one.</li>
<li><strong>Blood pressure.</strong> Diets rich in fruit and vegetables help blood pressure over months. A week of apples will not show on a monitor.</li>
<li><strong>“Detox” and skin.</strong> Your liver and kidneys do not need apples to work, and there is no good evidence that a week of any fruit changes your skin.</li>
<li><strong>Disease risk.</strong> Long-term studies link higher fruit intake with lower risk of heart disease and type 2 diabetes. Those links build over years of eating well, not seven days.</li>
</ul>

<h2>How to get the most from it</h2>
<ul>
<li><strong>Keep the skin on.</strong> Peeling removes a large share of the fibre and many of the polyphenols. Wash apples well under running water first.</li>
<li><strong>Eat them whole, not juiced.</strong> Juice loses the fibre and the fullness, and its sugars count as free sugars. The NHS counts juice as one of your 5 A Day only once, up to 150 ml a day.</li>
<li><strong>Put one before your biggest meal.</strong> That is where the fullness and blood-sugar effects showed up in the studies.</li>
<li><strong>Pair one with protein if it is a snack.</strong> An apple with a handful of nuts, a spoon of peanut butter or some cheese keeps you fuller for longer than the apple alone.</li>
<li><strong>Drink water, and build up if fibre is new to you.</strong> Start with one apple a day for a few days if your diet has been low in fibre.</li>
<li><strong>Vary it after the week.</strong> Apples are a good habit, not a magic fruit. <a href="/learn/eating-pears-every-day-for-a-week">Pears</a>, berries, oranges and kiwi bring different fibres and nutrients.</li>
</ul>

<h2>Who should be careful</h2>
<ul>
<li><strong>People with IBS or a sensitive gut.</strong> Apples are high in fructose and sorbitol. Smaller portions, or lower-FODMAP fruit such as oranges or kiwi, may suit you better.</li>
<li><strong>People with diabetes.</strong> Count each apple as about 25 g of carbohydrate. Eating it with or before a meal, rather than on its own, fits the blood-sugar evidence best. See our comparison of <a href="/learn/apples-vs-pears-for-diabetes">apples vs pears for diabetes</a>.</li>
<li><strong>People with hay fever.</strong> Some people with birch-pollen allergy get an itchy mouth or throat from raw apples (oral allergy syndrome). Cooked apple is usually tolerated; speak to a doctor if symptoms are more than mild.</li>
<li><strong>Your teeth.</strong> Apples are acidic. Rinsing with water afterwards, and not brushing straight away, is standard dental advice for acidic foods.</li>
</ul>
<p>Apple seeds contain a compound that can release small amounts of cyanide when crushed, but swallowing a few whole seeds by accident is harmless.</p>

<h2>The bottom line</h2>
<p>A week of two apples a day is a cheap, easy way to eat more fibre, feel fuller and take some of the edge off blood-sugar spikes, with some wind along the way. It will not transform your health in seven days. Keep it up for weeks, alongside a varied diet, and the modest cholesterol and weight benefits in the research become possible.</p>
`,
  faqs: [
    {
      question: 'Is it OK to eat two apples a day?',
      answer:
        'Yes, for most people. Two medium apples give about 9 g of fibre and 190 kcal, and count as two of your 5 A Day. People with IBS may find the fructose and sorbitol cause bloating, and people with diabetes should count each apple as about 25 g of carbohydrate.',
    },
    {
      question: 'What is the best time to eat an apple?',
      answer:
        'Before a meal, if you want the fullness and blood-sugar benefits. In studies, an apple eaten 10 to 15 minutes before a meal reduced how much people ate and lowered the blood-sugar rise after a starchy meal. Otherwise, whenever suits you.',
    },
    {
      question: 'Is apple juice as good as eating apples?',
      answer:
        'No. Juice loses most of the fibre, fills you up far less and its sugars count as free sugars. In a 2009 study, a whole apple before lunch cut calories eaten more than the same amount of apple juice did. The NHS counts juice as one of your 5 A Day only once, up to 150 ml.',
    },
    {
      question: 'Will eating apples help me lose weight?',
      answer:
        'Only if they replace higher-calorie foods. In a 12-week trial, overweight women given three apples or pears a day lost about 1.2 kg — a little more than women given oat biscuits. In one week, any change on the scales will mostly be water and normal fluctuation.',
    },
    {
      question: 'Can apples lower cholesterol?',
      answer:
        'A little, over weeks. In a 2020 trial, two apples a day for eight weeks lowered total and LDL cholesterol by a few per cent compared with a sugar-matched apple drink. A single week is too short to see a change.',
    },
    {
      question: 'Why do apples make me bloated?',
      answer:
        'Apples are high in fructose and sorbitol, two FODMAPs that gut bacteria ferment, and their fibre is new work for your gut if you do not usually eat much. The wind usually settles within a week. If it does not, or you have IBS, smaller portions may help.',
    },
    {
      question: 'Should I peel my apples?',
      answer:
        'Better not. A large share of an apple’s fibre and polyphenols is in or just under the skin. Wash apples well under running water instead.',
    },
  ],
  references: [
    {
      id: 'usda-fdc',
      text: 'USDA FoodData Central. Apples, raw, with skin — medium apple (182 g): 95 kcal, 4.4 g fibre, 19 g sugars, 8.4 mg vitamin C, 195 mg potassium.',
      url: 'https://fdc.nal.usda.gov/',
    },
    {
      id: 'koutsos-2020',
      text: 'Koutsos A et al. (2020). Two apples a day lower serum cholesterol and improve cardiometabolic biomarkers in mildly hypercholesterolemic adults: a randomized, controlled, crossover trial. American Journal of Clinical Nutrition 111:307-318.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31840162/',
    },
    {
      id: 'flood-obbagy-2009',
      text: 'Flood-Obbagy JE, Rolls BJ (2009). The effect of fruit in different forms on energy intake and satiety at a meal. Appetite 52:416-422.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19110020/',
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
      id: 'shinohara-2010',
      text: 'Shinohara K et al. (2010). Effect of apple intake on fecal microbiota and metabolites in humans. Anaerobe 16 — eight adults, two apples a day for two weeks.',
      url: 'https://www.sciencedirect.com/science/article/abs/pii/S1075996410000314',
    },
    {
      id: 'oliveira-2003',
      text: 'Conceição de Oliveira M, Sichieri R, Sanchez Moura A (2003). Weight loss associated with a daily intake of three apples or three pears among overweight women. Nutrition 19(3):253-256.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12620529/',
    },
    {
      id: 'who-sugars-2015',
      text: 'World Health Organization (2015). Guideline: sugars intake for adults and children — free sugars exclude sugars in whole fresh fruit and vegetables.',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK285523/',
    },
    {
      id: 'who-fibre-2023',
      text: 'World Health Organization (2023). Carbohydrate intake for adults and children: WHO guideline — at least 25 g of naturally occurring dietary fibre and 400 g of fruit and vegetables a day for adults.',
      url: 'https://www.who.int/news/item/17-07-2023-who-updates-guidelines-on-fats-and-carbohydrates',
    },
    {
      id: 'nhs-5-a-day',
      text: 'NHS. 5 A Day portion sizes — one medium apple is one portion; fruit juice counts once, up to 150 ml a day.',
      url: 'https://www.nhs.uk/live-well/eat-well/5-a-day/portion-sizes/',
    },
    {
      id: 'nhs-fibre',
      text: 'NHS. How to get more fibre into your diet — the 30 g a day recommendation for adults.',
      url: 'https://www.nhs.uk/live-well/eat-well/digestive-health/how-to-get-more-fibre-into-your-diet/',
    },
    {
      id: 'monash-fodmap',
      text: 'Monash University. High and low FODMAP foods — apples are high in excess fructose and sorbitol.',
      url: 'https://www.monashfodmap.com/about-fodmap-and-ibs/high-and-low-fodmap-foods/',
    },
  ],
  history: [
    {
      date: '2026-09-29',
      note: 'Linked our comparison of apples and pears for diabetes.',
    },
    {
      date: '2026-09-29',
      note: 'Linked our companion article on eating two pears a day for a week.',
    },
    {
      date: '2026-09-29',
      note: 'First published, with a chart of what two apples a day add. Nutrition figures from USDA FoodData Central; evidence from the trials listed. Not yet reviewed by a clinician.',
    },
  ],
};
