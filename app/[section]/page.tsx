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
const info: Record<string, { title: string; intro: string; body: string }> = {
  about: {
    title: 'Good questions are a good start.',
    intro:
      'SharpAndLean is here to make supplement information easier to understand, with context behind every assessment.',
    body: '<h2>Look past the promise</h2><p>Our review format begins with the label: what is in a product, how much is present, and what research is available. We separate evidence for an ingredient from evidence for a finished product.</p><h2>Make the reasoning visible</h2><p>Reviews include sources, practical considerations and the limitations of the available research. Scores should reflect a documented assessment, rather than a manufacturer’s marketing.</p><h2>Keep the relationship clear</h2><p>Affiliate links are identified where they appear. Editorial judgments should not be purchased. Corrections and new research belong in an updated review with a visible review date.</p>',
  },
  'affiliate-disclosure': {
    title: 'Affiliate disclosure',
    intro: 'You deserve to know how this website is funded.',
    body: '<h2>How affiliate links work</h2><p>Some published pages may contain links that earn SharpAndLean a commission if you purchase through them, at no additional cost to you. These links are labelled near the purchase button.</p><h2>Editorial independence</h2><p>Affiliate relationships should not determine editorial scores or rankings. Product claims, prices and terms should be checked with the seller before purchase.</p>',
  },
  'medical-disclaimer': {
    title: 'Medical disclaimer',
    intro: 'Understand the scope of the information on this site.',
    body: '<h2>Educational information</h2><p>SharpAndLean provides general information about supplements. Content does not establish a clinician–patient relationship or provide an individual diagnosis or treatment plan.</p><h2>Personal questions</h2><p>Discuss personal health questions and supplement decisions with a qualified professional familiar with your circumstances.</p>',
  },
  'privacy-policy': {
    title: 'Privacy policy',
    intro:
      'Draft for launch review. This page must be completed with the website operator’s details before publication.',
    body: '<h2>Newsletter subscriptions</h2><p>If you subscribe, this website stores your email address, consent date and subscription source in its Supabase database. The email delivery provider and unsubscribe process must be specified before newsletters are sent.</p><h2>Community reviews</h2><p>Submitted display names, ratings and review text are stored for moderation. Approved submissions become public. Do not include private or sensitive information.</p><h2>Site operation</h2><p>Admin authentication uses session cookies. Short-lived hashed request identifiers are used to limit form abuse. The production site may use Vercel Analytics; applicable disclosures and consent settings must be reviewed for the intended audience.</p><h2>Contact and retention</h2><p>The operator’s legal identity, contact address, retention periods, applicable rights and request process are awaiting confirmation.</p>',
  },
  terms: {
    title: 'Terms of use',
    intro: 'Draft for launch review. Operator and jurisdiction details are awaiting confirmation.',
    body: '<h2>Using the site</h2><p>Review content is provided for general information. Product availability, pricing and seller policies may change. Purchases take place with third-party sellers under their own terms.</p><h2>Community contributions</h2><p>Submit only your own experience. Do not include private information, misleading claims, harassment or promotional spam. Submissions are moderated before publication.</p><h2>Before launch</h2><p>The final terms, operator details and governing jurisdiction require review before this site is published.</p>',
  },
};
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
          {content?.buying_guide && (
            <section className="reading-section">
              <RichText html={content.buying_guide} />
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
              We welcome feedback on our reviews and suggestions for what to examine next.
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
              <h2>Stay in the loop.</h2>
              <p className="page-intro">Join us for new reviews and fresh perspectives.</p>
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
