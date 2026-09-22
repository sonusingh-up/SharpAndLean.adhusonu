import sanitizeHtml from 'sanitize-html';
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
export function safeUrl(url: string) {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}
/* Commission-earning links. `/recommended/` is this site's own affiliate
   redirect namespace, so a body link into it is a paid link even though the
   host is ours. */
const PAID_LINK =
  /clickbank|hop\.clickbank|awin|gurumedia|amzn\.to|amazon\.[a-z.]+[^\s"]*[?&]tag=|\/recommended\//i;

/**
 * The `rel` for a link in body copy.
 *
 * Every outbound link is nofollow, including citations. The links are here so a
 * reader can check a figure, which they still can; what the site does not do is
 * hand ranking signal to the manufacturers, retailers and organisations it
 * writes about. Internal links are relative and keep passing equity normally.
 */
export function linkRel(href?: string) {
  if (!href) return 'noopener noreferrer';
  if (PAID_LINK.test(href)) return 'sponsored nofollow noopener noreferrer';
  return /^https?:\/\//i.test(href) ? 'nofollow noopener noreferrer' : 'noopener noreferrer';
}

export function cleanHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
      img: ['src', 'alt', 'width', 'height'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => ({
        tagName: 'a',
        attribs: { ...attrs, rel: linkRel(attrs.href) },
      }),
    },
  });
}
export function articleContent(html: string) {
  const toc: { id: string; title: string }[] = [];
  const clean = cleanHtml(html).replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, heading: string) => {
    const title = sanitizeHtml(heading, { allowedTags: [], allowedAttributes: {} });
    const id = `${slugify(title) || 'section'}-${toc.length + 1}`;
    toc.push({ id, title });
    return `<h2 id="${id}">${heading}</h2>`;
  });
  return { html: clean, toc };
}
