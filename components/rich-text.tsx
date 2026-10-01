import parse, {
  Element,
  attributesToProps,
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from 'html-react-parser';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { articleContent } from '@/lib/content';
import { siteUrl } from '@/lib/config';
import { previewTarget } from '@/lib/link-rel';
import { LinkPreview } from './notion-mention-link';

/**
 * `tools` places interactive components inside an article: the body marks the
 * spot with `<div data-tool="name"></div>` and the page supplies the component
 * for that name. If a block is unavailable, keep its sanitised HTML fallback.
 * Empty placeholders still render nothing.
 */
export function RichText({ html, tools }: { html: string; tools?: Record<string, ReactNode> }) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      if (node.name === 'div' && node.attribs['data-tool']) {
        return (
          <>
            {tools?.[node.attribs['data-tool']] ?? domToReact(node.children as DOMNode[], options)}
          </>
        );
      }
      if (node.name === 'details') {
        return (
          <details className="article-disclosure">
            {domToReact(node.children as DOMNode[], options)}
          </details>
        );
      }
      if (node.name === 'table') {
        return (
          <div
            className="article-table-scroll"
            role="region"
            aria-label="Table (scroll horizontally if needed)"
            tabIndex={0}
          >
            <table {...attributesToProps(node.attribs)}>
              {domToReact(node.children as DOMNode[], options)}
            </table>
          </div>
        );
      }
      if (node.name === 'img') {
        const src = node.attribs.src || '';
        const local = /^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|gif|svg)$/.test(src);
        if (
          !local &&
          !/^https:\/\/[^/]+\.supabase\.co\//.test(src) &&
          !/^https:\/\/images\.unsplash\.com\//.test(src)
        )
          return <span />;
        return (
          <Image
            src={src}
            unoptimized={src.endsWith('.gif')}
            alt={node.attribs.alt || ''}
            width={Number(node.attribs.width) || 1000}
            height={Number(node.attribs.height) || 650}
            sizes="(max-width: 700px) 90vw, 700px"
            quality={90}
            style={{ width: '100%', height: 'auto' }}
          />
        );
      }
      if (node.name === 'a') {
        const previewUrl = previewTarget(node.attribs.href, siteUrl);
        if (!previewUrl) return;
        // The link is kept exactly as sanitised — text, href, rel and target —
        // and only gains the hover card.
        return (
          <LinkPreview {...attributesToProps(node.attribs)} previewUrl={previewUrl}>
            {domToReact(node.children as DOMNode[], options)}
          </LinkPreview>
        );
      }
    },
  };
  return <div className="prose prose-slate">{parse(articleContent(html).html, options)}</div>;
}
