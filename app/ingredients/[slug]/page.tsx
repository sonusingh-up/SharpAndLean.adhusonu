import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { ReviewCard } from '@/components/review-card';
import { EvidenceBadge, QuickAnswer, ExpertNote, TableOfContents } from '@/components/evidence';
import { pageMeta, JsonLd, BreadcrumbSchema, FaqSchema, publisherRef } from '@/components/seo';
import { ReferenceBox, PageHistory } from '@/components/article-footer';
import { liveIngredients, getIngredient, findIngredientByName } from '@/lib/ingredients';
import { getReviews } from '@/lib/data';
import { siteUrl } from '@/lib/config';
import { teamProfile } from '@/lib/author';

export const revalidate = 3600;

export async function generateStaticParams() {
  // Scheduled pages are not prebuilt; they render on first request once live.
  return liveIngredients().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ing = getIngredient(slug);
  if (!ing) return pageMeta('Ingredient', 'Ingredient reference', `/ingredients/${slug}`);
  return pageMeta(
    `${ing.name}: evidence, dosage and safety`,
    ing.quickAnswer.slice(0, 155),
    `/ingredients/${ing.slug}`,
    undefined,
    { type: 'article', modifiedTime: ing.updated },
  );
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ing = getIngredient(slug);
  if (!ing) notFound();

  // Every product whose panel lists this ingredient. This is the link that ties
  // reference pages to commercial pages in both directions.
  const reviews = (await getReviews()).filter((r) =>
    r.ingredients.some((row) => findIngredientByName(row.name)?.slug === ing.slug),
  );

  const toc = [
    { id: 'what-is-it', title: `What is ${ing.name}?` },
    { id: 'mechanism', title: 'How it works' },
    { id: 'research', title: 'What the research shows' },
    { id: 'dosage', title: 'Effective dosage' },
    { id: 'safety', title: 'Safety and interactions' },
    ...(reviews.length ? [{ id: 'products', title: 'Products containing it' }] : []),
    { id: 'faq', title: 'Common questions' },
    { id: 'references', title: 'References' },
  ];

  const url = `${siteUrl}/ingredients/${ing.slug}`;

  return (
    <SiteShell>
      <article className="page-section ingredient-page">
        <BreadcrumbSchema
          items={[
            { label: 'Ingredients', path: '/ingredients' },
            { label: ing.name, path: `/ingredients/${ing.slug}` },
          ]}
        />
        <JsonLd
          data={{
            '@type': ['Article', 'MedicalWebPage'],
            headline: `${ing.name}: evidence, dosage and safety`,
            description: ing.quickAnswer,
            url,
            inLanguage: 'en-US',
            dateModified: ing.updated,
            about: { '@type': 'Substance', name: ing.name },
            author: {
              '@type': 'Organization',
              '@id': `${siteUrl}/author/${teamProfile.slug}#team`,
              name: teamProfile.name,
            },
            publisher: publisherRef,
            isPartOf: { '@id': `${siteUrl}/#website` },
            citation: ing.references.map((r) => r.text),
          }}
        />
        <FaqSchema faqs={ing.faqs} />

        <Breadcrumb items={[{ label: 'Ingredients', href: '/ingredients' }, { label: ing.name }]} />

        <header className="page-top ingredient-top">
          <SectionLabel>{ing.category}</SectionLabel>
          <div className="ingredient-title-row">
            <h1 className="page-title">{ing.name}</h1>
            <EvidenceBadge grade={ing.grade} size="lg" />
          </div>
          <QuickAnswer>{ing.quickAnswer}</QuickAnswer>
          {ing.atAGlance?.length ? (
            <section className="at-a-glance" aria-labelledby="at-a-glance-heading">
              <h2 id="at-a-glance-heading">At a glance</h2>
              <dl>
                {ing.atAGlance.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      <strong>{row.value}</strong>
                      {row.note ? <span>{row.note}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </header>

        <TableOfContents items={toc} />

        <div className="prose ingredient-body">
          <h2 id="what-is-it">What is {ing.name}?</h2>
          <p>{ing.whatIsIt}</p>

          <h2 id="mechanism">How it works</h2>
          <p>{ing.mechanism}</p>

          <h2 id="research">What the research actually shows</h2>
          <p>
            Evidence strength varies by what is being claimed, so each use is graded separately
            against the <Link href="/evidence-grading">published criteria</Link> rather than
            averaged into one reassuring letter.
          </p>
          {ing.claims.map((c) => (
            <div className="claim-block" key={c.claim}>
              <div className="claim-head">
                <h3>{c.claim}</h3>
                <EvidenceBadge grade={c.grade} size="sm" />
              </div>
              <p>{c.body}</p>
              {c.refs?.length ? (
                <p className="claim-refs">
                  Sources:{' '}
                  {c.refs.map((id, i) => {
                    const ref = ing.references.find((r) => r.id === id);
                    if (!ref) return null;
                    return (
                      <span key={id}>
                        {i > 0 && ', '}
                        <a href={`#ref-${id}`}>{ref.text.split('.')[0]}</a>
                      </span>
                    );
                  })}
                </p>
              ) : null}
            </div>
          ))}

          <h2 id="dosage">Effective dosage</h2>
          <p>{ing.dosage}</p>
          <p>
            <strong>Where products diverge from the research.</strong> {ing.dosageGap}
          </p>

          <h2 id="safety">Safety, side effects and interactions</h2>
          <p>{ing.safety}</p>
          <p>
            None of this is medical advice. See the{' '}
            <Link href="/medical-disclaimer">medical disclaimer</Link> for what that means before
            you act on anything here.
          </p>
        </div>

        {reviews.length > 0 && (
          <section className="reading-section" id="products">
            <h2>Products we have covered containing {ing.name}</h2>
            <p>
              Every label overview on this site whose Supplement Facts panel lists {ing.name}, with
              the amount each one discloses.
            </p>
            <div className="review-grid">
              {reviews.map((r) => (
                <ReviewCard review={r} key={r.id} />
              ))}
            </div>
          </section>
        )}

        <section className="reading-section" id="faq">
          <h2>Common questions</h2>
          <div className="faq-list">
            {ing.faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div id="references">
          <ReferenceBox references={ing.references} />
          <PageHistory entries={ing.history || [{ date: ing.updated, note: 'Published.' }]} />
        </div>

        <ExpertNote>{ing.editorNote}</ExpertNote>

        {ing.related.length > 0 && (
          <section className="reading-section">
            <h2>Related ingredients</h2>
            <div className="index-category-links">
              {ing.related.map((s) => {
                const r = getIngredient(s);
                if (!r) return null;
                return (
                  <Link className="text-link" href={`/ingredients/${r.slug}`} key={s}>
                    {r.name} <ArrowUpRight size={14} />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <p className="page-updated">
          Compiled by <Link href={`/author/${teamProfile.slug}`}>{teamProfile.name}</Link>
        </p>
      </article>
    </SiteShell>
  );
}
