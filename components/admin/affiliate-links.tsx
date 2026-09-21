'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveAffiliateRedirect } from '@/app/admin/affiliate-actions';
import { productSlug, type AffiliateRedirect } from '@/lib/affiliate-redirects';

export function AffiliateLinks({ rows, origin, unavailable }: {
  rows: AffiliateRedirect[]; origin: string; unavailable: boolean;
}) {
  const router = useRouter();
  const blank = { name: '', slug: '', destination: '', enabled: true };
  const [form, setForm] = useState<Omit<AffiliateRedirect, 'id'> & { id?: string }>(blank);
  const [customSlug, setCustomSlug] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const url = (slug: string) => `${origin}/recommended/${slug}`;
  return <>
    <header className="admin-page-heading"><div><h1>Affiliate links</h1><p>One memorable URL. Update its destination whenever you need to.</p></div></header>
    <p className="notice">Keep affiliate disclosures beside your links and use sponsored/nofollow attributes. Check that your affiliate program permits redirects. Existing article links are not changed automatically.</p>
    {unavailable && <p role="alert" className="notice">Saving is unavailable. Configure Supabase and apply <code>003_affiliate_redirects.sql</code>.</p>}
    <form className="admin-panel redirect-form" onSubmit={async e => {
      e.preventDefault(); setBusy(true); setMessage('');
      try {
        const result = await saveAffiliateRedirect(form);
        if (result.error) setMessage(result.error);
        else { setMessage(`Saved: ${url(form.slug)}`); setForm(blank); setCustomSlug(false); router.refresh(); }
      } catch { setMessage('Unable to save. Please try again.'); }
      finally { setBusy(false); }
    }}>
      <h2>{form.id ? 'Edit link' : 'Create a recommendation link'}</h2>
      <fieldset disabled={busy || unavailable}>
        <label>Product name<input required minLength={2} maxLength={200} value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: customSlug || form.id ? form.slug : productSlug(e.target.value) })} placeholder="NOW Psyllium Husk Powder" /></label>
        <label>URL slug<input required maxLength={140} pattern="[a-z0-9]+(-[a-z0-9]+)*" readOnly={Boolean(form.id)} value={form.slug} onChange={e => { setCustomSlug(true); setForm({ ...form, slug: e.target.value }); }} placeholder="now-psyllium-husk-powder" /></label>
        <p className="muted redirect-url">{url(form.slug || 'product-name')}</p>
        {form.id && <p className="muted">The slug stays fixed so shared links keep working. Create a new link for a different URL.</p>}
        <label>Affiliate destination<input type="url" required maxLength={4000} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="https://merchant.com/product?affiliate=your-id" /></label>
        <label className="redirect-checkbox"><input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} /> Enable redirect</label>
        <div className="redirect-actions"><button className="button" type="submit">{busy ? 'Saving…' : form.id ? 'Save changes' : 'Create link'}</button>{form.id && <button type="button" onClick={() => { setForm(blank); setCustomSlug(false); }}>Cancel edit</button>}</div>
      </fieldset>
    </form>
    <p role="status" aria-live="polite" className="redirect-url">{message}</p>
    <section className="admin-panel table-scroll"><table><thead><tr><th>Product / recommendation URL</th><th>Destination</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {rows.map(row => <tr key={row.id}><td><strong>{row.name}</strong><div className="redirect-url"><a href={`/recommended/${row.slug}`} target="_blank" rel="sponsored nofollow noopener noreferrer">{url(row.slug)}</a></div></td><td className="redirect-url">{row.destination}</td><td>{row.enabled ? 'Active' : 'Disabled'}</td><td><div className="redirect-actions"><button type="button" disabled={busy} onClick={() => { setForm(row); setCustomSlug(true); setMessage('Editing ' + row.name); }}>Edit</button><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(url(row.slug)); setMessage('Link copied.'); } catch { setMessage(`Copy this URL: ${url(row.slug)}`); } }}>Copy link</button></div></td></tr>)}
    </tbody></table>{!rows.length && <p className="table-empty">No recommendation links yet.</p>}</section>
  </>;
}
