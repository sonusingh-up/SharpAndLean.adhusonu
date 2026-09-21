import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, Empty, SectionLabel } from '@/components/site';
import { Catalog } from '@/components/catalog';
import { RichText } from '@/components/rich-text';
import { Newsletter } from '@/components/newsletter';
import { pageMeta, JsonLd, BreadcrumbSchema, WebPageSchema } from '@/components/seo';
import { categories } from '@/lib/sample';
import { getReviews, getCollections, getCategoryData } from '@/lib/data';
import { siteUrl, demoMode } from '@/lib/config';
import { categoryGuides, informationPages as info } from '@/lib/editorial-content';
import { authors } from '@/lib/author';
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
              <span className="muted">{category.tagline}</span>
            </h1>
            <p className="page-intro">{category.description}</p>
            {/* These are the desk's label overviews, so this points at the
                method rather than at the clinician who did not write them. */}
            <Link className="text-link" href="/about">
              How we read these labels <ArrowUpRight size={14} />
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
          data={{
            '@type': 'CollectionPage',
            name: category.name,
            description: category.description,
            url: `${siteUrl}/${section}`,
            inLanguage: 'en-US',
            isPartOf: { '@id': `${siteUrl}/#website` },
            publisher: { '@id': `${siteUrl}/#organization` },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: reviews.length,
              itemListElement: reviews.map((r, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: r.title,
                url: `${siteUrl}/${r.category_slug}/${r.slug}`,
              })),
            },
          }}
        />
      </SiteShell>
    );
  }
  if (section === 'best' || section === 'compare') {
    const list = await getCollections(section === 'best' ? 'best_lists' : 'comparisons');
    return (
      <SiteShell>
        <div className="page-section">
          <JsonLd
            data={{
              '@type': 'CollectionPage',
              name: section === 'best' ? 'Best-of guides' : 'Supplement comparisons',
              url: `${siteUrl}/${section}`,
              inLanguage: 'en-US',
              isPartOf: { '@id': `${siteUrl}/#website` },
              publisher: { '@id': `${siteUrl}/#organization` },
              mainEntity: {
                '@type': 'ItemList',
                numberOfItems: list.length,
                itemListElement: list.map((c, i) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  name: c.title,
                  url: `${siteUrl}/${section}/${c.slug}`,
                })),
              },
            }}
          />
          <BreadcrumbSchema
            items={[
              {
                label: section === 'best' ? 'The shortlists' : 'Comparisons',
                path: `/${section}`,
              },
            ]}
          />
          <Breadcrumb items={[{ label: section === 'best' ? 'The shortlists' : 'Comparisons' }]} />
          <header className="page-top">
            <SectionLabel>{section === 'best' ? 'The shortlists' : 'Side by side'}</SectionLabel>
            <h1 className="page-title">
              {section === 'best' ? 'Shortlists, and the reasoning.' : 'Same category. Same units.'}
            </h1>
            <p className="page-intro">
              {section === 'best'
                ? 'How to narrow a category down yourself: define the job, match the doses, then compare the cost of a labelled serving. These are methods, not rankings.'
                : 'Two products are only comparable once the servings, strengths and forms line up. These guides do that arithmetic before drawing any conclusion.'}
            </p>
          </header>
          {list.length ? (
            <div className="collection-grid">
              {list.map((c) => (
                <Link className="collection-card" href={`/${section}/${c.slug}`} key={c.id}>
                  <span className="tag">{demoMode ? 'Sample layout' : 'Editorial guide'}</span>
                  <h3>{c.title}</h3>
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
          {section === 'best' ? (
            <>
              <section className="reading-section">
                <h2>Why there is no number one</h2>
                <p>
                  A ranking has to assume everyone wants the same thing. In supplements that
                  assumption breaks immediately: a fibre powder, a relaxation formula and a vitamin
                  D softgel are not competing for one crown, and the right choice depends on a gap
                  you are trying to close rather than on a score somebody else assigned.
                </p>
                <p>
                  So these guides teach the selection instead of performing it. Define the job in
                  one sentence, list the candidates with their disclosed amounts, check whether the
                  research used that form and dose, then compare what a labelled serving actually
                  costs. The shortlist you end up with is yours, and you can redo it when a formula
                  changes.
                </p>
              </section>
              <section className="reading-section">
                <h2>Where a shortlist usually goes wrong</h2>
                <ul>
                  <li>
                    Comparing bottle prices when one product needs three capsules a serving and
                    another needs one.
                  </li>
                  <li>
                    Treating a proprietary blend as a single ingredient, when it hides how much of
                    anything is in there.
                  </li>
                  <li>
                    Accepting a study as support without checking it used the same form, dose and
                    population.
                  </li>
                  <li>
                    Reading a certification badge as a batch test result, when it may be neither
                    recent nor specific to the bottle.
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <>
              <section className="reading-section">
                <h2>What has to match before a comparison means anything</h2>
                <p>
                  Two products are comparable when four things line up: the active ingredient and
                  its form, the amount per labelled serving, the number of servings in the
                  container, and the total cost of getting through it. Change any one and the
                  comparison stops being like for like, however similar the packaging looks.
                </p>
                <p>
                  This is where most supplement shopping goes wrong, and it rarely involves anyone
                  lying. A bottle that says 575 mg on the front can have a 1,725 mg serving. A fish
                  oil labelled 1,000 mg can contain 300 mg of the omega-3 you are buying it for.
                  Both numbers are true. Only one answers the question.
                </p>
              </section>
              <section className="reading-section">
                <h2>How to run the arithmetic</h2>
                <ul>
                  <li>
                    Divide the price by servings per container, not by capsule count, to get a cost
                    per serving.
                  </li>
                  <li>
                    Convert to the same unit before comparing strengths — mcg and IU describe the
                    same vitamin D, and elemental weight is not compound weight.
                  </li>
                  <li>
                    Read the full panel rather than the product name. Two strengths of the same
                    brand can contain different secondary ingredients.
                  </li>
                  <li>
                    Compare the evidence separately from the price. A cheaper serving is not a
                    better one.
                  </li>
                </ul>
              </section>
            </>
          )}
          <section className="reading-section">
            <h2>Start from a category</h2>
            <p>
              Every label overview sits in one of three categories, each with a guide covering the
              ingredients that come up most often and the questions worth asking about them.
            </p>
            <div className="index-category-links">
              {categories.map((c) => (
                <Link className="text-link" href={`/${c.slug}`} key={c.slug}>
                  {c.name} <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </SiteShell>
    );
  }
  if (section === 'contact')
    return (
      <SiteShell>
        <div className="page-section">
          <WebPageSchema
            type="ContactPage"
            name="Contact SharpAndLean"
            description="Corrections, product suggestions, press questions and privacy requests."
            path="/contact"
          />
          <BreadcrumbSchema items={[{ label: 'Contact', path: '/contact' }]} />
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
                <p>
                  Use Sumita’s LinkedIn profile below for professional enquiries. Please do not send
                  private medical information.
                </p>
              )}
              <p>
                For a correction, include the page URL, the passage in question and a primary source
                when available. General messages are normally reviewed within five business days;
                evidence or legal questions can take longer.
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
                  <p>
                    Yes. A suggestion does not guarantee coverage or a favourable verdict. Include
                    the current label and official product page if you can.
                  </p>
                </details>
                <details>
                  <summary>How do I report an error?</summary>
                  <p>
                    Send the exact page, disputed detail and best available source. Factual
                    corrections are checked independently and updated visibly.
                  </p>
                </details>
                <details>
                  <summary>Do you accept paid rankings?</summary>
                  <p>
                    No. Commercial relationships do not purchase placement, scores or editorial
                    approval.
                  </p>
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
  if (section === 'about') {
    const about = info.about;
    return (
      <SiteShell>
        <article className="page-section info-page about-page">
          <WebPageSchema
            type="AboutPage"
            name={about.title}
            description={about.intro}
            path="/about"
          />
          <BreadcrumbSchema items={[{ label: 'Our approach', path: '/about' }]} />
          <Breadcrumb items={[{ label: 'Our approach' }]} />
          <header className="page-top">
            <SectionLabel>The Sharp &amp; Lean standard</SectionLabel>
            <h1 className="page-title">{about.title}</h1>
            <p className="page-intro">{about.intro}</p>
          </header>

          {/* The four checks, stated before the prose so the method is visible
              without reading a thousand words first. */}
          <ol className="about-checks">
            {[
              [
                'Serving size',
                'How many units make a serving, and how many servings are really in the container.',
              ],
              [
                'Disclosed amounts',
                'Whether every active carries its own number, or several hide inside one blend total.',
              ],
              [
                'Total stimulants',
                'Caffeine added up across every source on the panel, not read one line at a time.',
              ],
              [
                'Testing claims',
                'Whether a test names a laboratory, a batch and a date, or is just a reassuring phrase.',
              ],
            ].map(([title, text], i) => (
              <li key={title}>
                <span className="about-check-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>

          <RichText html={about.body} />

          <section className="about-authors">
            <h2>Who writes this</h2>
            <div className="author-cards">
              {authors.map((a) => (
                <Link className="author-card" href={`/author/${a.slug}`} key={a.slug}>
                  {a.photo_url ? (
                    <Image
                      className="author-card-photo"
                      src={a.photo_url}
                      alt={a.name}
                      width={72}
                      height={72}
                    />
                  ) : (
                    <span className="author-card-mark" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  <span className="author-card-body">
                    <strong>{a.name}</strong>
                    <span className="author-card-title">{a.title}</span>
                    <span className="author-card-role">{a.role}</span>
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        </article>
      </SiteShell>
    );
  }
  const content = info[section];
  if (!content) notFound();
  return (
    <SiteShell>
      <article className="page-section info-page">
        <WebPageSchema
          type={
            { about: 'AboutPage', contact: 'ContactPage' }[section] ||
            (section.includes('policy') || section === 'terms' ? 'WebPage' : 'WebPage')
          }
          name={content.title}
          description={content.intro}
          path={`/${section}`}
        />
        <BreadcrumbSchema
          items={[
            {
              label: section === 'about' ? 'Our approach' : content.title,
              path: `/${section}`,
            },
          ]}
        />
        <Breadcrumb items={[{ label: section === 'about' ? 'Our approach' : content.title }]} />
        <header className="page-top">
          <SectionLabel>
            {section === 'about' ? 'The Sharp & Lean standard' : 'The details'}
          </SectionLabel>
          <h1 className="page-title">{content.title}</h1>
          <p className="page-intro">{content.intro}</p>
        </header>
        <RichText html={content.body} />
      </article>
    </SiteShell>
  );
}
