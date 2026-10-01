/*
 * Turns site content into Instagram posts: a list of slides plus a caption.
 *
 * Every figure on a slide comes from the article file it is built from — the
 * score is the same mean the page prints, the pros and cons are the page's own
 * — so a post can never say something the review does not.
 */
import { articles, getArticle, type ProductArticle } from '../../lib/articles';
import { overallScore, scoreCriteria } from '../../lib/scoring';
import type { Slide } from './render';

export const SITE = 'https://sharpandlean.com';
export const LINKS_PAGE = 'sharpandlean.com/links';

export type QueueEntry = {
  /** Folder name under public/ig/ and social/instagram/posts/. */
  id: string;
  /** 'review' is built from an article; anything else is a named special in SPECIALS. */
  type: 'review' | 'special';
  slug?: string;
  special?: string;
  /** Overrides the default cover hook. */
  hook?: string;
  format: 'carousel' | 'reel';
  /** Only 'approved' posts are published automatically. */
  status: 'draft' | 'approved' | 'published' | 'manual';
  /** Where the links page sends readers for this post. Defaults to the review URL. */
  link?: string;
  /** Short label for the links page button. */
  linkLabel?: string;
  publishedAt?: string;
  mediaId?: string;
  permalink?: string;
};

export type Post = { slides: Slide[]; caption: string; link: string; linkLabel: string };

const CATEGORY_LABEL: Record<string, string> = {
  'fat-burners': 'Weight management',
  nootropics: 'Focus & calm',
  wellness: 'Everyday wellness',
};

const GOAL_TAGS: Record<string, string[]> = {
  'weight-loss': ['#weightlosssupplements', '#glp1'],
  'weight-gain': ['#gymsupplements', '#proteinpowder'],
  probiotics: ['#guthealth', '#probiotics'],
  sleep: ['#sleepsupport', '#melatonin'],
  focus: ['#nootropics', '#focus'],
  'heart-health': ['#hearthealth', '#fibre'],
};

export function articleScore(a: ProductArticle): number | null {
  if (a.score !== undefined) return a.score;
  return a.scoreBreakdown ? overallScore(a.scoreBreakdown) : null;
}

export const articleUrl = (a: ProductArticle) => `${SITE}/${a.category}/${a.slug}`;

/** First n sentences of a paragraph. */
function sentences(text: string, n: number) {
  const parts = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  return parts.slice(0, n).map((s) => s.trim());
}

function defaultHook(a: ProductArticle, score: number | null) {
  if (score == null) return `${a.name}: what the label actually says`;
  if (score >= 8) return `One of the best-scoring products we have reviewed.`;
  if (score >= 7) return `Worth the money? We scored it ${score.toFixed(1)}/10.`;
  if (score >= 5) return `Good, but not for the reason on the tub.`;
  return `We read the label so you don’t have to. It scored ${score.toFixed(1)}/10.`;
}

function hashtags(a: ProductArticle) {
  const tags = new Set<string>(['#supplementreview']);
  for (const g of a.goalTags) for (const t of GOAL_TAGS[g] ?? []) tags.add(t);
  if (a.category === 'wellness' && tags.size < 3) tags.add('#wellnessuk');
  tags.add('#sharpandlean');
  return [...tags].slice(0, 5).join(' ');
}

const DISCLAIMER =
  'Not medical advice — speak to a pharmacist or GP before starting a supplement, especially if you take medication. We may earn commission from some links on our site; it never changes a score.';

