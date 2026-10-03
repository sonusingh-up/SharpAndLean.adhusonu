import type { Collection } from '../types';

/*
 * Symptom-led companion to the vitamin B12 ingredient page
 * (lib/ingredient-pages/vitamins.ts) and the daily-vitamins guide. Doses,
 * trial figures and at-risk groups quoted here must agree with that page and
 * with lib/vitamins.ts, which drives the checker embedded below. Symptoms are
 * the NHS list; test thresholds are NICE NG239's.
 */
export const b12DeficiencySigns: Collection = {
  id: 'b12-deficiency-signs',
  kind: 'articles',
  slug: 'b12-deficiency-signs-who-needs-a-supplement',
  topic: 'vitamins',
  title: '5 signs of B12 deficiency, and who really needs a supplement',
  seo_title: 'B12 Deficiency: 5 Warning Signs and Who Needs a Supplement',
  seo_desc:
    'Tiredness, pins and needles, balance problems, a sore red tongue, memory or mood changes. Who is at risk, which test to ask for, and how much B12 to take.',
  summary:
    'Vitamin B12 deficiency builds slowly and is easy to blame on something else — but left untreated it can damage nerves for good. These are the five signs to take seriously, the blood test that confirms it, and the groups who genuinely need a supplement: vegans, many people over 50, and anyone on metformin or long-term stomach-acid medicine. For everyone else, extra B12 does nothing.',
  is_published: true,
  about: [
    { name: 'Vitamin B12 deficiency', sameAs: 'https://en.wikipedia.org/wiki/Vitamin_B12_deficiency' },
    { name: 'Vitamin B12', sameAs: 'https://en.wikipedia.org/wiki/Vitamin_B12' },
  ],
  evidenceReviewed: false,
  authors: [{ name: 'SLN Team', slug: 'snl-team', type: 'Organization' }],
  published_at: '2026-10-03T00:00:00Z',
  updated_at: '2026-10-03T00:00:00Z',
  takeaways: [
    'The five signs to take seriously: tiredness and breathlessness that rest does not fix, pins and needles or numbness, balance and coordination problems, a sore red tongue or mouth ulcers, and changes in memory or mood.',
    'Nerve symptoms can become permanent if B12 deficiency goes untreated, so see a GP for a blood test rather than guessing — and tell them about any supplement you already take.',
    'Vegans need B12 without exception: at least 10 micrograms a day or 2,000 micrograms a week. People over 50 should rely on fortified foods or a supplement, and anyone on metformin or a long-term acid-reducing medicine should ask about a check.',
    'Pernicious anaemia, the most common cause of deficiency in the UK, is not fixed by a shop-bought supplement. And if your B12 is normal, extra does not give you more energy.',
  ],
  body: `
<h2>The short answer</h2>
<p>The five signs of vitamin B12 deficiency most worth acting on are <strong>tiredness and breathlessness that rest does not fix</strong>, <strong>pins and needles or numbness</strong>, <strong>problems with balance and coordination</strong>, <strong>a sore, red tongue or mouth ulcers</strong>, and <strong>changes in memory, thinking or mood</strong>. None of them proves you are low in B12 — each has plenty of other causes — but together, or in someone at risk, they are a reason to ask your GP for a blood test.</p>
<p>As for who really needs a supplement: <strong>vegans</strong>, always; <strong>most people over 50</strong>, as fortified foods or a supplement; and anyone taking <strong>metformin or a long-term stomach-acid medicine</strong> should have their level checked. If you eat meat, fish, eggs or dairy, are under 50 and take neither medicine, you almost certainly get enough already.</p>

<h2>Why B12 deficiency is easy to miss</h2>
<p>Your liver stores a large reserve of B12 — enough, the NHS says, to last two to five years without any new supply. So when intake or absorption falls, nothing happens for a long time. Symptoms then creep in gradually, and they are vague enough to be put down to stress, age or a busy life.</p>
<p>That slow build-up is what makes it worth taking seriously. B12 does two jobs: it helps make red blood cells, and it maintains the protective sheath around your nerves. Running low affects both, causing a type of anaemia and nerve damage — and the nerve damage can happen even when a blood count looks normal. The NHS warns that the longer deficiency goes untreated, the higher the chance that some of that damage becomes permanent.</p>

<h2>The 5 signs of B12 deficiency</h2>

<h3>1. Tiredness, weakness and breathlessness that rest does not fix</h3>
<p>Without enough B12, the bone marrow makes fewer red blood cells, and the ones it does make are large and immature. Fewer working red cells means less oxygen reaching your muscles and brain. The result is the classic picture of anaemia: feeling weak or tired all the time, getting out of breath more easily, headaches, and noticing your heart beating fast or fluttering (palpitations).</p>
<p>Tiredness alone is the least specific sign on this list — most tired people are not B12 deficient. It matters more when it is new, does not lift with rest, and comes with breathlessness or any of the signs below.</p>

<h3>2. Pins and needles, or numbness, in the hands and feet</h3>
<p>This is the sign that should get you to a GP soonest. B12 deficiency can damage the nerves that carry feeling from your hands and feet, so it often starts as pins and needles, tingling or numbness, usually in both feet or both hands. Because this nerve damage can occur before any anaemia shows up, a normal blood count does not rule B12 out.</p>

<h3>3. Problems with balance, coordination and walking</h3>
<p>As deficiency progresses, it can affect the spinal cord and the nerves that tell your brain where your limbs are. People describe feeling unsteady, especially in the dark, stumbling, or finding their legs weak or clumsy. The NHS also lists muscle weakness and, in more advanced cases, incontinence. These are neurological symptoms, and they need prompt medical assessment rather than a supplement bought on spec.</p>

<h3>4. A sore, red tongue and mouth ulcers</h3>
<p>The cells lining your mouth and tongue are replaced quickly, so they are among the first to suffer when the body cannot make new cells properly. A tongue that is sore, red, swollen or unusually smooth (glossitis), sometimes with mouth ulcers, is one of the more distinctive signs of B12 or folate deficiency — and one that is easy to see.</p>

<h3>5. Memory problems, low mood or confusion</h3>
<p>B12 deficiency can affect the brain as well as the nerves. The NHS lists problems with memory, understanding and judgement, and psychological changes that range from mild depression or anxiety to confusion and, in severe cases, dementia. In older people these are often put down to age. Memory problems caused by deficiency can improve with treatment, which is one reason it is worth ruling out.</p>

<h3>Other symptoms</h3>
<p>The NHS also lists headaches, indigestion, loss of appetite, diarrhoea and problems with your vision. On their own these point nowhere in particular; alongside the five above, they add to the picture.</p>

<table>
<thead><tr><th>Sign</th><th>What is behind it</th><th>How much it points to B12</th></tr></thead>
<tbody>
<tr><td><strong>Tiredness and breathlessness</strong></td><td>Anaemia: fewer, larger red blood cells</td><td>Low on its own — tiredness has many causes</td></tr>
<tr><td><strong>Pins and needles, numbness</strong></td><td>Damage to the nerves in the hands and feet</td><td>Moderate; can appear before anaemia</td></tr>
<tr><td><strong>Balance and coordination problems</strong></td><td>Spinal cord and nerve damage</td><td>Moderate to high in someone at risk; needs prompt assessment</td></tr>
<tr><td><strong>Sore, red tongue, mouth ulcers</strong></td><td>Fast-dividing cells cannot renew properly</td><td>Fairly distinctive; also seen with folate and iron deficiency</td></tr>
<tr><td><strong>Memory, mood, confusion</strong></td><td>Effects on the brain</td><td>Low on its own, but worth ruling out — it can improve with treatment</td></tr>
</tbody>
</table>

<h2>When to see a doctor, and what the blood test shows</h2>
<p>See your GP if you have symptoms like these, and <strong>do not wait</strong> if you have pins and needles, numbness, balance problems or confusion. A blood test is the only way to know, and guessing has a cost either way: miss a real deficiency and nerve damage can become permanent; assume B12 when the cause is something else and the real problem goes untreated.</p>
<p>Tell the doctor if you already take a B12 supplement or a multivitamin, because it raises the blood level and changes how the result should be read.</p>
<p>In England, NICE’s 2024 guideline sets out how the first test is usually interpreted. Your laboratory may use its own validated cut-offs, so treat these as a guide to the conversation, not a self-diagnosis.</p>
<table>
<thead><tr><th>Test</th><th>Deficiency likely</th><th>Indeterminate</th><th>Deficiency unlikely</th></tr></thead>
<tbody>
<tr><td><strong>Total B12</strong></td><td>Below 180 ng/L (133 pmol/L)</td><td>180–350 ng/L (133–258 pmol/L)</td><td>Above 350 ng/L (258 pmol/L)</td></tr>
<tr><td><strong>Active B12</strong> (holotranscobalamin)</td><td>Below 25 pmol/L</td><td>25–70 pmol/L</td><td>Above 70 pmol/L</td></tr>
</tbody>
</table>
<p>An indeterminate result is common, and it is not the same as “fine”. Depending on your symptoms and risk, the doctor may repeat the test, add a second marker such as methylmalonic acid, or start treatment. If recreational nitrous oxide use is the suspected cause, NICE advises a different first test (homocysteine), because the gas inactivates B12 without necessarily lowering the blood level.</p>

<h2>Who really needs a B12 supplement</h2>
<p>B12 is made by bacteria and found naturally only in animal foods — meat, fish, eggs, milk and cheese. Absorbing it takes stomach acid to free it from food, and a protein called intrinsic factor, made in the stomach, to carry it into the body. So deficiency comes from one of three places: too little in the diet, too little stomach acid, or no intrinsic factor. That tells you who is at risk.</p>
<table>
<thead><tr><th>Who</th><th>Why</th><th>What to do</th></tr></thead>
<tbody>
<tr><td><strong>Vegans</strong></td><td>No natural B12 in plant foods</td><td>Supplement or fortified foods, without exception: at least 10 mcg a day or 2,000 mcg a week</td></tr>
<tr><td><strong>Vegetarians who eat few eggs or dairy</strong></td><td>Low intake</td><td>As for vegans, or fortified foods every day</td></tr>
<tr><td><strong>Most people over 50</strong></td><td>Less stomach acid to free B12 from food</td><td>Get most B12 from fortified foods or a supplement, which skip that step</td></tr>
<tr><td><strong>Long-term metformin</strong></td><td>The medicine lowers B12 absorption</td><td>Ask your doctor about regular checks</td></tr>
<tr><td><strong>Long-term PPIs or H2 blockers</strong> (omeprazole, lansoprazole)</td><td>Less stomach acid</td><td>Ask about a check if you have taken one for two years or more</td></tr>
<tr><td><strong>Pernicious anaemia</strong></td><td>No intrinsic factor, so food and low-dose supplements are not absorbed</td><td>Medical treatment, usually injections — not a shop supplement</td></tr>
<tr><td><strong>Stomach or bowel surgery, Crohn’s, coeliac disease</strong></td><td>Absorption is disrupted</td><td>Specialist management, often injections</td></tr>
<tr><td><strong>Recreational nitrous oxide use</strong></td><td>The gas inactivates B12</td><td>Stop, and see a doctor about testing and treatment</td></tr>
</tbody>
</table>
<p>Pregnancy and breastfeeding on a vegan diet deserve a special mention, because a mother’s low B12 can leave her baby deficient too. The Vegan Society stresses a reliable daily source throughout.</p>
<p><strong>Who does not need one:</strong> adults under 50 who eat animal foods, have no stomach or bowel condition, and take neither metformin nor a long-term acid-reducing medicine. For them, a B12 tablet adds nothing.</p>
<p>Not sure where you fit? This checker works through the same groups, along with vitamin D and folic acid, using only NHS, NIH and US Preventive Services Task Force advice.</p>
<div data-tool="vitamin-checker"></div>

<h2>How much B12 to take, and which kind</h2>
<h3>The dose</h3>
<p>Adults need very little: about <strong>1.5 micrograms a day</strong> in UK guidance, and 2.4 micrograms in the US. Supplements contain far more because the body absorbs a smaller share as the dose rises.</p>
<ul>
<li><strong>To prevent deficiency on a vegan diet:</strong> at least 10 micrograms a day, or at least 2,000 micrograms once a week, as the Vegan Society advises.</li>
<li><strong>For a diet-related deficiency your GP has diagnosed:</strong> the NHS gives a usual dose of 50 to 150 micrograms of cyanocobalamin a day, on an empty stomach.</li>
<li><strong>For deficiency from other causes:</strong> treatment is usually injections or 1,000 to 2,000 micrograms by mouth, on a doctor’s advice. A 2018 Cochrane review found high-dose tablets restored levels about as well as injections over three to four months, but the trials were small.</li>
</ul>
<h3>The form</h3>
<p>Cyanocobalamin is the most common and usually the cheapest. Methylcobalamin is marketed as “active” and better absorbed, and sprays and lozenges as faster, but the NIH says research has not shown any form of B12 to be better than the others. A cheap 10 to 50 microgram tablet covers a vegan’s needs. For more on doses and forms, see our <a href="/ingredients/vitamin-b12">vitamin B12 guide</a>.</p>

<h2>Does B12 give you energy?</h2>
<p>Only if you were deficient. B12 is sold heavily for energy and endurance, and injections are offered as a pick-me-up, but the NIH is explicit that it does not boost energy or athletic performance in people who already get enough. Tiredness caused by deficiency gets better with treatment. Tiredness caused by poor sleep, stress, low iron, an underactive thyroid or anything else does not — which is why a blood test beats a tub of “energy” tablets.</p>

<h2>Is too much B12 harmful?</h2>
<p>No upper limit has been set, and the NIH says B12 has not been shown to cause harm even at high doses, because so little of a large dose is absorbed. Two cautions run the other way. High-dose folic acid — above 1 mg a day — can correct the anaemia of B12 deficiency while the nerve damage carries on, hiding the problem.</p>

<h2>The bottom line</h2>
<p>Take the five signs seriously, especially pins and needles, numbness or balance problems, and get a blood test rather than self-treating. If you are vegan, B12 is not optional. If you are over 50, lean on fortified foods or a small supplement, and if you take metformin or have been on an acid-reducing medicine for years, ask your GP whether your level has been checked. If none of that applies to you, save your money: B12 is the vitamin where who you are matters far more than the dose on the label.</p>
<p>For the wider picture of which vitamins are worth taking at all, read <a href="/learn/which-vitamins-should-you-take-daily">which vitamins should you take every day</a>.</p>
`,
  faqs: [
    {
      question: 'What are the first signs of B12 deficiency?',
      answer:
        'Often tiredness, weakness and breathlessness from anaemia, or pins and needles in the hands and feet. A sore, red tongue and mouth ulcers are common early signs too. Because the body stores two to five years’ worth of B12, symptoms usually come on gradually.',
    },
    {
      question: 'Can B12 deficiency cause permanent damage?',
      answer:
        'Yes. The NHS warns that some problems, particularly nerve damage, can be irreversible if deficiency is left untreated, and the risk rises the longer it goes on. That is why pins and needles, numbness or balance problems should be checked promptly.',
    },
    {
      question: 'Who is most at risk of B12 deficiency?',
      answer:
        'Vegans and vegetarians who eat few animal foods, people over 50, people taking metformin or long-term acid-reducing medicines, and people with pernicious anaemia, stomach or bowel surgery, Crohn’s or coeliac disease. Recreational nitrous oxide use is another cause.',
    },
    {
      question: 'How much B12 should a vegan take?',
      answer:
        'The Vegan Society advises at least 10 micrograms a day or at least 2,000 micrograms once a week. Fortified foods eaten several times a day can also work, but a supplement is the simplest reliable source.',
    },
    {
      question: 'Should I take B12 before getting tested?',
      answer:
        'If you have symptoms, see a GP first and tell them about any supplement you already take, because it raises your blood level and affects how the result is read. Starting a supplement does not replace finding out why you are low.',
    },
    {
      question: 'Can a B12 supplement treat pernicious anaemia?',
      answer:
        'Not a standard shop supplement. Pernicious anaemia stops the body making intrinsic factor, so normal doses of B12 are barely absorbed. It is usually treated with injections, and sometimes very high-dose tablets, under medical supervision.',
    },
    {
      question: 'Is methylcobalamin better than cyanocobalamin?',
      answer:
        'There is no good evidence that it is. The NIH says no form of B12 has been shown to be better than the others. Cyanocobalamin is the most common and usually the cheapest.',
    },
  ],
  references: [
    {
      id: 'nhs-b12-symptoms',
      text: 'NHS. Vitamin B12 or folate deficiency anaemia — symptoms, including the neurological symptoms of B12 deficiency, and the warning that some problems can be irreversible if untreated.',
      url: 'https://www.nhs.uk/conditions/vitamin-b12-or-folate-deficiency-anaemia/symptoms/',
    },
    {
      id: 'nhs-b12-causes',
      text: 'NHS. Vitamin B12 or folate deficiency anaemia — causes: pernicious anaemia as the most common cause in the UK; stores lasting two to five years; PPIs, metformin and nitrous oxide.',
      url: 'https://www.nhs.uk/conditions/vitamin-b12-or-folate-deficiency-anaemia/causes/',
    },
    {
      id: 'nice-ng239',
      text: 'NICE (2024). Vitamin B12 deficiency in over 16s: diagnosis and management. NICE guideline NG239 — total and active B12 thresholds; homocysteine testing for suspected nitrous oxide-related deficiency.',
      url: 'https://www.nice.org.uk/guidance/ng239/chapter/Recommendations',
    },
    {
      id: 'nhs-cyanocobalamin',
      text: 'NHS. How and when to take cyanocobalamin — 50 to 150 micrograms a day for diet-related deficiency; 1,000 to 2,000 micrograms a day for other causes.',
      url: 'https://www.nhs.uk/medicines/cyanocobalamin/how-and-when-to-take-cyanocobalamin/',
    },
    {
      id: 'nhs-vitamin-b',
      text: 'NHS. B vitamins and folic acid — adults aged 19 to 64 need about 1.5 micrograms of vitamin B12 a day.',
      url: 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-b/',
    },
    {
      id: 'ods-b12',
      text: 'NIH Office of Dietary Supplements. Vitamin B12 fact sheet for consumers — groups at risk, advice for people over 50, forms, medicine interactions, and the evidence on energy.',
      url: 'https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/',
    },
    {
      id: 'vegan-society-b12',
      text: 'The Vegan Society. What every vegan should know about vitamin B12 — at least 10 micrograms a day or at least 2,000 micrograms a week.',
      url: 'https://www.vegansociety.com/resources/nutrition-and-health/nutrients/vitamin-b12/what-every-vegan-should-know-about-vitamin-b12',
    },
    {
      id: 'dejager-2010',
      text: 'de Jager J et al. (2010). Long term treatment with metformin in patients with type 2 diabetes and risk of vitamin B-12 deficiency: randomised placebo controlled trial. BMJ 340:c2181.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20488910/',
    },
    {
      id: 'lam-2013',
      text: 'Lam JR et al. (2013). Proton pump inhibitor and histamine 2 receptor antagonist use and vitamin B12 deficiency. JAMA 310(22):2435-2442.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/24327038/',
    },
    {
      id: 'cochrane-oral-2018',
      text: 'Wang H et al. (2018). Oral vitamin B12 versus intramuscular vitamin B12 for vitamin B12 deficiency. Cochrane Database of Systematic Reviews CD004655.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29543316/',
    },
  ],
  history: [
    {
      date: '2026-10-03',
      note: 'First published. Symptoms checked against the NHS, test thresholds against NICE NG239, doses against the NHS, NIH and Vegan Society sources listed. Not yet reviewed by a clinician.',
    },
  ],
};
