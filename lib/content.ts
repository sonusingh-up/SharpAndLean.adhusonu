import sanitizeHtml from 'sanitize-html';
import { linkRel } from './link-rel';

export { linkRel };

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