export function reviewPost(entry: QueueEntry): Post {
  const a = getArticle(entry.slug!);
  if (!a) throw new Error(`No article with slug "${entry.slug}"`);
  const score = articleScore(a);
  const hook = entry.hook ?? defaultHook(a, score);
  const tested = a.testedBy
    ? 'Includes first-hand use notes.'
    : 'Desk review of the label and published research.';

  const slides: Slide[] = [
    {
      kind: 'cover',
      kicker: `Independent review · ${CATEGORY_LABEL[a.category] ?? a.category}`,
      hook,
      product: a.name,
      score,
    },
    { kind: 'summary', kicker: 'The short version', text: a.summary, verdict: a.verdict },
  ];
  if (a.scoreBreakdown) {
    slides.push({
      kind: 'scores',
      kicker: 'How it scored',
      title: 'The five things we check',
      rows: scoreCriteria
        .filter((c) => a.scoreBreakdown![c.name] !== undefined)
        .map((c) => ({ label: c.name, value: a.scoreBreakdown![c.name] })),
      note: `Overall ${score?.toFixed(1)}/10 is the plain average. Method: sharpandlean.com/evidence-grading`,
    });
  }
  if (a.pros?.length) slides.push({ kind: 'list', kicker: 'What’s good', title: 'Credit where it’s due', items: a.pros.slice(0, 3), tone: 'good' });
  if (a.cons?.length) slides.push({ kind: 'list', kicker: 'Watch out for', title: 'What the front of the pack won’t tell you', items: a.cons.slice(0, 3), tone: 'bad' });
  if (a.whoAvoid) {
    slides.push({
      kind: 'list',
      kicker: 'Check first',
      title: 'Not for everyone — who should skip it or ask first',
      items: sentences(a.whoAvoid, 3),
      tone: 'neutral',
    });
  }
  slides.push({
    kind: 'cta',
    title: 'Full review, every source and the best alternatives',
    line: `Link in bio  →  ${LINKS_PAGE}`,
    small: `${tested} Method and evidence reviewed by Sumita Bhatti, Clinical Nutritionist. Not medical advice.`,
  });

  const caption = [
    hook,
    '',
    a.summary,
    '',
    a.verdict ? `Our verdict: ${a.verdict}.` : '',
    score != null
      ? `Score: ${score.toFixed(1)}/10 across five criteria — evidence, dose, label, value and safety.`
      : '',
    '',
    `Full review with every source → link in bio (${LINKS_PAGE})`,
    '',
    `${tested} ${DISCLAIMER}`,
    '',
    hashtags(a),
  ]
    .filter((l, i, arr) => !(l === '' && arr[i - 1] === ''))
    .join('\n')
    .trim();

  return {
    slides,
    caption,
    link: entry.link ?? `/${a.category}/${a.slug}`,
    linkLabel: entry.linkLabel ?? `${a.name} review`,
  };
}

/* ---------- specials: posts that are not one article ---------- */

