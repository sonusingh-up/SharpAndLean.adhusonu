import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  ListOrdered,
  Scale,
  ImageIcon,
  Users,
  MessageSquare,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { Logo } from '@/components/site';
import { EditorSignOut } from '@/components/auth-controls';
export function AdminShell({
  children,
  section,
  preview,
}: {
  children: React.ReactNode;
  section: string;
  preview: boolean;
}) {
  const links = [
    ['', 'Overview', LayoutDashboard],
    ['reviews', 'Reviews', FileText],
    ['best-lists', 'Best-of lists', ListOrdered],
    ['comparisons', 'Comparisons', Scale],
    ['articles', 'Learning articles', BookOpen],
    ['affiliate-links', 'Affiliate links', ArrowUpRight],
    ['media', 'Media library', ImageIcon],
    ['subscribers', 'Subscribers', Users],
    ['community', 'Community', MessageSquare],
  ] as const;
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo />
        <span className="eyebrow">THE EDITORIAL DESK</span>
        <nav aria-label="Editorial navigation">
          {links.map(([path, label, Icon]) => (
            <Link
              className={section === path ? 'active' : ''}
              href={`/admin${path ? '/' + path : ''}`}
              key={path}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/">
            View website <ArrowUpRight size={15} />
          </Link>
          <EditorSignOut />
        </div>
      </aside>
      <main id="main" className="admin-main">
        <header className="admin-topbar">
          <span>SharpAndLean / {links.find((l) => l[0] === section)?.[1] || 'Editor'}</span>
          <span className="tag">{preview ? 'Read-only preview' : 'Editor'}</span>
        </header>
        {preview && (
          <div className="notice">
            CMS preview · Connect your Supabase project to enable saving, uploads and moderation.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
