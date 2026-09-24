import parse, { Element, domToReact, type DOMNode } from 'html-react-parser';
import Image from 'next/image';
import { articleContent } from '@/lib/content';
import { scheduledPaths, isScheduledHref } from '@/lib/scheduled-paths';
export function RichText({ html }: { html: string }) {
  const scheduled = scheduledPaths();
  return (
    <div className="prose prose-slate">
      {parse(articleContent(html).html, {
        replace(node) {
          // A link to a page that is not live yet keeps its text and loses the
          // link, so readers never land on a 404. It returns once the page is live.
          if (node instanceof Element && node.name === 'a' && isScheduledHref(node.attribs.href, scheduled))
            return <>{domToReact(node.children as DOMNode[])}</>;
          if (node instanceof Element && node.name === 'img') {
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
        },
      })}
    </div>
  );
}
