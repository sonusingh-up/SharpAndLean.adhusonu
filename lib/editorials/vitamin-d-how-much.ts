import type { Collection } from '../types';

/*
 * Practical companion to the vitamin D ingredient page
 * (lib/ingredient-pages/vitamins.ts) and the daily-vitamins guide: the dose
 * by age, the form to buy, and who runs low. Amounts must agree with that
 * page and with lib/vitamins.ts, which drives the checker embedded below.
 * Status figures are NDNS (UK), NHANES (US) and UK Biobank.
 */
export const vitaminDHowMuch: Collection = {
  id: 'vitamin-d-how-much',
  kind: 'articles',
  slug: 'vitamin-d-how-much-which-form-who-is-low',
  topic: 'vitamins',
  title: 'Vitamin D: how much, which form, and who is low',
  seo_title: 'How Much Vitamin D to Take: Dose, D3 vs D2 and Who Is Low',
  seo_desc:
    'NHS advice is 10 mcg (400 IU) a day in autumn and winter; the US says 600–800 IU. D3 or D2, the units that trip people up, and who is most likely to be low.',
  summary:
    'For most adults in the UK the right amount of vitamin D is 10 micrograms (400 IU) a day from October to March, and all year if you get little sun or have dark skin. The form matters less than the marketing suggests, the units trip people up, and more is not better. Here is the dose by age, how to choose a supplement, and who is most likely to be running low.',
  is_published: true,
  about: [
    { name: 'Vitamin D', sameAs: 'https://en.wikipedia.org/wiki/Vitamin_D' },
    { name: 'Vitamin D deficiency', sameAs: 'https://en.wikipedia.org/wiki/Vitamin_D_deficiency' },
  ],
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-10-03T00:00:00Z',
  updated_at: '2026-10-03T00:00:00Z',
  takeaways: [
    'How much: 10 micrograms (400 IU) a day for UK adults and children over one from October to March, and all year if you are rarely outdoors, cover your skin or have dark skin. US advice is 600 IU a day, or 800 IU over 70.',
    'Which form: D3 and D2 both work as a daily dose. D3 raises blood levels more when taken as big, occasional doses. Vegans can use D2 or D3 made from lichen.',
    'Who is low: about one in five UK adults has low vitamin D across the year, and more than half of people of South Asian heritage in winter. People with dark skin, little sun, care-home residents and breastfed babies are most at risk.',
    'Do not go above the 100 microgram (4,000 IU) adult upper limit without medical advice, and you do not need a routine blood test to take the standard dose.',
  ],
  body: `
<h2>The short answer</h2>
<p><strong>How much:</strong> in the UK, the NHS advises adults and children over one to take <strong>10 micrograms (400 IU) of vitamin D a day from October to March</strong>, and all year round if you are not often outdoors, usually cover most of your skin, or have dark skin. In the US, the recommended amount from food and supplements together is 15 micrograms (600 IU) a day up to age 70, and 20 micrograms (800 IU) after that.</p>
<p><strong>Which form:</strong> a plain vitamin D3 tablet, capsule or spray is all most people need. D2 works as a daily dose too, and is suitable for vegans, as is D3 made from lichen.</p>
<p><strong>Who is low:</strong> roughly one in five UK adults across the year, rising sharply in winter, and far more among people with dark skin. The groups below are the ones who most need to take it seriously.</p>

<h2>How much vitamin D you need, by age</h2>
<p>Your skin makes vitamin D from the UVB in sunlight. In the UK, the sun is only strong enough to do that from about late March or early April to the end of September. For the other six months most people make little or none, which is why the NHS advice is seasonal rather than year-round for most adults.</p>
<table>
<thead><tr><th>Who</th><th>UK advice (NHS)</th><th>US recommended amount</th></tr></thead>
<tbody>
<tr><td><strong>Breastfed babies, birth to 1 year</strong></td><td>8.5–10 mcg (340–400 IU) a day, from birth</td><td>10 mcg (400 IU) a day</td></tr>
<tr><td><strong>Formula-fed babies</strong></td><td>No supplement if they drink more than 500 ml of formula a day, because formula is fortified</td><td>Depends on formula intake; ask your paediatrician</td></tr>
<tr><td><strong>Children aged 1 to 4</strong></td><td>10 mcg (400 IU) a day, all year</td><td>15 mcg (600 IU) a day</td></tr>
<tr><td><strong>Children over 4 and adults</strong></td><td>10 mcg (400 IU) a day, October to March</td><td>15 mcg (600 IU) a day up to age 70</td></tr>
<tr><td><strong>Adults over 70</strong></td><td>10 mcg (400 IU) a day; all year if you are rarely outdoors</td><td>20 mcg (800 IU) a day</td></tr>
<tr><td><strong>Pregnant or breastfeeding</strong></td><td>10 mcg (400 IU) a day, October to March at least</td><td>15 mcg (600 IU) a day</td></tr>
<tr><td><strong>Little sun, covered skin, dark skin, care homes</strong></td><td>10 mcg (400 IU) a day, all year</td><td>As for your age group</td></tr>
</tbody>
</table>
<p>The UK and US figures differ because they were set by different committees with different assumptions about sunlight and diet, not because people in one country need more. Either is a reasonable, safe daily amount.</p>

<h3>Micrograms and IU: the unit trap</h3>
<p>Labels give vitamin D in micrograms (mcg or µg), international units (IU), or both. <strong>1 microgram = 40 IU</strong>, so 10 mcg is 400 IU, 25 mcg is 1,000 IU and 100 mcg is 4,000 IU. Because the two numbers differ by a factor of forty, comparing one brand’s microgram figure with another’s IU figure is the most common way people end up taking far more, or less, than they meant to.</p>

<h3>Is more better?</h3>
<p>No — not for people who are not deficient. In the VITAL trial, nearly 26,000 healthy adults over 50 took 2,000 IU a day or a placebo for about five years. Vitamin D did not reduce cancer, heart attacks or strokes, and a follow-up analysis found no fewer fractures. The Endocrine Society’s 2024 guideline advises against taking more than the recommended amounts to prevent disease in healthy adults under 75.</p>
<p>The <strong>upper limit for adults is 100 micrograms (4,000 IU) a day</strong>; the NHS sets lower limits of 50 micrograms for children aged 1 to 10 and 25 micrograms for babies. Taking too much over a long time raises calcium in the blood, which can weaken bones and damage the kidneys and heart. Very large occasional doses carry their own risk: in one trial of older women, a single 500,000 IU dose each year increased falls and fractures. Take a modest amount daily rather than a big dose now and then.</p>

<h2>Which form of vitamin D to buy</h2>
<table>
<thead><tr><th>On the label</th><th>What it is</th><th>What to know</th></tr></thead>
<tbody>
<tr><td><strong>Vitamin D3</strong> (cholecalciferol)</td><td>The form your skin makes; usually from sheep’s wool lanolin</td><td>The default choice. Not vegan unless it says it comes from lichen</td></tr>
<tr><td><strong>Vitamin D2</strong> (ergocalciferol)</td><td>Made from plants and fungi</td><td>Works as well as D3 for a daily dose; less well as a large occasional dose. Suitable for vegans</td></tr>
<tr><td><strong>Vegan D3</strong></td><td>D3 extracted from lichen</td><td>Same molecule as ordinary D3, suitable for vegans</td></tr>
<tr><td><strong>Sprays, drops, gummies</strong></td><td>Different ways of delivering the same vitamin</td><td>Choose whatever you will take every day. Gummies often add sugar</td></tr>
<tr><td><strong>D3 with K2</strong></td><td>Vitamin D combined with vitamin K2</td><td>Vitamin D does not need K2 to work, and there is no good evidence the pairing adds benefit. Avoid if you take warfarin</td></tr>
<tr><td><strong>“High strength” 4,000–5,000 IU</strong></td><td>100–125 micrograms a dose</td><td>At or above the adult upper limit. Only on medical advice</td></tr>
</tbody>
</table>
<h3>D3 or D2?</h3>
<p>A 2012 meta-analysis found that D3 raised blood levels more than D2 when each was given as a large, infrequent dose, but with daily dosing the difference was not significant. For an everyday supplement, either works; D3 is simply more common.</p>
<h3>When to take it</h3>
<p>Vitamin D is fat-soluble, so taking it with a meal is a sensible habit. The time of day does not matter; consistency does. Add up everything you take — a multivitamin, a separate vitamin D and fortified foods can together come to more than you think.</p>
<p>A small, single-ingredient product is all you need. The one we have reviewed, <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3</a>, is 25 micrograms (1,000 IU) a softgel — more than the NHS amount, a quarter of the upper limit.</p>

<h2>Who is low in vitamin D?</h2>
<p>Low vitamin D is common, and it is not spread evenly. In the UK’s National Diet and Nutrition Survey, <strong>19 per cent of adults aged 19 to 64</strong>, 23 per cent of children aged 11 to 18 and 15 per cent of adults over 65 had blood levels below 25 nmol/L — the UK threshold for a risk of deficiency — with samples taken across the whole year, so winter levels are worse. In the US, about <strong>5 per cent</strong> of people are at risk of deficiency and another 18 per cent at risk of inadequacy.</p>
<p>Skin colour makes the biggest difference. Darker skin needs more sunlight to make the same amount of vitamin D. In UK Biobank, a study of more than 440,000 adults, <strong>57 per cent of participants of South Asian ancestry and 39 per cent of Black African ancestry were deficient in winter and spring</strong>.</p>
<table>
<thead><tr><th>Group</th><th>Why they run low</th></tr></thead>
<tbody>
<tr><td><strong>Dark skin</strong> (African, African-Caribbean or South Asian heritage)</td><td>Melanin reduces how much vitamin D the skin makes from the same sunlight</td></tr>
<tr><td><strong>Rarely outdoors</strong> — housebound, care-home residents, night-shift workers</td><td>Little sunlight on the skin</td></tr>
<tr><td><strong>Skin usually covered outdoors</strong></td><td>Sunlight cannot reach the skin</td></tr>
<tr><td><strong>Older people</strong></td><td>Skin makes vitamin D less efficiently with age, and many spend more time indoors</td></tr>
<tr><td><strong>Breastfed babies and young children</strong></td><td>Breast milk contains little vitamin D, and children grow fast</td></tr>
<tr><td><strong>Pregnant and breastfeeding women</strong></td><td>Higher needs, and the baby relies on the mother’s supply</td></tr>
<tr><td><strong>Obesity</strong></td><td>Vitamin D is stored in fat, so blood levels tend to be lower</td></tr>
<tr><td><strong>Coeliac disease, Crohn’s, weight-loss surgery, kidney or liver disease</strong></td><td>Absorption or activation of vitamin D is impaired</td></tr>
</tbody>
</table>
<p>Check where you fit, alongside folic acid and B12, with the checker below. It uses only NHS, NIH, US Preventive Services Task Force and Endocrine Society advice.</p>
<div data-tool="vitamin-checker"></div>

<h2>Signs you might be low, and whether to get tested</h2>
<p>Mild deficiency often causes no symptoms at all. More severe or long-standing deficiency can cause bone pain, aching or weak muscles and, in children, rickets — soft bones that bend. In adults, the equivalent is osteomalacia. Tiredness and low mood are often blamed on vitamin D, but they have many causes, and supplements have not been shown to fix them in people who are not deficient.</p>
<p>You do not need a blood test to take the standard dose. The Endocrine Society’s 2024 guideline advises against routine vitamin D testing in healthy people, including those with dark skin or obesity, because a test does not change the advice: take the small daily amount. A test makes sense if you have symptoms such as bone pain or muscle weakness, a condition that affects absorption, or your doctor has another reason to check.</p>
<p>If you are tested, results may be in nmol/L (UK) or ng/mL (US). Divide nmol/L by 2.5 to get ng/mL. In the UK, below 25 nmol/L (10 ng/mL) means a risk of deficiency. In the US, below 30 nmol/L (12 ng/mL) is considered deficient and 50 nmol/L (20 ng/mL) enough for nearly everyone. A doctor treating a confirmed deficiency may prescribe higher doses for a short time; that is different from taking them yourself indefinitely.</p>

<h2>Food and sunlight</h2>
<p>Few foods contain much vitamin D: oily fish such as salmon, sardines, herring and mackerel, red meat, liver, egg yolks, and fortified foods such as some breakfast cereals, fat spreads and plant milks. It is hard to reach 10 micrograms a day from food alone, which is why the advice centres on a supplement.</p>
<p>From April to September, short periods of sun on your forearms, hands or lower legs, without sunscreen, let most people in the UK make what they need. You cannot overdose on vitamin D from sunlight, but take care to cover up or protect your skin before it starts to turn red or burn.</p>

<h2>Who should check before taking vitamin D</h2>
<p>Ask a doctor or pharmacist first if you have kidney disease, a condition that affects calcium levels such as sarcoidosis or hyperparathyroidism, or if you take medicines that interact with vitamin D, including some diuretics, steroids such as prednisone, the weight-loss medicine orlistat and some statins.</p>

<h2>The bottom line</h2>
<p>Take 10 micrograms (400 IU) of vitamin D a day from October to March, and all year if you get little sun, cover your skin or have dark skin. A plain D3 supplement is fine; D2 or lichen D3 suits vegans. Check the units, add up everything you take, and stay under 100 micrograms (4,000 IU) a day unless a doctor advises otherwise. You do not need a blood test or a high-strength tub — just the small dose, every day, through the darker months.</p>
<p>For the evidence behind each claim made for vitamin D, see our <a href="/ingredients/vitamin-d3">vitamin D guide</a>, and for the other vitamins worth taking, <a href="/learn/which-vitamins-should-you-take-daily">which vitamins should you take every day</a>. If you are vegan or over 50, read <a href="/learn/b12-deficiency-signs-who-needs-a-supplement">the signs of B12 deficiency</a> too.</p>
`,
  faqs: [
    {
      question: 'How much vitamin D should I take a day?',
      answer:
        'In the UK, 10 micrograms (400 IU) a day from October to March for adults and children over one, and all year if you get little sun, cover your skin or have dark skin. In the US, the recommended amount is 600 IU a day up to age 70 and 800 IU after that.',
    },
    {
      question: 'Is 1,000 IU of vitamin D a day too much?',
      answer:
        'No. 1,000 IU is 25 micrograms — more than the NHS amount but a quarter of the 4,000 IU adult upper limit. It is safe for most adults, though there is no evidence it does more than a smaller dose for someone who is not deficient.',
    },
    {
      question: 'Is vitamin D3 better than D2?',
      answer:
        'For a daily supplement, there is little difference. D3 raises blood levels more when given as large, infrequent doses, but with daily dosing a 2012 meta-analysis found no significant difference. Vegans can use D2 or D3 made from lichen.',
    },
    {
      question: 'Should I take vitamin D all year?',
      answer:
        'Most UK adults only need it from October to March, because from April to September the sun lets the skin make enough. Take it all year if you are rarely outdoors, usually cover your skin, live in a care home or have dark skin.',
    },
    {
      question: 'Who is most likely to be low in vitamin D?',
      answer:
        'People with dark skin, people who are rarely outdoors or cover their skin, older people, breastfed babies, pregnant women, people with obesity, and people with conditions that affect absorption such as coeliac or Crohn’s disease.',
    },
    {
      question: 'Do I need a blood test before taking vitamin D?',
      answer:
        'No. The Endocrine Society advises against routine vitamin D testing in healthy people. A test is worthwhile if you have symptoms such as bone pain or muscle weakness, a condition that affects absorption, or your doctor has a reason to check.',
    },
    {
      question: 'What is the best time of day to take vitamin D?',
      answer:
        'The time of day does not matter. Vitamin D is fat-soluble, so taking it with a meal is a sensible habit, and taking it every day matters more than when.',
    },
    {
      question: 'Do I need to take vitamin K2 with vitamin D?',
      answer:
        'No. Vitamin D works without K2, and there is no good evidence that combining them adds benefit for most people. If you take warfarin, avoid vitamin K supplements unless your doctor agrees, because they affect how it works.',
    },
  ],
  references: [
    {
      id: 'nhs-vitamin-d',
      text: 'NHS. Vitamin D — 10 micrograms a day in autumn and winter, all year for at-risk groups; advice for babies and children; sources; upper limits; hypercalcaemia.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/',
    },
    {
      id: 'nhs-pregnancy',
      text: 'NHS. Pregnancy vitamins and supplements — 10 micrograms of vitamin D a day from early October to late March.',
      url: 'https://www.nhs.uk/pregnancy/keeping-well/pregnancy-vitamins-and-supplements/',
    },
    {
      id: 'medlineplus-vitamin-d',
      text: 'MedlinePlus. Vitamin D — 400 IU for infants, 600 IU a day for ages 1–70, 800 IU over 70; upper limit 4,000 IU for adults.',
      url: 'https://medlineplus.gov/ency/article/002405.htm',
    },
    {
      id: 'ods-vitd',
      text: 'NIH Office of Dietary Supplements. Vitamin D — Fact Sheet for Health Professionals: serum 25(OH)D thresholds, groups at risk, interactions.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
    },
    {
      id: 'ndns-1-9',
      text: 'Public Health England and Food Standards Agency (2019). National Diet and Nutrition Survey, years 1 to 9 (2008/09–2016/17): statistical summary — 19% of adults aged 19 to 64, 23% of children aged 11 to 18 and 15% of adults 65 and over had serum 25-OHD below 25 nmol/L.',
      url: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/772430/NDNS_Y1-9_statistical_summary.pdf',
    },
    {
      id: 'herrick-2019',
      text: 'Herrick KA et al. (2019). Vitamin D status in the United States, 2011–2014. American Journal of Clinical Nutrition 110(1):150-157 — 5.0% at risk of deficiency (below 30 nmol/L), 18.3% at risk of inadequacy (30–49 nmol/L).',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31076739/',
    },
    {
      id: 'lin-2021',
      text: 'Lin LY et al. (2021). Distribution of vitamin D status in the UK: a cross-sectional analysis of UK Biobank. BMJ Open 11(1):e038503 — deficiency in winter/spring 57.2% in Asian and 38.5% in Black African participants.',
      url: 'https://bmjopen.bmj.com/content/11/1/e038503',
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
      id: 'sanders-2010',
      text: 'Sanders KM et al. (2010). Annual high-dose oral vitamin D and falls and fractures in older women: a randomized controlled trial. JAMA 303(18):1815-1822.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20460620/',
    },
    {
      id: 'tripkovic-2012',
      text: 'Tripkovic L et al. (2012). Comparison of vitamin D2 and vitamin D3 supplementation in raising serum 25-hydroxyvitamin D status: a systematic review and meta-analysis. American Journal of Clinical Nutrition 95(6):1357-1364.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/22552031/',
    },
  ],
  history: [
    {
      date: '2026-10-03',
      note: 'First published. Doses checked against the NHS and NIH, status figures against NDNS, NHANES and UK Biobank, and testing advice against the Endocrine Society 2024 guideline. Not yet reviewed by a clinician.',
    },
  ],
};
