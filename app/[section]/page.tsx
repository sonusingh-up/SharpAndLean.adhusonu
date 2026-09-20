import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, Empty, SectionLabel } from '@/components/site';
import { Catalog } from '@/components/catalog';
import { RichText } from '@/components/rich-text';
import { Newsletter } from '@/components/newsletter';
import { pageMeta, JsonLd, BreadcrumbSchema } from '@/components/seo';
import { categories } from '@/lib/sample';
import { getReviews, getCollections, getCategoryData } from '@/lib/data';
import { siteUrl, demoMode } from '@/lib/config';
import { categoryGuides, informationPages as info } from '@/lib/editorial-content';
export const revalidate = 3600;
export async function generateStaticParams() {
  return [
    ...categories.map((c) => ({ section: c.slug })),
    ...[
      'best',
      'compare',
      'about',
      'contact',
      'affiliate-disclosure',
      'medical-disclaimer',
      'privacy-policy',
      'terms',
    ].map((section) => ({ section })),
  ];
}
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const c = categories.find((c) => c.slug === section);
  const title =
    c?.name ||
    info[section]?.title ||
    { best: 'Best-of guides', compare: 'Supplement comparisons', contact: 'Get in touch' }[
      section
    ] ||
    'Page';
  return pageMeta(
    title,
    c?.description ||
      info[section]?.intro ||
      'Explore thoughtful supplement information from SharpAndLean.',
    `/${section}`,
  );
}
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const category = categories.find((c) => c.slug === section);
  if (category) {
    const [all, content, articles] = await Promise.all([
      getReviews(),
      getCategoryData(section),
      getCollections('articles'),
    ]);
    const reviews = all.filter((r) => r.category_slug === section);
    return (
      <SiteShell>
        <div className="page-section">
          <Breadcrumb items={[{ label: category.name }]} />
          <BreadcrumbSchema items={[{ label: category.name, path: `/${section}` }]} />
          <header className="page-top">
            <SectionLabel>{category.label}</SectionLabel>
            <h1 className="page-title">
              {category.name}.<br />
              <span className="muted">With perspective.</span>
            </h1>
            <p className="page-intro">{category.description}</p>
            <Link className="text-link" href="/author/sumita-bhatti">
              Meet our reviewer <ArrowUpRight size={14} />
            </Link>
          </header>
          {reviews.length ? (
            <Catalog reviews={reviews} />
          ) : (
            <Empty
              title="The first reviews are on their way."
              description="We’re preparing our evidence-based assessments. Check back soon."
            />
          )}
          {(content?.buying_guide || categoryGuides[section]) && (
            <section className="reading-section">
              <RichText html={content?.buying_guide || categoryGuides[section]} />
            </section>
          )}
          {content?.faqs?.length > 0 && (
            <section className="reading-section">
              <h2>Common questions</h2>
              <div className="faq-list">
                {content.faqs.map((f: { question: string; answer: string }, i: number) => (
                  <details key={i}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          {articles.filter((a) => a.category_id === content?.id).length > 0 && (
            <section className="reading-section">
              <h2>Further reading</h2>
              {articles
                .filter((a) => a.category_id === content?.id)
                .map((a) => (
                  <Link className="text-link" key={a.id} href={`/learn/${a.slug}`}>
                    {a.title}
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
            </section>
          )}
          <section className="reading-section">
            <SectionLabel>Also explore</SectionLabel>
            <div className="category-links">
              {categories
                .filter((c) => c.slug !== section)
                .map((c) => (
                  <Link href={`/${c.slug}`} key={c.slug}>
                    {c.name}
                    <ArrowUpRight />
                  </Link>
                ))}
            </div>
          </section>
        </div>
        <JsonLd
          data={{ '@type': 'CollectionPage', name: category.name, url: `${siteUrl}/${section}` }}
        />
      </SiteShell>
    );
  }
  if (section === 'best' || section === 'compare') {
    const list = await getCollections(section === 'best' ? 'best_lists' : 'comparisons');
    return (
      <SiteShell>
        <div className="page-section">
          <Breadcrumb items={[{ label: section === 'best' ? 'The shortlists' : 'Comparisons' }]} />
          <header className="page-top">
            <SectionLabel>{section === 'best' ? 'The shortlists' : 'Side by side'}</SectionLabel>
            <h1 className="page-title">
              {section === 'best' ? 'The picks. And the why.' : 'A clearer comparison.'}
            </h1>
            <p className="page-intro">
              {section === 'best'
                ? 'Considered guides with the reasoning behind every selection.'
                : 'Compare the details that matter, without losing the context.'}
            </p>
          </header>
          {list.length ? (
            <div className="collection-grid">
              {list.map((c) => (
                <Link className="collection-card" href={`/${section}/${c.slug}`} key={c.id}>
                  <span className="tag">{demoMode ? 'Sample layout' : 'Editorial guide'}</span>
                  <h2>{c.title}</h2>
                  <p>{c.summary}</p>
                  <span className="circle">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <Empty
              title="New guides are being prepared."
              description="Each guide needs a complete review before it goes live."
            />
          )}
        </div>
      </SiteShell>
    );
  }
  if (section === 'contact')
    return (
      <SiteShell>
        <div className="page-section">
          <Breadcrumb items={[{ label: 'Contact' }]} />
          <header className="page-top">
            <SectionLabel>Let’s talk</SectionLabel>
            <h1 className="page-title">
              A question.
              <br />A correction. A hello.
            </h1>
            <p className="page-intro">
              Corrections, product suggestions, press questions and thoughtful feedback are welcome.
              Requests to buy a positive review are declined.
            </p>
          </header>
          <div className="contact-grid">
            <div className="summary-box">
              <h2>Get in touch</h2>
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
                <a className="text-link" href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              ) : (
                <p>Our contact email will be listed here before launch.</p>
              )}
              <p>
                For a correction, include the page URL, the passage in question and a primary
                source when available. General messages are normally reviewed within five
                business days; evidence or legal questions can take longer.
              </p>
              <a
                className="text-link"
                href="https://www.linkedin.com/in/sumita-bhatti-979467368/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find Sumita on LinkedIn <ArrowUpRight size={16} />
              </a>
            </div>
            <div>
              <h2>Before you write</h2>
              <div className="faq-list">
                <details open>
                  <summary>Can I submit a product for review?</summary>
                  <p>Yes. A suggestion does not guarantee coverage or a favourable verdict. Include the current label and official product page if you can.</p>
                </details>
                <details>
                  <summary>How do I report an error?</summary>
                  <p>Send the exact page, disputed detail and best available source. Factual corrections are checked independently and updated visibly.</p>
                </details>
                <details>
                  <summary>Do you accept paid rankings?</summary>
                  <p>No. Commercial relationships do not purchase placement, scores or editorial approval.</p>
                </details>
              </div>
              <h2>Stay in the loop.</h2>
              <p>Join us for new reviews and evidence updates. No miracle promises.</p>
              <Newsletter />
            </div>
          </div>
        </div>
      </SiteShell>
    );
  const content = info[section];
  if (!content) notFound();
  return (
    <SiteShell>
      <article className="page-section info-page">
        <Breadcrumb items={[{ label: section === 'about' ? 'Our approach' : content.title }]} />
        <header className="page-top">
          <SectionLabel>
            {section === 'about' ? 'The Sharp & Lean standard' : 'The details'}
          </SectionLabel>
          <h1 className="page-title">{content.title}</h1>
          <p className="page-intro">{content.intro}</p>
        </header>
        <RichText html={content.body} />
        {section === 'about' && (
          <Link className="button" href="/author/sumita-bhatti">
            Meet Sumita Bhatti <ArrowUpRight size={17} />
          </Link>
        )}
      </article>
    </SiteShell>
  );
}
