import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { SiteShell, Breadcrumb, SectionLabel } from '@/components/site';
import { KeyTakeaways, ExpertNote, TableOfContents } from '@/components/evidence';
import {
  pageMeta,
  JsonLd,
  BreadcrumbSchema,
  FaqSchema,
  publisherRef,
  ExtendedAccess,
} from '@/components/seo';
import { ReferenceBox, PageHistory } from '@/components/article-footer';
import { guides, getGuide } from '@/lib/guides';
import { siteUrl } from '@/lib/config';
import { teamProfile } from '@/lib/author';

export const revalidate = 3600;

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return pageMeta('Guide', 'Guide', `/guides/${slug}`);
  return pageMeta(g.title, g.summary, `/guides/${g.slug}`, undefined, {
    type: 'article',
    publishedTime: g.published,
    modifiedTime: g.updated,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const toc = g.blocks
    .filter((b): b is Extract<typeof b, { type: 'h2' }> => b.type === 'h2')
    .map((b) => ({ id: b.id, title: b.text }));

  return (
    <SiteShell>
      <ExtendedAccess headline={g.title} path={`/guides/${g.slug}`} />
      <article className="page-section info-page guide-page">
        <BreadcrumbSchema
          items={[
            { label: 'Guides', path: '/guides' },
            { label: g.title, path: `/guides/${g.slug}` },
          ]}
        />
        <JsonLd
          data={{
            '@type': 'BlogPosting',
            headline: g.title,
            description: g.summary,
            url: `${siteUrl}/guides/${g.slug}`,
            inLanguage: 'en-US',
            datePublished: g.published,
            dateModified: g.updated,
            author: {
              '@type': 'Organization',
              '@id': `${siteUrl}/author/${teamProfile.slug}#team`,
              name: teamProfile.name,
            },
            publisher: publisherRef,
            isPartOf: { '@id': `${siteUrl}/#website` },
          }}
        />
        <FaqSchema faqs={g.faqs} />

        <Breadcrumb items={[{ label: 'Guides', href: '/guides' }, { label: g.title }]} />

        <header className="page-top">
          <SectionLabel>Guide</SectionLabel>
          <h1 className="page-title">{g.title}</h1>
          <p className="page-intro">{g.hook}</p>
        </header>

        <KeyTakeaways items={g.takeaways} />
        <TableOfContents items={toc} />

        <div className="prose guide-body">
          {g.blocks.map((b, i) => {
            if (b.type === 'h2')
              return (
                <h2 id={b.id} key={i}>
                  {b.text}
                </h2>
              );
            if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
            if (b.type === 'p') return <p key={i}>{b.text}</p>;
            if (b.type === 'ul')
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            if (b.type === 'table')
              return (
                <figure className="guide-table" key={i}>
                  <table>
                    <caption>{b.caption}</caption>
                    <thead>
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row) => (
                        <tr key={row.join()}>
                          {row.map((cell, n) => (
                            <td key={n}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </figure>
              );
            if (b.type === 'expert') return <ExpertNote key={i}>{b.text}</ExpertNote>;
            return (
              <aside className="guide-callout" key={i}>
                <p>{b.text}</p>
                <Link className="text-link" href={b.href}>
                  {b.label} <ArrowUpRight size={14} />
                </Link>
              </aside>
            );
          })}
        </div>

        <section className="reading-section">
          <h2>Common questions</h2>
          <div className="faq-list">
            {g.faqs.map((f) => (
              <details key={f.question}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <ReferenceBox references={g.references || []} />
        <PageHistory entries={g.history || [{ date: g.published, note: 'Published.' }]} />

        {g.related.length > 0 && (
          <section className="reading-section">
            <h2>Read next</h2>
            <div className="index-category-links">
              {g.related.map((href) => (
                <Link className="text-link" href={href} key={href}>
                  {href.replace(/^\//, '').replace(/[-/]/g, ' ')} <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="page-updated">
          Published{' '}
          {new Date(g.published).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {g.changelog ? ` · ${g.changelog}` : ''} · By{' '}
          <Link href={`/author/${teamProfile.slug}`}>{teamProfile.name}</Link>
        </p>
      </article>
    </SiteShell>
  );
}
