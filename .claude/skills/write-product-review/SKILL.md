---
name: write-product-review
description: Write a full UK product review for SharpAndLean (a lib/articles/<slug>.ts file) from a product name, and optionally an image and affiliate link. Use when asked to "write a review of X", "review X for the UK", or to review the alternatives named in an existing review.
---

# Write a SharpAndLean product review

A review is one file, `lib/articles/<product-slug>-review.ts`, plus one line in
`lib/articles/index.ts`. Read `lib/articles/README.md` first: its rules
(no stubs in `alternatives`, best-alternatives section, commercial links,
images, nofollow) apply to every review. Use a recent full review as the model,
e.g. `lib/articles/myprotein-impact-creatine-review.ts` or
`lib/articles/optimum-nutrition-serious-mass-review.ts`.

If the user lists several products, write **one review at a time**: finish,
check, commit and push each before starting the next, and move straight on to
the next unless told to stop.

## 1. Research

- Read the product's UK label: serving size, servings per pack, amount of each
  active ingredient per serving (and %NRV), ingredient list, directions,
  warnings, allergens and the claims on the pack. Prefer the brand's GB page;
  if it cannot be reached, use UK retailer listings and say so in `sourceNote`.
- Check that listings describe the UK/EU formula, not a US product sold under
  the same name. Where listings disagree, give both figures or leave the figure
  out and say why. Never quote a number you could not source.
- Collect UK prices from named retailers or a price comparison, with the date.
  Work out the fair unit: per 100 g (creatine), per 100 g of protein (protein
  powders), per 1,000 kcal (gainers), per day (vitamins, caffeine drinks).
- Find the research behind the claim: position stands, meta-analyses, the key
  randomised trials, NHS guidance and the GB nutrition and health claims
  register. Cite PubMed, DOI or official URLs you have confirmed.
- Find the Amazon.co.uk ASIN for the image (see the README).

## 2. Write the file

- `slug`: `<product-name>-review`. `seoTitle`: `<Product>: UK Review 2026`,
  unless the user gives one.
- `goalTags` from `lib/goals.ts`, or `[]` if none honestly fits.
- `scoreBreakdown` with the five criteria from /evidence-grading, each with a
  comment explaining the mark:
  `Evidence for the marketed claim`, `Dose against the studied amount`,
  `Label transparency`, `Value against the generic equivalent`,
  `Safety and tolerability`. The page score is their mean; quote it in the
  body and history.
- `image` and `affiliateUrl` per the README (`/recommended/<product-slug>`).
- Body sections, in this order: Our take; What exactly are you buying?; what
  the evidence shows; testing or safety specifics; Price; **Best
  alternatives**; Who should skip it; Sources and shopping (which names the
  commercial link and the score).
- State plainly that it is a desk review and nobody on the team has used the
  product, unless someone has (then use `testedBy`).
- `pros`, `cons`, `ingredients` (`evidence_rating` is `strong`, `moderate`,
  `weak` or `none`), `faqs`, `references`, `history` (score entry and
  first-published entry), `published` and `updated`.
- Plain British English and short sentences. Say what we could not verify.

## 3. Update the rest of the site

- Register the article in `lib/articles/index.ts`.
- `grep -rn "not yet reviewed" lib/articles` for mentions of this product in
  earlier reviews. For each: link the mention, mark it "(reviewed)", add the
  slug to that review's `alternatives`, and add a history entry. Fix any
  sentence that now says the product has not been reviewed.

## 4. Check and ship

```sh
npm run -s typecheck
npm run -s test:unit
```

Both must pass. Commit with a message giving the score and the main reasons,
and push to the working branch. In the reply, give the score table, the
sources relied on, anything unverified (images you could not load, figures you
could not confirm), and the `/recommended/` redirects that need creating in the
admin CMS.
