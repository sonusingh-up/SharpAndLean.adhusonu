import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel, Empty } from '@/components/site';
import { pageMeta, JsonLd, BreadcrumbSchema } from '@/components/seo';
import { guides } from '@/lib/guides';
import { siteUrl } from '@/lib/config';

export const revalidate = 3600;

export const metadata = pageMeta(
  'Guides',
  'How to read a Supplement Facts panel, work out what a serving really costs, and tell a checkable claim from an unfalsifiable one.',
  '/guides',
);

export default function GuidesIndex() {
  return (
    <SiteShell>
      <div className="page-section">
        <BreadcrumbSchema items={[{ label: 'Guides', path: '/guides' }]} />
        <JsonLd
          data={{
            '@type': 'CollectionPage',
            name: 'Guides',
            url: `${siteUrl}/guides`,
            inLanguage: 'en-US',
            isPartOf: { '@id': `${siteUrl}/#website` },
            publisher: { '@id': `${siteUrl}/#organization` },
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: guides.length,
              itemListElement: guides.map((g, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: g.title,
                url: `${siteUrl}/guides/${g.slug}`,
              })),
            },
          }}
        />
        <Breadcrumb items={[{ label: 'Guides' }]} />
        <header className="page-top">
          <SectionLabel>Reading the small print</SectionLabel>
          <h1 className="page-title">
            Guides.
            <br />
            <span className="muted">Skills, not opinions.</span>
          </h1>
          <p className="page-intro">
            Each of these teaches something you can do yourself with a bottle in your hand: read a
            panel, do the serving arithmetic, spot where a claim stops being checkable.
          </p>
        </header>

        {guides.length ? (
          <div className="collection-grid">
            {guides.map((g) => (
              <Link className="collection-card" href={`/guides/${g.slug}`} key={g.slug}>
                <span className="tag">Guide</span>
                <h3>{g.title}</h3>
                <p>{g.summary}</p>
                <span className="circle">
                  <ArrowUpRight size={20} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <Empty
            title="Guides are being written."
            description="Each one needs a real worked example before it goes live."
          />
        )}
      </div>
    </SiteShell>
  );
}
