import type { IngredientPage } from '../ingredients';

/*
 * The three vitamins public-health advice actually asks people to take:
 * vitamin D, folic acid and vitamin B12. Written as a set — each links to the
 * others — and kept here rather than in lib/ingredients.ts so the entries can
 * run to full length. Prose fields use a blank line for a new paragraph.
 *
 * The amounts quoted must agree with lib/vitamins.ts and the vitamins guide at
 * /learn/which-vitamins-should-you-take-daily.
 */

export const vitaminD: IngredientPage = {
  // Slug kept from the original "Vitamin D3" page, which other pages link to.
  slug: 'vitamin-d3',
  name: 'Vitamin D',
  seoTitle: 'Vitamin D: Who Needs It and How Much',
  seoDescription:
    'Vitamin D prevents deficiency and matters in UK winters, but in healthy adults it did not prevent cancer, heart disease or fractures. Who needs it, and why.',
  aliases: [
    'vitamin d',
    'vitamin d3',
    'vitamin d2',
    'cholecalciferol',
    'ergocalciferol',
    'vitamin d3 (cholecalciferol)',
  ],
  category: 'Fat-soluble vitamin',
  grade: 'A',
  quickAnswer:
    'Vitamin D controls how much calcium you absorb, which keeps bones and muscles working, and your skin makes most of it from summer sunlight. The evidence is strong for preventing and treating deficiency, which is why the NHS advises 10 micrograms (400 IU) a day in autumn and winter. It is weak for almost everything else: large trials in healthy adults found no protection from cancer, heart disease or fractures. Take the small dose that covers winter; there is no case for megadoses.',
  atAGlance: [
    {
      label: 'UK advice (NHS)',
      value: '10 mcg (400 IU) a day',
      note: 'October to March for everyone; all year if you get little sun, cover your skin or have dark skin.',
    },
    {
      label: 'US recommended amount',
      value: '15–20 mcg (600–800 IU)',
      note: '600 IU up to age 70 and 800 IU over 70, from food and supplements together.',
    },
    {
      label: 'Upper limit for adults',
      value: '100 mcg (4,000 IU) a day',
      note: 'Toxicity almost always comes from supplements. You cannot overdose from sunlight.',
    },
    {
      label: 'Units',
      value: '1 mcg = 40 IU',
      note: 'Labels use both. Compare products in one unit or the numbers can be forty times out.',
    },
    {
      label: 'Healthy adults, 2,000 IU a day',
      value: 'No fewer cancers, heart attacks or fractures',
      note: 'The VITAL trial: 25,871 adults over 50, followed for about five years.',
    },
  ],
  whatIsIt: `Vitamin D is a fat-soluble vitamin that behaves more like a hormone. Your skin makes vitamin D3 (cholecalciferol) when it is exposed to UVB light from the sun, and that is where most people get most of theirs. Food supplies a little: oily fish such as salmon, sardines, trout, herring and mackerel, red meat, liver, egg yolks, and fortified foods such as some fat spreads and breakfast cereals. Supplements contain either D3 or vitamin D2 (ergocalciferol), which comes from plants and fungi.

In the UK, the sun is strong enough to make vitamin D only from about late March or early April to the end of September. For the rest of the year, most people make little or none — which is why the NHS advice is seasonal. Because vitamin D is fat-soluble, the body stores it: summer levels carry some way into winter, and too much from supplements can build up.`,
  mechanism: `The liver converts vitamin D into 25-hydroxyvitamin D, the form a blood test measures, and the kidneys convert that into calcitriol, the active hormone. Calcitriol regulates the amount of calcium and phosphate in the body, mainly by increasing how much the gut absorbs. Bones, teeth and muscles need both.

Without enough vitamin D, children develop rickets and adults develop osteomalacia: soft, painful bones and weak muscles. Receptors for vitamin D are also found in many other tissues, including immune cells, and that is the basis for the wider claims made for it. But a receptor being present does not mean that extra vitamin D does more there, and the trials testing those claims in people who were not deficient have mostly come back negative.`,
  claims: [
    {
      claim: 'For preventing and treating deficiency',
      grade: 'A',
      body: 'Settled and uncontroversial. Supplements raise blood levels, and correcting deficiency prevents and treats rickets and osteomalacia. This is the job vitamin D supplements exist for, and the reason public-health advice targets the winter months and people who get little sun rather than everyone all year.',
      refs: ['nhs-vitamin-d', 'endocrine-2024'],
    },
    {
      claim: 'For preventing fractures, taken alone',
      grade: 'F',
      body: `A 2014 Cochrane review found high-quality evidence that vitamin D on its own is unlikely to prevent hip fractures (11 trials, 27,693 people) or fractures of any kind. The VITAL trial then gave 25,871 generally healthy adults 2,000 IU a day or a placebo for about five years and found no difference in total, non-vertebral or hip fractures.

Very large occasional doses may do harm. In a trial of 2,256 older women, a single 500,000 IU dose each autumn or winter increased falls by 15 per cent and fractures by 26 per cent compared with placebo.`,
      refs: ['cochrane-fractures-2014', 'vital-fractures-2022', 'sanders-2010'],
    },
    {
      claim: 'For fractures in older people, taken with calcium',
      grade: 'B',
      body: 'The same Cochrane review found that vitamin D combined with calcium slightly reduces hip fractures (nine trials, 49,853 people; risk ratio 0.84). In people living at home that is about one fewer hip fracture per 1,000 people a year; in care homes, where fractures are far more common, about nine fewer. The combination also slightly increased stomach and bowel symptoms and kidney problems, so it is a decision for people at real risk rather than a default.',
      refs: ['cochrane-fractures-2014'],
    },
    {
      claim: 'For preventing cancer or heart disease',
      grade: 'F',
      body: 'VITAL was designed to answer this. Among 25,871 adults taking 2,000 IU a day or a placebo, vitamin D did not reduce invasive cancer (hazard ratio 0.96) or major cardiovascular events such as heart attack and stroke (0.97). A secondary analysis hinted at fewer cancer deaths, but the result was not statistically significant. Observational studies link low vitamin D to worse health, but that has not translated into benefit from supplementing people who were not deficient.',
      refs: ['vital-2019'],
    },
    {
      claim: 'For colds and chest infections',
      grade: 'C',
      body: `A 2017 analysis of individual data from 25 trials and 11,321 people found vitamin D modestly reduced acute respiratory infections, with the clearest benefit in people who were very deficient and took it daily or weekly rather than in large occasional doses.

A 2025 update, pooling 40 trials and 61,589 people, found a similar-sized effect that was no longer statistically significant. The honest reading is a possible small benefit, mostly for people who are low to begin with — not a reason for anyone else to take more.`,
      refs: ['martineau-2017', 'jolliffe-2025'],
    },
  ],
  whoShouldTake: `In the UK, the NHS advises everyone — including pregnant and breastfeeding women — to consider a daily supplement of 10 micrograms (400 IU) from October to March. It advises taking it all year if you are not often outdoors, live in a care home, usually wear clothes that cover most of your skin outdoors, or have dark skin. Breastfed babies should have 8.5 to 10 micrograms a day from birth, and children aged 1 to 4 years 10 micrograms a day all year.

The Endocrine Society's 2024 guideline suggests a daily vitamin D supplement for children and teenagers, adults over 75, people who are pregnant, and people with high-risk prediabetes. It suggests against taking more than the recommended amounts to prevent disease in healthy adults under 75 — and against routine blood tests for vitamin D, including in people with dark skin or obesity.

That last point reverses a common habit. For most people, the useful step is the small seasonal dose, not a blood test. Testing is for someone with symptoms, a condition that affects absorption, or a doctor's reason to check.`,
  dosage: `The NHS amount is 10 micrograms (400 IU) a day for adults and children over one. In the US, the recommended amount from food and supplements together is 15 micrograms (600 IU) a day up to age 70 and 20 micrograms (800 IU) over 70. The upper limit for adults is 100 micrograms (4,000 IU) a day; the NHS sets lower limits for children, at 50 micrograms for ages 1 to 10 and 25 micrograms for babies.

Take it daily rather than in large occasional doses. The Endocrine Society prefers daily dosing for people over 50, the respiratory-infection benefit appeared only with daily or weekly dosing, and an annual 500,000 IU dose increased falls and fractures in older women. Vitamin D is fat-soluble, so taking it with a meal is a sensible habit.

D3 or D2? In a 2012 meta-analysis, D3 raised blood levels more than D2 when given as large, infrequent doses; with daily dosing the difference was not significant. For a daily supplement either works. Vegans can use D2, or D3 made from lichen.`,
  studiedDose: {
    min: 10,
    max: 100,
    unit: 'mcg',
    per: 'day',
    basis: 'NHS daily amount to adult upper limit',
  },
  dosageGap: `In this category the usual problem is too much, not too little. Most single-ingredient supplements are 25 micrograms (1,000 IU) or 50 micrograms (2,000 IU) — two and a half to five times the NHS amount, but still within the upper limit — while "high-strength" 4,000 and 5,000 IU products sit at or above it. None of the extra has been shown to benefit healthy adults.

Units cause the rest. The same product may say 25 mcg on one line and 1,000 IU on another, and because the two differ by a factor of forty, comparing a microgram figure with an IU figure can be badly wrong. Add up everything you take: a multivitamin, a separate vitamin D and fortified foods can together pass the limit.`,
  safety: `At normal doses vitamin D is very safe, and you cannot overdose on it from sunlight. Taking too much from supplements over a long period can raise the amount of calcium in the blood (hypercalcaemia), which the NHS warns can weaken the bones and damage the kidneys and the heart. In the Cochrane review, supplements slightly increased mild hypercalcaemia, and vitamin D with calcium slightly increased kidney problems.

Ask a doctor or pharmacist before taking vitamin D if you have kidney disease or a condition that affects calcium levels, or if you take medicines that interact with it — including some diuretics, steroids such as prednisone, the weight-loss medicine orlistat, and some statins.`,
  faqs: [
    {
      question: 'Should I take vitamin D every day?',
      answer:
        'In the UK, the NHS advises everyone to consider 10 micrograms (400 IU) a day from October to March, and all year if you get little sun, cover most of your skin or have dark skin. From April to September most people make enough from sunlight. There is no benefit in taking more than the recommended amount if you are healthy.',
    },
    {
      question: 'Is 1,000 IU of vitamin D too much?',
      answer:
        'No. 1,000 IU is 25 micrograms: more than the NHS amount of 10 micrograms, but a quarter of the 100 microgram (4,000 IU) upper limit for adults. It is a safe daily dose for most adults, though there is no evidence it does more than a smaller one for someone who is not deficient.',
    },
    {
      question: 'Is 25 mcg the same as 1,000 IU?',
      answer:
        'Yes. Micrograms and IU are two units for the same amount, and 1 microgram equals 40 IU. Labels differ in which they lead with, which is how comparisons between brands go wrong.',
    },
    {
      question: 'Should I get my vitamin D level tested?',
      answer:
        'Not routinely. The Endocrine Society’s 2024 guideline advises against routine vitamin D blood tests in healthy people, including those with dark skin or obesity. A test makes sense if you have symptoms, a condition that affects absorption, or your doctor has a reason to check.',
    },
    {
      question: 'Is vitamin D3 better than D2?',
      answer:
        'D3 raises blood levels more when taken as large, infrequent doses, but with daily dosing a 2012 meta-analysis found no significant difference. For an everyday supplement either is fine. D2, or D3 from lichen, suits vegans.',
    },
    {
      question: 'Can I get enough vitamin D from the sun?',
      answer:
        'In the UK, from about late March or early April to the end of September, most people can make all they need from sunlight. From October to March the sun is too weak, which is why a supplement is advised then. You cannot overdose on vitamin D from the sun, but protect your skin from burning.',
    },
    {
      question: 'Does vitamin D prevent colds?',
      answer:
        'Possibly a little, mainly in people who are very low to begin with. A 2017 analysis of 25 trials found a modest reduction in respiratory infections, but a 2025 update of 40 trials found the effect was no longer statistically significant.',
    },
    {
      question: 'Can you take too much vitamin D?',
      answer:
        'Yes. The adult upper limit is 100 micrograms (4,000 IU) a day. Taking too much from supplements over a long time raises blood calcium, which can weaken bones and damage the kidneys and heart. Very large occasional doses have also been linked to more falls and fractures in older women.',
    },
  ],
  references: [
    {
      id: 'nhs-vitamin-d',
      text: 'NHS. Vitamin D (last reviewed 3 August 2020) — 10 micrograms a day in autumn and winter, all year for at-risk groups; sources; the 100 microgram upper limit; hypercalcaemia.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/',
    },
    {
      id: 'nhs-pregnancy',
      text: 'NHS. Pregnancy vitamins and supplements (last reviewed 3 June 2026) — 10 micrograms of vitamin D a day from early October to late March.',
      url: 'https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/',
    },
    {
      id: 'medlineplus-vitamin-d',
      text: 'MedlinePlus. Vitamin D (reviewed 21 January 2025) — 600 IU a day for ages 19–70, 800 IU over 70; upper limit 4,000 IU.',
      url: 'https://medlineplus.gov/ency/article/002405.htm',
    },
    {
      id: 'ods-vitd',
      text: 'NIH Office of Dietary Supplements. Vitamin D — Fact Sheet for Health Professionals.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
    },
    {
      id: 'endocrine-2024',
      text: 'Demay MB et al. (2024). Vitamin D for the prevention of disease: an Endocrine Society clinical practice guideline. Journal of Clinical Endocrinology & Metabolism 109(8):1907-1947.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38828931/',
    },
    {
      id: 'vital-2019',
      text: 'Manson JE et al. (2019). Vitamin D supplements and prevention of cancer and cardiovascular disease. New England Journal of Medicine 380(1):33-44 — VITAL, 25,871 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30415629/',
    },
    {
      id: 'vital-fractures-2022',
      text: 'LeBoff MS et al. (2022). Supplemental vitamin D and incident fractures in midlife and older adults. New England Journal of Medicine 387(4):299-309.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35939577/',
    },
    {
      id: 'cochrane-fractures-2014',
      text: 'Avenell A et al. (2014). Vitamin D and vitamin D analogues for preventing fractures in post-menopausal women and older men. Cochrane Database of Systematic Reviews CD000227 — 53 trials, 91,791 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24729336/',
    },
    {
      id: 'sanders-2010',
      text: 'Sanders KM et al. (2010). Annual high-dose oral vitamin D and falls and fractures in older women: a randomized controlled trial. JAMA 303(18):1815-1822.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20460620/',
    },
    {
      id: 'martineau-2017',
      text: 'Martineau AR et al. (2017). Vitamin D supplementation to prevent acute respiratory tract infections: systematic review and meta-analysis of individual participant data. BMJ 356:i6583.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28202713/',
    },
    {
      id: 'jolliffe-2025',
      text: 'Jolliffe DA et al. (2025). Vitamin D supplementation to prevent acute respiratory infections: systematic review and meta-analysis of stratified aggregate data. Lancet Diabetes & Endocrinology 13(4):307-320.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39993397/',
    },
    {
      id: 'tripkovic-2012',
      text: 'Tripkovic L et al. (2012). Comparison of vitamin D2 and vitamin D3 supplementation in raising serum 25-hydroxyvitamin D status: a systematic review and meta-analysis. American Journal of Clinical Nutrition 95(6):1357-1364.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22552031/',
    },
  ],
  editorNote:
    'Vitamin D is the rare supplement most people in the UK genuinely benefit from — for about six months of the year, at a dose that costs pennies. It is also one of the most oversold. The same trials that justify the winter dose show that more does not protect your heart, prevent cancer or stop fractures in healthy people. Take the small dose, skip the 5,000 IU tub, and do not pay for a blood test nobody asked for.',
  related: ['folic-acid', 'vitamin-b12', 'omega-3'],
  history: [
    { date: '2026-09-21', note: 'First published with per-claim evidence grades.' },
    { date: '2026-09-21', note: 'Related-ingredient links extended as the reference set grew.' },
    {
      date: '2026-09-27',
      note: 'Rewritten to cover vitamin D as a whole, and renamed from "Vitamin D3". Added NHS seasonal advice and the Endocrine Society 2024 guideline, which advises against routine testing — replacing our earlier advice to test first. Added the VITAL fracture results, the Cochrane fracture review, the annual high-dose trial and the 2025 respiratory-infection meta-analysis, and revised the fracture and infection grades to match.',
    },
  ],
  updated: '2026-09-27',
};

