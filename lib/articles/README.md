# Articles

One file per article. This directory is the whole content layer for product
pages — routes, sitemap, search index, schema and category listings all read
from it.

## Publishing an article

1. Create `lib/articles/<slug>.ts`.
2. Add one import and one array entry in `index.ts`.

That is the entire checklist. Nothing under `app/` needs a new folder: the page
is served by the existing `app/[section]/[slug]` route, where `section` is the
article's `category`.

```ts
// lib/articles/example-product.ts
import type { ProductArticle } from './types';

export const exampleProduct: ProductArticle = {
  slug: 'example-product',
  name: 'Example Product',
  category: 'wellness',
  summary: 'One sentence, used as the meta description and the page intro.',
  source: 'https://manufacturer.example/product',
  facts: 'What the Supplement Facts panel says.',
  caution: 'Who should not take it, and what it interacts with.',
  takeaway: 'What to compare before buying.',
};
```

The URL is `/<category>/<slug>`.

## Slugs

A review's slug is `<product-name>-review`, e.g. `kinetica-whey-protein-review`.
The file is named after the slug, so renaming one means renaming both and
updating the import in `index.ts`, every `alternatives` entry pointing at it,
and every in-body link. A published slug is a promise to the outside world:
change one only if nothing external links to it yet, and add a redirect if
anything does.

## Two kinds of page

The shape of the file decides which one you get:

| You supply                       | You get          | The h1 reads         |
| -------------------------------- | ---------------- | -------------------- |
| `facts` + `caution` + `takeaway` | a label overview | "… — label overview" |
| `body`                           | a review         | "… review"           |

A label overview is assembled from the standard template in `to-review.ts` and
records only what the manufacturer published. Supplying `body` replaces the
template with your own HTML and the page becomes a review. Set `kind`
explicitly only to override that inference.

Everything else on `ProductArticle` is optional and defaults sensibly — see the
field comments in `types.ts` and the defaults in `to-review.ts`. A short
overview needs about eight fields; a long-form review with pros, cons,
ingredients, FAQs, references and history uses about twenty-five.

## Comparison products get full reviews, never stubs

When a review needs alternatives for its "How does it compare?" block, name
them with `alternatives: ['<slug>', ...]`. Without that field the page falls
back to other articles in the same category, and the categories here are wide
enough that a whey protein will be compared against fish oil.

**Every slug named there must be a full review, written to the same standard as
the review that links to it** — researched body prose, a five-criterion
`scoreBreakdown`, pros, cons, ingredients, FAQs, references and history. Use
[`optimum-nutrition-uk-review-2026.ts`](optimum-nutrition-uk-review-2026.ts) as
the model.

Do not create a thin `facts`/`caution`/`takeaway` label overview just to give a
comparison card something to point at. A comparison card is a promise that
there is a real review behind it, and a reader who follows the link and finds a
stub has been misled by this site rather than by a manufacturer. If you are not
prepared to research the alternative properly, leave it out of `alternatives`
and discuss it as prose in the body instead — an unlinked mention promises
nothing.

A practical consequence: adding one review often means adding three. Budget for
that before starting, rather than discovering it at the comparison block.

## Bylines

Pages are bylined to the team by default, with the clinician credited
separately as the evidence reviewer. Set `writtenBy: 'clinician'` on an article
she wrote herself.

`testedBy: '<author slug>'` adds a "Personally tested by" credit beside the
writer. Set it only when someone named actually used the product, and say in
the body how long for, in which market, and what their experience does not
establish. It is the one claim on a page here that a reader cannot check
against a label, so it carries a correspondingly higher burden.

## Outbound links are nofollow

Every link out of a page — citations, manufacturer sources, retailers, research
bodies — is rendered `rel="nofollow"`, and commercial links additionally carry
`sponsored`. That is handled centrally by `linkRel()` in `lib/content.ts`, which
`cleanHtml` applies to body copy and the references box applies to citations, so
an article file never sets `rel` itself. Write plain `<a href="...">` and it
comes out right.

The reasoning: the links exist so a reader can check a figure, which nofollow
does not affect. What the site does not do is hand ranking signal to the
manufacturers, retailers and organisations it writes about, because it writes
about them critically and the two should not be entangled. Internal links are
relative and pass equity normally.

## Commercial links

`asin` links to amazon.com. For a product sold in another market, set
`affiliateUrl` to a `/recommended/<slug>` redirect instead and create that
redirect in the admin CMS — an article-supplied link is never overwritten by
the Amazon fallback. A product with neither field simply shows no buy button,
which is the right outcome: the site does not guess at listings.

## Files here

- `types.ts` — the `ProductArticle` type. The single source of truth for a page.
- `index.ts` — the registry, plus a duplicate-slug guard that throws at import.
- `to-review.ts` — adapts an article to the `Review` shape the components render,
  and holds every default.
- `<slug>.ts` — the articles.
