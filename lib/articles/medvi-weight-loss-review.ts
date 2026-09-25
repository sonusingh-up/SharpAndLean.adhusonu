import type { ProductArticle } from './types';

export const medviWeightLossReview: ProductArticle = {
  slug: 'medvi-weight-loss-review',
  name: 'MEDVi Weight Loss',
  brand: 'MEDVi',
  category: 'fat-burners',
  summary:
    'Medvi is a telehealth storefront for GLP-1 weight-loss drugs. The molecules are among the best-evidenced in medicine; the compounded versions it leads with are not FDA-evaluated, its tablets have no published human evidence, and its record includes an FDA warning letter addressed to the company, deepfaked ads and an F from the BBB.',
  verdict:
    'Real medicines sold through a storefront with a long paper trail — and the approved versions now cost about the same bought direct',
  // Scored against the five published criteria on /evidence-grading. Those criteria were
  // written for a product on a shelf; each note says how it was applied to a prescription
  // service. The compounded injections carry the most weight because they are what the
  // sign-up page leads with.
  scoreBreakdown: {
    // Semaglutide and tirzepatide carry A-grade trial evidence, and the branded options
    // Medvi offers are exactly what was tested. The compounded products it leads with have
    // no trials of their own, the tablets have no human evidence at all, and the headline
    // results on the page are self-reported customer data.
    'Evidence for the marketed claim': 5,
    // Clinicians can titrate injections to the studied 2.4 mg and 15 mg doses, and the
    // semaglutide refill price is flat across doses. Held back by compounded vials being
    // measured by hand with a syringe, and by tablets that have no studied dose to hit.
    'Dose against the studied amount': 5,
    // Credit for now naming the clinician network, the three partner pharmacies and the
    // not-FDA-approved status. Marked down for an FDA warning letter over labelling that
    // implied Medvi made the drugs, a tablet whose molecule the page does not name, an
    // unstated medication cost on the branded route, a "guarantee" the refund policy
    // disclaims, and testimonial imagery the footer says may be models or AI.
    'Label transparency': 3,
    // The generic equivalent of a compounded GLP-1 is the approved drug bought direct. At
    // maintenance the Wegovy pill costs the same $299 a month from NovoCare as Medvi's
    // compounded semaglutide refill, and the Wegovy injection $50 more. Medvi's price
    // includes a prescriber, which is worth something, but the discount for taking an
    // unapproved product has shrunk to almost nothing.
    'Value against the generic equivalent': 4,
    // The class side effects are well characterised for the approved drugs. Compounded
    // products add unreviewed quality, hand-measured doses and 1,700-plus FDA adverse event
    // reports across the category; the tablets are alleged in federal court to be inert.
    // Prescribing follows an online questionnaire, with the clinician visit after payment.
    'Safety and tolerability': 4,
  },
  seoTitle: 'MEDVi Review 2026: GLP-1 Prices, FDA Letter and Lawsuits',
  seoDescription:
    'Medvi sells compounded GLP-1s from $149. We checked its prices against Wegovy and Zepbound bought direct, its FDA warning letter, the lawsuits and its refund terms.',
  // Medvi's own render for its compounded injections, from the GLP-1 sign-up page.
  image: '/images/medvi-weight-loss.webp',
  alternatives: [],
  writtenBy: 'team',
  price: '$149 first month, then $299 a month for compounded semaglutide (25 Sept 2026)',
  guarantee:
    'No refund on cancelling a monthly plan — only if medically disqualified, or within 72 hours with no services received',
  thirdPartyTested: false,
  source: 'https://home.medvi.org/',
  sourceNote:
    'Prices, the refund policy, the named partner pharmacies and the site’s own disclaimers were read from medvi.org and its GLP-1 sign-up page on 25 September 2026, which is also the source of the product image. Nothing was purchased and no intake was completed.',
  body: `
<h2>Our take: real medicines, sold by a marketing company with a paper trail</h2>
<p>Most products reviewed on this site have a weak ingredient and a strong sales page. Medvi is the opposite problem. The molecules it sells — semaglutide and tirzepatide — are among the best-evidenced weight-loss treatments ever tested, with trial results no supplement comes close to. The difficulty is everything wrapped around them.</p>
<p>Medvi (styled MEDVi) is not a clinic, a pharmacy or a drug maker. It is a consumer-facing storefront: it runs the website and the advertising, while an outsourced clinician network decides who gets a prescription and outside pharmacies make and ship the medicine. Its sign-up page leads with compounded versions of the drugs, which the FDA does not review for safety, effectiveness or quality, and it also sells a daily "GLP-1 tablet" for which we could find no published human evidence at all.</p>
<p>The record around the company is unusually long for one founded in 2024: an FDA warning letter addressed to MEDVi, LLC in February 2026, which the company says concerned an affiliate's website; reporting on deepfaked before-and-after photographs and AI-generated doctors in its advertising; a federal class action over oral GLP-1 tablets whose lead plaintiff bought them through Medvi; and an F rating from the Better Business Bureau. None of that is a finding that the medicine you would receive is faulty. All of it is a reason to read the small print more carefully than usual.</p>
<p>Our view: if you and a clinician have decided a GLP-1 is right for you, there are now cleaner routes to the FDA-approved versions at similar prices. The Wegovy pill bought direct from its manufacturer costs the same $299 a month at maintenance as Medvi's compounded injection refill. Medvi's best case is convenience for someone with no prescriber of their own. We would not buy its tablets at any price.</p>
<p>This is a desk review. Nobody at SharpAndLean signed up, completed Medvi's intake or took medication from it. Prices, policies and disclaimers were read from Medvi's own pages on 25 September 2026; everything else is traced to a regulator, a court filing, a trial or named reporting, listed in the references below.</p>

<h2>What Medvi is, and what it is not</h2>
<p>MEDVi, LLC was incorporated in Delaware in April 2024 and gives an address in Newark, Delaware. Its founder, Matthew Gallagher, has said he launched it from his Los Angeles home with about $20,000 and a stack of AI tools. In April 2026 the <em>New York Times</em> and <em>Forbes</em> reported it was on course for $1.8 billion in sales with two employees — Gallagher and his brother Elliot, whom the BBB lists as chief operating officer. The site now claims more than 500,000 patients.</p>
<p>Two people cannot prescribe to half a million, and they do not. Medvi's own footer sets out the structure. Its online assessment, it says, does not create a doctor-patient relationship. Prescribing is done by clinicians from OpenLoop Health and affiliated professional corporations, who decide whether to prescribe. The medicine is dispensed by partner pharmacies it names as Triad Rx in Alabama, RedRock Pharmacy in Utah and Beaker Pharmacy &amp; Compounding in Texas. Its terms state that Medvi does not act as a pharmacy and does not make compounded medicines.</p>
<p>That arrangement is legal and common in telehealth. It does mean the company whose name is on the website is responsible for the marketing rather than the medicine — and when something goes wrong with a dose or a delivery, you may be dealing with three organisations instead of one.</p>
<p>One sequencing detail is worth knowing before you start. The footer says the OpenLoop clinician meets you <em>after</em> checkout: you pay first and are assessed second. Medvi's refund policy promises a full refund if a clinician disqualifies you for a medical reason.</p>

<h2>What is on the menu, and what it costs</h2>
<p>These are the prices on Medvi's GLP-1 sign-up page on 25 September 2026, under a banner still advertising a summer sale:</p>
<ul>
<li><strong>Compounded GLP-1 injections</strong> — from $149 for the first month. The page's FAQ says the semaglutide programme then refills at $299 a month, covering the prescriber, the medication and shipping, with no separate membership fee.</li>
<li><strong>Compounded GLP-1 tablets</strong> — from $249, one dissolvable tablet a day. The page does not say which molecule they contain.</li>
<li><strong>Wegovy pill, Wegovy injection and Zepbound injection</strong> — a $99 monthly membership plus the cost of the medication, which the page does not state.</li>
</ul>
<p>The vial pictured at the top of this page is Medvi's own render for its compounded injections, taken from that sign-up page. It carries no brand name — the FDA's warning letter objected to earlier product images labelled MEDVi, because they implied Medvi made the drug — and Medvi's footer says the medication you receive may look different from what its website shows.</p>
<p>We could not find a price for compounded tirzepatide injections on the pages we read, although the FDA's warning letter shows Medvi-branded compounded tirzepatide was being marketed at the end of 2025. Ask before you pay.</p>
<p>At the compounded semaglutide prices, a first year costs $149 plus eleven refills at $299 — about <strong>$3,438</strong>. Two other details sit in the small print. The "no hidden fees" promise applies to the compounded plans; the branded route carries a membership on top of the drug. And the "free" dietitian visits are footnoted as subject to insurance and copay eligibility, which is not quite the same thing as free.</p>

<h2>The medicines work — the question is which version you get</h2>
<h3>The branded drugs have some of the best evidence in medicine</h3>
<p>In STEP 1, weekly semaglutide 2.4 mg — the drug sold as Wegovy — produced a mean weight loss of 14.9 per cent over 68 weeks, against 2.4 per cent on placebo. In SURMOUNT-1, tirzepatide 15 mg, sold as Zepbound, produced 20.9 per cent over 72 weeks. The newer Wegovy pill, oral semaglutide 25 mg, produced 13.6 per cent over 64 weeks against 2.2 per cent on placebo in the 307-person OASIS 4 trial, and was approved by the FDA in December 2025. Our <a href="/learn/glp-1">GLP-1 explainer</a> goes through these trials, and what happens when people stop.</p>
<p>Those are the products Medvi offers through its $99 membership route. If that is what you are prescribed, you are getting exactly what was tested.</p>
<h3>Compounded injections are the same molecule, not the same product</h3>
<p>What Medvi leads with is compounded semaglutide and tirzepatide: versions mixed by a pharmacy rather than made by Novo Nordisk or Eli Lilly. The FDA's position is that compounded drugs are not FDA-approved, which means the agency does not review their safety, effectiveness or quality before they are sold. No compounded product has been through a trial; the STEP and SURMOUNT results belong to the branded drugs.</p>
<p>That is not the same as saying compounded injections do not work — plenty of people lose weight on them. It is saying the evidence stops at the molecule, and the quality of what arrives depends on a pharmacy you did not choose. As of 31 May 2026 the FDA had received 990 adverse event reports involving compounded semaglutide and more than 730 involving compounded tirzepatide, and it describes those figures as an undercount because many state-licensed pharmacies are not required to report. A recurring cause is dosing error: compounded vials are drawn up by hand with a syringe, and confusion between millilitres, units and milligrams has produced ten-fold overdoses. Branded pens are pre-set.</p>
<p>Medvi's disclaimer says its compounded medicines are made in "FDA-regulated facilities". It does not say which kind. Outsourcing facilities registered under section 503B of federal law work to federal manufacturing standards and are inspected by the FDA; ordinary compounding pharmacies operating under section 503A are overseen mainly by state pharmacy boards. Ask which your pharmacy is.</p>
<h3>The tablets are the weakest thing on the menu</h3>
<p>Semaglutide and tirzepatide are peptides — chains of amino acids that the gut digests like any other protein. The Wegovy pill works only because semaglutide is co-formulated with an absorption enhancer called SNAC, which protects it in the stomach and carries it through the stomach lining. Even with SNAC, roughly 1 per cent of an oral dose reaches the bloodstream, which is why the pill has to be taken on an empty stomach with a sip of water. A compounded tablet without that technology has no established route into the body, and we could find no published human study showing that compounded oral tirzepatide or compounded oral semaglutide reaches meaningful blood levels.</p>
<p>That gap is now in federal court. <em>Day v. OpenLoop Health</em>, filed in Delaware in November 2025, alleges that "oral tirzepatide" tablets sold through a network of telehealth storefronts cannot be absorbed and are effectively inert. It brings racketeering, fraud and consumer-protection claims against OpenLoop and Triad Rx — the same clinician network and one of the three pharmacies Medvi names. The lead plaintiff says he bought a one-month supply from medvi.org in October 2025 for $279.99. Medvi is not a defendant; the complaint describes it as one of many near-identical storefronts. These are allegations, and no court has found against the defendants.</p>
<p>Medvi's current page offers "GLP-1 tablets" from $249 without saying which molecule they contain. Our advice does not depend on the answer: we would not pay for a compounded GLP-1 tablet until someone publishes evidence that it is absorbed.</p>
<h3>Side effects come with the molecule</h3>
<p>Whichever version you receive, the side effects of the drug class apply. In the Wegovy injection trials, nausea affected 44 per cent of people, diarrhoea 30 per cent, vomiting 24 per cent and constipation 24 per cent, against 16, 16, 6 and 11 per cent on placebo. Pancreatitis and gallbladder disease are rarer but listed, and the drugs carry a boxed warning about thyroid C-cell tumours seen in rodents: they are not for anyone with a personal or family history of medullary thyroid carcinoma or MEN 2. They are not for use in pregnancy. Tirzepatide can make oral contraceptives less reliable, the drugs can cause low blood sugar alongside insulin or sulfonylureas, and anyone having an anaesthetic needs to tell the team they are on one.</p>
<p>An online questionnaire can only screen for what you tell it. If any of the above applies to you, it belongs in the intake — and in a conversation with a clinician who knows your history.</p>

<h2>Medvi's own numbers, checked</h2>
<p>The sign-up page makes three headline claims: that customers lose an average of 18 per cent of their body weight, that they lose six times more than with diet and exercise alone, and that 93 per cent kept the weight off for good. All three are footnoted as data from Medvi patients over their first six months. The homepage adds that the figures are self-reported: customers enter their weight on a questionnaire every three to four weeks.</p>
<p><strong>The 18 per cent.</strong> The branded trials needed 68 to 72 weeks, with weight measured by trial staff, to reach 15 to 21 per cent. Medvi reports a comparable figure at six months, from weights customers typed in themselves. Self-reported averages also have a survivor problem: people who stall, have side effects or cancel tend to stop reporting, and drop out of the average. Without the number who started and the number still reporting, the figure cannot be checked.</p>
<p><strong>Six times diet and exercise.</strong> A dataset of paying customers contains nobody on diet and exercise alone, so it cannot produce this comparison. The ratio does match STEP 1, where 14.9 per cent on branded semaglutide against 2.4 per cent on placebo is about six to one. That is a trial of Wegovy, not of Medvi's customers or of compounded product.</p>
<p><strong>Ninety-three per cent kept it off for good.</strong> Six months of data cannot show that anyone kept weight off for good, and most people in their first six months are still on treatment. When STEP 1 participants stopped semaglutide, they regained a mean of 11.6 percentage points within a year — about two-thirds of what they had lost. Keeping the weight off on these drugs generally means staying on them, which is a cost question as much as a medical one.</p>
<p>Elsewhere the page promises to fix a broken metabolism. GLP-1 drugs act mainly on appetite and on how quickly the stomach empties. They do not repair anything, and the regain data shows the effect lasts about as long as the prescription.</p>

<h2>The marketing record and the FDA letter</h2>
<h3>Before-and-after photographs that were not patients</h3>
<p>In May 2025 Futurism reported that before-and-after pictures presented on Medvi's site as patients had been lifted from images circulating online for years, with the faces altered by AI. One "patient" was traced to a 2018 newspaper story about a man whose weight loss took place years before semaglutide was approved for weight loss; one advert showed an AI-generated Ozempic box with garbled lettering. The same report found a real physician who said he had nothing to do with the company and wanted his name taken off its sites. Medvi did not respond to Futurism at the time.</p>
<p>The site's footer now says some of its text, images and media may be generated or enhanced with AI, that people in its advertisements may be actors or models, and that testimonial images may use models to protect patient privacy. The descriptive text attached to several of the testimonial photographs on the sign-up page reads like generic stock-library captions rather than descriptions of patients.</p>
<h3>Doctors who were not doctors</h3>
<p>In April 2026, after a <em>New York Times</em> profile brought the company wide attention, reporters documented social-media accounts posing as physicians and running Medvi adverts. Medvi told Futurism it had recently become aware of adverts that appeared to feature AI-generated medical practitioners, and that it had changed its marketing rules to prohibit them.</p>
<h3>The FDA warning letter</h3>
<p>On 20 February 2026 the FDA's Office of Compounding Quality and Compliance sent a warning letter to MEDVi, LLC at the same Newark address printed on medvi.org. The agency had reviewed content at medvi.io in December 2025 and found Medvi-branded compounded semaglutide and tirzepatide misbranded on two grounds. Claims such as "Same active ingredient as Wegovy® and Ozempic®", it said, implied the compounded products were FDA-approved or equivalent to the approved drugs. And product images carrying the MEDVi name falsely suggested that Medvi was the compounder. It asked for a written response within 15 working days, including who actually made the drugs.</p>
<p>Gallagher told Futurism in April that the letter concerned medvi.io, an affiliate's website, and that his company had never received a letter from the FDA. We cannot settle that from the outside. The letter is addressed to MEDVi, LLC, and we found no published close-out letter.</p>
<p>Medvi was not singled out. On 3 March 2026 the FDA announced 30 more warning letters to telehealth companies for the same two practices, and in February it said it intended to restrict the GLP-1 ingredients used in unapproved compounded drugs. The regulatory ground under compounded GLP-1s is shifting, so anyone starting a course should ask what happens if their pharmacy can no longer supply it.</p>
<h3>The New York Times profile</h3>
<p>The <em>Times</em> profiled Medvi on 2 April 2026 as an example of a very large business run by a very small, AI-assisted team. After readers pointed out what it had left out, the paper updated the article and added an editor's note saying it should have mentioned the FDA letter and a pending class action accusing Medvi of breaking California's anti-spam law. Medvi's sign-up page displays the <em>Times</em> logo alongside <em>Forbes</em>, WebMD and others, under a heading that runs together publications that have covered the company and publications it has advertised in. A logo strip is not an endorsement.</p>

<h2>Lawsuits, complaints and the refund policy</h2>
<h3>In court</h3>
<ul>
<li><strong>A California anti-spam class action</strong>, filed in March 2026 and pending, alleges Medvi benefited from commercial email that broke California law. This is the case the <em>Times</em> editor's note refers to.</li>
<li><strong><em>Day v. OpenLoop Health</em></strong>, the Delaware oral-tirzepatide complaint described above. Medvi is named as the storefront the plaintiff bought from, not as a defendant.</li>
<li><strong>Unsolicited text messages.</strong> The Delaware complaint records that in a 2025 federal case in Florida over unsolicited marketing texts, Medvi was served and did not appear.</li>
</ul>
<p>All of these are allegations. We found no judgment against Medvi on the merits of any of them.</p>
<h3>What customers say</h3>
<p>On 25 September 2026 Medvi had a 4.3 rating across 14,833 reviews on Trustpilot, where it has claimed its profile and pays for a subscription. Two of the three most recent reviews on its summary page were marked as invited by the company — a normal practice, and one that tends to draw happier customers. Reviewers often praise the clinicians and support staff. The complaints that do appear are about delivery delays, double charges, confusing dose instructions and difficulty cancelling.</p>
<p>The Better Business Bureau rates Medvi <strong>F</strong>, citing 749 complaints and a failure to respond to 133 of them. The BBB itself cautions that complaint counts should be read against a company's size, and against 500,000 claimed patients the raw number is modest. The unanswered ones — nearly one complaint in five — are the more telling figure.</p>
<h3>Cancelling: read this before you pay</h3>
<p>Medvi's refund policy is strict, and parts of it are printed in capital letters.</p>
<ul>
<li>You can cancel at any time, by email or through the patient portal, but the request must arrive at least 72 hours before your next billing date or you will be charged for another cycle.</li>
<li>On a monthly plan there is no refund for the month in which you cancel, or for any earlier month.</li>
<li>A full refund is available only if you cancel within 72 hours of starting and have received no services, or if a clinician disqualifies you.</li>
<li>On a plan billed two or more months at a time, you are refunded for months in which no medication shipped.</li>
<li>Prescription medicine cannot be returned once dispensed.</li>
</ul>
<p>The same policy says there is no guarantee of results. The sign-up page, meanwhile, advertises a "MEDVi guarantee" beside a money-back-guarantee icon, and according to screenshots filed in the Delaware complaint, the homepage in November 2025 promised weight loss or your money back. Whatever the marketing says, the refund policy is the document that governs your money. Put the 72-hour deadline in your calendar the day you sign up.</p>

<h2>Medvi or going direct?</h2>
<p>When the branded drugs were in shortage and cost well over $1,000 a month at list price, the case for compounded versions was easy to make. Both manufacturers now sell direct to people paying for themselves, and the gap has narrowed to almost nothing. On 25 September 2026:</p>
<ul>
<li><strong>Wegovy pill, from NovoCare Pharmacy</strong> — $149 a month at 1.5 mg, $199 at 4 mg, and $299 at 9 mg and 25 mg.</li>
<li><strong>Wegovy injection, from NovoCare Pharmacy</strong> — $199 a month for the first two fills at the starting doses for new patients until 31 December 2026, then $349 a month; $399 for the 7.2 mg high dose.</li>
<li><strong>Zepbound, from LillyDirect</strong> — $299 a month at 2.5 mg, $399 at 5 mg, and $449 at 7.5 to 15 mg if you refill within 45 days, rising to $499 to $699 if you do not.</li>
<li><strong>Medvi compounded semaglutide</strong> — $149 for the first month, then $299.</li>
</ul>
<p>At maintenance, then, the FDA-approved Wegovy pill costs the same $299 a month as Medvi's compounded semaglutide injection, and the approved injection costs $50 more. The catch is that buying direct needs a prescription, and Medvi's price includes the prescriber. If you have a doctor willing to prescribe, the direct route gets you an approved product for about the same money. If you do not, Medvi's $99 membership is one way to get a prescription for the branded drugs — at a monthly total of roughly $250 to $550 depending on drug and dose, if the medication is priced at the manufacturers' self-pay rates. Medvi does not publish that medication cost, so ask for it in writing.</p>
<p>Medvi says all its prescriptions are cash-pay. If your insurance covers Wegovy or Zepbound, a copay through your own doctor may undercut every price on this page.</p>

<h2>How we scored a service against supplement criteria</h2>
<p>Our <a href="/evidence-grading">five criteria</a> were written for products on a shelf, so each needs translating for a prescription service. We applied them to what Medvi sells as a package — the prescription, the medicine and the terms — and gave the compounded injections the most weight, because they are what the sign-up page leads with.</p>
<ul>
<li><strong>Evidence, 5 out of 10.</strong> The molecules are A-grade and the branded options are exactly what was tested. The compounded products have no trials, the tablets have no human evidence, and the headline results are self-reported.</li>
<li><strong>Dose, 5.</strong> Clinicians can titrate injections to the studied doses, and the semaglutide refill price is flat. But compounded vials are measured by hand, and the tablets have no studied dose to hit.</li>
<li><strong>Transparency, 3.</strong> Credit for naming the clinician network, the pharmacies and the not-FDA-approved status. Marked down for the FDA letter, an unnamed tablet molecule, an unstated branded medication cost and a guarantee the refund policy disclaims.</li>
<li><strong>Value, 4.</strong> The approved Wegovy pill costs the same at maintenance bought direct. Medvi's price includes a prescriber; the discount for accepting an unapproved product has all but gone.</li>
<li><strong>Safety, 4.</strong> Well-characterised class effects, plus unreviewed compounding quality, hand-measured doses and tablets alleged in court to be inert.</li>
</ul>
<p>The result, 4.2 out of 10, is not a score for semaglutide or tirzepatide. It is a score for buying them this way.</p>

<h2>Sources and shopping: what to check before signing up</h2>
<p>If you decide to use Medvi, these are the questions worth asking — in writing, before you pay:</p>
<ul>
<li>Which exact drug, strength and form will I receive, and is it compounded or FDA-approved?</li>
<li>Which pharmacy will fill it, and is it a 503B outsourcing facility or a 503A pharmacy?</li>
<li>What will each later month cost at each dose, including any membership?</li>
<li>For a compounded vial: in what units is my dose measured, and who shows me how to draw it up?</li>
<li>Who do I contact about side effects out of hours, and is that person a clinician?</li>
<li>What is my billing date, and how do I cancel before the 72-hour cut-off?</li>
</ul>
<p>Before any of that, check whether your own doctor or insurer can get you an approved GLP-1. And decline the tablets.</p>
<p>We have no commercial relationship with Medvi, and this page carries no buy link. Every figure above is traced to a source in the references below.</p>
`,
  whoFor:
    'An adult in the United States who has already decided with a clinician that a GLP-1 is appropriate, has no prescriber of their own, understands the difference between compounded and FDA-approved versions, and has read the refund policy before paying. The strongest case is the branded route, where the $99 membership buys access to a prescription for an approved drug.',
  whoAvoid:
    'Anyone offered the compounded tablets. Anyone with a personal or family history of medullary thyroid carcinoma or MEN 2, anyone pregnant, planning pregnancy or breastfeeding, and anyone with a history of pancreatitis, until a clinician who knows their history has been involved. Anyone on insulin or a sulfonylurea without closer monitoring than a questionnaire provides. Anyone not confident measuring a dose from a vial. Anyone outside the United States.',
  pros: [
    'Offers FDA-approved options — the Wegovy pill, Wegovy injection and Zepbound — alongside compounded ones',
    'The site now names its clinician network and three partner pharmacies, and states that compounded medicines are not FDA-approved',
    'A flat $299 monthly refill for compounded semaglutide, which the site says covers prescriber, medication and shipping',
    'A full refund if a clinician medically disqualifies you',
    'Trustpilot reviewers frequently praise its clinicians and support staff, with a 4.3 rating across 14,833 reviews',
  ],
  cons: [
    'An FDA warning letter to MEDVi, LLC in February 2026 over misbranded compounded semaglutide and tirzepatide; the company says it concerned an affiliate’s site',
    'Sells compounded GLP-1 tablets with no published human evidence of absorption, and does not name the molecule on its sign-up page',
    'The lead plaintiff in a federal RICO complaint over “oral tirzepatide” bought his tablets through Medvi',
    'Headline results — 18 per cent average loss, 93 per cent kept it off — are self-reported customer data, not trials',
    'Reported use of deepfaked before-and-after photos and AI-generated doctors in its advertising',
    'An F from the BBB, with 749 complaints and 133 left unanswered',
    'No refund on cancelling a monthly plan, and cancellation needs 72 hours’ notice before billing',
    'The branded route adds a $99 monthly membership to a medication cost the page does not state',
  ],
  ingredients: [
    {
      name: 'Compounded semaglutide (weekly injection)',
      dose: 'Weekly injection, strength set by the prescriber',
      evidence_rating: 'moderate',
      note: 'The molecule carries A-grade trial evidence as Wegovy, which produced 14.9 per cent mean weight loss over 68 weeks in STEP 1. This compounded version has no trials of its own and is not reviewed by the FDA for safety, effectiveness or quality, so the rating is marked down a step for that gap. Doses are drawn from a vial by hand, where unit confusion has caused ten-fold overdoses.',
    },
    {
      name: 'Compounded tirzepatide (weekly injection)',
      dose: 'Weekly injection; no price shown on the pages we read',
      evidence_rating: 'moderate',
      note: 'As Zepbound, tirzepatide produced 20.9 per cent mean weight loss over 72 weeks in SURMOUNT-1. The compounded version is unevaluated, for the same reasons as compounded semaglutide. It was one of the two products named in the FDA’s February 2026 warning letter to MEDVi, LLC.',
    },
    {
      name: 'Compounded “GLP-1 tablets” (dissolvable, daily)',
      dose: 'One tablet a day; molecule and strength not named on the sign-up page',
      evidence_rating: 'none',
      note: 'Peptides are digested in the gut, and the approved Wegovy pill relies on the absorption enhancer SNAC to reach even about 1 per cent bioavailability. We found no published human study showing a compounded GLP-1 tablet reaches meaningful blood levels. A federal complaint alleges “oral tirzepatide” tablets sold this way, including one bought through Medvi, are effectively inert.',
    },
    {
      name: 'Wegovy pill (oral semaglutide)',
      dose: '1.5 mg daily, stepped up to 25 mg (label)',
      evidence_rating: 'strong',
      note: 'FDA-approved in December 2025 on the OASIS 4 trial: 13.6 per cent mean weight loss over 64 weeks against 2.2 per cent on placebo, in 307 adults. Available through Medvi’s $99 membership route, or direct from NovoCare Pharmacy at $149 to $299 a month depending on dose.',
    },
    {
      name: 'Wegovy injection (semaglutide)',
      dose: '0.25 mg weekly, stepped up to 2.4 mg (label)',
      evidence_rating: 'strong',
      note: 'The drug tested in STEP 1, and in the SELECT trial, which showed fewer major cardiovascular events. Available through Medvi’s membership route or direct from NovoCare Pharmacy at $349 a month after an introductory price for new patients.',
    },
    {
      name: 'Zepbound injection (tirzepatide)',
      dose: '2.5 mg weekly, stepped up to 5–15 mg (label)',
      evidence_rating: 'strong',
      note: 'The drug tested in SURMOUNT-1, and superior to semaglutide head to head in SURMOUNT-5. Available through Medvi’s membership route or direct from LillyDirect at $299 to $449 a month with timely refills.',
    },
  ],
  faqs: [
    {
      question: 'Is Medvi legit?',
      answer:
        'It is a real US company, and prescribing and dispensing are done by licensed clinicians and pharmacies it names. Legitimate is not the same as advisable, though. Its record includes an FDA warning letter addressed to MEDVi, LLC, reporting on deepfaked before-and-after photos and fake doctors in its ads, pending litigation, and an F rating from the Better Business Bureau.',
    },
    {
      question: 'Is Medvi’s semaglutide the same as Ozempic or Wegovy?',
      answer:
        'It contains the same molecule, but it is not the same product. Compounded semaglutide is mixed by a pharmacy, has never been through a trial, and is not reviewed by the FDA for safety, effectiveness or quality. The FDA’s warning letter specifically objected to claims that Medvi’s compounded products had the same active ingredient as Wegovy and Ozempic, because the wording implied an equivalence and approval they do not have.',
    },
    {
      question: 'How much does Medvi cost?',
      answer:
        'On 25 September 2026, compounded GLP-1 injections started at $149 for the first month, with semaglutide refills at $299 a month. Compounded tablets started at $249. Branded Wegovy and Zepbound cost a $99 monthly membership plus the medication, whose price the page did not state. We found no published price for compounded tirzepatide.',
    },
    {
      question: 'Do Medvi’s GLP-1 tablets work?',
      answer:
        'We found no published human evidence that they are absorbed. Semaglutide and tirzepatide are peptides that the gut digests, and the approved Wegovy pill needs a special absorption enhancer to get even about 1 per cent of a dose into the bloodstream. A federal complaint alleges that “oral tirzepatide” tablets sold through a network of telehealth sites, including one bought through Medvi, are effectively inert. That is an allegation, not a finding, but we would not buy them.',
    },
    {
      question: 'Did Medvi get an FDA warning letter?',
      answer:
        'The FDA sent a warning letter to MEDVi, LLC on 20 February 2026, about compounded semaglutide and tirzepatide it had seen marketed at medvi.io. It cited claims implying the drugs matched Wegovy, Ozempic, Mounjaro and Zepbound, and labels suggesting Medvi was the compounder. Medvi’s founder has said the letter concerned an affiliate’s website and that his company never received it.',
    },
    {
      question: 'Can I cancel Medvi and get a refund?',
      answer:
        'You can cancel at any time, but the request must arrive at least 72 hours before your next billing date. On a monthly plan there is no refund for the current or any earlier month. Full refunds are limited to cancelling within 72 hours before receiving any service, or being medically disqualified. Multi-month plans refund months in which nothing shipped.',
    },
    {
      question: 'Is Medvi cheaper than buying Wegovy or Zepbound directly?',
      answer:
        'Barely, if at all. At maintenance, the FDA-approved Wegovy pill costs $299 a month from NovoCare Pharmacy — the same as Medvi’s compounded semaglutide refill — and the Wegovy injection costs $349. Buying direct needs a prescription, which Medvi’s price includes. If you already have a prescriber, going direct gets you an approved drug for about the same money.',
    },
    {
      question: 'Does Medvi take insurance?',
      answer:
        'Medvi says all its prescriptions are cash-pay, though insurers may reimburse the branded drugs. If your plan covers Wegovy or Zepbound, a copay arranged through your own doctor may cost far less than any cash price, so check your coverage before signing up anywhere.',
    },
    {
      question: 'How much weight will I lose with Medvi?',
      answer:
        'Nobody can predict that for an individual. Medvi advertises an 18 per cent average from its customers’ self-reported weights over six months, which cannot be independently checked. The best evidence is from trials of the branded drugs: about 15 per cent over 68 weeks for semaglutide and about 21 per cent over 72 weeks for tirzepatide, with most of it regained within a year of stopping.',
    },
  ],
  references: [
    {
      id: 'fda-wl-medvi',
      text: 'US Food and Drug Administration (20 February 2026). Warning letter 721455 to MEDVi, LLC dba MEDVi — misbranded compounded semaglutide and tirzepatide, based on a December 2025 review of medvi.io.',
      url: 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/medvi-llc-dba-medvi-721455-02202026',
    },
    {
      id: 'fda-30-letters',
      text: 'US Food and Drug Administration (3 March 2026). FDA warns 30 telehealth companies against illegal marketing of compounded GLP-1s.',
      url: 'https://www.fda.gov/news-events/press-announcements/fda-warns-30-telehealth-companies-against-illegal-marketing-compounded-glp-1s',
    },
    {
      id: 'fda-api-action',
      text: 'US Food and Drug Administration (6 February 2026). FDA intends to take action against non-FDA-approved GLP-1 drugs — including restricting the ingredients used in unapproved compounded versions.',
      url: 'https://www.fda.gov/news-events/press-announcements/fda-intends-take-action-against-non-fda-approved-glp-1-drugs',
    },
    {
      id: 'fda-unapproved-medvi',
      text: 'US Food and Drug Administration. FDA’s concerns with unapproved GLP-1 drugs used for weight loss — adverse event reports to 31 May 2026, dosing errors and the advice to use a licensed prescriber and pharmacy.',
      url: 'https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss',
    },
    {
      id: 'day-v-openloop',
      text: 'Day v. OpenLoop Health, Inc. et al., No. 1:25-cv-01418 (D. Del., filed 20 November 2025). Class action complaint alleging “oral tirzepatide” tablets are not absorbed; the plaintiff’s purchase through medvi.org is described at paragraphs 82–83.',
      url: 'https://chimicles.com/wp-content/uploads/2026/01/OT-Complaint-1.pdf',
    },
    {
      id: 'medvi-files',
      text: 'Keeler B. (7 April 2026). The MEDVi Files — a summary of court dockets naming Medvi, including the Florida and California text-message cases and the California anti-spam class action.',
      url: 'https://healthapiguy.substack.com/p/the-medvi-files',
    },
    {
      id: 'futurism-deepfakes',
      text: 'Futurism (29 May 2025). Investigation of Medvi’s AI-altered before-and-after photographs and AI-generated advertising.',
      url: 'https://futurism.com/medvi-ai-ozempic',
    },
    {
      id: 'futurism-response',
      text: 'Futurism (9 April 2026). Medvi’s response to reporting on AI-generated doctors, and its founder’s account of the FDA letter.',
      url: 'https://futurism.com/artificial-intelligence/ai-drug-marketer-medvi-responds',
    },
    {
      id: 'futurism-nyt',
      text: 'Futurism (10 April 2026). The New York Times’ editor’s note adding the FDA letter and the California anti-spam class action to its Medvi profile.',
      url: 'https://futurism.com/artificial-intelligence/new-york-times-edits-medvi-article',
    },
    {
      id: 'forbes-medvi',
      text: 'Forbes (2 April 2026). How Medvi was built with $20,000 and AI tools — the $1.8 billion sales projection and founding account.',
      url: 'https://www.forbes.com/sites/josipamajic/2026/04/02/ai-and-20000-helped-one-man-build-a-18-billion-telehealth-startup/',
    },
    {
      id: 'medvi-signup',
      text: 'MEDVi. GLP-1 sign-up page — prices, headline claims, partner pharmacies and disclaimers, read 25 September 2026.',
      url: 'https://glp1.medvi.org/?page=multi3&sub1=org-multi',
    },
    {
      id: 'medvi-refund',
      text: 'MEDVi. Cancellation and refund policy, read 25 September 2026.',
      url: 'https://home.medvi.org/cancellation-and-refund-policy',
    },
    {
      id: 'bbb-medvi',
      text: 'Better Business Bureau. MEDVi business profile — F rating, 749 complaints, 133 unanswered, checked 25 September 2026.',
      url: 'https://www.bbb.org/us/de/newark/profile/medical-consultants/medvi-0251-92034163',
    },
    {
      id: 'trustpilot-medvi',
      text: 'Trustpilot. MEDVi reviews — 4.3 across 14,833 reviews, checked 25 September 2026.',
      url: 'https://www.trustpilot.com/review/medvi.org',
    },
    {
      id: 'novocare-wegovy',
      text: 'NovoCare Pharmacy. Wegovy self-pay prices for the pill and the injection, checked 25 September 2026.',
      url: 'https://www.novocare.com/pharmacy/wegovy/offer.html',
    },
    {
      id: 'lillydirect-zepbound',
      text: 'LillyDirect. Zepbound self-pay prices by dose, checked 25 September 2026.',
      url: 'https://www.lilly.com/lillydirect/zepbound',
    },
    {
      id: 'step1-medvi',
      text: 'Wilding JPH et al. (2021). Once-weekly semaglutide in adults with overweight or obesity. STEP 1 — 14.9 per cent mean weight loss over 68 weeks against 2.4 per cent on placebo.',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2032183',
    },
    {
      id: 'step1-extension-medvi',
      text: 'Wilding JPH et al. (2022). Weight regain after withdrawal of semaglutide: the STEP 1 trial extension — a mean 11.6 percentage points regained over 52 weeks off treatment.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/',
    },
    {
      id: 'surmount1-medvi',
      text: 'Jastreboff AM et al. (2022). Tirzepatide once weekly for the treatment of obesity. SURMOUNT-1 — 20.9 per cent mean weight loss on 15 mg at 72 weeks.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35658024/',
    },
    {
      id: 'oasis4-medvi',
      text: 'Wharton S et al. (2025). Oral semaglutide at a dose of 25 mg in adults with overweight or obesity. OASIS 4 — 13.6 per cent mean weight loss over 64 weeks against 2.2 per cent on placebo.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40934115/',
    },
    {
      id: 'snac-review-medvi',
      text: 'Aroda VR, Blonde L, Pratley RE (2022). A new era for oral peptides: SNAC and the development of oral semaglutide — why an absorption enhancer is needed and the roughly 1 per cent bioavailability it achieves.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35838946/',
    },
    {
      id: 'wegovy-label-medvi',
      text: 'US Food and Drug Administration. WEGOVY (semaglutide) injection prescribing information — the boxed warning, contraindications and the adverse reaction rates quoted on this page.',
      url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/215256s024lbl.pdf',
    },
  ],
  history: [
    {
      date: '2026-09-25',
      note: 'Scored 4.2 out of 10 against the five published criteria, applied to a prescription service as explained on the page. The score reflects buying GLP-1 drugs through this storefront — compounded products, unproven tablets, the marketing and refund record — not the evidence for semaglutide or tirzepatide themselves.',
    },
    {
      date: '2026-09-25',
      note: 'First published. Medvi’s prices, refund policy, partner pharmacies and disclaimers read from its own pages; Wegovy and Zepbound self-pay prices from NovoCare and LillyDirect; BBB and Trustpilot figures checked, all on this date. Nobody at SharpAndLean signed up, completed the intake or took medication from Medvi.',
    },
  ],
  published: '2026-09-25T00:00:00Z',
  updated: '2026-09-25T00:00:00Z',
};
