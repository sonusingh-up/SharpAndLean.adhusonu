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
import { pageMeta, OrganizationSchema, WebSiteSchema, FaqSchema } from '@/components/seo';
export const revalidate = 3600;
// The root segment does not inherit the title template from its own layout, so
// the homepage has to carry the brand itself or it ships a title with no brand
// and no category term in it.
export const metadata = pageMeta(
  'Supplement Labels and Ingredient Evidence | SharpAndLean',
  'We read the Supplement Facts panel, not the front of the bottle. Ingredient evidence graded A to F, with doses checked against the research.',
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
        <OrganizationSchema />
        <WebSiteSchema />
        {/* The four label checks are the page's most extractable content, so
            they are also published as question/answer pairs for AI answers. */}
        <FaqSchema
          faqs={[
            {
              question: 'How do you read a Supplement Facts panel?',
              answer:
                'Check four things: the serving size and how many servings the container holds, whether every active ingredient shows its own amount, the total stimulant content added across all sources, and whether any testing claim names a laboratory, a batch and a date.',
            },
            {
              question: 'What is a proprietary blend?',
              answer:
                'A proprietary blend lists several ingredients under one combined total instead of giving each its own amount. You learn the order the ingredients appear in and nothing else, which makes it impossible to check any single dose against the research.',
            },
            {
              question: 'Does the FDA approve dietary supplements?',
              answer:
                'No. Dietary supplements are regulated under the Dietary Supplement Health and Education Act of 1994 and are not approved by the FDA for safety or effectiveness before they go on sale. Manufacturers are responsible for their own safety and labelling, and the FDA acts after the fact.',
            },
            {
              question:
                'Does “made in an FDA-registered facility” mean a supplement is FDA approved?',
              answer:
                'No. It means a facility submitted a registration. It is not FDA approval of the product, the formula or any claim made for it.',
            },
          ]}
        />
        <section className="hero-content">
          <div className="hero-kicker">
            <SectionLabel>Read the panel, not the promise.</SectionLabel>
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
                The front of the bottle is marketing.
                <br />
                The Supplement Facts panel is the
                <br className="desktop-break" /> product. We read the panel.
              </p>
            </div>
          </div>
          <aside className="floating-note">
            <div className="note-top">
              <span className="tiny-label">A LITTLE CLARITY</span>
              <ScanLine size={22} strokeWidth={1} />
            </div>
            <h3>
              Is the dose
              <br />
              even on there?
            </h3>
            <p>
              A proprietary blend lists
              <br />
              ingredients but hides amounts.
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
              <ShieldCheck size={16} /> Doses checked against the research
            </span>
            <span>
              <Microscope size={16} /> Proprietary blends called out
            </span>
            <span>
              <CircleHelp size={16} /> Every paid link disclosed
            </span>
            <a href="#categories" className="scroll-link">
              A little more below <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <section className="section categories-section" id="categories">
          <div className="center-heading">
            <SectionLabel>Three categories, one method</SectionLabel>
            <h2>
              Different shelves.
              <br />
              The same questions.
            </h2>
            <p>
              Whether it is a fat burner, a focus formula or a daily vitamin, the checks do not
              change: what is in it, how much, and does the research use that amount.
            </p>
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
                No product here is sold as
                <br />
                a cure. Supplements are not
                <br />
                approved by the FDA before sale.
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
        <section className="section method-section" id="method">
          <div className="section-heading">
            <div>
              <SectionLabel>How to read a Supplement Facts panel</SectionLabel>
              <h2>
                Four checks,
                <br />
                before you buy.
              </h2>
            </div>
            <p>
              The same four questions decide most of it. You can run them yourself, in a shop, in
              about a minute.
            </p>
          </div>
          <ol className="method-list">
            {[
              [
                'Serving size',
                'Check how many capsules make one serving, and how many servings are in the tub. A bottle of 120 capsules at four per serving is thirty days, not a hundred and twenty — and that changes the real price per day.',
              ],
              [
                'Disclosed amounts',
                'Every active ingredient should show its own amount. If several sit under one “proprietary blend” total, you know the order they appear in and nothing else. Dose is usually the entire question.',
              ],
              [
                'Total stimulants',
                'Add up caffeine from every source on the panel — guarana, yerba mate, green tea extract and plain caffeine all count. Then add your coffee. The total is what your body responds to, not the number on the front.',
              ],
              [
                'Testing claims',
                'A meaningful test result names the laboratory, the batch and the date. “Made in an FDA-registered facility” is not a test, and it is not FDA approval of anything.',
              ],
            ].map(([title, text], index) => (
              <li key={title}>
                <span className="method-step">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="method-foot">
            Dietary supplements are regulated under DSHEA and are not approved by the FDA for safety
            or effectiveness before they go on sale.{' '}
            <Link href="/medical-disclaimer">What that means for you</Link>.
          </p>
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
              Each overview is built from the manufacturer’s own published label and directions,
              with the source linked so you can check it yourself.
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
                What we check.
                <br />
                And what we won’t.
              </h2>
            </div>
            <p>
              An assessment is only worth reading if you can see how it was reached — and what would
              have changed it.
            </p>
          </div>
          <div className="trust-grid">
            <div className="trust-image">
              <Image
                src="/images/trust-panel.webp"
                alt="Soft daylight casting a leaf shadow across a warm plaster wall"
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
                  'The dose has to match the study',
                  'An ingredient with good evidence at 400 mg tells you nothing about a capsule containing 40 mg. We compare the amount on the panel with the amount that was actually tested, and say when they do not line up.',
                ],
                [
                  '02',
                  'A weak study is not a strong claim',
                  'A systematic review carries more weight than one small trial, and a trial carries more weight than a cell experiment. Where the research is thin, preliminary or done in a different population, the overview says so rather than rounding up.',
                ],
                [
                  '03',
                  'What stops a product cold',
                  'An undisclosed proprietary blend where dose is the whole question. A stimulant total you cannot add up. Disease-treatment language. A testing claim with no batch, no laboratory and no date. Any of these caps an assessment regardless of how good the marketing is.',
                ],
                [
                  '04',
                  'Every paid link is marked',
                  'Some purchase links earn a commission. That is disclosed beside the button, at the top of the page and in the footer — never only in the small print. It buys no placement, no score and no advance sight of what we wrote.',
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
            <SectionLabel>Occasional, not relentless</SectionLabel>
            <h2>
              When a label
              <br />
              changes, you’ll know.
            </h2>
            <p>
              New label overviews, reformulations worth knowing about, and corrections when we get
              something wrong. Unsubscribe in one click.
            </p>
          </div>
          <Newsletter />
        </section>
      </main>
      <Footer />
    </div>
  );
}
