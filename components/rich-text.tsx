import parse, { Element } from 'html-react-parser';
import Image from 'next/image';
import { articleContent } from '@/lib/content';
export function RichText({ html }: { html: string }) {
  return (
    <div className="prose prose-slate">
      {parse(articleContent(html).html, {
        replace(node) {
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
