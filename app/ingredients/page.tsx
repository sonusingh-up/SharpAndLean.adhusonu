import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { EvidenceBadge } from '@/components/evidence';
import { pageMeta, JsonLd, BreadcrumbSchema } from '@/components/seo';
import { ingredients } from '@/lib/ingredients';
import { siteUrl } from '@/lib/config';

export const revalidate = 3600;

export const metadata = pageMeta(
  'Ingredient evidence reference',
  'What the research actually supports for each supplement ingredient, graded A to F by claimed benefit rather than by reputation.',
  '/ingredients',
);

export default function IngredientsIndex() {
  return (
    <SiteShell>
      <div className="page-section">
        <BreadcrumbSchema items={[{ label: 'Ingredients', path: '/ingredients' }]} />
        <JsonLd
          data={{
            '@type': 'CollectionPage',
            name: 'Ingredient evidence reference',
            url: `${siteUrl}/ingredients`,
            inLanguage: 'en-US',
            isPartOf: { '@id': `${siteUrl}/#website` },
            publisher: { '@id': `${siteUrl}/#organization` },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: ingredients.length,
              itemListElement: ingredients.map((i, n) => ({
                '@type': 'ListItem',
                position: n + 1,
                name: i.name,
                url: `${siteUrl}/ingredients/${i.slug}`,
              })),
            },
          }}
        />
        <Breadcrumb items={[{ label: 'Ingredients' }]} />
        <header className="page-top">
          <SectionLabel>The evidence reference</SectionLabel>
          <h1 className="page-title">
            Ingredients.
            <br />
            <span className="muted">Graded, not praised.</span>
          </h1>
          <p className="page-intro">
            One page per ingredient, with every claimed benefit graded separately against{' '}
            <Link href="/evidence-grading">published criteria</Link>. Grades are assigned per claim
            because evidence strength varies by use — an ingredient can be well supported for one
            thing and unsupported for another.
          </p>
        </header>

        <div className="ingredient-grid">
          {ingredients.map((i) => (
            <Link className="ingredient-card" href={`/ingredients/${i.slug}`} key={i.slug}>
              <div className="ingredient-card-top">
                <span className="tag">{i.category}</span>
                <EvidenceBadge grade={i.grade} size="sm" linked={false} />
              </div>
              <h2>{i.name}</h2>
              <p>{i.quickAnswer.split('. ').slice(0, 2).join('. ')}.</p>
              <span className="ingredient-card-foot">
                {i.claims.length} graded {i.claims.length === 1 ? 'claim' : 'claims'}
                <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>

        <section className="reading-section">
          <h2>Why grade by claim</h2>
          <p>
            A single letter for a whole ingredient hides the distinction that actually matters.
            Glucomannan is a reasonable fibre with acceptable support for regularity and effectively
            none for weight loss — the use it is almost always sold for. Averaging those into one
            grade would reassure exactly the reader who needs warning. So every claimed benefit gets
            its own grade, and the criteria are published rather than asserted.
          </p>
          <p>
            A site where nothing ever scores below B is not being rigorous, it is being polite. Some
            of these grades are deliberately low.
          </p>
        </section>
      </div>
    </SiteShell>
  );
}
