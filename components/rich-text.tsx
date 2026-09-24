import parse, {
  Element,
  attributesToProps,
  domToReact,
  type DOMNode,
  type HTMLReactParserOptions,
} from 'html-react-parser';
import Image from 'next/image';
import { articleContent } from '@/lib/content';
import { siteUrl } from '@/lib/config';
import { previewTarget } from '@/lib/link-rel';
import { LinkPreview } from './notion-mention-link';

export function RichText({ html }: { html: string }) {
  const options: HTMLReactParserOptions = {
    replace(node) {
      if (!(node instanceof Element)) return;
      if (node.name === 'img') {
        const src = node.attribs.src || '';
        if (!/^https:\/\/[^/]+\.supabase\.co\//.test(src)) return <span />;
        return (
          <Image
            src={src}
            alt={node.attribs.alt || ''}
            width={Number(node.attribs.width) || 1000}
            height={Number(node.attribs.height) || 650}
            sizes="(max-width: 700px) 90vw, 700px"
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
