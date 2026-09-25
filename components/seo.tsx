import Script from 'next/script';
import { siteUrl } from '@/lib/config';
import type { Metadata } from 'next';

/** Stable @id values so every graph node can point at one shared entity. */
export const ORG_ID = `${siteUrl}/#organization`;
export const SITE_ID = `${siteUrl}/#website`;

/** Reference to the publisher, for use inside Article/Review/Product schemas. */
export const publisherRef = { '@id': ORG_ID };

/** 1200×630, the size link previews expect. JPEG because not every platform accepts WebP. */
export const defaultOgImage = '/images/og-default.jpg';

/**
 * Structured data needs absolute URLs. Product images stored under /images/
 * are relative, and Google reports a relative `image` as an invalid URL.
 */
export function absoluteUrl(src: string) {
  return src.startsWith('http') ? src : new URL(src, siteUrl).href;
}

/** The person a page credits as its evidence reviewer. */
export type ReviewerRef = { slug: string; name: string; title?: string };

export function personRef(p: ReviewerRef) {
  return {
    '@type': 'Person',
    '@id': `${siteUrl}/author/${p.slug}#person`,
    name: p.name,
    ...(p.title ? { jobTitle: p.title } : {}),
    url: `${siteUrl}/author/${p.slug}`,
  };
}

/**
 * Google Extended Access (Subscribe with Google Basic).
 *
 * Declares a page as an article belonging to the site's Publisher Center
 * product. The product is registered as open access, so this is metadata — it
 * gates nothing and changes nothing a reader sees.
 *
 * It renders its own article node deliberately. swg-basic.js does not create
 * one: it mutates whichever `application/ld+json` block appears first in the
 * document, appending "NewsArticle" to its @type and injecting isPartOf. Left
 * to itself it reached the site-wide Organization node — the entity every page
 * references by @id as its publisher — and declared the publisher an article.
 * Giving it a correct node to find first is what stops that, which is also why
 * SiteShell renders this ahead of the identity schema.
 *
 * Goes on editorial content only. On a category listing or the privacy policy
 * it would declare those pages articles, which they are not.
 */
export function ExtendedAccess({
  id,
  headline,
  path,
  datePublished,
  dateModified,
  image,
  author,
}: {
  /**
   * Shared with any other article node on the page, so search engines read
   * the two blocks as one article rather than two competing ones.
   */
  id?: string;
  headline?: string;
  path?: string;
  datePublished?: string | null;
  dateModified?: string | null;
  image?: string;
  /** A desk byline is an Organization; a named writer is a Person. */
  author?:
    | { name: string; slug: string; type?: 'Organization' | 'Person' }
    | { name: string; slug: string; type?: 'Organization' | 'Person' }[];
}) {
  return (
    <>
      <JsonLd
        data={{
          '@type': 'NewsArticle',
          ...(id ? { '@id': id } : {}),
          ...(headline ? { headline } : {}),
          ...(path
            ? { url: new URL(path, siteUrl).href, mainEntityOfPage: new URL(path, siteUrl).href }
            : {}),
          // Google News reads these four on the article node. Without dates it
          // cannot place a story in time, and without an image it has nothing to
          // show alongside it.
          ...(datePublished ? { datePublished } : {}),
          ...(dateModified ? { dateModified } : {}),
          ...(image ? { image: absoluteUrl(image) } : {}),
          ...(author
            ? {
                author: (Array.isArray(author) ? author : [author]).map((a) => ({
                  '@type': a.type ?? 'Organization',
                  name: a.name,
                  url: new URL(`/author/${a.slug}`, siteUrl).href,
                })),
              }
            : {}),
          // What "openaccess" means, stated in the markup rather than implied.
          isAccessibleForFree: true,
          publisher: { '@id': `${siteUrl}/#organization` },
        }}
      />
      <Script
        async
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
      />
      <Script id="swg-basic-init" strategy="afterInteractive">
        {`(self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
  basicSubscriptions.init({
    type: "NewsArticle",
    isPartOfType: ["Product"],
    isPartOfProductId: "CAow9M-jDA:openaccess",
    clientOptions: { theme: "light", lang: "en" },
  });
});`}
      </Script>
    </>
  );
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(
          /</g,
          '\\u003c',
        ),
      }}
    />
  );
}

