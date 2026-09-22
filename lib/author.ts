export type AuthorProfile = {
  name: string;
  slug: string;
  title: string;
  /** 'person' maps to schema.org Person, 'team' to Organization. */
  kind: 'person' | 'team';
  photo_url?: string;
  linkedin_url?: string;
  bio: string;
  /** Short line used under a byline. */
  role: string;
  credentials: string[];
  specialisations: string[];
};

export const authors: AuthorProfile[] = [
  {
    name: 'Sumita Bhatti',
    slug: 'sumita-bhatti',
    title: 'Clinical Nutritionist',
    kind: 'person',
    photo_url: '/images/sumita.jpg',
    linkedin_url: 'https://www.linkedin.com/in/sumita-bhatti-979467368/',
    bio: 'Sumita Bhatti has spent more than fifteen years in clinical nutrition, dietary planning and food safety — work that comes down to reading labels closely and asking what a claim actually rests on. At SharpAndLean she applies the same habit to supplements: separating what a Supplement Facts panel discloses from what the front of the package promises, and saying plainly when the research behind an ingredient never tested the amount in the bottle.',
    role: 'Sets the review method and interprets the evidence behind ingredient claims.',
    credentials: ['15+ years of professional experience in clinical nutrition'],
    specialisations: [
      'Clinical nutrition',
      'Evidence-based dietary planning',
      'Food safety',
      'Supplement label analysis',
    ],
  },
  {
    name: 'SNL Team',
    slug: 'snl-team',
    title: 'SharpAndLean Editorial Team',
    kind: 'team',
    bio: 'The SNL Team is the editorial desk behind SharpAndLean. It does the unglamorous part of the job: transcribing Supplement Facts panels exactly as the manufacturer publishes them, working out what a serving actually costs, checking whether a cited study used the form and dose that is in the bottle, and re-checking pages when a formula changes. Label overviews carry this byline because they are a record of what a label says, not a clinical opinion about what a product does.',
    role: 'Compiles label overviews, guides and comparisons from published manufacturer data.',
    credentials: [
      'Transcribes Supplement Facts panels from the manufacturer’s own published page',
      'Links the source on every overview so any figure can be checked',
      'Records what is missing rather than filling the gap with an assumption',
    ],
    specialisations: [
      'Supplement label transcription',
      'Cost-per-serving analysis',
      'Source verification',
      'Editorial corrections',
    ],
  },
  {
    name: 'Pankaj Singh',
    slug: 'pankaj-singh',
    title: 'Hands-on Product Tester',
    kind: 'person',
    bio: 'Pankaj Singh buys supplements with his own money and uses them long enough to have an opinion worth reading. He drank Optimum Nutrition Gold Standard 100% Whey almost daily for three years while training in India, across several tubs and flavours, which is the kind of exposure a one-week trial cannot produce. What he contributes is narrow and specific: how a powder mixes, how it tastes by the fiftieth shake rather than the first, how a scoop and a tub behave in a humid kitchen, and how his own digestion handled it. He is not a clinician, his experience is one person’s, and the tubs he used were bought in India rather than the United Kingdom — all three limits are stated on any page carrying his name.',
    role: 'Supplies first-hand use notes on products he has bought and used himself.',
    credentials: [
      'Reports only on products he has personally bought and used, for a stated length of time',
      'Separates what he experienced from what the research shows',
      'States the market he bought in, because formulas and labels differ by country',
    ],
    specialisations: [
      'Long-term daily use notes',
      'Mixing, texture and taste over months rather than days',
      'Tolerability and practical routine fit',
    ],
  },
];

/** Default author for evidence-led reviews. */
export const authorProfile = authors.find((a) => a.slug === 'sumita-bhatti')!;
/** Byline used for label overviews, guides and comparisons. */
export const teamProfile = authors.find((a) => a.slug === 'snl-team')!;
/** Credited separately from the writer when a page rests on first-hand use. */
export const testerProfile = authors.find((a) => a.slug === 'pankaj-singh')!;

export function getAuthorBySlug(slug: string) {
  return authors.find((a) => a.slug === slug);
}
