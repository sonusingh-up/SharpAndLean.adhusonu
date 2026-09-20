import { SiteShell, Empty } from '@/components/site';
export default function NotFound() {
  return (
    <SiteShell>
      <div className="page-section">
        <Empty
          title="This page isn’t on the shelf."
          description="The link may have changed, or the review hasn’t been published yet."
        />
      </div>
    </SiteShell>
  );
}
