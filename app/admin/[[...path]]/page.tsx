import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Plus, ArrowUpRight } from 'lucide-react';
import { AdminShell } from '@/components/admin/shell';
import { ContentForm } from '@/components/admin/content-form';
import { DataTable } from '@/components/admin/data-table';
import { MediaLibrary } from '@/components/admin/media';
import { Moderation } from '@/components/admin/moderation';
import { AffiliateLinks } from '@/components/admin/affiliate-links';
import type { AffiliateRedirect } from '@/lib/affiliate-redirects';
import { siteUrl } from '@/lib/config';
import { requireAdmin } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/config';
import { sampleReviews, categories as sampleCategories } from '@/lib/sample';
export const dynamic = 'force-dynamic';
const tables: Record<string, string> = {
  reviews: 'reviews',
  'best-lists': 'best_lists',
  comparisons: 'comparisons',
  articles: 'articles',
};
export default async function AdminPage({ params }: { params: Promise<{ path?: string[] }> }) {
  await auth.protect();
  const { path = [] } = await params;
  const [section = '', id] = path;
  const preview = !hasSupabase;
  let db: Awaited<ReturnType<typeof requireAdmin>>['db'] | null = null;
  if (!preview) {
    try {
      db = (await requireAdmin()).db;
    } catch {
      return (
        <AdminShell section={section} preview={false}>
          <div className="empty">
            <h1>Editor access required.</h1>
            <p>
              Your account could not be verified as an approved editor. Contact the site owner for
              access.
            </p>
            <Link href="/">Back to SharpAndLean</Link>
          </div>
        </AdminShell>
      );
    }
  }
  if (path.length > 2) notFound();
  const shell = (content: React.ReactNode) => (
    <AdminShell section={section} preview={preview}>
      {content}
    </AdminShell>
  );
  if (!section) {
    const kinds = ['reviews', 'best_lists', 'comparisons', 'subscribers', 'community_reviews'];
    const results = db
      ? await Promise.all(
          kinds.map((kind) => db!.from(kind).select('*', { count: 'exact' }).limit(100)),
        )
      : [];
    const counts = Object.fromEntries(kinds.map((k, i) => [k, results[i]?.count || 0]));
    const recent = db
      ? (results[0]?.data || [])
          .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
          .slice(0, 5)
      : sampleReviews.slice(0, 5);
    const published = db
      ? await db
          .from('reviews')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true)
      : null;
    const pending = db
      ? await db
          .from('community_reviews')
          .select('id', { count: 'exact', head: true })
          .eq('moderation_status', 'pending')
      : null;
    return shell(
      <>
        <header className="admin-page-heading">
          <div>
            <span className="eyebrow">MAKE EVERY REVIEW COUNT</span>
            <h1>Your editorial overview.</h1>
            <p>A clear view of what’s published and what’s next.</p>
          </div>
          <Link className="button" href="/admin/reviews/new">
            <Plus size={16} /> New review
          </Link>
        </header>
        <div className="admin-stats">
          {[
            ['Reviews', preview ? sampleReviews.length : counts.reviews],
            ['Published', published?.count || 0],
            ['Best-of lists', counts.best_lists],
            ['Comparisons', counts.comparisons],
            ['Subscribers', counts.subscribers],
            ['Awaiting review', pending?.count || 0],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Recently updated reviews</h2>
            <Link href="/admin/reviews">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          <DataTable rows={recent as unknown as Record<string, unknown>[]} section="reviews" />
        </section>
        <div className="admin-quick-links">
          <Link href="/admin/best-lists/new">
            New best-of list <Plus size={18} />
          </Link>
          <Link href="/admin/comparisons/new">
            New comparison <Plus size={18} />
          </Link>
          <Link href="/admin/media">
            Manage imagery <ArrowUpRight size={18} />
          </Link>
        </div>
      </>,
    );
  }
  if (section === 'media' && !id) return shell(<MediaLibrary preview={preview} />);
  if (section === 'affiliate-links' && !id) {
    const result = db ? await db.from('affiliate_redirects').select('id,name,slug,destination,enabled').order('created_at', { ascending: false }) : null;
    return shell(<AffiliateLinks rows={(result?.data || []) as AffiliateRedirect[]} origin={siteUrl} unavailable={preview || Boolean(result?.error)} />);
  }
  if (section === 'subscribers' && !id) {
    const result = db
      ? await db
          .from('subscribers')
          .select('id,email,source,consent_at,created_at')
          .order('created_at', { ascending: false })
          .limit(1000)
      : null;
    return shell(
      <>
        <header className="admin-page-heading">
          <div>
            <h1>Subscribers</h1>
            <p>Newsletter sign-ups and consent records. Latest 1,000 entries.</p>
          </div>
        </header>
        <div className="admin-panel table-scroll">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Source</th>
                <th>Consent recorded</th>
              </tr>
            </thead>
            <tbody>
              {result?.data?.map((row) => (
                <tr key={row.id}>
                  <td>{row.email}</td>
                  <td>{row.source}</td>
                  <td>{new Date(row.consent_at).toLocaleString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!result?.data?.length && <p className="table-empty">No subscribers yet.</p>}
        </div>
      </>,
    );
  }
  if (section === 'community' && !id) {
    const result = db
      ? await db
          .from('community_reviews')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
      : null;
    return shell(
      <>
        <header className="admin-page-heading">
          <div>
            <h1>Community experiences</h1>
            <p>Review submissions before they appear on the site.</p>
          </div>
        </header>
        <Moderation rows={result?.data || []} preview={preview} />
      </>,
    );
  }
  const kind = tables[section];
  if (!kind) notFound();
  if (!id) {
    const result = db
      ? await db.from(kind).select('*').order('updated_at', { ascending: false }).limit(1000)
      : null;
    const rows = preview && kind === 'reviews' ? sampleReviews : result?.data || [];
    return shell(
      <>
        <header className="admin-page-heading">
          <div>
            <h1>
              {section === 'best-lists'
                ? 'Best-of lists'
                : section.charAt(0).toUpperCase() + section.slice(1)}
            </h1>
            <p>Your published work and drafts. Latest 1,000 entries.</p>
          </div>
          <Link className="button" href={`/admin/${section}/new`}>
            <Plus size={16} /> Create new
          </Link>
        </header>
        <DataTable rows={rows as Record<string, unknown>[]} section={section} />
      </>,
    );
  }
  const [categoryResult, authorResult, reviewResult] = db
    ? await Promise.all([
        db.from('categories').select('id,name'),
        db.from('authors').select('id,name'),
        db.from('reviews').select('id,title'),
      ])
    : [];
  let initial: Record<string, unknown> | undefined;
  if (id !== 'new') {
    if (preview)
      initial = sampleReviews.find((r) => r.id === id) as unknown as Record<string, unknown>;
    else {
      const selection =
        kind === 'reviews'
          ? '*,ingredients:review_ingredients(*),faqs:review_faqs(*)'
          : kind === 'best_lists'
            ? '*,items:best_list_items(*),faqs:best_list_faqs(*)'
            : '*';
      const result = await db!.from(kind).select(selection).eq('id', id).maybeSingle();
      initial = result.data as unknown as Record<string, unknown>;
    }
    if (!initial) notFound();
  }
  return shell(
    <ContentForm
      kind={kind}
      initial={initial}
      categories={
        categoryResult?.data ||
        sampleCategories.map((c, i) => ({ id: `sample-category-${i}`, name: c.name }))
      }
      authors={authorResult?.data || [{ id: 'sample-author', name: 'Sumita Bhatti' }]}
      reviews={reviewResult?.data || sampleReviews.map((r) => ({ id: r.id, title: r.title }))}
      preview={preview}
    />,
  );
}
