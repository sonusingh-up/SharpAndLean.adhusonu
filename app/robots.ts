import type { MetadataRoute } from 'next';
import { demoMode, siteUrl } from '@/lib/config';

// Answer engines are a deliberate distribution channel for this site, so their
// crawlers are allowed explicitly rather than left to the wildcard rule. Being
// crawlable is what makes a page citable in an AI answer. Reverse these entries
// to opt out of AI training and citation.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'meta-externalagent',
  'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
  if (demoMode) {
    return { rules: { userAgent: '*', disallow: '/' }, sitemap: `${siteUrl}/sitemap.xml` };
  }
  const disallow = ['/admin', '/api/'];
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
