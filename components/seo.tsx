import { siteUrl } from '@/lib/config';
import type { Metadata } from 'next';

/** Stable @id values so every graph node can point at one shared entity. */
export const ORG_ID = `${siteUrl}/#organization`;
export const SITE_ID = `${siteUrl}/#website`;

/** Reference to the publisher, for use inside Article/Review/Product schemas. */
export const publisherRef = { '@id': ORG_ID };

export const defaultOgImage = '/images/hero.png';

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

/** Generic page node. `type` narrows it to AboutPage, ContactPage, etc. */
export function WebPageSchema({
  type = 'WebPage',
  name,
  description,
  path,
  dateModified,
}: {
  type?: string;
  name: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return (
    <JsonLd
      data={{
        '@type': type,
        name,
        description,
        url: new URL(path, siteUrl).href,
        inLanguage: 'en-US',
        isPartOf: { '@id': SITE_ID },
        publisher: publisherRef,
        ...(dateModified ? { dateModified } : {}),
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
      images: [{ url: ogImage, width: 1672, height: 941, alt: title }],
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