export const folicAcid: IngredientPage = {
  slug: 'folic-acid',
  name: 'Folic acid',
  seoTitle: 'Folic Acid: Who Needs It and How Much',
  seoDescription:
    'Folic acid prevents most spina bifida when started before pregnancy: 400 mcg a day, or 5 mg if higher-risk. What else it does, and what it does not.',
  aliases: [
    'folic acid',
    'folate',
    'vitamin b9',
    'methylfolate',
    'l-methylfolate',
    '5-mthf',
    'folinic acid',
  ],
  category: 'Water-soluble B vitamin',
  grade: 'A',
  quickAnswer:
    'Folic acid is the manufactured form of folate, a B vitamin the body needs to make DNA and new cells. Its best-proven use is one of the strongest in nutrition: taken every day from before conception until 12 weeks of pregnancy, it prevents most neural tube defects such as spina bifida. That is why anyone who could become pregnant is advised to take 400 micrograms a day. For most other claims — heart disease, memory, cancer — trials in well-fed populations show little or no benefit.',
  atAGlance: [
    {
      label: 'Before and in early pregnancy',
      value: '400 mcg a day',
      note: 'From before you stop contraception until 12 weeks of pregnancy (NHS). The USPSTF advises 400–800 mcg.',
    },
    {
      label: 'Higher-risk pregnancy',
      value: '5 mg a day, on prescription',
      note: 'For example with diabetes, a previous affected pregnancy, or some epilepsy and HIV medicines.',
    },
    {
      label: 'Neural tube defects prevented',
      value: 'About 7 in 10',
      note: 'Cochrane review: risk ratio 0.31 across five trials and 6,708 births.',
    },
    {
      label: 'Adults need from food',
      value: '200 mcg (UK) · 400 mcg DFE (US)',
      note: 'Leafy greens, peas, beans, chickpeas and fortified cereals.',
    },
    {
      label: 'Upper limit from supplements',
      value: '1 mg (1,000 mcg) a day',
      note: 'Higher doses can hide a vitamin B12 deficiency while it damages nerves.',
    },
    {
      label: 'UK flour fortification',
      value: 'From 13 December 2026',
      note: '0.25 mg per 100 g of non-wholemeal wheat flour, expected to prevent around 200 neural tube defects a year.',
    },
  ],
  whatIsIt: `Folate is vitamin B9. The word covers the forms found naturally in food — broccoli, Brussels sprouts, leafy greens, peas, chickpeas, kidney beans and liver — and folic acid, the stable manufactured form used in supplements and fortified foods. The body absorbs folic acid better than food folate: 240 micrograms of folic acid counts the same as 400 micrograms of food folate, which is why US labels give amounts in "dietary folate equivalents" (DFE).

Supplements also sell "methylfolate" (5-MTHF), the form the body uses directly, often marketed as better for people with a variant of the MTHFR gene. The US Centers for Disease Control and Prevention says that is not true. More than half of people in the US carry at least one copy of the common variant, and they can process folic acid; folic acid is the only form of folate shown in trials to prevent neural tube defects.`,
  mechanism: `Folate carries the single-carbon units cells need to build DNA and divide, and — together with vitamin B12 — to recycle homocysteine into methionine. Tissues that divide quickly depend on it most: blood cells, and an embryo in its first weeks. Too little causes megaloblastic anaemia, in which red blood cells are large and immature.

The neural tube, which becomes the brain and spinal cord, forms and closes within the first month after conception — often before someone knows they are pregnant. That timing is the whole reason folic acid has to be taken before pregnancy rather than after a positive test.`,
  claims: [
    {
      claim: 'For preventing neural tube defects',
      grade: 'A',
      body: `Among the strongest findings in nutrition. In the 1991 MRC Vitamin Study, 1,817 women who had already had an affected pregnancy took folic acid or not around conception: folic acid cut the recurrence of neural tube defects by 72 per cent. A 1992 Hungarian trial then tested first occurrence, giving women planning a pregnancy a multivitamin with 0.8 mg of folic acid or a trace-element tablet: there were six neural tube defects in the comparison group and none in the vitamin group.

A 2015 Cochrane review of five trials and 6,708 births found folic acid, alone or with other vitamins, reduced neural tube defects by about 70 per cent (risk ratio 0.31), with the same effect at 400 micrograms or higher. It found no clear effect on other birth defects such as cleft lip and palate or heart defects, or on miscarriage. The US Preventive Services Task Force gives the recommendation its highest grade.`,
      refs: ['mrc-1991', 'czeizel-1992', 'cochrane-ntd-2015', 'uspstf-folic-2023'],
    },
    {
      claim: 'For preventing stroke in people with high blood pressure',
      grade: 'C',
      body: 'The CSPPT trial gave 20,702 adults with high blood pressure in China — where food is not fortified with folic acid — either a blood-pressure tablet or the same tablet with 0.8 mg of folic acid, for about four and a half years. First strokes fell from 3.4 to 2.7 per cent (hazard ratio 0.79). It is a single trial in a population with low folate, and the result should not be assumed to carry over to countries where flour is already fortified.',
      refs: ['csppt-2015'],
    },
    {
      claim: 'For heart disease',
      grade: 'F',
      body: 'Folic acid, with vitamins B6 and B12, lowers blood homocysteine, a compound linked to heart attacks and strokes. But trials found that lowering homocysteine with B vitamins did not reduce heart disease or stroke, so the link does not translate into a reason to take them.',
      refs: ['ods-b12'],
    },
    {
      claim: 'For preventing cancer',
      grade: 'F',
      body: 'A meta-analysis of about 50,000 people in folic acid trials, summarised by the CDC, found no increase or decrease in cancer. The NIH notes that high doses might raise the risk of colorectal cancer in some people — one reason not to exceed 1 mg a day without medical advice.',
      refs: ['cdc-safety', 'ods-folate'],
    },
  ],
  whoShouldTake: `Anyone who could become pregnant should take 400 micrograms of folic acid a day. The NHS advises starting before you stop using contraception — ideally three months before — and continuing until you are 12 weeks pregnant; if you find you are pregnant and have not been taking it, start straight away. The US Preventive Services Task Force recommends 400 to 800 micrograms a day for everyone planning to or able to become pregnant.

A higher dose of 5 mg a day, available on prescription, is advised if you or the baby's biological father have a neural tube defect or a family history of one, if you have had a previous affected pregnancy, if you have diabetes, sickle cell anaemia or thalassaemia, or if you take epilepsy or HIV medicines. Ask your GP.

Most other adults eating a varied diet do not need a folic acid supplement. From 13 December 2026, non-wholemeal wheat flour in the UK must be fortified with folic acid, which the government expects to prevent around 200 neural tube defects a year — about a fifth of the UK total. It is a safety net for unplanned pregnancies, not a substitute: the NHS advice to take a daily supplement continues.`,
  dosage: `For pregnancy, 400 micrograms a day, or 5 mg on prescription for higher-risk pregnancies. In the Cochrane review, 400 micrograms worked as well as higher doses. Pregnancy multivitamins usually contain 400 micrograms — check the label, and avoid any that contain vitamin A (retinol), which the NHS advises against in pregnancy.

Adults need about 200 micrograms of folate a day from food in the UK, or 400 micrograms DFE in the US. The NHS says 1 mg or less a day of folic acid from supplements is unlikely to cause harm; the US upper limit is 1,000 micrograms a day from supplements and fortified foods combined. Folate that occurs naturally in food does not count towards the limit.`,
  studiedDose: {
    min: 400,
    max: 800,
    unit: 'mcg',
    per: 'day',
    basis: 'USPSTF recommended range',
  },
  dosageGap: `Most pregnancy supplements contain the right amount. The gap is timing: the neural tube closes within a month of conception, and the trials gave folic acid before pregnancy. A tablet started at the first scan arrives after the window it protects.

The other gap is marketing. Methylfolate products are sold as "active" or better absorbed, often at several times the price, and pitched at people with MTHFR variants. The CDC says people with those variants can use folic acid, and that folic acid is the only form of folate proven to prevent neural tube defects.`,
  safety: `At the recommended amount, folic acid is safe: the CDC states that 400 micrograms a day has not been shown to cause harm.

Doses above 1 mg a day can hide a vitamin B12 deficiency. Folic acid corrects the anaemia that low B12 causes but not the nerve damage, which can progress unnoticed and become permanent — a particular concern for older people, whose B12 absorption falls with age.

Folic acid interacts with some medicines. It could interfere with methotrexate taken for cancer; anti-seizure medicines such as phenytoin, carbamazepine and valproate can lower folate, and folic acid can lower their blood levels; and sulfasalazine, used for ulcerative colitis, reduces folate absorption. Some people taking these medicines are prescribed folic acid deliberately, so follow your prescriber's advice.`,
  faqs: [
    {
      question: 'When should I start taking folic acid?',
      answer:
        'Before you get pregnant. The NHS advises starting before you stop using contraception — ideally three months before — and taking 400 micrograms a day until you are 12 weeks pregnant. The neural tube forms within the first month of pregnancy, often before a test is positive.',
    },
    {
      question: 'What if I am pregnant and have not been taking folic acid?',
      answer:
        'Start taking 400 micrograms a day as soon as you know, and continue until you are 12 weeks pregnant. Tell your midwife or GP, especially if any of the higher-risk factors apply to you.',
    },
    {
      question: 'Is folate the same as folic acid?',
      answer:
        'Folate is vitamin B9 in all its forms, including the natural forms in food. Folic acid is the manufactured form used in supplements and fortified foods. The body absorbs folic acid better, and it is the form proven in trials to prevent neural tube defects.',
    },
    {
      question: 'Do I need methylfolate if I have an MTHFR gene variant?',
      answer:
        'No. The CDC says people with MTHFR variants — more than half of people in the US carry at least one copy — can process folic acid, and folic acid is the only form of folate shown to prevent neural tube defects.',
    },
    {
      question: 'Who needs the 5 mg dose of folic acid?',
      answer:
        'The NHS advises 5 mg, on prescription, if you or the baby’s biological father have a neural tube defect or a family history of one, if you have had an affected pregnancy, if you have diabetes, sickle cell anaemia or thalassaemia, or if you take epilepsy or HIV medicines.',
    },
    {
      question: 'Can you take too much folic acid?',
      answer:
        'Yes. The NHS says 1 mg or less a day is unlikely to cause harm, but higher doses can hide a vitamin B12 deficiency, which can go on to damage nerves permanently. Take more than 1 mg only if a doctor prescribes it.',
    },
    {
      question: 'Do I still need a supplement once flour is fortified?',
      answer:
        'Yes, if you could become pregnant. UK fortification of non-wholemeal wheat flour from December 2026 is a safety net, and the NHS advice to take 400 micrograms a day before and in early pregnancy continues.',
    },
  ],
  references: [
    {
      id: 'nhs-pregnancy',
      text: 'NHS. Pregnancy vitamins and supplements (last reviewed 3 June 2026) — 400 micrograms of folic acid, the 5 mg dose and who needs it, and the vitamin A warning.',
      url: 'https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/',
    },
    {
      id: 'nhs-vitamin-b',
      text: 'NHS. B vitamins and folic acid — adults need 200 micrograms of folate a day; 1 mg or less of folic acid is unlikely to cause harm; higher doses can mask B12 deficiency.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-b/',
    },
    {
      id: 'uspstf-folic-2023',
      text: 'US Preventive Services Task Force (2023). Folic acid supplementation to prevent neural tube defects: reaffirmation recommendation statement. JAMA 330(5):454-459 — 400 to 800 micrograms a day, grade A.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/37526713/',
    },
    {
      id: 'mrc-1991',
      text: 'MRC Vitamin Study Research Group (1991). Prevention of neural tube defects: results of the Medical Research Council Vitamin Study. Lancet 338(8760):131-137 — 1,817 women, 72 per cent protective effect.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1677062/',
    },
    {
      id: 'czeizel-1992',
      text: 'Czeizel AE, Dudás I (1992). Prevention of the first occurrence of neural-tube defects by periconceptional vitamin supplementation. New England Journal of Medicine 327(26):1832-1835.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/1307234/',
    },
    {
      id: 'cochrane-ntd-2015',
      text: 'De-Regil LM et al. (2015). Effects and safety of periconceptional oral folate supplementation for preventing birth defects. Cochrane Database of Systematic Reviews CD007950 — five trials, 6,708 births, risk ratio 0.31.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26662928/',
    },
    {
      id: 'csppt-2015',
      text: 'Huo Y et al. (2015). Efficacy of folic acid therapy in primary prevention of stroke among adults with hypertension in China: the CSPPT randomized clinical trial. JAMA 313(13):1325-1335.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/25771069/',
    },
    {
      id: 'cdc-mthfr',
      text: 'US Centers for Disease Control and Prevention. MTHFR gene variant and folic acid facts (16 July 2026).',
      url: 'https://www.cdc.gov/folic-acid/data-research/mthfr/index.html',
    },
    {
      id: 'cdc-safety',
      text: 'US Centers for Disease Control and Prevention. Folic acid safety, interactions and health outcomes (15 July 2026) — 400 micrograms a day not shown to cause harm; no change in cancer in a meta-analysis of about 50,000 people.',
      url: 'https://www.cdc.gov/folic-acid/about/safety.html',
    },
    {
      id: 'ods-folate',
      text: 'NIH Office of Dietary Supplements. Folate fact sheet for consumers (updated 1 November 2022) — dietary folate equivalents, the upper limit, high-dose risks and medicine interactions.',
      url: 'https://ods.od.nih.gov/factsheets/Folate-Consumer/',
    },
    {
      id: 'ods-b12',
      text: 'NIH Office of Dietary Supplements. Vitamin B12 fact sheet for consumers (updated 15 December 2023) — B vitamins lower homocysteine but do not reduce cardiovascular disease or stroke.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/',
    },
    {
      id: 'uk-fortification',
      text: 'GOV.UK. Bread and flour: labelling and composition — folic acid at 0.250 mg per 100 g of non-wholemeal wheat flour from 13 December 2026; and Folic acid added to flour to prevent spinal conditions in babies (20 September 2021) — around 200 neural tube defects a year.',
      url: 'https://www.gov.uk/guidance/bread-and-flour-labelling-and-composition',
    },
  ],
  editorNote:
    'Folic acid is the clearest case in this reference section of a supplement doing something big: a tablet costing pennies prevents most cases of a serious birth defect. It is also the one most often started too late. If you could become pregnant, the time to take it is now, not after the test — and the ordinary 400 microgram tablet does the job. The premium "active folate" version has no evidence that it does it better.',
  related: ['vitamin-b12', 'vitamin-d3'],
  history: [
    {
      date: '2026-09-27',
      note: 'First published with per-claim evidence grades. Advice checked against the NHS, USPSTF, CDC, NIH and UK government sources listed, and the trials behind them.',
    },
  ],
  updated: '2026-09-27',
};

