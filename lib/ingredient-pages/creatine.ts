import type { IngredientPage } from '../ingredients';

/*
 * Creatine monohydrate. Written for readers in any country: regulatory notes
 * sit side by side (EU and GB claims, the US position, sports bodies) rather
 * than one market leading. Prose fields use a blank line for a new paragraph.
 *
 * The doses quoted must agree with the creatine reviews in lib/articles, which
 * rest on the same Hultman 1996 study and the 3 g authorised claim.
 */

export const creatineMonohydrate: IngredientPage = {
  slug: 'creatine-monohydrate',
  name: 'Creatine monohydrate',
  seoDescription:
    'Creatine monohydrate at 3–5 g a day adds strength and muscle alongside training. The evidence, dosing, loading, safety and what it does not do.',
  aliases: [
    'creatine',
    'creatine monohydrate',
    'micronised creatine monohydrate',
    'micronized creatine monohydrate',
    'creapure',
  ],
  category: 'Sports nutrition compound',
  grade: 'A',
  quickAnswer:
    'Creatine monohydrate is the best-studied sports supplement there is. Taken at 3 to 5 grams a day, it tops up the creatine your muscles use for short, hard efforts, and alongside resistance training it reliably adds a little extra strength, power and muscle — a 2025 analysis of 69 trials put the gain at about 1.4 kg on the bench press and 5.6 kg on the squat. It does not help endurance, and brain and mood benefits are unproven. It is safe for healthy adults, cheap, and plain monohydrate beats every fancier form.',
  atAGlance: [
    {
      label: 'Daily dose',
      value: '3–5 g a day',
      note: 'Every day, at any time. 3 g is the amount in the EU and GB authorised claims.',
    },
    {
      label: 'Loading phase (optional)',
      value: '20 g a day for 5–7 days',
      note: 'Split into four 5 g doses. Fills muscle in about a week instead of about four.',
    },
    {
      label: 'Extra strength with training',
      value: '+1.4 kg bench, +5.6 kg squat',
      note: 'On top of training alone: a 2025 meta-analysis of 69 trials and 1,937 people.',
    },
    {
      label: 'Early weight gain',
      value: 'Often 1–2 kg',
      note: 'Mostly water drawn into muscle in the first week or so, especially with loading.',
    },
    {
      label: 'Best form',
      value: 'Plain monohydrate',
      note: 'No other form has done better in trials. Micronised is the same thing, ground finer.',
    },
    {
      label: 'In sport',
      value: 'Not banned',
      note: 'Allowed under anti-doping rules. Athletes should still choose batch-tested products.',
    },
  ],
  whatIsIt: `Creatine is a compound your body makes and eats every day. The liver and kidneys build it from three amino acids — arginine, glycine and methionine — at a rate of about a gram a day, and a diet that includes meat and fish supplies roughly another gram. About 95 per cent of the body's creatine is stored in skeletal muscle, much of it as phosphocreatine. A small, steady amount breaks down each day into creatinine, which the kidneys clear, so the store has to be topped up continuously.

Creatine monohydrate is creatine bound to one molecule of water, and it is the form used in almost all of the research. It is about 88 per cent creatine by weight, so a 5 g scoop gives about 4.4 g of creatine itself. Supplements are made synthetically rather than from animal products, which makes them suitable for vegetarians and vegans. "Micronised" creatine monohydrate is the same substance milled into finer particles so it mixes more easily; it is not a different or stronger form. Creapure is a trade name for creatine monohydrate from one German manufacturer.

Vegetarians and vegans get almost no creatine from food and tend to have lower muscle stores. That is why they often see a larger rise in muscle creatine when they supplement.`,
  mechanism: `Muscles run on ATP, and during an all-out effort they use it faster than they can make it. Phosphocreatine is the fastest backup: it hands its phosphate to ADP to rebuild ATP almost instantly, which powers the first few seconds of a sprint, a jump or a heavy set. It runs out quickly, and how much you have limits how hard you can go and how fast you recover between efforts.

Supplementing raises the total creatine in muscle by about 20 per cent, as the chart below shows. With more phosphocreatine on hand, you can squeeze out a rep or two more per set, or hold sprint speed a little longer across repeats. Over weeks of training, that extra work is what builds the additional strength and muscle. Creatine also draws water into muscle cells, which accounts for the early gain on the scales and may itself be a signal for growth.

How much you respond depends on where you start. People whose muscle creatine is already high — often those who eat a lot of meat and fish — gain the least, and some barely respond at all. The brain uses creatine too, but its levels rise much less than muscle's at ordinary doses, which is why most brain studies use far larger amounts.`,
  claims: [
    {
      claim: 'For strength and power, alongside resistance training',
      grade: 'A',
      body: `This is what creatine is for, and the evidence is as strong as supplement evidence gets. A 2025 meta-analysis pooled 69 randomised trials and 1,937 people. Compared with placebo, creatine plus resistance training added about 1.4 kg to bench or chest press strength, 5.6 kg to squat strength, 1.5 cm to vertical jump and 48 watts to peak cycling power. An earlier meta-analysis of 53 trials found the same consistent upper-body strength gain across different groups of people.

Two caveats keep this in proportion. The effect is real but modest: creatine helps you train a little harder, and the extra comes through that training. Taken without training, there is little to gain.`,
      refs: ['nutrients-2025-strength', 'lanhers-2017', 'issn-2017'],
    },
    {
      claim: 'For repeated short, high-intensity efforts',
      grade: 'A',
      body: `Creatine's best-established use. Because phosphocreatine fuels the first seconds of an all-out effort, topping it up lets you repeat sprints, sets and intervals with less drop-off in between. It is one of only two creatine health claims authorised in the EU and Great Britain: "creatine increases physical performance in successive bursts of short-term, high intensity exercise", for adults taking 3 g a day.

International sports bodies agree. The International Olympic Committee's consensus statement on supplements lists creatine among the few with good evidence for performance, and the Australian Institute of Sport places it in its top group — supplements with strong scientific support for use in specific situations.`,
      refs: ['branch-2003', 'eu-432-2012', 'ioc-2018', 'ais-framework'],
    },
    {
      claim: 'For muscle mass, alongside training',
      grade: 'A',
      body: `Trials consistently find more lean mass with creatine than with training alone. Part of the early rise is water held inside muscle, which is why the scale often moves by a kilogram or two in the first week, particularly with a loading phase. The larger, slower gains over months of training reflect real muscle.

Creatine is not a steroid and does not act like one. It works by letting you do more training, not by changing hormones.`,
      refs: ['branch-2003', 'issn-2017', 'antonio-2021'],
    },
    {
      claim: 'For older adults, with resistance training',
      grade: 'B',
      body: `Ageing muscle loses mass and strength, and resistance training is the main defence. Creatine adds to it. A 2017 meta-analysis of trials in adults aged about 57 to 70 found that creatine taken with two or three strength sessions a week, for 7 to 52 weeks, added about 1.4 kg of lean tissue and more upper- and lower-body strength than training alone.

The European Food Safety Authority accepted this, and the EU authorised a second claim: daily creatine can enhance the effect of resistance training on muscle strength in adults over 55. The conditions are 3 g a day with progressive training at least three times a week. The grade is B rather than A because the trials are smaller and more varied than in younger adults, and creatine does little for older muscle without the training.`,
      refs: ['chilibeck-2017', 'eu-2017-672'],
    },
    {
      claim: 'For endurance performance',
      grade: 'F',
      body: `For long, steady exercise — running, cycling or swimming for more than a few minutes — most trials show no benefit. The effect of creatine is concentrated in short, high-intensity work, and the extra body water can be a small handicap in sports where you carry your own weight. Some endurance events include hard surges or a sprint finish where it could help, but that is not a reason to take it for endurance itself.`,
      refs: ['issn-2017', 'branch-2003'],
    },
    {
      claim: 'For memory and thinking in healthy adults',
      grade: 'C',
      body: `Promising, but not proven. A 2024 meta-analysis of 16 trials and 492 adults found creatine improved memory, attention and processing speed. Critics have pointed out that it pooled several related test results from the same studies, which can overstate the effect, and the trials were small.

The European Food Safety Authority reviewed 21 studies the same year and concluded that a cause-and-effect relationship between creatine and improved cognitive function had not been established: effects seen with high doses over short periods did not hold at 3 g a day taken continuously. Any benefit may be larger in older adults and vegetarians, whose brain creatine is lower, but that has not been settled.`,
      refs: ['xu-2024', 'efsa-2024-cognition'],
    },
    {
      claim: 'For mental performance when sleep-deprived',
      grade: 'C',
      body: `An intriguing early finding. In a 2024 study, 15 young adults kept awake for 21 hours took a single large dose of creatine — 0.35 g per kilogram of body weight, about 25 g for a 70 kg adult — or a placebo. With creatine, brain energy compounds held up better and processing speed and short-term memory declined less.

It is one small study with a dose far above the daily amount. It suggests a mechanism worth testing, not a strategy to copy.`,
      refs: ['gordji-nejad-2024'],
    },
    {
      claim: 'For depression, alongside treatment',
      grade: 'D',
      body: `Several small trials have added creatine to antidepressants or therapy. A 2025 meta-analysis of 11 randomised trials and 1,093 people found a small average improvement in symptoms — equivalent to about 2.2 points on the Hamilton depression scale, below the 3 points generally considered the smallest change patients notice. The authors rated the certainty of the evidence as very low and found signs of bias favouring creatine.

Creatine is not a treatment for depression. Anyone with depression should keep to the care their doctor recommends.`,
      refs: ['eckert-2025'],
    },
  ],
  dosage: `For most adults, 3 to 5 g of creatine monohydrate a day, every day, is the whole protocol. Timing matters much less than consistency: the benefit comes from keeping your muscle stores full, not from when you take each scoop. Take it with water, juice, a shake or a meal — whatever makes it a daily habit.

A loading phase is optional. About 20 g a day, split into four 5 g doses, for five to seven days fills muscle in about a week; 3 g a day gets to the same level in about four weeks. The classic Nottingham study by Hultman and colleagues showed both routes end in the same place, and that 2 g a day was enough to hold the level after loading. Loading is useful if you want the effect quickly, for example before a competition. Otherwise it costs more, uses up a tub faster and is more likely to cause stomach upset.

If you stop, muscle creatine falls back to its starting level over roughly a month. Brain studies have used much larger doses, such as 20 g a day for a week or a single dose of about 0.35 g per kilogram; those are research protocols, not daily advice.`,
  figure: {
    src: '/images/creatine-loading-vs-daily-dose.jpg',
    alt: 'Line chart of the rise in muscle creatine over 28 days. With loading at 20 g a day, muscle creatine reached its full rise by about day 6 and was held there with 2 g a day. With 3 g a day and no loading, it reached the same level by day 28. Dots mark the points measured in the study; the lines between them show the general shape.',
    caption:
      'Loading and a steady 3 g a day end at the same level; loading just gets there in about a week instead of about four. Redrawn from Hultman et al. (1996). Dots are measured points; the dotted lines show the general shape between them, not daily measurements.',
  },
  dosageGap: `Most creatine powders get the dose right, with a 3 g or 5 g scoop. The gaps are elsewhere.

Serving sizes vary: some powders suggest a scoop larger than the 3 g the claims are based on, which simply makes a tub run out sooner. Pre-workout blends often contain 1 to 2 g — below the studied amount — alongside caffeine you may not want every day. Mass gainers sometimes include 3 g per serving, which is fine as long as you take the full serving and do not also take creatine separately.

Newer formats deserve the most caution. Creatine breaks down into creatinine in heat and moisture, and gummies are made with both. In 2024, the supplement maker NOW Foods tested 12 creatine gummy products and found five failed: two contained only a fraction of the creatine on the label and three contained none. Plain powder is the cheapest and most reliable way to get a known dose.

Alternative forms — creatine hydrochloride, ethyl ester and "buffered" creatine — are often sold at smaller doses with claims of better absorption. There is no good evidence for those claims. In head-to-head trials, creatine ethyl ester raised muscle creatine less than monohydrate, and a buffered form did no better.`,
  safety: `Creatine monohydrate is one of the most thoroughly studied supplements for safety. At the recommended doses, reviews by the International Society of Sports Nutrition find no harm in healthy people, including in trials lasting years. A 2019 meta-analysis of the kidney studies found no change in blood creatinine or urea in healthy people taking creatine. In the US, the FDA had no questions about a notice that creatine monohydrate is generally recognised as safe for use in foods.

There is one thing to tell your doctor. Because creatine breaks down into creatinine, supplements can nudge blood creatinine up, and a standard kidney blood test (eGFR) can then look slightly worse without any kidney damage. Mention that you take creatine before a blood test.

Ask a doctor first if you have kidney disease or diabetes that affects your kidneys, or take medicines that can strain the kidneys, such as regular high-dose anti-inflammatory painkillers. There is not enough research on creatine in pregnancy or breastfeeding, so avoid it then unless your doctor advises otherwise. Research in teenagers is more limited than in adults; talk to a doctor or sports dietitian first.

The common side effects are mild: early weight gain from water, and stomach upset or loose stools with large single doses — which is why loading doses are split through the day. The worries about cramps and dehydration have not held up in trials.

Hair loss is the best-known myth. It traces to one 2009 study in 20 rugby players, in which the hormone DHT rose after a week of loading. No study has shown creatine causes hair loss, and a 2025 randomised trial of 5 g a day for 12 weeks found no change in DHT, hair density, hair thickness or follicle health.

Creatine is not banned in sport. As with any supplement, products can be contaminated, so competitive athletes should choose ones batch-tested by a scheme such as Informed Sport or NSF Certified for Sport.`,
  faqs: [
    {
      question: 'Does creatine actually work?',
      answer:
        'Yes, for what it is sold for. Alongside resistance training, creatine monohydrate reliably adds a little extra strength, power and muscle — a 2025 analysis of 69 trials put the extra gain at about 1.4 kg on the bench press and 5.6 kg on the squat. It does not help endurance, and it does little without training.',
    },
    {
      question: 'How much creatine should I take a day?',
      answer:
        '3 to 5 g of creatine monohydrate a day for most adults. 3 g is the amount behind the EU and GB authorised claims, and it raises muscle creatine as much as a loading phase within about four weeks.',
    },
    {
      question: 'Do I need a loading phase?',
      answer:
        'No. Loading at about 20 g a day, split into four doses, for five to seven days fills muscle in about a week. 3 g a day reaches the same level in about four weeks. Load only if you want the effect sooner; otherwise it costs more and is more likely to upset your stomach.',
    },
    {
      question: 'When is the best time to take creatine?',
      answer:
        'Whenever you will remember it. Creatine works by keeping your muscle stores full, so taking it every day matters far more than the time of day or whether it is before or after training.',
    },
    {
      question: 'Does creatine cause hair loss?',
      answer:
        'There is no evidence that it does. The idea comes from one 2009 study in which the hormone DHT rose in rugby players after loading. A 2025 randomised trial of 5 g a day for 12 weeks found no change in DHT or in hair density, thickness or follicle health.',
    },
    {
      question: 'Is creatine bad for your kidneys?',
      answer:
        'Not in healthy people at recommended doses; a 2019 meta-analysis found no change in kidney markers. But creatine can raise blood creatinine, which can make a kidney blood test look slightly worse, so tell your doctor you take it. If you have kidney disease, ask your doctor before taking it.',
    },
    {
      question: 'Will creatine make me gain weight?',
      answer:
        'At first, usually 1 to 2 kg, mostly water drawn into your muscles — more with a loading phase. It is not fat. Over months of training, some of the extra weight is new muscle.',
    },
    {
      question: 'Is creatine HCl better than monohydrate?',
      answer:
        'There is no good evidence that it is. Creatine HCl dissolves more easily, but no trial has shown it raises muscle creatine more or works better at a smaller dose. Monohydrate is the form nearly all the research used, and it is cheaper.',
    },
    {
      question: 'Is creatine suitable for vegetarians and vegans?',
      answer:
        'Yes. Supplements are made synthetically, not from animal products. Vegetarians and vegans usually have lower muscle creatine to start with, and in trials they tend to see a larger rise from supplementing.',
    },
    {
      question: 'What happens when I stop taking creatine?',
      answer:
        'Your muscle creatine drifts back to its usual level over roughly a month, and the water weight goes with it. Strength and muscle you built through training do not vanish, but you lose the small extra edge creatine gave your sessions.',
    },
  ],
  references: [
    {
      id: 'issn-2017',
      text: 'Kreider RB et al. (2017). International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. Journal of the International Society of Sports Nutrition 14:18.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28615996/',
    },
    {
      id: 'antonio-2021',
      text: 'Antonio J et al. (2021). Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show? Journal of the International Society of Sports Nutrition 18:13.',
      url: 'https://doi.org/10.1186/s12970-021-00412-w',
    },
    {
      id: 'hultman-1996',
      text: 'Hultman E et al. (1996). Muscle creatine loading in men. Journal of Applied Physiology 81(1):232-237 — 20 g a day for 6 days and 3 g a day for 28 days both raised muscle creatine by about 20 per cent; 2 g a day maintained it.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/8828669/',
    },
    {
      id: 'nutrients-2025-strength',
      text: 'The effects of creatine supplementation on upper- and lower-body strength and power: a systematic review and meta-analysis (2025). Nutrients — 69 randomised trials, 1,937 participants.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12430374/',
    },
    {
      id: 'lanhers-2017',
      text: 'Lanhers C et al. (2017). Creatine supplementation and upper limb strength performance: a systematic review and meta-analysis. Sports Medicine 47(1):163-173.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/27328852/',
    },
    {
      id: 'branch-2003',
      text: 'Branch JD (2003). Effect of creatine supplementation on body composition and performance: a meta-analysis. International Journal of Sport Nutrition and Exercise Metabolism 13(2):198-226.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12945830/',
    },
    {
      id: 'chilibeck-2017',
      text: 'Chilibeck PD et al. (2017). Effect of creatine supplementation during resistance training on lean tissue mass and muscular strength in older adults: a meta-analysis. Open Access Journal of Sports Medicine 8:213-226.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29138605/',
    },
    {
      id: 'eu-432-2012',
      text: 'Commission Regulation (EU) No 432/2012 — the list of permitted health claims, including creatine and performance in successive bursts of short-term, high intensity exercise (3 g a day). Retained in Great Britain.',
      url: 'https://eur-lex.europa.eu/eli/reg/2012/432/oj',
    },
    {
      id: 'eu-2017-672',
      text: 'Commission Implementing Regulation (EU) 2017/672 — authorising the claim that daily creatine consumption can enhance the effect of resistance training on muscle strength in adults over 55.',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32017R0672',
    },
    {
      id: 'ioc-2018',
      text: 'Maughan RJ et al. (2018). IOC consensus statement: dietary supplements and the high-performance athlete. British Journal of Sports Medicine 52(7):439-455.',
      url: 'https://stillmed.olympics.com/media/Documents/Athletes/Medical-Scientific/Consensus-Statements/2018_dietary-supplements-high-performance-athlete.pdf',
    },
    {
      id: 'ais-framework',
      text: 'Australian Institute of Sport. Sports Supplement Framework — creatine in Group A, supplements with strong scientific evidence for use in specific situations in sport.',
      url: 'https://www.ausport.gov.au/ais/nutrition/supplements',
    },
    {
      id: 'burke-2003',
      text: 'Burke DG et al. (2003). Effect of creatine and weight training on muscle creatine and performance in vegetarians. Medicine & Science in Sports & Exercise 35(11):1946-1955.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/14600563/',
    },
    {
      id: 'xu-2024',
      text: 'Xu C et al. (2024). The effects of creatine supplementation on cognitive function in adults: a systematic review and meta-analysis. Frontiers in Nutrition 11:1424972 — 16 randomised trials, 492 participants.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39070254/',
    },
    {
      id: 'efsa-2024-cognition',
      text: 'EFSA Panel on Nutrition, Novel Foods and Food Allergens (2024). Creatine and improvement in cognitive function: evaluation of a health claim. EFSA Journal 22:e9100 — cause and effect not established.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39564533/',
    },
    {
      id: 'gordji-nejad-2024',
      text: 'Gordji-Nejad A et al. (2024). Single dose creatine improves cognitive performance and induces changes in cerebral high energy phosphates during sleep deprivation. Scientific Reports 14:4937.',
      url: 'https://www.nature.com/articles/s41598-024-54249-9',
    },
    {
      id: 'eckert-2025',
      text: 'Eckert I, Lima J, Dariva AA (2025). Creatine supplementation for treating symptoms of depression: a systematic review and meta-analysis. British Journal of Nutrition — 11 randomised trials, 1,093 participants; certainty very low.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41189312/',
    },
    {
      id: 'desouza-2019',
      text: 'de Souza e Silva A et al. (2019). Effects of creatine supplementation on renal function: a systematic review and meta-analysis. Journal of Renal Nutrition 29(6):480-489.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/31375416/',
    },
    {
      id: 'fda-grn-931',
      text: 'US Food and Drug Administration. GRAS Notice No. 931: creatine monohydrate — the agency had no questions about the notifier’s conclusion that it is generally recognised as safe for use in foods.',
      url: 'https://www.fda.gov/media/143525/download',
    },
    {
      id: 'vandermerwe-2009',
      text: 'van der Merwe J, Brooks NE, Myburgh KH (2009). Three weeks of creatine monohydrate supplementation affects dihydrotestosterone to testosterone ratio in college-aged rugby players. Clinical Journal of Sport Medicine 19(5):399-404.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19741313/',
    },
    {
      id: 'lak-2025',
      text: 'Lak M et al. (2025). Does creatine cause hair loss? A 12-week randomized controlled trial. Journal of the International Society of Sports Nutrition 22(sup1):2495229.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40265319/',
    },
    {
      id: 'spillane-2009',
      text: 'Spillane M et al. (2009). The effects of creatine ethyl ester supplementation combined with heavy resistance training on body composition, muscle performance, and serum and muscle creatine levels. Journal of the International Society of Sports Nutrition 6:6.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/19228401/',
    },
    {
      id: 'jagim-2012',
      text: 'Jagim AR et al. (2012). A buffered form of creatine does not promote greater changes in muscle creatine content, body composition, or training adaptations than creatine monohydrate. Journal of the International Society of Sports Nutrition 9:43.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3500725/',
    },
    {
      id: 'now-gummies-2024',
      text: 'Nutraceuticals World (2024). NOW reports widespread failings in creatine gummy tests — five of 12 products failed; three contained no creatine.',
      url: 'https://www.nutraceuticalsworld.com/breaking-news/now-reports-widespread-failings-in-creatine-gummy-tests/',
    },
  ],
  editorNote:
    'Creatine is the rare sports supplement that earns its place: decades of trials, a clear mechanism, a tiny price and a clean safety record. It is also routinely oversold as a brain booster, a mood fix and a reason to buy something more expensive than a plain tub. Take 3 to 5 g of plain monohydrate every day, train hard enough for it to matter, skip the gummies and the "advanced" forms, and tell your doctor before a kidney blood test.',
  related: ['whey-protein-blend', 'vitamin-b12'],
  history: [
    {
      date: '2026-09-29',
      note: 'First published with per-claim evidence grades: strength and power, repeated high-intensity efforts and muscle mass (A); older adults with training (B); memory, and thinking when sleep-deprived (C); depression (D); endurance (F). Includes a chart of loading against a steady daily dose, redrawn from Hultman et al. (1996).',
    },
  ],
  updated: '2026-09-29',
};
