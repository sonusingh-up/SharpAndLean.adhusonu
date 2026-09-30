# SharpAndLean RSS and Flipboard

## Feed URLs after deployment

| Magazine | RSS feed |
| --- | --- |
| All published editorial content | https://sharpandlean.com/rss.xml |
| Fitness Made Simple | https://sharpandlean.com/feeds/fitness.xml |
| Food & Nutrition Explained | https://sharpandlean.com/feeds/nutrition.xml |
| Supplement Reviews & Ingredients | https://sharpandlean.com/feeds/supplements.xml |

These are deployment URLs, not confirmation that the feeds are already live or accepted by Flipboard.

## What updates automatically

The feed readers use the same file-backed/database-backed content source as the website. Published reviews, Learn articles, curated comparisons, buying guides, label-reading guides and dated ingredient pages enter the master feed. The Supergut brand guide is also included. Listing pages, automatically generated comparison pairs, drafts, sample reviews, future publications and undated articles are excluded.

Fitness uses the Learn fitness topic. Nutrition includes food, vitamins and weight-loss explainers plus the beginner protein article. Supplements includes reviews, label overviews, comparisons, buying guides, ingredients, supplement guides, vitamin and weight-loss explainers. Intentional overlap means the protein guide can appear in both fitness and nutrition. A new Learn topic still appears in the master feed even before topic routing is added.

Original publication dates and canonical-URL GUIDs are preserved. There is no artificial date refresh or archive cutoff in our feeds. Ingredient pages need an actual publication event in their history; their latest edit date is not used as a substitute. Feed responses revalidate every ten minutes; database content follows the existing content cache too. Demo mode produces empty, noindex feeds.

Images use their article-specific source, with absolute Media RSS URLs and an image in the HTML excerpt. Available local assets also receive standard RSS enclosures with their real byte lengths. Remote images (or assets outside a deployed function's filesystem) use Media RSS without an invented enclosure length. No generic logo is substituted for missing article artwork. Some existing illustrations are SVGs or have small dimensions; check the importer preview and supply suitable article artwork if Flipboard rejects them.

## Deployment and connection checklist

1. Run `npm run typecheck` and `npx tsx --test tests/rss.test.ts`.
2. Deploy the changes through the site's normal production workflow. The existing Vercel configuration disables deployments for `codex/**` branches, so pushing a branch alone does not make these URLs live.
3. Check all four public URLs return RSS XML with HTTPS `sharpandlean.com` links, not a preview host or localhost. `NEXT_PUBLIC_SITE_URL` controls the canonical origin.
4. Check HTML source on the homepage and an article contains the four `rel="alternate"` RSS links. Check images open publicly and crawlers are not challenged by a CDN or login screen.
5. Obtain Flipboard publisher/feed access, then connect each topic feed to the matching existing magazine. Do not create duplicate magazines or paste XML URLs as ordinary article flips.
6. Confirm source status in Flipboard and inspect imported article cards. Feed access, acceptance and indexing are controlled by Flipboard, not by this application.

## Flipboard setup status (30 September 2026)

The three public magazines and profile bio exist. Their editor menus did not expose RSS/source controls. The legacy `flipboard.com/publishers` entry point redirected to a paid-content-program article, not an application form. No paid service, publisher application, support message or RSS source has been submitted by this work. Publisher access needs clarification before connection can be confirmed.

Flipboard's [RSS guidelines](https://about.flipboard.com/rss-guidelines/) recommend recent items, author information and article imagery. They generally exclude content over 90 days old and advise allowing at least 12 hours before troubleshooting a missing new item. Narrow feeds currently contain fewer than the suggested 20 items; do not pad them with unrelated or fabricated content. The master feed is the broader alternative if requested during review.

## Support request draft (not sent)

Subject: RSS feed access for SharpAndLean

Hello Flipboard team,

We would like to connect SharpAndLean's original fitness, nutrition and supplement articles to our existing magazines at https://flipboard.com/@SharpAndLean.

The magazines are Fitness Made Simple, Food & Nutrition Explained, and Supplement Reviews & Ingredients. The website's RSS implementation is ready for deployment, with a master feed at https://sharpandlean.com/rss.xml and topic feeds listed above.

Our magazine editor does not show an RSS or Sources option, and the legacy publisher signup URL redirects to a promotional article. Could you confirm the current process for enabling RSS ingestion for a new publisher, whether it is available to this account, and any review or minimum-content requirements?

We would prefer to connect the existing magazines rather than create duplicates. Please let us know which public feed URLs you need once deployment is complete.

Thank you,
SharpAndLean
