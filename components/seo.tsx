import { siteUrl } from '@/lib/config';
import type { Metadata } from 'next';
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
export function pageMeta(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
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
