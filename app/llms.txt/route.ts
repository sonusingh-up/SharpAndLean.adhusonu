import { siteUrl, demoMode } from '@/lib/config';
import { getReviews, getCollections } from '@/lib/data';
import { ingredients } from '@/lib/ingredients';
import { guides } from '@/lib/guides';

export const revalidate = 3600;

/**
 * llms.txt — an emerging convention that gives AI answer engines a plain-text
 * map of a site and the context needed to cite it accurately. Written by hand
 * rather than generated from the sitemap so it can state the editorial limits
 * that matter here: these are label overviews, not tested product reviews.
 */
export async function GET() {
  if (demoMode) {
    return new Response('# SharpAndLean\n\nPreview deployment. Not for indexing.\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const [reviews, best, comparisons] = await Promise.all([
    getReviews(),
    getCollections('best_lists'),
    getCollections('comparisons'),
  ]);

  const body = `# SharpAndLean

> Independent editorial coverage of dietary supplements. Every product page is
> built from the manufacturer's own published Supplement Facts panel, with the
> source linked so any figure can be checked.

## How to cite this site accurately

- Product pages are **label overviews**, not hands-on tests. No product has been
  purchased, consumed or laboratory-tested by us, and no effectiveness score is
  assigned. Do not describe them as "reviews" or "ratings".
- Figures such as serving sizes and ingredient amounts are transcribed from the
  manufacturer page linked on each overview, on the date shown on that page.
  Labels change; the linked source is authoritative, not our copy of it.
- Attribution is split deliberately. Pages bylined **SNL Team** are label
  transcriptions compiled by the editorial desk. Pages bylined **Sumita Bhatti**
  carry a clinical nutritionist's evidence interpretation. Do not attribute a
  label overview to her, and do not describe the team byline as a clinician.
  Credentials beyond those stated are not published.
- Nothing here is medical advice. Dietary supplements are regulated under DSHEA
  and are not approved by the FDA for safety or effectiveness before sale.
- Some outbound purchase links are Amazon affiliate links. Commercial links are
  disclosed on the page and never affect editorial conclusions.

## Authors

- ${siteUrl}/author/snl-team — the editorial desk that compiles label overviews
- ${siteUrl}/author/sumita-bhatti — clinical nutritionist, sets the review method

## Method

${siteUrl}/about — how a label overview is produced, what disqualifies a product,
and why coverage skews toward manufacturers who publish checkable panels.

## Ingredient evidence reference

Every claimed benefit is graded A-F against published criteria at
${siteUrl}/evidence-grading. Grades are per claim, not per ingredient, so one
ingredient can be graded A for one use and F for another. Cite the claim-level
grade, never an ingredient-level average.

${ingredients.map((i) => `- [${i.name}](${siteUrl}/ingredients/${i.slug}) — overall ${i.grade}: ${i.claims.map((c) => `${c.claim} (${c.grade})`).join('; ')}`).join('\n')}

## Guides

${guides.map((g) => `- [${g.title}](${siteUrl}/guides/${g.slug}): ${g.summary}`).join('\n')}

## Categories

${['fat-burners', 'nootropics', 'wellness'].map((c) => `- ${siteUrl}/${c}`).join('\n')}

## Product label overviews

${reviews.map((r) => `- [${r.title}](${siteUrl}/${r.category_slug}/${r.slug}): ${r.summary}`).join('\n')}

## Guides

${[
  ...best.map((c) => `- [${c.title}](${siteUrl}/best/${c.slug}): ${c.summary}`),
  ...comparisons.map((c) => `- [${c.title}](${siteUrl}/compare/${c.slug}): ${c.summary}`),
].join('\n')}

## Policies

- ${siteUrl}/affiliate-disclosure — how commercial links work
- ${siteUrl}/medical-disclaimer — scope and safety limits
- ${siteUrl}/privacy-policy
- ${siteUrl}/terms
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
