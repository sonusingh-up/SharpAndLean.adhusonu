import Link from 'next/link';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { EvidenceBadge } from '@/components/evidence';
import { pageMeta, BreadcrumbSchema, WebPageSchema, FaqSchema } from '@/components/seo';
import { gradeBands } from '@/lib/ingredients';
import { scoreCriteria } from '@/lib/scoring';

export const revalidate = 3600;

const faqs = [
  {
    question: 'How is an evidence grade assigned?',
    answer:
      'Against the published bands on this page: the number of independent studies, the combined participant count, how consistent the results are, and whether randomised controlled trials or meta-analyses exist. A grade is assigned per claimed benefit, not per ingredient.',
  },
  {
    question: 'Why does one ingredient have several different grades?',
    answer:
      'Because evidence strength varies by use. Glucomannan has reasonable support as a fibre for regularity and effectively none for weight loss. Publishing one averaged grade would hide the difference that matters to someone deciding what to buy.',
  },
  {
    question: 'Does a high grade mean I should take it?',
    answer:
      'No. A grade describes the strength of the evidence for a claim in the studied population. It says nothing about whether you personally need it, whether it interacts with your medication, or whether your levels are already adequate. That is a question for a clinician.',
  },
  {
    question: 'How is a product score different from an evidence grade?',
    answer:
      'An evidence grade describes the published research for one claim, so it belongs to the ingredient rather than to any brand. A product score out of 10 judges a specific product: whether this tub, at this price, with this label, is a sensible purchase. A grade A ingredient can sit inside a product that scores poorly, which is the whole reason the two are kept separate.',
  },
  {
    question: 'Why are the five scoring criteria weighted equally?',
    answer:
      'Because a product that hides its Supplement Facts panel and charges a large premium should not be rescued by its chemistry. Weighting evidence above everything else would produce high scores for expensive, opaque products built on well-studied ingredients, which is the outcome the method exists to avoid. The overall score is the mean of the five, so it can always be checked against the breakdown printed on the page.',
  },
  {
    question: 'Do grades change?',
    answer:
      'Yes. A new trial can strengthen or weaken a grade, and pages carry a last-updated date so you can see when the assessment was last examined. A grade that has not been revisited in years is a reason to check the primary sources yourself.',
  },
];

export const metadata = pageMeta(
  'How we grade evidence',
  'The published A to F criteria behind every ingredient grade on SharpAndLean: study count, participant numbers, consistency and trial design.',
  '/evidence-grading',
);

export default function EvidenceGradingPage() {
  return (
    <SiteShell>
      <article className="page-section info-page">
        <WebPageSchema
          type="WebPage"
          name="How we grade evidence"
          description="The A to F criteria behind every ingredient grade on SharpAndLean."
          path="/evidence-grading"
        />
        <BreadcrumbSchema items={[{ label: 'How we grade evidence', path: '/evidence-grading' }]} />
        <FaqSchema faqs={faqs} />
        <Breadcrumb items={[{ label: 'How we grade evidence' }]} />

        <header className="page-top">
          <SectionLabel>The scoring criteria</SectionLabel>
          <h1 className="page-title">How we grade evidence.</h1>
          <p className="page-intro">
            Every ingredient claim on this site carries a letter grade. A grade nobody can audit is
            worth less than no grade at all, so here are the exact bands, applied the same way every
            time.
          </p>
        </header>

        <div className="grade-table">
          {gradeBands.map((b) => (
            <div className="grade-row" key={b.grade}>
              <EvidenceBadge grade={b.grade} size="md" />
              <div>
                <h2>{b.label}</h2>
                <p>{b.criteria}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="prose">
          <h2>Graded per claim, not per ingredient</h2>
          <p>
            Grades are assigned to a specific claimed benefit, never to an ingredient as a whole.
            This is the single most important rule in the method. An ingredient is not simply
            &ldquo;good&rdquo; or &ldquo;unproven&rdquo; — it has been studied for particular
            outcomes, and the evidence for one can be strong while the evidence for another is
            absent.
          </p>
          <p>
            <Link href="/ingredients/glucomannan">Glucomannan</Link> is the clearest case on this
            site. As a bulk-forming fibre it has acceptable support for regularity. For weight loss,
            which is what almost every product containing it is sold for, the NIH Office of Dietary
            Supplements concludes it has little to no effect. One averaged grade would flatten that
            into something reassuring and useless.
          </p>

          <h2>What a grade does not tell you</h2>
          <p>
            A grade measures the state of the published evidence for a claim. It does not measure
            whether a particular product contains a useful amount, whether the form used matches the
            form studied, or whether you personally need it. A grade A ingredient in a product that
            contains a tenth of the studied dose is still a poor purchase, which is why the label
            overviews check the panel separately.
          </p>
          <p>
            It is also not clinical advice. Evidence strength in a trial population says nothing
            about your own medication, blood levels or history. See the{' '}
            <Link href="/medical-disclaimer">medical disclaimer</Link>.
          </p>

          <h2>Why some grades are low on purpose</h2>
          <p>
            A grading system where nothing scores below B is not rigorous, it is marketing with
            letters attached. Applying these bands honestly means some widely sold ingredients grade
            D or F for their headline use, and publishing those is the point of having a method
            rather than an opinion.
          </p>

          <h2 id="product-scores">Scoring a product, not an ingredient</h2>
          <p>
            A letter grade describes research. It cannot tell you whether a particular tub is worth
            buying, because that also depends on how much active ingredient a serving contains, what
            the label discloses and what you are paying for it. Reviews therefore carry a separate
            score out of 10, built from five criteria applied the same way every time.
          </p>
          <p>
            Each criterion is scored out of 10 and the overall figure is their mean, printed as a
            breakdown on every scored review so the arithmetic can be checked. Label overviews carry
            no score at all: they record what a manufacturer published and are not assessments.
          </p>

          <div className="criteria-table">
            {scoreCriteria.map((c) => (
              <div className="criteria-row" key={c.name}>
                <h3>{c.name}</h3>
                <p>{c.what}</p>
                <p className="criteria-bands">
                  <span>
                    <strong>Scores 10:</strong> {c.high}
                  </span>
                  <span>
                    <strong>Scores 0:</strong> {c.low}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <p>
            The five are weighted equally on purpose. A product whose active ingredient works, but
            which does not publish a readable panel and charges a large premium over the generic
            equivalent, should not be rescued by its chemistry.
          </p>

          <h2>When grades change</h2>
          <p>
            Grades are revisited when a relevant trial or systematic review is published, and every
            ingredient page shows when it was last updated. A change that moves a grade is described
            rather than made silently — see how{' '}
            <Link href="/about">pages are produced and corrected</Link>.
          </p>
        </div>

        <section className="reading-section">
          <h2>Common questions</h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
