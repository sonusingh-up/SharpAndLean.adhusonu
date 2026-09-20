import type { Review, Collection } from './types';

const products = [
  {
    name: 'NOW Psyllium Husk Powder',
    slug: 'now-psyllium-husk-powder',
    category: 'fat-burners' as const,
    summary: 'A fibre powder, not a thermogenic fat burner. The distinction matters when comparing weight-management products.',
    source: 'https://www.nowfoods.com/products/supplements/psyllium-husk-powder',
    facts: 'The manufacturer lists a 9 g serving with 7 g dietary fibre. Its directions specify at least 12 oz of liquid and immediate consumption. This powder belongs in a discussion about fibre; its label does not establish fat loss.',
    caution: 'NOW warns against use with swallowing difficulties and inadequate liquid because of choking risk. Its label advises medical consultation for medicines, medical conditions, pregnancy or nursing.',
    takeaway: 'Compare powder weight, fibre content and the preparation instructions. Do not mistake a larger scoop for stronger evidence of weight loss.',
  },
  {
    name: 'NOW L-Theanine 100 mg',
    slug: 'now-l-theanine-100-mg',
    category: 'nootropics' as const,
    summary: 'A closer look at a relaxation-labelled formula containing both L-theanine and decaffeinated green tea.',
    source: 'https://www.nowfoods.com/products/supplements/l-theanine-100-mg-veg-capsules',
    facts: 'The manufacturer lists 100 mg L-theanine and 250 mg decaffeinated green tea per capsule, with 90 capsules per bottle. This is not a single-ingredient L-theanine capsule. The label markets relaxation; that claim should not be stretched into a promise of better memory.',
    caution: 'The manufacturer says to take with food, avoid an empty stomach and not exceed its recommended dose. It advises medical consultation for pregnancy, nursing, medicines or medical conditions, including liver disease.',
    takeaway: 'Read the full ingredient panel when comparing the 100 mg and 200 mg versions. A shared brand name does not establish an identical formula.',
  },
  {
    name: 'Nature Made Vitamin D3 1000 IU',
    slug: 'nature-made-vitamin-d3-1000-iu',
    category: 'wellness' as const,
    summary: 'A clearly named vitamin D3 softgel. Check the strength and bottle count carefully when comparing listings.',
    source: 'https://www.naturemade.com/products/vitamin-d3-25-mcg-1000-iu-softgels',
    facts: 'The product title and benefits section specify 25 mcg (1000 IU) per softgel. The manufacturer offers multiple bottle counts. One introductory sentence on its page inconsistently says 50 mcg; check the actual package panel before purchase rather than repeating that inconsistency.',
    caution: 'An appropriate vitamin D dose depends on individual circumstances. Discuss personal use with a healthcare professional, particularly alongside other supplements or medicines.',
    takeaway: 'Compare the same strength and softgel count. A price comparison with a higher-strength bottle is not a like-for-like comparison.',
  },
];

export const productReviews: Review[] = products.map((p, index) => ({
  id: `editorial-product-${index + 1}`, product_name: p.name, title: p.name,
  slug: p.slug, category_slug: p.category, score: null,
  verdict: 'Manufacturer-label overview', summary: p.summary,
  body: `<h2>What this page covers</h2><p>This is a source-based product overview, not a hands-on test or a clinical endorsement. No effectiveness score has been assigned.</p><h2>Read the label</h2><p>${p.facts}</p><h2>Before use</h2><p>${p.caution}</p><h2>What to compare</h2><p>${p.takeaway}</p><h2>Sources and shopping</h2><p><a href="${p.source}" target="_blank" rel="noopener noreferrer">Manufacturer product information</a></p><p><a href="https://www.amazon.com/s?k=${encodeURIComponent(p.name)}" target="_blank" rel="noopener noreferrer">Search this product on Amazon</a>. This is a search link, not a verified seller listing or an affiliate link. Check the seller, strength, package size and current label. Prices and stock are not quoted here.</p>`,
  pros: ['Manufacturer source linked for inspection', 'Product identity and comparison criteria stated'],
  cons: ['No hands-on testing performed', 'No independent assessment of the purchased batch'],
  ingredients: [], faqs: [{question: 'Has Sumita personally tested this product?', answer: 'This overview does not claim personal testing or clinical sign-off. It describes public manufacturer information.'}],
  affiliate_url: '', affiliate_network: '', product_price: 'Check current seller price',
  price_amount: null, currency: 'USD', third_party_tested: false,
  money_back_guarantee: 'Check seller return policy', featured_image_url: '', og_image_url: '',
  seo_title: p.name + ' — Label Overview', seo_desc: p.summary,
  is_published: true, published_at: '2026-09-20T00:00:00Z', updated_at: '2026-09-20T00:00:00Z',
  who_for: 'Readers comparing the named product and its label.',
  who_avoid: p.caution, score_breakdown: {},
}));

export const editorialCollections: Collection[] = [
  {
    id: 'label-shortlist', kind: 'best_lists', title: 'How to build a supplement shortlist',
    slug: 'build-a-supplement-shortlist', summary: 'A practical selection method: purpose, disclosed amounts, evidence and total cost.',
    body: '<h2>Start with the question</h2><p>Write down the purpose before selecting a brand. A fibre powder, a relaxation formula and a vitamin have different jobs and should not compete for one best-product score.</p><h2>Build a comparable list</h2><p>Record the serving size, ingredient amounts, bottle count and cost per serving. Match the actual strength and form before comparing prices. Keep a link to the manufacturer label beside each entry.</p><h2>Check what is missing</h2><p>Ask whether a research citation concerns the finished formula. Record testing documents by batch and date. If a label hides individual doses, record that uncertainty.</p><h2>Read the product overviews</h2><p><a href="/fat-burners/now-psyllium-husk-powder">NOW Psyllium Husk Powder</a>, <a href="/nootropics/now-l-theanine-100-mg">NOW L-Theanine 100 mg</a> and <a href="/wellness/nature-made-vitamin-d3-1000-iu">Nature Made Vitamin D3 1000 IU</a> illustrate different label questions. This list is not a ranking.</p>',
  },
  {
    id: 'label-comparison', kind: 'comparisons', title: 'Compare supplements without mixing up doses',
    slug: 'compare-labels-and-serving-costs', summary: 'Separate capsule count, daily serving and ingredient amount before deciding which listing offers value.',
    body: '<h2>Price per bottle misses the point</h2><p>Divide the bottle price by the number of labelled servings. A 60-capsule bottle taken two capsules at a time contains 30 servings. A 30-capsule bottle taken one at a time also contains 30. Delivery charges and subscription conditions still affect the final cost.</p><h2>Match the formula</h2><p>Compare the exact form, strength and ingredient list. A product containing L-theanine plus green tea is different from pure L-theanine. A vitamin D bottle with a different strength is a different comparison even if the packaging looks similar.</p><h2>Keep evidence separate</h2><p>A cheaper serving is not proof of better effectiveness. Compare the relevance of the research independently, then consider testing documentation and practical use. Mark unverified details clearly.</p><h2>Check the source</h2><p>Use the manufacturer information linked in each product overview and compare it with the package offered by the seller. Marketplace listing titles can combine variants.</p>',
  },
].map((row) => ({...row, kind: row.kind as Collection['kind'], is_published: true, seo_title: row.title, seo_desc: row.summary, published_at: '2026-09-20T00:00:00Z', updated_at: '2026-09-20T00:00:00Z'}));