const SPECIALS: Record<string, (entry: QueueEntry) => Post> = {
  method: () => ({
    slides: [
      {
        kind: 'cover',
        kicker: 'Hello from SharpAndLean',
        hook: 'Most supplement reviews are adverts. Ours come with a score you can check.',
        cta: 'Swipe to see how it works  →',
      },
      {
        kind: 'statement',
        kicker: 'The rule',
        text: 'We read the Supplement Facts panel, not the front of the tub — then check whether the research used the dose in the bottle.',
        note: 'Every figure on our site links to the page it came from, so you can check it yourself.',
      },
      {
        kind: 'list',
        kicker: 'Five criteria, each out of 10',
        title: 'What every product is scored on',
        items: scoreCriteria.slice(0, 3).map((c) => `${c.name}: ${c.what}`),
        tone: 'good',
      },
      {
        kind: 'list',
        kicker: 'Five criteria, each out of 10',
        title: '…and the last two',
        items: scoreCriteria.slice(3).map((c) => `${c.name}: ${c.what}`),
        tone: 'good',
      },
      {
        kind: 'statement',
        kicker: 'Who sets the method',
        text: 'Sumita Bhatti, Clinical Nutritionist — 15+ years reading labels and asking what a claim actually rests on.',
        note: 'The overall score is the plain average of the five. A good ingredient cannot rescue a hidden dose or a sixfold price.',
        theme: 'dark',
      },
      {
        kind: 'cta',
        kicker: 'New reviews every week',
        title: 'Follow for honest, checkable supplement reviews',
        line: `Link in bio  →  ${LINKS_PAGE}`,
        small: 'Independent and UK-focused. Not medical advice.',
      },
    ],
    caption: [
      'Most supplement reviews are adverts. Ours come with a score you can check.',
      '',
      'Every product we review gets marked out of 10 on five things: the evidence for what it is sold to do, the dose against the studied amount, how transparent the label is, value against the plain generic, and safety.',
      '',
      'The overall score is the plain average — so a great ingredient can’t rescue a hidden dose or a price six times the generic.',
      '',
      'Our method is set by Sumita Bhatti, Clinical Nutritionist (15+ years). Full method → link in bio.',
      '',
      'Which supplement should we score next? Tell us in the comments.',
      '',
      '#supplementreview #supplementsuk #nutritionist #evidencebased #sharpandlean',
    ].join('\n'),
    link: '/evidence-grading',
    linkLabel: 'How we score supplements',
  }),

  'glp1-ranking': () => {
    const slugs = [
      'calocurb-review',
      'lemme-glp-1-daily-review',
      'supergut-prebiotic-bars-review',
      'pendulum-akkermansia-review',
      'supergut-glp-1-booster-review',
      'pendulum-glp-1-probiotic-review',
      'colonbroom-glp-1-booster-review',
    ];
    const ranked = slugs
      .map((s) => getArticle(s))
      .filter((a): a is ProductArticle => Boolean(a))
      .map((a) => ({ a, score: articleScore(a) ?? 0 }))
      .sort((x, y) => y.score - x.score);
    const top = ranked[0];
    const best = Math.max(...ranked.map((r) => r.score));
    const threshold = Math.ceil(best + 0.0001);
    const short = (n: string) => n.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    return {
      slides: [
        {
          kind: 'cover',
          kicker: '“Natural GLP-1” supplements, ranked',
          hook: `We scored ${ranked.length} “GLP-1” supplements. Not one reached ${threshold}/10.`,
          cta: 'Swipe for the ranking  →',
        },
        {
          kind: 'statement',
          kicker: 'Why this matters',
          text: 'GLP-1 is the hormone behind Ozempic and Wegovy. A capsule with “GLP-1” on the label is not that medicine — and none of these has been shown to work like it.',
          note: 'So we checked the doses, the labels and the research behind each one.',
        },
        {
          kind: 'scores',
          kicker: 'Our scores',
          title: 'Ranked, best to worst',
          rows: ranked.map((r) => ({ label: short(r.a.name), value: r.score })),
          note: 'Each score is the average of five criteria: evidence, dose, label, value, safety.',
        },
        {
          kind: 'list',
          kicker: 'The pattern',
          title: 'Where they fall down',
          items: (
            [
              ['colonbroom-glp-1-booster-review', (a: ProductArticle) => a.cons?.[0]],
              ['pendulum-akkermansia-review', (a: ProductArticle) => a.cons?.[2]],
              ['supergut-glp-1-booster-review', (a: ProductArticle) => a.verdict],
            ] as const
          )
            .map(([slug, pick]) => {
              const r = ranked.find((x) => x.a.slug === slug);
              const text = r && pick(r.a);
              return text ? `${short(r.a.name)}: ${text}` : '';
            })
            .filter(Boolean),
          tone: 'bad',
        },
        {
          kind: 'statement',
          kicker: 'Top of a weak list',
          text: `${short(top.a.name)} scored highest, at ${top.score.toFixed(1)}: ${(top.a.verdict ?? '').replace(/^./, (c) => c.toLowerCase())}.`,
          note: 'If you are considering a GLP-1 medicine, that is a conversation for your GP or pharmacist, not a supplement aisle.',
          theme: 'dark',
        },
        {
          kind: 'cta',
          title: 'All seven reviews, with every source',
          line: `Link in bio  →  ${LINKS_PAGE}`,
          small: 'Desk reviews of labels and published research. Method and evidence reviewed by Sumita Bhatti, Clinical Nutritionist. Not medical advice.',
        },
      ],
      caption: [
        `We scored ${ranked.length} “natural GLP-1” supplements. Not one reached ${threshold}/10.`,
        '',
        ranked.map((r, i) => `${i + 1}. ${short(r.a.name)} — ${r.score.toFixed(1)}`).join('\n'),
        '',
        'The common problems: doses far below the research, GLP-1 claims resting on cell or animal studies, and prices several times a plain generic.',
        '',
        'Save this before you buy one. Full reviews → link in bio.',
        '',
        `Desk reviews of labels and published research. ${DISCLAIMER}`,
        '',
        '#glp1 #ozempic #weightlosssupplements #supplementreview #sharpandlean',
      ].join('\n'),
      link: '/fat-burners',
      linkLabel: '“GLP-1” supplements, ranked',
    };
  },
};

export function buildPost(entry: QueueEntry): Post {
  if (entry.type === 'review') return reviewPost(entry);
  const make = SPECIALS[entry.special ?? ''];
  if (!make) throw new Error(`Unknown special "${entry.special}" in queue entry ${entry.id}`);
  return make(entry);
}

export { articles };
