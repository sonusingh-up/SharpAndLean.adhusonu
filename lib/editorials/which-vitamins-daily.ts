import type { Collection } from '../types';
import { reviewIdFor } from './review-id';

/*
 * The checker on this page runs on lib/vitamins.ts, and tests/vitamins.test.ts
 * pins the amounts quoted below. Change a dose in one place and change it in
 * the other.
 */
export const whichVitaminsDaily: Collection = {
  id: 'which-vitamins-daily',
  kind: 'articles',
  slug: 'which-vitamins-should-you-take-daily',
  title: 'Which vitamins should you take every day?',
  seo_title: 'Which Vitamins Should You Take Daily? The Essential Few',
  seo_desc:
    'Most adults need no daily multivitamin. The essential few: vitamin D in winter, folic acid before pregnancy, B12 if vegan or over 50. Check yours in a minute.',
  summary:
    'For most healthy adults eating a varied diet, the honest answer is none every day — with three exceptions the evidence clearly supports: vitamin D in the darker months, folic acid for anyone who could become pregnant, and vitamin B12 for vegans and most people over 50. Here is who needs what, what to skip, and a checker that works out your list.',
  is_published: true,
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-09-27T00:00:00Z',
  updated_at: '2026-09-27T00:00:00Z',
  figure: {
    src: '/images/which-vitamins-daily.jpg',
    alt: 'Table of which vitamins are worth taking for healthy adults: vitamin D, 10 micrograms, worth it in UK winters or all year with little sun; folic acid, 400 micrograms, worth it for anyone who could become pregnant; vitamin B12 for some — vegans, over-50s and metformin users; a multivitamin rarely needed; vitamin C, skip; vitamin E and beta-carotene, avoid.',
    caption:
      'SharpAndLean chart, drawn from NHS, US Preventive Services Task Force, NIH and Endocrine Society guidance cited below. General advice for adults, not a personal prescription.',
  },
  takeaways: [
    'Most healthy adults eating a varied diet do not need a vitamin every day, and a daily multivitamin has not been shown to prevent heart disease or cancer or help people live longer.',
    'Vitamin D is the one most people in the UK need: 10 micrograms (400 IU) a day from October to March, and all year if you get little sun or have dark skin.',
    'Anyone who could become pregnant should take 400 micrograms of folic acid a day, starting before pregnancy. Vegans, and most people over 50, need a reliable source of vitamin B12.',
    'Skip vitamin C for colds, and avoid vitamin E, beta-carotene and high doses of vitamin A or B6. More is not better with any vitamin.',
  ],
  body: `
<h2>The short answer</h2>
<p>If you are a healthy adult eating a varied diet, you probably do not need to take a vitamin every day. The NHS says most people should get all the nutrients they need from a varied, balanced diet, and the US Preventive Services Task Force found too little evidence to say that a daily multivitamin prevents heart disease or cancer.</p>
<p>There are three well-supported exceptions:</p>
<ul>
<li><strong>Vitamin D</strong> — 10 micrograms (400 IU) a day from October to March if you live in the UK, and all year if you get little sun or have dark skin. The US recommended amount is 15 micrograms (600 IU).</li>
<li><strong>Folic acid</strong> — 400 micrograms a day for anyone who could become pregnant, starting before pregnancy.</li>
<li><strong>Vitamin B12</strong> — for vegans and most people over 50. Anyone taking metformin or a long-term stomach-acid medicine should ask about a B12 test.</li>
</ul>
<p>Almost everything else is for a specific medical situation — or, in the case of vitamin E and beta-carotene, better avoided altogether.</p>

<h2>Check which vitamins you need</h2>
<p>Tick what applies to you and the checker lists the vitamins worth taking, how much, and when. It only recommends what the NHS, the US Preventive Services Task Force, the NIH or the Endocrine Society already advise, and it adds nothing of its own.</p>
<div data-tool="vitamin-checker"></div>

<h2>Vitamin D: the one most people in the UK need</h2>
<p>Your skin makes vitamin D from sunlight, and in the UK the sun is too weak to do that from October to March. So the NHS advises everyone — including pregnant and breastfeeding women — to consider a daily supplement of <strong>10 micrograms (400 IU)</strong> in autumn and winter. It advises taking it all year if you are not often outdoors, live in a care home, usually cover most of your skin when outside, or have dark skin.</p>
<p>In the US, the recommended amount from food and supplements together is 15 micrograms (600 IU) a day up to age 70, and 20 micrograms (800 IU) over 70. The Endocrine Society’s 2024 guideline suggests a daily vitamin D supplement for adults over 75 and in pregnancy, and advises against routine blood tests for vitamin D in healthy people.</p>
<p>More is not better. In the VITAL trial, nearly 26,000 healthy adults over 50 took 2,000 IU a day or a placebo for about five years. Vitamin D did not reduce cancer, heart attacks or strokes, and a follow-up analysis found no fewer fractures either. The Endocrine Society suggests against going above the recommended amounts to prevent disease in healthy adults under 75. The upper limit for adults is <strong>100 micrograms (4,000 IU) a day</strong>, and vitamin D poisoning almost always comes from taking too many supplements.</p>
<p>A small, single-ingredient D3 supplement is all you need. The one we have reviewed, <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3</a>, is 25 micrograms (1,000 IU) a softgel — more than the NHS amount, a quarter of the upper limit — and costs about six cents a day. Our <a href="/ingredients/vitamin-d3">vitamin D3 guide</a> covers the evidence in more detail.</p>

<h2>Folic acid: before pregnancy, not after the test</h2>
<p>This is the supplement with the strongest case of all. Folic acid lowers the risk of neural tube defects such as spina bifida, which form in the first weeks of pregnancy — often before someone knows they are pregnant. The US Preventive Services Task Force gives it its highest grade: everyone who is planning to or could become pregnant should take a daily supplement of <strong>400 to 800 micrograms</strong>. Around 3,000 pregnancies a year are affected by neural tube defects in the US alone.</p>
<p>The NHS advises 400 micrograms a day until you are 12 weeks pregnant, and to start before you stop using contraception. Some people at higher risk are prescribed a higher dose by their doctor, so mention it if you have a medical condition or a previous affected pregnancy.</p>
<p>In pregnancy, the NHS also advises 10 micrograms of vitamin D a day, and warns against supplements containing vitamin A (retinol), including fish liver oils such as cod liver oil, because too much vitamin A can harm the baby’s development.</p>

<h2>Vitamin B12: vegans, over-50s and some medicines</h2>
<p>Vitamin B12 keeps your blood and nerve cells healthy. It is found naturally only in animal foods — meat, fish, eggs and dairy — so plant foods contain none unless it has been added. <strong>If you are vegan, you need a reliable source every day</strong>: a supplement, or fortified foods such as some plant milks, breakfast cereals and nutritional yeast.</p>
<p>Age matters too. Many older adults do not make enough stomach acid to release B12 from food, and deficiency affects between 3 and 43 per cent of older adults, according to the NIH. It advises that people over 50 get most of their B12 from fortified foods or supplements, which the body can still absorb. Because the body stores years’ worth, a deficiency builds slowly — tiredness, pins and needles, memory problems — and is easy to miss.</p>
<p>Some medicines lower B12: metformin, used for diabetes and prediabetes, and stomach-acid medicines such as omeprazole and lansoprazole. If you take one long term, ask your doctor whether to check your level. Supplements often contain 500 or 1,000 micrograms; the body absorbs only a small share, and these doses are considered safe. No form of B12 has been shown to work better than the others. It will not give you more energy unless you were short of it.</p>

<h2>Do you need a daily multivitamin?</h2>
<p>About a third of US adults take one. In 2022 the US Preventive Services Task Force reviewed the trials and concluded the evidence was insufficient to judge whether multivitamins prevent heart disease or cancer. In 2024, an NIH study that followed 390,124 healthy adults for up to 27 years found that people who took a multivitamin every day did not live longer — if anything, their risk of death was 4 per cent higher in the first part of the follow-up. That was an observational study, but it points the same way as the trials.</p>
<p>A multivitamin can still make sense if you eat very little or a very restricted diet, if you are pregnant (in the form of a pregnancy-specific one), or if a doctor or dietitian advises it after surgery or illness. If you take one, choose one that supplies around 100 per cent of the reference intakes rather than megadoses, and add up what it contains alongside any single vitamins you take, so you do not double up on vitamins A or D.</p>

<h2>Vitamins to skip, or take care with</h2>
<h3>Vitamin C for colds</h3>
<p>A Cochrane review of 29 trial comparisons and 11,306 people found that taking vitamin C every day did not reduce how often people in the general population caught colds. It shortened colds by about 8 per cent in adults — roughly half a day on a week-long cold — and starting it once a cold had begun showed no consistent effect. The exception was people under extreme physical stress, such as marathon runners and soldiers in subarctic conditions, whose risk halved. Above 1,000 mg a day, the NHS warns it can cause stomach pain and diarrhoea.</p>
<h3>Vitamin E and beta-carotene</h3>
<p>The US Preventive Services Task Force recommends against taking either to prevent heart disease or cancer. For beta-carotene, it concluded the harms outweigh the benefits; large trials in smokers found more lung cancer, not less. For vitamin E, the SELECT trial gave 400 IU a day to more than 35,000 healthy men, and those taking it had a 17 per cent higher risk of prostate cancer.</p>
<h3>Vitamin A</h3>
<p>The NHS warns that more than 1.5 milligrams a day of vitamin A over many years may weaken your bones, and that you should not take supplements containing vitamin A if you are pregnant. Check the label of any multivitamin or fish liver oil, and count them together.</p>
<h3>Vitamin B6</h3>
<p>The NHS advises no more than 10 mg a day of vitamin B6 from supplements unless a doctor recommends it. Taking 200 mg or more a day can cause a loss of feeling in the arms and legs that may be permanent. B-complex and "energy" products can contain far more than 10 mg a dose, so read the panel.</p>

<h2>Food first: where the vitamins come from</h2>
<p>UK and US figures differ because the two countries set their reference amounts differently; both describe what nearly all healthy adults need.</p>
<table><thead><tr><th>Vitamin</th><th>Adults need a day (UK / US)</th><th>Good food sources</th></tr></thead><tbody>
<tr><td>Vitamin D</td><td>10 mcg / 15 mcg (600 IU)</td><td>Oily fish, eggs, red meat, fortified spreads and cereals — but mostly sunlight</td></tr>
<tr><td>Vitamin B12</td><td>1.5 mcg / 2.4 mcg</td><td>Meat, fish, milk, cheese, eggs, fortified cereals and plant milks</td></tr>
<tr><td>Folate</td><td>200 mcg / 400 mcg</td><td>Broccoli, Brussels sprouts, leafy greens, peas, chickpeas, kidney beans, fortified cereals</td></tr>
<tr><td>Vitamin C</td><td>40 mg / 75–90 mg</td><td>Oranges, peppers, strawberries, blackcurrants, broccoli, potatoes</td></tr>
</tbody></table>
<p>The folic acid advised before pregnancy is on top of the folate in food, which is why a supplement is recommended even for people who eat well.</p>

<h2>How to buy a vitamin sensibly</h2>
<ul>
<li><strong>Buy the one you need.</strong> A single vitamin at the amount you need beats a "complex" of twenty ingredients you do not.</li>
<li><strong>Check the units.</strong> Vitamin D appears in micrograms and in IU; 1 microgram is 40 IU. Our <a href="/guides/what-a-supplement-label-hides">guide to reading a supplement label</a> shows how easily the two get mixed up.</li>
<li><strong>Look for independent testing.</strong> Marks such as USP Verified mean an outside body has checked that the product contains what its label says.</li>
<li><strong>Add everything up.</strong> A multivitamin, a single vitamin and fortified foods can together take you past a safe limit.</li>
<li><strong>Tell your pharmacist.</strong> Vitamins can interact with medicines — vitamin K with warfarin is the best-known example — so mention anything you take.</li>
</ul>

<h2>Who needs different advice</h2>
<ul>
<li><strong>Babies and young children.</strong> The NHS advises a daily vitamin D supplement for breastfed babies from birth, and vitamins A, C and D every day for children aged 6 months to 5 years, unless they have more than 500 ml of formula a day. Your health visitor can advise.</li>
<li><strong>Pregnancy and breastfeeding.</strong> Folic acid and vitamin D as above, no vitamin A supplements, and your midwife’s advice on anything else.</li>
<li><strong>Weight-loss surgery, coeliac or Crohn’s disease.</strong> These can cause several deficiencies at once; follow your specialist’s supplement plan.</li>
<li><strong>Kidney or liver disease, or regular medicines.</strong> Vitamin needs and safe limits can change; check before starting anything.</li>
<li><strong>Tired all the time, or pins and needles.</strong> See your GP for a blood test rather than guessing — low B12, iron or thyroid problems can all look alike.</li>
</ul>
`,
  productsIntro: {
    label: 'If you need vitamin D',
    heading: 'The vitamin D we have reviewed.',
    text: 'A plain, single-ingredient D3 is all most people need. This is the one we have reviewed in full, with its score, label and cost per day.',
  },
  items: [
    {
      review_id: reviewIdFor('nature-made-vitamin-d3-1000-iu'),
      rank: 1,
      why_it_made_the_list:
        'One ingredient, its strength printed in both micrograms and IU, USP verified for potency, and about six cents a day at $19.29 for 300 softgels. Each is 25 micrograms (1,000 IU): more than the NHS amount of 10 micrograms, but a quarter of the upper limit.',
    },
  ],
  faqs: [
    {
      question: 'Which vitamins should I take daily?',
      answer:
        'Most healthy adults eating a varied diet do not need any every day. The exceptions are vitamin D in autumn and winter in the UK (all year if you get little sun), folic acid for anyone who could become pregnant, and vitamin B12 for vegans and most people over 50.',
    },
    {
      question: 'Is it worth taking a multivitamin every day?',
      answer:
        'For most healthy adults, no. The US Preventive Services Task Force found insufficient evidence that multivitamins prevent heart disease or cancer, and a 2024 study of 390,124 adults found daily users did not live longer. One can make sense for restricted diets, in pregnancy, or on medical advice.',
    },
    {
      question: 'Should I take vitamin D all year round?',
      answer:
        'In the UK, the NHS advises everyone to consider 10 micrograms a day from October to March, and all year if you are rarely outdoors, cover most of your skin, have dark skin or live in a care home. The Endocrine Society also suggests daily vitamin D for adults over 75.',
    },
    {
      question: 'Can you take too much vitamin D?',
      answer:
        'Yes. The upper limit for adults is 100 micrograms (4,000 IU) a day, and vitamin D toxicity almost always comes from supplements. Higher doses have not been shown to help healthy adults: the VITAL trial found 2,000 IU a day did not prevent cancer, heart disease or fractures.',
    },
    {
      question: 'What vitamins should women take?',
      answer:
        'The same as men, plus folic acid: 400 micrograms a day for anyone who could become pregnant, started before pregnancy. Iron is a mineral rather than a vitamin; if you have heavy periods or feel tired all the time, ask your GP about a blood test rather than taking iron on spec.',
    },
    {
      question: 'Do vegans need to take vitamin B12?',
      answer:
        'Yes. Vitamin B12 is found naturally only in animal foods, so vegans need a daily supplement or B12-fortified foods such as some plant milks, cereals and nutritional yeast. Deficiency builds slowly and can damage nerves, so do not wait for symptoms.',
    },
    {
      question: 'Does vitamin C stop you getting colds?',
      answer:
        'Not for most people. A Cochrane review found daily vitamin C did not reduce how often people caught colds, though it shortened them by about 8 per cent in adults. Only people under extreme physical stress, such as marathon runners, caught fewer colds.',
    },
    {
      question: 'Can I get all the vitamins I need from food?',
      answer:
        'Most people can. The main exceptions are vitamin D in UK autumn and winter, when sunlight is too weak and few foods contain much, vitamin B12 on a vegan diet, and the extra folic acid advised before and in early pregnancy.',
    },
  ],
  references: [
    {
      id: 'nhs-vitamins',
      text: 'NHS. Vitamins and minerals (last reviewed 3 August 2020) — most people should get all the nutrients they need from a varied and balanced diet.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/',
    },
    {
      id: 'nhs-vitamin-d',
      text: 'NHS. Vitamin D (last reviewed 3 August 2020) — 10 micrograms a day in autumn and winter for everyone, all year for at-risk groups; do not exceed 100 micrograms (4,000 IU) a day.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/',
    },
    {
      id: 'nhs-vitamin-b',
      text: 'NHS. B vitamins and folic acid — no more than 10 mg of B6 a day from supplements; adults need 1.5 micrograms of B12 and 200 micrograms of folate a day; 400 micrograms of folic acid until 12 weeks of pregnancy.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-b/',
    },
    {
      id: 'nhs-vitamin-a',
      text: 'NHS. Vitamin A — more than 1.5 mg a day over many years may affect bones; avoid vitamin A supplements and liver in pregnancy.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-a/',
    },
    {
      id: 'nhs-vitamin-c',
      text: 'NHS. Vitamin C — adults need 40 mg a day; more than 1,000 mg a day can cause stomach pain and diarrhoea.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-c/',
    },
    {
      id: 'nhs-pregnancy',
      text: 'NHS. Pregnancy vitamins and supplements — folic acid, vitamin D, and the warning against vitamin A and cod liver oil.',
      url: 'https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/',
    },
    {
      id: 'nhs-children',
      text: 'NHS. Vitamins for children — vitamins A, C and D daily from 6 months to 5 years; vitamin D for breastfed babies from birth.',
      url: 'https://www.nhs.uk/baby/weaning-and-feeding/vitamins-for-children/',
    },
    {
      id: 'medlineplus-vitamin-d',
      text: 'MedlinePlus. Vitamin D (reviewed 21 January 2025) — 600 IU (15 mcg) a day for ages 19–70, 800 IU (20 mcg) over 70; upper limit 4,000 IU (100 mcg).',
      url: 'https://medlineplus.gov/ency/article/002405.htm',
    },
    {
      id: 'ods-b12',
      text: 'NIH Office of Dietary Supplements. Vitamin B12 fact sheet for consumers (updated 15 December 2023) — over-50s, vegans, metformin and acid-suppressing medicines.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/',
    },
    {
      id: 'uspstf-2022',
      text: 'US Preventive Services Task Force (2022). Vitamin, mineral, and multivitamin supplementation to prevent cardiovascular disease and cancer. JAMA 327(23):2326-2333.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35727271/',
    },
    {
      id: 'loftfield-2024',
      text: 'Loftfield E et al. (2024). Multivitamin use and mortality risk in 3 prospective US cohorts. JAMA Network Open 7(6):e2418729 — 390,124 adults followed for up to 27 years.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38922615/',
    },
    {
      id: 'uspstf-folic-2023',
      text: 'US Preventive Services Task Force (2023). Folic acid supplementation to prevent neural tube defects: reaffirmation recommendation statement. JAMA 330(5):454-459 — 400 to 800 micrograms a day, grade A.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/37526713/',
    },
    {
      id: 'endocrine-2024',
      text: 'Demay MB et al. (2024). Vitamin D for the prevention of disease: an Endocrine Society clinical practice guideline. Journal of Clinical Endocrinology & Metabolism 109(8):1907-1947.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38828931/',
    },
    {
      id: 'vital-2019',
      text: 'Manson JE et al. (2019). Vitamin D supplements and prevention of cancer and cardiovascular disease. New England Journal of Medicine 380(1):33-44 — VITAL, 25,871 participants, 2,000 IU a day.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30415629/',
    },
    {
      id: 'vital-fractures-2022',
      text: 'LeBoff MS et al. (2022). Supplemental vitamin D and incident fractures in midlife and older adults. New England Journal of Medicine 387(4):299-309.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35939577/',
    },
    {
      id: 'cochrane-vitamin-c',
      text: 'Hemilä H, Chalker E (2013). Vitamin C for preventing and treating the common cold. Cochrane Database of Systematic Reviews CD000980.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/23440782/',
    },
    {
      id: 'select-2011',
      text: 'Klein EA et al. (2011). Vitamin E and the risk of prostate cancer: the Selenium and Vitamin E Cancer Prevention Trial (SELECT). JAMA 306(14):1549-1556.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21990298/',
    },
  ],
  history: [
    {
      date: '2026-09-27',
      note: 'First published, with the vitamin checker. Advice checked against the NHS, USPSTF, NIH, MedlinePlus and Endocrine Society sources listed, and the trials behind them. Not yet reviewed by a clinician.',
    },
  ],
};
