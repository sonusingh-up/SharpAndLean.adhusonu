import Link from 'next/link';
import Script from 'next/script';
import { ArrowUpRight, Plus, ArrowRight } from 'lucide-react';
import { AuthControls, AuthMenuControls } from '@/components/auth-controls';
import { SiteSearch } from '@/components/site-search';
import { OrganizationSchema, WebSiteSchema } from '@/components/seo';
import { CompareTray } from '@/components/compare-tray';
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="SharpAndLean home">
      <span className="logo-mark">
        <i />
        <i />
        <i />
        <i />
      </span>
      Sharp<span className="logo-and">&</span>Lean
    </Link>
  );
}
export function Header({ hero = false }: { hero?: boolean }) {
  return (
    <header className={`navbar ${hero ? 'navbar-hero' : ''}`}>
      <Logo />
      <nav aria-label="Main navigation" className="desktop-nav">
        <Link href="/fat-burners">Fat Burners</Link>
        <Link href="/nootropics">Nootropics</Link>
        <Link href="/wellness">Wellness</Link>
      </nav>
      <div className="nav-right">
        <AuthControls />
        <Link className="nav-about" href="/about">
          Our approach <ArrowUpRight size={14} />
        </Link>
        <SiteSearch />
        <details className="menu">
          <summary aria-label="Open navigation menu">
            <span />
            <span />
          </summary>
          <nav aria-label="More navigation">
            <Link href="/fat-burners">Fat Burners</Link>
            <Link href="/nootropics">Nootropics</Link>
            <Link href="/wellness">Wellness</Link>
            <Link href="/ingredients">Ingredients</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/best">Best-of lists</Link>
            <Link href="/compare">Comparisons</Link>
            <Link href="/about">Our approach</Link>
            <Link href="/author/sumita-bhatti">Meet Sumita</Link>
            <Link href="/contact">Contact</Link>
            <AuthMenuControls />
          </nav>
        </details>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo />
          <p>
            A little more clarity.
            <br />A more informed choice.
          </p>
          {/* Google's own Preferred Sources button: readers who add us see more of
              our work in Search, and the overlay returns them to the page rather
              than navigating away. Loaded lazily so a third-party script on every
              page cannot touch LCP, and the button labels itself in the reader's
              language — so there is no heading to be left stranded if the script
              is blocked. Requires the domain to be registered in Publisher Center. */}
          <div className="footer-preferred">
            <Script src="https://news.google.com/swg/js/v1/publisher.js" strategy="lazyOnload" />
            <div google-add-preferred-source-btn="" data-theme="light" data-lang="en" />
          </div>
        </div>
        <div className="footer-links">
          <div>
            <span>EXPLORE</span>
            <Link href="/ingredients">Ingredients</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/fat-burners">Fat Burners</Link>
            <Link href="/nootropics">Nootropics</Link>
            <Link href="/wellness">Wellness</Link>
          </div>
          <div>
            <span>SHARP & LEAN</span>
            <Link href="/about">Our approach</Link>
            <Link href="/author/sumita-bhatti">Meet Sumita</Link>
            <Link href="/contact">Get in touch</Link>
          </div>
          <div>
            <span>THE DETAILS</span>
            <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
            <Link href="/medical-disclaimer">Medical disclaimer</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms">Terms of use</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} SharpAndLean</span>
        <span>Independent thinking. Informed choices.</span>
        <Link href="/admin">
          Editorial desk <ArrowUpRight size={13} />
        </Link>
      </div>
    </footer>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CompareTray />
      {/* Publisher and site identity, referenced by @id from every page node.
          Rendered last on purpose: Google's swg-basic.js mutates whichever
          ld+json block comes first in the document, and when that was the
          Organization node it typed the publisher as an article. */}
      <OrganizationSchema />
      <WebSiteSchema />
    </div>
  );
}
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">{children}</div>
  );
}
export function ButtonLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`button ${light ? 'button-light' : ''}`} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
export function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty">
      <Plus size={28} />
      <h2>{title}</h2>
      <p>{description}</p>
      <Link href="/">
        Back to home <ArrowRight size={15} />
      </Link>
    </div>
  );
}
