import type { Collection, Review } from '../types';
import type { Guide } from '../guides';

const SITE = 'https://sharpandlean.com';
const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type DigestItem = { title: string; summary: string; href: string; topic: string; published: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

export function recentDigestItems(now: Date, articles: Collection[], reviews: Review[], guides: Guide[]) {
  const items: DigestItem[] = [
    ...articles.filter((item) => item.is_published && item.published_at).map((item) => ({
      title: item.title, summary: item.summary, href: `/learn/${item.slug}`,
      topic: 'Article', published: item.published_at!,
    })),
    ...reviews.filter((item) => item.is_published && item.published_at).map((item) => ({
      title: item.title, summary: item.summary,
      href: `/${item.category_slug}/${item.slug}`, topic: 'Review', published: item.published_at!,
    })),
    ...guides.map((item) => ({
      title: item.title, summary: item.summary, href: `/guides/${item.slug}`,
      topic: item.topic || 'Guide', published: item.published,
    })),
  ];
  return items
    .filter((item) => {
      const published = Date.parse(item.published);
      return Number.isFinite(published) && published <= now.getTime() && published > now.getTime() - WINDOW_MS;
    })
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published))
    .slice(0, 6);
}

export function weeklyDigest(now: Date, items: DigestItem[]) {
  if (!items.length) return null;
  const weekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
  const name = `SharpAndLean weekly digest ${weekStart.toISOString().slice(0, 10)}`;
  const subject = 'New this week from SharpAndLean';
  const rows = items.map((item) => {
    const href = escapeHtml(`${SITE}${item.href}`);
    return `<tr><td style="padding:22px 0;border-bottom:1px solid #e8e1d5"><p style="margin:0 0 8px;color:#a9813c;font:700 11px Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase">${escapeHtml(item.topic)}</p><h2 style="margin:0 0 8px;font:400 23px/1.25 Arial,sans-serif;color:#1c2a28"><a href="${href}" style="color:#1c2a28;text-decoration:none">${escapeHtml(item.title)}</a></h2><p style="margin:0 0 12px;font:15px/1.6 Arial,sans-serif;color:#3d4c48">${escapeHtml(item.summary.slice(0, 200))}</p><a href="${href}" style="font:700 13px Arial,sans-serif;color:#2f7c72">Read the ${item.topic === 'Review' ? 'review' : 'article'} →</a></td></tr>`;
  }).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head><body style="margin:0;background:#ece6dc"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 12px"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fbf9f5;border-radius:16px"><tr><td style="padding:30px 36px 12px"><img src="${SITE}/images/logo.png" width="42" height="42" alt="SharpAndLean logo" style="display:inline-block;vertical-align:middle;border-radius:9px"><span style="padding-left:10px;font:700 22px Arial,sans-serif;color:#183b37;vertical-align:middle">Sharp&amp;Lean</span></td></tr><tr><td style="padding:16px 36px 34px"><p style="color:#a9813c;font:700 11px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase">The weekly edit</p><h1 style="margin:0 0 14px;color:#1c2a28;font:400 38px/1.15 Arial,sans-serif">Worth a closer look this week.</h1><p style="color:#3d4c48;font:16px/1.6 Arial,sans-serif">Fresh articles, guides and reviews from our editorial desk—only when there is something new to share.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr><tr><td style="padding:24px 36px;background:#183b37;color:#e8eee9;font:12px/1.7 Arial,sans-serif">Independent thinking. Informed choices.<br><a href="${SITE}" style="color:#c1ded8">sharpandlean.com</a> · <a href="${SITE}/contact" style="color:#c1ded8">Contact</a> · <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#c1ded8">Unsubscribe</a></td></tr></table></td></tr></table></body></html>`;
  const text = `New this week from SharpAndLean\n\n${items.map((item) => `${item.topic}: ${item.title}\n${item.summary}\n${SITE}${item.href}`).join('\n\n')}\n\nUnsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}`;
  return { name, subject, html, text };
}
