import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/site';
import { Newsletter } from '@/components/newsletter';
import { pageMeta } from '@/components/seo';
import { articles, getArticle, type ProductArticle } from '@/lib/articles';
import { overallScore } from '@/lib/scoring';
import queue from '@/social/instagram/queue.json';
import styles from './links.module.css';

/*
 * The Instagram link-in-bio page. Instagram allows one link in a bio, so this
 * page is where every "link in bio" in a caption lands. The top section lists
 * the posts the publisher has marked published in social/instagram/queue.json,
 * newest first, so the post someone just saw is the first thing they tap.
 * Every link carries UTM tags so Instagram traffic is separable in analytics.
 */

export const metadata = {
  ...pageMeta(
    'SharpAndLean on Instagram',
    'Every review, guide and ranking from our Instagram posts, in one place.',
    '/links',
  ),
  robots: { index: false, follow: true },
};

type Entry = {
  id: string;
  type: string;
  slug?: string;
  status: string;
  link?: string;
  linkLabel?: string;
  publishedAt?: string;
};

const utm = (href: string, content: string) =>
  `${href}${href.includes('?') ? '&' : '?'}utm_source=instagram&utm_medium=social&utm_campaign=link_in_bio&utm_content=${encodeURIComponent(content)}`;

const scoreOf = (a: ProductArticle) =>
  a.score !== undefined ? a.score : a.scoreBreakdown ? overallScore(a.scoreBreakdown) : null;

function postLink(p: Entry) {
  const a = p.slug ? getArticle(p.slug) : undefined;
  return {
    id: p.id,
    href: p.link ?? (a ? `/${a.category}/${a.slug}` : '/'),
    label: p.linkLabel ?? (a ? `${a.name} review` : p.id),
    score: a ? scoreOf(a) : null,
  };
}

const START_HERE = [
  { href: '/evidence-grading', label: 'How we score supplements' },
  { href: '/fat-burners', label: 'Weight-management reviews' },
  { href: '/wellness', label: 'Protein, creatine & everyday wellness' },
  { href: '/guides', label: 'How to read a supplement label' },
  { href: '/author/sumita-bhatti', label: 'Meet Sumita, our clinical nutritionist' },
];

export default function LinksPage() {
  const posts = (queue.posts as Entry[])
    .filter((p) => p.status === 'published')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .slice(0, 8)
    .map(postLink);

  const topPicks = articles
    .map((a) => ({ a, s: scoreOf(a) }))
    .filter((x): x is { a: ProductArticle; s: number } => x.s != null && x.s >= 7.5)
    .sort((x, y) => y.s - x.s)
    .slice(0, 4);

  return (
    <main id="main" className={styles.page}>
      <header className={styles.head}>
        <Logo />
        <p className={styles.tagline}>
          Independent supplement reviews — <em>scored, sourced</em> and UK-focused.
        </p>
      </header>

      {posts.length > 0 && (
        <section className={styles.section} aria-labelledby="latest">
          <h2 id="latest" className={styles.label}>
            From our latest posts
          </h2>
          {posts.map((p) => (
            <Link key={p.id} href={utm(p.href, p.id)} className={`${styles.card} ${styles.feature}`}>
              <span>{p.label}</span>
              {p.score != null && <span className={styles.score}>{p.score.toFixed(1)}/10</span>}
              <ArrowUpRight size={18} aria-hidden />
            </Link>
          ))}
        </section>
      )}

      <section className={styles.section} aria-labelledby="start">
        <h2 id="start" className={styles.label}>
          Start here
        </h2>
        {START_HERE.map((l) => (
          <Link key={l.href} href={utm(l.href, 'start-here')} className={styles.card}>
            <span>{l.label}</span>
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        ))}
      </section>

      {topPicks.length > 0 && (
        <section className={styles.section} aria-labelledby="top">
          <h2 id="top" className={styles.label}>
            Our highest scores
          </h2>
          {topPicks.map(({ a, s }) => (
            <Link key={a.slug} href={utm(`/${a.category}/${a.slug}`, 'top-picks')} className={styles.card}>
              <span>{a.name}</span>
              <span className={styles.score}>{s.toFixed(1)}/10</span>
              <ArrowUpRight size={18} aria-hidden />
            </Link>
          ))}
        </section>
      )}

      <section className={styles.section} aria-labelledby="news">
        <h2 id="news" className={styles.label}>
          New reviews by email
        </h2>
        <Newsletter compact />
      </section>

      <footer className={styles.foot}>
        <a href="https://www.instagram.com/sharpandlean/" target="_blank" rel="noopener noreferrer">
          @sharpandlean on Instagram
        </a>
        <span>
          We may earn commission from some links. It never changes a score.{' '}
          <Link href="/affiliate-disclosure">Disclosure</Link>
        </span>
      </footer>
    </main>
  );
}
