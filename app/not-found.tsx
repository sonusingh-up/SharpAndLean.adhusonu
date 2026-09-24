import Link from 'next/link';
import { SiteShell } from '@/components/site';
export const metadata = { title: 'Page not found', robots: { index: false, follow: false } };
export default function NotFound() {
  return (
    <SiteShell>
      <div className="page-section not-found-page">
        <h1 className="page-title">
          That page isn&rsquo;t <em>on the shelf.</em>
        </h1>
        <p className="page-intro">
          The address may have changed, or the overview may not be published yet. Nothing here is
          deleted quietly &mdash; if a page you had bookmarked has moved, tell us and we will point
          it somewhere sensible.
        </p>
        <div className="not-found-links">
          <Link className="button" href="/">
            Back to the homepage
          </Link>
          <Link className="text-link" href="/fat-burners">
            Fat Burners
          </Link>
          <Link className="text-link" href="/nootropics">
            Nootropics
          </Link>
          <Link className="text-link" href="/wellness">
            Wellness
          </Link>
          <Link className="text-link" href="/contact">
            Report a broken link
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
