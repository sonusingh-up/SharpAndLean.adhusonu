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

## Two kinds of page

The shape of the file decides which one you get:

| You supply                      | You get          | The h1 reads      |
| ------------------------------- | ---------------- | ----------------- |
| `facts` + `caution` + `takeaway` | a label overview | "… — label overview" |
| `body`                          | a review         | "… review"        |

A label overview is assembled from the standard template in `to-review.ts` and
records only what the manufacturer published. Supplying `body` replaces the
template with your own HTML and the page becomes a review. Set `kind`
explicitly only to override that inference.

Everything else on `ProductArticle` is optional and defaults sensibly — see the
field comments in `types.ts` and the defaults in `to-review.ts`. A short
overview needs about eight fields; a long-form review with pros, cons,
ingredients, FAQs, references and history uses about twenty-five.

## Bylines

Pages are bylined to the team by default, with the clinician credited
separately as the evidence reviewer. Set `writtenBy: 'clinician'` on an article
she wrote herself.

## Files here

- `types.ts` — the `ProductArticle` type. The single source of truth for a page.
- `index.ts` — the registry, plus a duplicate-slug guard that throws at import.
- `to-review.ts` — adapts an article to the `Review` shape the components render,
  and holds every default.
- `<slug>.ts` — the articles.
