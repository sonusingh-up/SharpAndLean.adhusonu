import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { getReviews, getCollections, getAuthor } from '@/lib/data';
import { authors, getAuthorBySlug } from '@/lib/author';
import { categories } from '@/lib/sample';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { ReviewPage, AffiliateButton } from '@/components/review-page';
import { Catalog } from '@/components/catalog';
import { RichText } from '@/components/rich-text';
import { KeyTakeaways } from '@/components/evidence';
import { BreadcrumbSchema, JsonLd, pageMeta } from '@/components/seo';
import { demoMode, siteUrl } from '@/lib/config';
import type { Review } from '@/lib/types';
export const revalidate = 3600;
export async function generateStaticParams() {
  const [reviews, best, compare, articles] = await Promise.all([
    getReviews(),
    getCollections('best_lists'),
    getCollections('comparisons'),
    getCollections('articles'),
  ]);
  return [
    ...reviews.map((r) => ({ section: r.category_slug, slug: r.slug })),
    ...best.map((r) => ({ section: 'best', slug: r.slug })),
    ...compare.map((r) => ({ section: 'compare', slug: r.slug })),
    ...articles.map((r) => ({ section: 'learn', slug: r.slug })),
    ...authors.map((a) => ({ section: 'author', slug: a.slug })),
  ];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  if (section === 'author') {
    const person = getAuthorBySlug(slug);
    if (!person) notFound();
    return pageMeta(
      `${person.name} — ${person.title}`,
      person.bio.slice(0, 155),
      `/author/${slug}`,
      person.photo_url,
    );
  }
  const row = categories.some((c) => c.slug === section)
    ? (await getReviews()).find((r) => r.slug === slug && r.category_slug === section)
    : (
        await getCollections(
          section === 'best' ? 'best_lists' : section === 'learn' ? 'articles' : 'comparisons',
        )
      ).find((r) => r.slug === slug);
  return row
    ? pageMeta(
        row.seo_title || row.title,
        row.seo_desc || row.summary,
        `/${section}/${slug}`,
        'og_image_url' in row ? row.og_image_url : undefined,
      )
    : { title: 'Page not found' };
}
function CompareTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className="comparison-table">
      <table>
        <thead>
          <tr>
            <th scope="col">At a glance</th>
            {reviews.map((r) => (
              <th scope="col" key={r.id}>
                <Link href={`/${r.category_slug}/${r.slug}`}>{r.title}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            [
              'Editorial score',
              ...reviews.map((r) => (r.score === null ? 'Not rated' : `${r.score}/10`)),
            ],
            ['Price', ...reviews.map((r) => r.product_price || 'Not listed')],
            ['Guarantee', ...reviews.map((r) => r.money_back_guarantee || 'Not verified')],
            ['Best suited to', ...reviews.map((r) => r.who_for || 'See review')],
            ['Ingredients assessed', ...reviews.map((r) => String(r.ingredients.length))],
          ].map(([label, ...values]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {values.map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default async function DetailPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const all = await getReviews();
  if (categories.some((c) => c.slug === section)) {
    const review = all.find((r) => r.slug === slug && r.category_slug === section);
    if (!review) notFound();
    return <ReviewPage review={review} all={all} />;
  }
  if (section === 'author') {
    const profile = getAuthorBySlug(slug);
    if (!profile) notFound();
    // Only the named clinician has a stored CMS record; the team byline is
    // defined in code so it cannot be edited into a false credential.
    const stored = profile.slug === 'sumita-bhatti' ? await getAuthor() : null;
    const author = {
      ...profile,
      ...(stored || {}),
      photo_url: stored?.photo_url || profile.photo_url,
      linkedin_url: stored?.linkedin_url || profile.linkedin_url,
    };
    const isTeam = profile.kind === 'team';
    return (
      <SiteShell>
        <div className="page-section">
          <Breadcrumb items={[{ label: isTeam ? 'The editorial desk' : 'Meet Sumita' }]} />
          <div className={`author-hero ${isTeam ? 'author-hero-team' : ''}`}>
            <div>
              <SectionLabel>
                {isTeam ? 'Who compiles the overviews' : 'The person behind the perspective'}
              </SectionLabel>
              <h1 className="page-title">{author.name}.</h1>
              <p className="author-title">{author.title}</p>
              <p className="page-intro">{author.bio}</p>
              {author.linkedin_url ? (
                <a
                  className="button"
                  href={author.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect on LinkedIn <ArrowUpRight size={16} />
                </a>
              ) : (
                <Link className="button" href="/about">
                  How a page is produced <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
            {author.photo_url && (
              <Image
                className="author-photo"
                src={author.photo_url}
                alt={`${author.name}, ${author.title}`}
                width={400}
                height={400}
                priority
              />
            )}
          </div>
          <section className="reading-section">
            <SectionLabel>Areas of focus</SectionLabel>
            <div className="expertise">
              {author.specialisations?.map((s: string) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            {author.credentials?.length > 0 && (
              <ul>
                {author.credentials.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </section>
          {!isTeam && (
            <>
              <section className="reading-section">
                <h2>A clinical eye on commercial claims</h2>
                <p>
                  Sumita’s career has centred on nutrition, dietary planning and food safety. That
                  background shapes the questions she brings to supplement reviews. What is the
                  product meant to do? Is the ingredient amount disclosed? Does the cited research
                  use the same form and a comparable dose? Who was studied, and how closely do they
                  resemble the person being asked to buy the product?
                </p>
                <p>
                  SharpAndLean does not publish employer names, degrees, registrations or specialist
                  clinical claims that have not been documented and approved. Her verified public
                  profile is linked above so readers can inspect the source rather than accept an
                  embellished biography.
                </p>
              </section>
              <section className="reading-section">
                <h2>Her review philosophy</h2>
                <p>
                  The label comes first. An attractive theory cannot rescue a hidden dose, and a
                  study on one standardised extract cannot validate every product that uses the
                  plant’s name. Sumita looks for exact amounts, relevant human evidence, credible
                  quality checks and safety information that is easy to find before purchase.
                </p>
                <p>
                  One recurring frustration is the oversized proprietary blend: a company lists a
                  dozen impressive ingredients, then supplies only one combined number. That
                  prevents a reader from checking whether any ingredient approaches the amount used
                  in research. The lack of disclosure becomes part of the verdict.
                </p>
                <p>
                  Evidence is graded in context. Systematic reviews and well-designed controlled
                  trials carry more weight than a mechanistic paper or a testimonial, but study
                  design, duration, population and conflicts still matter. When findings are mixed,
                  the review says mixed. Certainty is not manufactured to make a cleaner headline.
                </p>
              </section>
              <section className="reading-section">
                <h2>Standards she enforces</h2>
                <ul>
                  <li>
                    Separate evidence for an ingredient from evidence for the finished formula.
                  </li>
                  <li>
                    Compare the disclosed serving with the form and dose used in cited research.
                  </li>
                  <li>
                    Verify testing claims through batch documents or the certifier where possible.
                  </li>
                  <li>State contraindications and evidence limits in language a buyer can use.</li>
                  <li>Keep affiliate relationships out of scoring and ranking decisions.</li>
                  <li>
                    Date substantive reviews and revisit them when formulas or important evidence
                    change.
                  </li>
                </ul>
              </section>
              <section className="reading-section">
                <h2>Questions for Sumita</h2>
                <div className="faq-list">
                  <details open>
                    <summary>What qualifies you to review supplements?</summary>
                    <p>
                      I bring more than 15 years of clinical nutrition experience, including dietary
                      planning and food-safety work. My role here is evidence interpretation and
                      editorial review. It is not a substitute for a reader’s own doctor or
                      pharmacist.
                    </p>
                  </details>
                  <details>
                    <summary>Do you accept products from brands?</summary>
                    <p>
                      A brand may provide a label, supporting documents or a sample for evaluation.
                      That does not buy coverage, placement or a positive conclusion. Any material
                      relationship belongs in the disclosure.
                    </p>
                  </details>
                  <details>
                    <summary>How often are reviews updated?</summary>
                    <p>
                      We check pages when a formula changes, a material correction arrives or
                      important new evidence affects the conclusion. Reviews also receive scheduled
                      editorial checks, with higher-interest and safety-sensitive pages prioritised.
                    </p>
                  </details>
                  <details>
                    <summary>What makes you reject a claim?</summary>
                    <p>
                      Hidden doses, a mismatch between the marketed claim and the cited outcome,
                      irrelevant research, unverifiable testing language or a safety omission can
                      all weaken or disqualify a claim.
                    </p>
                  </details>
                  <details>
                    <summary>Can you tell me which supplement I should take?</summary>
                    <p>
                      Not through a public review. Personal recommendations require health history,
                      medicines, diet and clinical context. Use the reviews to ask better questions,
                      then take personal decisions to an appropriately qualified professional.
                    </p>
                  </details>
                </div>
              </section>
            </>
          )}
          {isTeam && (
            <>
              <section className="reading-section">
                <h2>What this byline means</h2>
                <p>
                  A page signed by the SNL Team is a record of what a manufacturer publishes, not a
                  clinical opinion about what a product does. The desk transcribes the Supplement
                  Facts panel, works out the serving arithmetic, checks the claim against the
                  research for that ingredient, and links the source so you can repeat the work.
                </p>
                <p>
                  That distinction matters enough to put two names on the site. Sumita Bhatti sets
                  the method and interprets evidence. The desk applies it consistently and does not
                  borrow her credentials to make a label transcription sound like a clinical
                  verdict.
                </p>
              </section>
              <section className="reading-section">
                <h2>What the desk actually checks</h2>
                <ul>
                  <li>
                    The serving size, and how many servings the container really holds — which is
                    often not the number printed on the front.
                  </li>
                  <li>
                    Whether every active ingredient carries its own amount, or several are hidden
                    inside one proprietary blend total.
                  </li>
                  <li>
                    The total stimulant content across every source on the panel, added up rather
                    than read one line at a time.
                  </li>
                  <li>
                    Whether a testing claim names a laboratory, a batch and a date, or is only a
                    reassuring phrase.
                  </li>
                  <li>
                    The cost of a labelled serving, so two bottles can be compared on the same
                    basis.
                  </li>
                </ul>
              </section>
              <section className="reading-section">
                <h2>What the desk will not do</h2>
                <p>
                  It does not assign an effectiveness score to a product nobody here has tested. It
                  does not describe a label transcription as a review. It does not quote a price it
                  has not checked, or repeat a manufacturer&rsquo;s own marketing sentence as though
                  it were a finding. Where a figure is missing, the page records that it is missing
                  rather than estimating it.
                </p>
                <p>
                  Commercial relationships are kept out of this entirely. An affiliate link never
                  decides whether a product is covered or how a panel is described — see the{' '}
                  <Link href="/affiliate-disclosure">affiliate disclosure</Link> for the full
                  position.
                </p>
              </section>
              <section className="reading-section">
                <h2>Corrections</h2>
                <p>
                  Labels get reformulated, manufacturers move pages and figures go stale. If
                  something here no longer matches the product in front of you, send the page
                  address and what differs through the <Link href="/contact">contact page</Link>.
                  Factual corrections are checked against the manufacturer source and updated with a
                  fresh review date, and a correction is never made quietly when it changes a
                  conclusion.
                </p>
              </section>
            </>
          )}
          <section className="reading-section">
            <h2>{isTeam ? 'Everything the desk has published' : 'Product label overviews'}</h2>
            <Catalog reviews={all} paginated />
          </section>
        </div>
        <BreadcrumbSchema items={[{ label: author.name, path: `/author/${slug}` }]} />
        <JsonLd
          data={{
            '@type': 'ProfilePage',
            url: `${siteUrl}/author/${slug}`,
            inLanguage: 'en-US',
            isPartOf: { '@id': `${siteUrl}/#website` },
            publisher: { '@id': `${siteUrl}/#organization` },
            mainEntity: {
              // A team is an Organization in schema.org terms, not a Person.
              '@type': isTeam ? 'Organization' : 'Person',
              '@id': `${siteUrl}/author/${slug}#${isTeam ? 'team' : 'person'}`,
              name: author.name,
              description: author.bio,
              url: `${siteUrl}/author/${slug}`,
              knowsAbout: author.specialisations,
              ...(isTeam
                ? { parentOrganization: { '@id': `${siteUrl}/#organization` } }
                : {
                    jobTitle: author.title,
                    worksFor: { '@id': `${siteUrl}/#organization` },
                  }),
              ...(author.photo_url ? { image: new URL(author.photo_url, siteUrl).href } : {}),
              ...(author.linkedin_url ? { sameAs: [author.linkedin_url] } : {}),
            },
          }}
        />
      </SiteShell>
    );
  }
  if (!['best', 'compare', 'learn'].includes(section)) notFound();
  const kind =
    section === 'best' ? 'best_lists' : section === 'compare' ? 'comparisons' : 'articles';
  const collections = await getCollections(kind);
  const row = collections.find((r) => r.slug === slug);
  if (!row) notFound();
  const picks =
    section === 'best'
      ? (row.items || [])
          .sort((a, b) => a.rank - b.rank)
          .map((i) => all.find((r) => r.id === i.review_id))
          .filter((r): r is Review => !!r)
      : section === 'compare'
        ? [row.product_a_id, row.product_b_id]
            .map((id) => all.find((r) => r.id === id))
            .filter((r): r is Review => !!r)
        : [];
  return (
    <SiteShell>
      <article className="page-section">
        <Breadcrumb
          items={[
            {
              label:
                section === 'best'
                  ? 'Best-of guides'
                  : section === 'compare'
                    ? 'Comparisons'
                    : 'Learn',
              ...(section !== 'learn' ? { href: `/${section}` } : {}),
            },
            { label: row.title },
          ]}
        />
        <BreadcrumbSchema items={[{ label: row.title, path: `/${section}/${slug}` }]} />
        {demoMode && (
          <div className="notice">
            Sample layout · Fictional products. No product ranking or recommendation is implied.
          </div>
        )}
        <header className="page-top">
          <SectionLabel>
            {section === 'best'
              ? 'The shortlist'
              : section === 'compare'
                ? 'Side by side'
                : 'Further reading'}
          </SectionLabel>
          <h1 className="page-title">{row.title}</h1>
          <p className="page-intro">{row.summary}</p>
          {row.verdict && <p className="notice">{row.verdict}</p>}
        </header>
        {/* Rendered on presence of data rather than on section, so a best-of
            or comparison page can opt in without another branch here. */}
        {row.takeaways?.length ? <KeyTakeaways items={row.takeaways} /> : null}
        {section === 'best' && (
          <nav className="quick-picks" aria-label="Quick picks">
            {picks.map((r, i) => (
              <a href={`#pick-${r.id}`} key={r.id}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                {r.title}
                <ArrowUpRight size={17} />
              </a>
            ))}
          </nav>
        )}
        {picks.length > 0 && <CompareTable reviews={picks} />}
        <div className="collection-body">
          <RichText html={row.body} />
          {picks.map((r) => (
            <section className="pick-section" id={`pick-${r.id}`} key={r.id}>
              <SectionLabel>
                {categories.find((c) => c.slug === r.category_slug)?.name}
              </SectionLabel>
              <h2>{r.title}</h2>
              <p>
                {section === 'best'
                  ? row.items?.find((i) => i.review_id === r.id)?.why_it_made_the_list
                  : r.summary}
              </p>
              <Link className="text-link" href={`/${r.category_slug}/${r.slug}`}>
                Read the full review <ArrowUpRight size={16} />
              </Link>
              <AffiliateButton review={r} />
            </section>
          ))}
          {row.faqs && row.faqs.length > 0 && (
            <section className="reading-section">
              <h2>Your questions</h2>
              <div className="faq-list">
                {row.faqs.map((f, i) => (
                  <details key={i}>
                    <summary>{f.question}</summary>
                    <p>{f.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
        {collections.length > 1 && (
          <section className="reading-section">
            <h2>Keep exploring</h2>
            {collections
              .filter((c) => c.id !== row.id)
              .map((c) => (
                <Link className="text-link" href={`/${section}/${c.slug}`} key={c.id}>
                  {c.title}
                  <ArrowUpRight size={16} />
                </Link>
              ))}
          </section>
        )}
      </article>
      {!demoMode && (
        <JsonLd
          data={{
            '@type': 'Article',
            headline: row.title,
            description: row.summary,
            url: new URL(`/${section}/${row.slug}`, siteUrl).href,
            inLanguage: 'en-US',
            datePublished: row.published_at,
            dateModified: row.updated_at,
            author: {
              '@type': 'Organization',
              name: 'SharpAndLean',
              '@id': `${siteUrl}/#organization`,
            },
            publisher: { '@id': `${siteUrl}/#organization` },
            isPartOf: { '@id': `${siteUrl}/#website` },
            ...(section === 'best' && picks.length
              ? {
                  mainEntity: {
                    '@type': 'ItemList',
                    name: row.title,
                    numberOfItems: picks.length,
                    itemListElement: picks.map((r, i) => ({
                      '@type': 'ListItem',
                      position: i + 1,
                      url: `${siteUrl}/${r.category_slug}/${r.slug}`,
                      name: r.title,
                    })),
                  },
                }
              : {}),
          }}
        />
      )}
    </SiteShell>
  );
}
