import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { AffiliateButton } from '@/components/review-page';
import { RichText } from '@/components/rich-text';
import { KeyTakeaways } from '@/components/evidence';
import { ReferenceBox, PageHistory } from '@/components/article-footer';
import { pageMeta, JsonLd, BreadcrumbSchema, WebPageSchema, FaqSchema } from '@/components/seo';
import { getReviews } from '@/lib/data';
import { siteUrl, demoMode } from '@/lib/config';
import { supergut as brand } from '@/lib/brands/supergut';

export const revalidate = 3600;

export const metadata = pageMeta(brand.seoTitle, brand.seoDescription, brand.path, brand.figure.src, {
  type: 'article',
  publishedTime: brand.published,
  modifiedTime: brand.updated,
});

/**
 * Brand guide for Supergut. Reviews are read live from the catalogue by slug,
 * so each card carries the review's current score and image; everything else
 * comes from lib/brands/supergut.ts.
 */
export default async function SupergutPage() {
  const all = await getReviews();
  const reviews = brand.reviewedSlugs
    .map((slug) => all.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => !!r);
  const pageUrl = `${siteUrl}${brand.path}`;

  return (
    <SiteShell>
      <article className="page-section">
        <BreadcrumbSchema items={[{ label: brand.name, path: brand.path }]} />
        <Breadcrumb items={[{ label: brand.name }]} />
        <header className="page-top">
          <SectionLabel>Brand guide</SectionLabel>
          <h1 className="page-title">{brand.title}</h1>
          <p className="page-intro">{brand.intro}</p>
        </header>

        <KeyTakeaways items={brand.takeaways} />

        <figure className="research-result-figure">
          <Image
            src={brand.figure.src}
            alt={brand.figure.alt}
            width={1200}
            height={720}
            sizes="(max-width: 900px) 90vw, 900px"
            quality={90}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
          <figcaption>{brand.figure.caption}</figcaption>
        </figure>

        <section className="reading-section" id="reviews">
          <div className="section-heading">
            <div>
              <SectionLabel>Reviewed in full</SectionLabel>
              <h2>Our Supergut reviews.</h2>
            </div>
            <p>
              Scored against the five published criteria on our{' '}
              <Link href="/evidence-grading">evidence grading</Link> page. Each card opens the full
              review, with its sources.
            </p>
          </div>
          {/* Wide cards rather than the catalogue grid: with one or two reviews a
              three-column grid leaves most of the row empty. */}
          {reviews.map((r) => (
            <section
              className={`pick-section${r.featured_image_url ? ' has-media' : ''}`}
              id={`review-${r.slug}`}
              key={r.id}
            >
              {r.featured_image_url && (
                <Link className="pick-media" href={`/${r.category_slug}/${r.slug}`}>
                  <Image
                    src={r.featured_image_url}
                    alt={r.product_name || r.title}
                    fill
                    sizes="(max-width: 700px) 60vw, 220px"
                  />
                </Link>
              )}
              <div className="pick-body">
                <SectionLabel>
                  {r.score === null ? 'Label overview' : `Scored ${r.score.toFixed(1)} / 10`}
                </SectionLabel>
                <h2>{r.title}</h2>
                <p>{r.summary}</p>
                <Link className="text-link" href={`/${r.category_slug}/${r.slug}`}>
                  Read the full review <ArrowUpRight size={16} />
                </Link>
                <AffiliateButton review={r} />
              </div>
            </section>
          ))}
        </section>

        <section className="reading-section" id="range">
          <div className="section-heading">
            <div>
              <SectionLabel>The rest of the range</SectionLabel>
              <h2>Not yet reviewed.</h2>
            </div>
            <p>
              What else Supergut sells, with the figures we could confirm. None of these has been
              scored here yet, and a card is not a recommendation.
            </p>
          </div>
          {brand.unreviewed.map((p) => (
            <section className="pick-section" key={p.name}>
              <div className="pick-body">
                <SectionLabel>{`Supergut · ${p.fibre} of fibre`}</SectionLabel>
                <h2>{p.name}</h2>
                <p>{p.note}</p>
                {'reviewSlug' in p && p.reviewSlug ? (
                  <Link className="text-link" href={`/${p.reviewSlug}`}>
                    Read the full review <ArrowUpRight size={16} />
                  </Link>
                ) : (
                  <p className="rec-unreviewed">Not yet reviewed or scored on this site.</p>
                )}
                <div className="affiliate-block">
                  <p>Affiliate link: we may earn a commission at no extra cost to you.</p>
                  <a
                    className="button"
                    href={brand.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                  >
                    Check the current price <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </section>
          ))}
        </section>

        <section className="reading-section" id="articles">
          <div className="section-heading">
            <div>
              <SectionLabel>Further reading</SectionLabel>
              <h2>Articles that cover Supergut.</h2>
            </div>
            <p>Where the brand comes up elsewhere on the site, and what each piece adds.</p>
          </div>
          {brand.articles.map((a) => (
            <p key={a.href}>
              <Link className="text-link" href={a.href}>
                {a.title} <ArrowUpRight size={16} />
              </Link>
              <br />
              <span className="muted">{a.note}</span>
            </p>
          ))}
        </section>

        <div className="collection-body">
          <RichText html={brand.body} />
          <section className="reading-section" id="faqs">
            <h2>Your questions</h2>
            <div className="faq-list">
              {brand.faqs.map((f) => (
                <details key={f.question}>
                  <summary>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
          <ReferenceBox references={brand.references} />
          <PageHistory entries={brand.history} />
        </div>
      </article>

      {!demoMode && (
        <>
          <WebPageSchema
            name={brand.seoTitle}
            description={brand.seoDescription}
            path={brand.path}
            datePublished={brand.published}
            dateModified={brand.updated}
            reviewedBy={null}
            lastReviewed={null}
            mainEntity={`${pageUrl}#article`}
            image={brand.figure.src}
          />
          <FaqSchema faqs={brand.faqs} />
          <JsonLd
            data={{
              '@type': 'Article',
              '@id': `${pageUrl}#article`,
              headline: brand.seoTitle,
              description: brand.seoDescription,
              url: pageUrl,
              image: `${siteUrl}${brand.figure.src}`,
              datePublished: brand.published,
              dateModified: brand.updated,
              inLanguage: 'en-GB',
              author: { '@id': `${siteUrl}/#organization` },
              publisher: { '@id': `${siteUrl}/#organization` },
              about: { '@type': 'Brand', name: brand.name, url: 'https://supergut.com/' },
              mentions: reviews.map((r) => ({
                '@type': 'Product',
                name: r.product_name || r.title,
                url: `${siteUrl}/${r.category_slug}/${r.slug}`,
              })),
            }}
          />
        </>
      )}
    </SiteShell>
  );
}
