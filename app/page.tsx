import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  ArrowDown,
  Plus,
  Flame,
  Brain,
  Leaf,
  Scale,
  ListOrdered,
  ShieldCheck,
  Microscope,
  ScanLine,
  CircleHelp,
} from 'lucide-react';
import { Header, Footer, SectionLabel, ButtonLink } from '@/components/site';
import { ReviewCard } from '@/components/review-card';
import { Newsletter } from '@/components/newsletter';
import { getReviews } from '@/lib/data';
import { pageMeta, JsonLd } from '@/components/seo';
import { siteUrl } from '@/lib/config';
export const revalidate = 3600;
export const metadata = pageMeta(
  'Know what goes in.',
  'Thoughtful supplement reviews for weight management, cognitive health and everyday wellness.',
  '/',
);
export default async function Home() {
  const reviews = (await getReviews()).slice(0, 4);
  return (
    <div className="site-frame home-frame">
      <div className="hero-image">
        <Image
          src="/images/hero.png"
          alt="Sculptural translucent glass forms in soft botanical light"
          fill
          priority
          sizes="100vw"
        />
        <Header hero />
        <div className="image-caption">
          <span>WELLNESS, WITH PERSPECTIVE.</span>
          <span>01 — A CLEARER VIEW</span>
        </div>
      </div>
      <main id="main">
        <JsonLd data={{ '@type': 'WebSite', name: 'SharpAndLean', url: siteUrl }} />
        <section className="hero-content">
          <div className="hero-kicker">
            <SectionLabel>Good questions. Better choices.</SectionLabel>
            <Link href="/author/sumita-bhatti" className="mission">
              <span className="initial-avatar">
                <Image src="/images/sumita.jpg" alt="Sumita Bhatti" width={48} height={48} />
                <ArrowUpRight size={12} />
              </span>
              <span>
                Meet Sumita
                <br />
                Clinical nutritionist
              </span>
            </Link>
          </div>
          <div className="hero-copy">
            <h1>
              Know your supplements.
              <br />
              Start with <span>the label.</span>
              <sup>
                <Plus size={28} strokeWidth={1.3} />
              </sup>
            </h1>
            <div className="hero-actions">
              <ButtonLink href="#reviews">Explore products</ButtonLink>
              <p>
                Less noise. More know-how.
                <br />A thoughtful look at the supplements
                <br className="desktop-break" /> you bring into your everyday.
              </p>
            </div>
          </div>
          <aside className="floating-note">
            <div className="note-top">
              <span className="tiny-label">A LITTLE CLARITY</span>
              <ScanLine size={22} strokeWidth={1} />
            </div>
            <h3>
              What’s really
              <br />
              in your routine?
            </h3>
            <p>
              Start with the label.
              <br />
              We’ll help with the rest.
            </p>
            <Link href="/about">
              Our review approach{' '}
              <span className="circle">
                <ArrowUpRight size={17} />
              </span>
            </Link>
          </aside>
          <div className="hero-bottom">
            <span>
              <ShieldCheck size={16} /> Evidence comes first
            </span>
            <span>
              <Microscope size={16} /> Every ingredient matters
            </span>
            <span>
              <CircleHelp size={16} /> Transparency, always
            </span>
            <a href="#categories" className="scroll-link">
              A little more below <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <section className="section categories-section" id="categories">
          <div className="center-heading">
            <SectionLabel>Find your focus</SectionLabel>
            <h2>
              Your wellbeing.
              <br />A clearer starting point.
            </h2>
            <p>Explore the questions that matter to you.</p>
          </div>
          <div className="bento">
            <Link className="bento-card bento-fat" href="/fat-burners">
              <span className="bento-number">01 / WEIGHT MANAGEMENT</span>
              <Flame size={62} strokeWidth={1} />
              <div>
                <h3>Fat Burners</h3>
                <span className="circle">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
            <Link className="bento-card bento-brain" href="/nootropics">
              <Brain size={47} strokeWidth={1} />
              <div>
                <h3>Nootropics</h3>
                <ArrowUpRight size={18} />
              </div>
            </Link>
            <Link className="bento-card bento-wellness" href="/wellness">
              <Leaf size={47} strokeWidth={1} />
              <div>
                <h3>Wellness</h3>
                <ArrowUpRight size={18} />
              </div>
            </Link>
            <Link className="bento-card bento-compare" href="/compare">
              <Scale size={30} strokeWidth={1} />
              <div>
                <h3>Side by side</h3>
                <ArrowUpRight size={17} />
              </div>
            </Link>
            <div className="bento-text">
              <Plus size={22} strokeWidth={1} />
              <p>
                Not another miracle promise.
                <br />
                Just the information you need
                <br />
                to make your own call.
              </p>
            </div>
            <Link className="bento-card bento-best" href="/best">
              <ListOrdered size={47} strokeWidth={1} />
              <div>
                <h3>The shortlists</h3>
                <span className="circle">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <p>Practical guides to building your own shortlist.</p>
            </Link>
          </div>
        </section>
        <section className="section" id="reviews">
          <div className="section-heading">
            <div>
              <SectionLabel>Under the microscope</SectionLabel>
              <h2>
                A closer look.
                <br />
                An informed choice.
              </h2>
            </div>
            <p>
              Beyond the front-of-pack promises.
              <br />
              Manufacturer sources and clear label overviews.
            </p>
          </div>
          {reviews.length ? (
            <div className="review-grid">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <p className="empty">
              Our first reviews are being prepared. Join the newsletter for updates.
            </p>
          )}
        </section>
        <section className="section trust-section">
          <div className="section-heading">
            <div>
              <SectionLabel>The Sharp & Lean standard</SectionLabel>
              <h2>
                Trust is in
                <br />
                the details.
              </h2>
            </div>
            <p>
              Good advice should come with context.
              <br />
              Here’s what goes into ours.
            </p>
          </div>
          <div className="trust-grid">
            <div className="trust-image">
              <Image
                src="/images/hero.png"
                alt="Soft light through an abstract glass structure"
                fill
                sizes="(max-width: 700px) 90vw, 45vw"
              />
              <div className="trust-overlay">
                <span>
                  CURIOUS BY NATURE.
                  <br />
                  THOROUGH BY DESIGN.
                </span>
                <ButtonLink href="/about" light>
                  Meet our approach
                </ButtonLink>
              </div>
            </div>
            <div className="trust-accordions">
              {[
                [
                  '01',
                  'Evidence before enthusiasm',
                  'We look at the ingredients, the doses and the quality of the research. When evidence is limited, that belongs in the review too.',
                ],
                [
                  '02',
                  'A person behind every review',
                  'Our editorial process makes the author, review date and reasoning visible, so you can understand how an assessment was reached.',
                ],
                [
                  '03',
                  'Our links, clearly disclosed',
                  'Some links may earn us a commission. We explain this at the point where you need to know, alongside the purchase link.',
                ],
              ].map(([n, title, text], i) => (
                <details key={n} open={i === 0}>
                  <summary>
                    <span>{n}</span>
                    <h3>{title}</h3>
                    <Plus size={18} />
                  </summary>
                  <p>{text}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="section newsletter-section" id="newsletter">
          <div>
            <SectionLabel>A thoughtful addition to your inbox</SectionLabel>
            <h2>
              A little less guesswork.
              <br />A little more clarity.
            </h2>
            <p>New reviews and fresh perspectives. No miracle promises.</p>
          </div>
          <Newsletter />
        </section>
      </main>
      <Footer />
    </div>
  );
}