/**
 * Publisher identity. Emitted once per page from the shell so that Article,
 * Review, Product and WebPage nodes can all reference the same entity rather
 * than each restating it.
 */
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'SharpAndLean',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: new URL('/images/logo.png', siteUrl).href,
          width: 1254,
          height: 1254,
        },
        image: new URL('/images/logo.png', siteUrl).href,
        description:
          'Independent editorial coverage of dietary supplements, built from manufacturer Supplement Facts panels and published research.',
        knowsAbout: [
          'Dietary supplements',
          'Supplement Facts labels',
          'Nutrition research',
          'Weight management supplements',
          'Nootropics',
        ],
        publishingPrinciples: `${siteUrl}/about`,
        ethicsPolicy: `${siteUrl}/affiliate-disclosure`,
      }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        '@type': 'WebSite',
        '@id': SITE_ID,
        url: siteUrl,
        name: 'SharpAndLean',
        description:
          'Supplement label overviews and evidence guides. We read the Supplement Facts panel, not the front of the bottle.',
        inLanguage: 'en-US',
        publisher: publisherRef,
      }}
    />
  );
}

/**
 * Question/answer pairs are the format AI answer engines extract most reliably,
 * so this is emitted wherever real FAQs exist — including label overviews that
 * deliberately carry no Review schema.
 */
export function FaqSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs.length) return null;
  return (
    <JsonLd
      data={{
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }}
    />
  );
}

/**
 * Generic page node. `type` narrows it to AboutPage, ContactPage, etc.
 *
 * It is also where an evidence reviewer belongs: schema.org defines
 * `reviewedBy` and `lastReviewed` on WebPage, not on Product, Review or
 * Article, so validators flag them anywhere else.
 */
export function WebPageSchema({
  type = 'WebPage',
  name,
  description,
  path,
  datePublished,
  dateModified,
  reviewedBy,
  lastReviewed,
  about,
  mainEntity,
  image,
}: {
  type?: string;
  name: string;
  description: string;
  path: string;
  datePublished?: string | null;
  dateModified?: string | null;
  reviewedBy?: ReviewerRef | null;
  lastReviewed?: string | null;
  /** @id of the thing the page is about, such as a reviewed product. */
  about?: string;
  /** @id of the page's primary entity, such as its article. */
  mainEntity?: string;
  image?: string;
}) {
  const url = new URL(path, siteUrl).href;
  return (
    <JsonLd
      data={{
        '@type': type,
        '@id': `${url}#webpage`,
        name,
        description,
        url,
        inLanguage: 'en-US',
        isPartOf: { '@id': SITE_ID },
        publisher: publisherRef,
        ...(image
          ? { primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(image) } }
          : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(reviewedBy ? { reviewedBy: personRef(reviewedBy) } : {}),
        ...(lastReviewed ? { lastReviewed: lastReviewed.slice(0, 10) } : {}),
        ...(about ? { about: { '@id': about } } : {}),
        ...(mainEntity ? { mainEntity: { '@id': mainEntity } } : {}),
      }}
    />
  );
}

export function pageMeta(
  title: string,
  description: string,
  path: string,
  image?: string,
  options?: { publishedTime?: string; modifiedTime?: string; type?: 'website' | 'article' },
): Metadata {
  const ogImage = image || defaultOgImage;
  // Dimensions are only known for the default card. A page-supplied image gets
  // none rather than a guess, because wrong dimensions distort the preview.
  const ogImageEntry = image
    ? { url: ogImage, alt: title }
    : { url: ogImage, width: 1200, height: 630, alt: title };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'SharpAndLean',
      locale: 'en_US',
      type: options?.type || 'website',
      images: [ogImageEntry],
      ...(options?.publishedTime ? { publishedTime: options.publishedTime } : {}),
      ...(options?.modifiedTime ? { modifiedTime: options.modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export function BreadcrumbSchema({ items }: { items: { label: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        '@type': 'BreadcrumbList',
        itemListElement: [{ label: 'Home', path: '/' }, ...items].map((v, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: v.label,
          item: new URL(v.path, siteUrl).href,
        })),
      }}
    />
  );
}