export const vitaminB12: IngredientPage = {
  slug: 'vitamin-b12',
  name: 'Vitamin B12',
  seoTitle: 'Vitamin B12: Who Needs It and How Much',
  seoDescription:
    'Vegans and most over-50s need a reliable B12 source; metformin and acid-reducing drugs lower it. Doses, forms, signs of deficiency and the energy myth.',
  aliases: [
    'vitamin b12',
    'vitamin b-12',
    'b12',
    'cobalamin',
    'cyanocobalamin',
    'methylcobalamin',
    'hydroxocobalamin',
    'adenosylcobalamin',
  ],
  category: 'Water-soluble B vitamin',
  grade: 'A',
  quickAnswer:
    'Vitamin B12 keeps nerves and red blood cells healthy, and it is found naturally only in animal foods. Most people who eat meat, fish, eggs or dairy get enough, but three groups often do not: vegans, people over 50 — many of whom absorb less from food — and people on long-term metformin or stomach-acid medicines. For them a supplement or fortified food is worthwhile, and deficiency deserves attention because it can damage nerves permanently. For everyone else, extra B12 does not boost energy.',
  atAGlance: [
    {
      label: 'Adults need',
      value: '1.5 mcg (UK) · 2.4 mcg (US)',
      note: 'A day. Slightly more in pregnancy (2.6 mcg) and breastfeeding (2.8 mcg).',
    },
    {
      label: 'Vegan supplement',
      value: '10 mcg a day or 2,000 mcg a week',
      note: 'The Vegan Society’s advice. Smaller amounts are absorbed better, so a weekly dose has to be larger.',
    },
    {
      label: 'Deficiency in older adults',
      value: '3% to 43%',
      note: 'Depending on the study. Many older people make too little stomach acid to free B12 from food.',
    },
    {
      label: 'Metformin, 4.3 years',
      value: '19% lower B12',
      note: 'In a randomised trial, with 7.2 percentage points more people deficient than on placebo.',
    },
    {
      label: 'Upper limit',
      value: 'None set',
      note: 'No harm has been shown even at high doses; the body absorbs only a small share of a large one.',
    },
    {
      label: 'Tablets vs injections',
      value: 'Similar at 1,000–2,000 mcg a day',
      note: 'For correcting deficiency, in small, low-quality trials. Injections remain usual for pernicious anaemia.',
    },
  ],
  whatIsIt: `Vitamin B12, or cobalamin, is a water-soluble vitamin made by bacteria rather than by plants or animals. Animals take it in through their food and gut bacteria, which is why it is found naturally only in animal foods: meat, fish, eggs, milk and cheese. Plant foods contain none unless it has been added, as in some breakfast cereals, plant milks and nutritional yeast.

Supplements use cyanocobalamin, the most common form, or methylcobalamin, adenosylcobalamin or hydroxocobalamin. The NIH says research has not shown any one form to be better than the others.

The body stores 1,000 to 2,000 times the amount you would normally eat in a day, mostly in the liver. That is why a deficiency takes years to develop — and why it is easy to miss.`,
  mechanism: `B12 is needed to make red blood cells, to maintain the protective sheath around nerves, and — with folate — to make DNA and recycle homocysteine. Too little causes megaloblastic anaemia and nerve damage, and the nerve damage can occur even without anaemia.

Absorbing B12 from food takes two steps. Stomach acid first frees it from the protein it is bound to; it then combines with intrinsic factor, a protein made by the stomach, and the pair is absorbed in the small intestine. Anything that disrupts either step causes deficiency even on a good diet: low stomach acid with age or medicines, pernicious anaemia (an autoimmune condition in which the body makes no intrinsic factor), stomach or bowel surgery, and coeliac or Crohn's disease.

B12 in supplements and fortified foods is not bound to protein, so it skips the first step — which is why people over 50 are advised to rely on those sources. A small share of any large dose is absorbed without intrinsic factor at all, which is why very high doses by mouth can work even for some people who absorb poorly.`,
  claims: [
    {
      claim: 'For preventing and treating deficiency',
      grade: 'A',
      body: `Supplements and fortified foods reliably prevent deficiency in vegans and in older adults who absorb B12 poorly from food, and treatment reverses the anaemia. Pernicious anaemia is usually treated with injections, although very high doses by mouth might also work.

A 2018 Cochrane review compared tablets with injections for deficiency. In three small trials with 153 people, 1,000 to 2,000 micrograms a day by mouth restored blood levels about as well as injections over three to four months, at lower cost. The evidence was rated low quality, so for severe deficiency or nerve symptoms the choice is one for a doctor.`,
      refs: ['ods-b12', 'cochrane-oral-2018'],
    },
    {
      claim: 'For people taking metformin',
      grade: 'B',
      body: 'Metformin, the first-line medicine for type 2 diabetes, lowers B12. In a randomised trial of 390 people with type 2 diabetes, those taking metformin for 4.3 years had B12 levels 19 per cent lower than those on placebo, and 7.2 percentage points more of them were deficient — about one extra deficiency for every 14 people treated. The authors recommended regular B12 checks for people on metformin.',
      refs: ['dejager-2010', 'ods-b12'],
    },
    {
      claim: 'For people on long-term stomach-acid medicines',
      grade: 'C',
      body: 'Proton pump inhibitors such as omeprazole and lansoprazole, and H2 blockers, reduce the stomach acid needed to free B12 from food. A US study comparing 25,956 people diagnosed with B12 deficiency with 184,199 without found that two or more years of proton pump inhibitor use was linked to higher odds of deficiency. The study was observational, but the mechanism is clear enough that long-term users should ask about a check.',
      refs: ['lam-2013', 'ods-b12'],
    },
    {
      claim: 'For energy, fatigue or athletic performance',
      grade: 'F',
      body: 'B12 is widely sold for energy and endurance. The NIH is explicit that it does not provide these benefits in people who already get enough from their diet. Tiredness from genuine deficiency improves with treatment; tiredness from anything else does not.',
      refs: ['ods-b12'],
    },
    {
      claim: 'For heart disease and stroke',
      grade: 'F',
      body: 'B12, with folic acid and B6, lowers blood homocysteine, a compound linked to heart attack and stroke. But trials show that taking these vitamins does not reduce the risk of cardiovascular disease or stroke.',
      refs: ['ods-b12'],
    },
    {
      claim: 'For memory and preventing dementia',
      grade: 'D',
      body: 'Deficiency can cause confusion and memory problems, and those improve with treatment. For people who are not deficient, most studies find B12 levels do not affect the risk of cognitive decline, and the NIH says more trials are needed before supplements could be recommended for it.',
      refs: ['ods-b12'],
    },
  ],
  whoShouldTake: `Vegans, and vegetarians who eat few eggs or dairy foods, need a reliable source every day: a supplement, or foods fortified with B12. The Vegan Society advises either at least 10 micrograms a day or at least 2,000 micrograms once a week. This matters most in pregnancy and breastfeeding, when a vegan mother's baby can also become deficient.

People over 50 should get most of their B12 from fortified foods or supplements, according to the NIH, because many absorb less from food as stomach acid falls with age.

If you take metformin or a stomach-acid medicine long term, ask your doctor whether your B12 should be checked. After weight-loss surgery, or with pernicious anaemia, coeliac or Crohn's disease, B12 needs specialist management, often with injections.

Symptoms of deficiency include tiredness, weakness, pale skin, palpitations, pins and needles in the hands and feet, balance problems, memory problems and a sore mouth or tongue. They can take years to appear. If you have them, see your GP for a blood test rather than guessing.`,
  dosage: `Adults need about 1.5 micrograms a day in the UK; the US recommended amount is 2.4 micrograms, rising to 2.6 in pregnancy and 2.8 while breastfeeding. Most people who eat animal foods get this from their diet.

Supplements commonly contain 10 to 1,000 micrograms. The body absorbs a smaller share as the dose rises, so larger, less frequent doses make up for it — which is why the Vegan Society's advice is either 10 micrograms daily or 2,000 micrograms weekly. Treating a diagnosed deficiency is a job for a doctor, with injections or high-dose tablets.`,
  studiedDose: {
    min: 2.4,
    max: 2000,
    unit: 'mcg',
    per: 'day',
    basis: 'US recommended amount to oral deficiency-treatment dose',
  },
  dosageGap: `Most B12 products contain far more than anyone needs: 500 or 1,000 micrograms is hundreds of times the daily requirement. That is not dangerous, because only a small share is absorbed, but it undercuts "high-strength" premiums. For a vegan, a cheap 10 to 50 microgram daily tablet covers it.

The form is marketed more than it matters. Methylcobalamin is sold as "active" and better absorbed, and under-the-tongue sprays and lozenges as faster; the NIH says research has not shown any form of B12 to be better than the others.`,
  safety: `No upper limit has been set for B12, and the NIH says it has not been shown to cause harm even at high doses. Some studies link high blood levels of B12 with a higher risk of cancer, while others find the opposite or no link; more evidence is needed.

The important interactions run the other way: metformin, proton pump inhibitors and H2 blockers can lower your B12. And folic acid above 1 mg a day can hide a B12 deficiency by correcting the anaemia but not the nerve damage — a particular concern for older people.`,
  faqs: [
    {
      question: 'Do vegans need B12 supplements?',
      answer:
        'Yes. B12 is found naturally only in animal foods, so vegans need a supplement or fortified foods. The Vegan Society advises at least 10 micrograms a day or at least 2,000 micrograms once a week. Deficiency builds slowly and can damage nerves, so do not wait for symptoms.',
    },
    {
      question: 'How much vitamin B12 should I take a day?',
      answer:
        'If you eat animal foods and are under 50, probably none from supplements. Adults need 1.5 micrograms a day (UK) or 2.4 micrograms (US). Vegans should take at least 10 micrograms daily, and people over 50 should get most of their B12 from fortified foods or a supplement.',
    },
    {
      question: 'Is methylcobalamin better than cyanocobalamin?',
      answer:
        'There is no good evidence that it is. The NIH says research has not shown any form of B12 to be better than the others. Cyanocobalamin is the most common and usually the cheapest.',
    },
    {
      question: 'Does vitamin B12 give you energy?',
      answer:
        'Only if you were deficient. The NIH says B12 does not improve energy or athletic performance in people who already get enough. If you are tired all the time, see your GP rather than assuming it is B12.',
    },
    {
      question: 'What are the signs of B12 deficiency?',
      answer:
        'Tiredness, weakness, pale skin, palpitations, pins and needles, balance problems, memory problems, low mood and a sore mouth or tongue. Because the body stores years’ worth, symptoms can take a long time to appear. A blood test confirms it.',
    },
    {
      question: 'Can you take too much vitamin B12?',
      answer:
        'No upper limit has been set, and B12 has not been shown to cause harm even at high doses, because the body absorbs only a small share of a large dose. That also means very high doses are usually unnecessary.',
    },
    {
      question: 'Does metformin cause B12 deficiency?',
      answer:
        'It raises the risk. In a randomised trial, people taking metformin for 4.3 years had 19 per cent lower B12 than those on placebo, and more of them became deficient. If you take metformin long term, ask your doctor about checking your level.',
    },
    {
      question: 'Are B12 tablets as good as injections?',
      answer:
        'For correcting a deficiency, a 2018 Cochrane review found 1,000 to 2,000 micrograms a day by mouth worked about as well as injections, though the trials were small. Pernicious anaemia and deficiency with nerve symptoms are usually treated with injections, on a doctor’s advice.',
    },
  ],
  references: [
    {
      id: 'ods-b12',
      text: 'NIH Office of Dietary Supplements. Vitamin B12 fact sheet for consumers (updated 15 December 2023) — recommended amounts, absorption, groups at risk, forms, medicine interactions, and the evidence on energy, heart disease and cognition.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/',
    },
    {
      id: 'nhs-vitamin-b',
      text: 'NHS. B vitamins and folic acid — adults aged 19 to 64 need about 1.5 micrograms of vitamin B12 a day; high-dose folic acid can mask B12 deficiency.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-b/',
    },
    {
      id: 'vegan-society-b12',
      text: 'The Vegan Society. What every vegan should know about vitamin B12 — at least 10 micrograms a day or at least 2,000 micrograms a week.',
      url: 'https://www.vegansociety.com/resources/nutrition-and-health/nutrients/vitamin-b12/what-every-vegan-should-know-about-vitamin-b12',
    },
    {
      id: 'dejager-2010',
      text: 'de Jager J et al. (2010). Long term treatment with metformin in patients with type 2 diabetes and risk of vitamin B-12 deficiency: randomised placebo controlled trial. BMJ 340:c2181 — 390 patients, 4.3 years.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20488910/',
    },
    {
      id: 'lam-2013',
      text: 'Lam JR et al. (2013). Proton pump inhibitor and histamine 2 receptor antagonist use and vitamin B12 deficiency. JAMA 310(22):2435-2442 — 25,956 cases and 184,199 controls.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24327038/',
    },
    {
      id: 'cochrane-oral-2018',
      text: 'Wang H et al. (2018). Oral vitamin B12 versus intramuscular vitamin B12 for vitamin B12 deficiency. Cochrane Database of Systematic Reviews CD004655 — three trials, 153 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29543316/',
    },
  ],
  editorNote:
    'B12 is the vitamin where the dose on the label matters least and the person taking it matters most. A vegan needs it, without exception, and a 70-year-old on metformin should have their level checked. For a meat-eater in their thirties, a B12 "energy" supplement is money spent on a nutrient they almost certainly already have.',
  related: ['folic-acid', 'vitamin-d3'],
  history: [
    {
      date: '2026-09-27',
      note: 'First published with per-claim evidence grades. Advice checked against the NIH, NHS and Vegan Society sources listed, and the trials behind them.',
    },
  ],
  updated: '2026-09-27',
};
