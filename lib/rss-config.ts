export const rssFeeds = {
  all: {
    path: '/rss.xml',
    title: 'SharpAndLean — All articles',
    description:
      'Evidence-led nutrition, practical fitness, supplement reviews and ingredient guides.',
  },
  fitness: {
    path: '/feeds/fitness.xml',
    title: 'Fitness Made Simple — SharpAndLean',
    description: 'Beginner-friendly workouts, exercise form and practical ways to build strength.',
  },
  nutrition: {
    path: '/feeds/nutrition.xml',
    title: 'Food & Nutrition Explained — SharpAndLean',
    description: 'Clear guides to everyday foods, protein, vitamins and nutrition evidence.',
  },
  supplements: {
    path: '/feeds/supplements.xml',
    title: 'Supplement Reviews & Ingredients — SharpAndLean',
    description:
      'Supplement labels, ingredient evidence, doses and value, explained without the hype.',
  },
} as const;

export type RssFeed = keyof typeof rssFeeds;
export type RssTopic = Exclude<RssFeed, 'all'>;

export const rssAlternates = {
  'application/rss+xml': Object.values(rssFeeds).map(({ title, path }) => ({ title, url: path })),
};
