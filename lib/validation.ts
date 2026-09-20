import { z } from 'zod';
import { safeUrl } from './content';
const text = z.string().trim();
const url = text
  .max(2000)
  .refine((v) => !v || safeUrl(v), 'Use a complete http or https URL.')
  .default('');
const image = url.refine(
  (v) => !v || /^https:\/\/[^/]+\.supabase\.co\//.test(v),
  'Use a Supabase Storage image URL.',
);
export const faqSchema = z.object({
  question: text.min(1).max(500),
  answer: text.min(1).max(5000),
});
export const ingredientSchema = z.object({
  name: text.min(1).max(200),
  dose: text.max(200),
  evidence_rating: z.enum(['strong', 'moderate', 'weak', 'none']),
  note: text.max(5000),
});
const base = {
  id: z.uuid().optional(),
  title: text.min(3).max(200),
  slug: text
    .min(1)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: text.max(2000).default(''),
  body: z.string().max(250000).default(''),
  seo_title: text.max(200).default(''),
  seo_desc: text.max(160).default(''),
  is_published: z.boolean(),
  published_at: z.iso.datetime().nullable().optional(),
  category_id: z.uuid(),
};
export const reviewSchema = z
  .object({
    ...base,
    author_id: z.uuid(),
    product_name: text.min(1).max(200),
    score: z.number().min(0).max(10).nullable(),
    verdict: text.max(250).default(''),
    pros: z.array(text.min(1).max(1000)).max(30),
    cons: z.array(text.min(1).max(1000)).max(30),
    affiliate_url: url,
    affiliate_network: z.enum(['', 'Amazon', 'Clickbank', 'Awin', 'Gurumedia']),
    product_price: text.max(100),
    price_amount: z.number().nonnegative().nullable(),
    currency: z.string().regex(/^[A-Z]{3}$/),
    third_party_tested: z.boolean(),
    money_back_guarantee: text.max(200),
    featured_image_url: image,
    og_image_url: image,
    who_for: text.max(3000),
    who_avoid: text.max(3000),
    score_breakdown: z.record(text.max(80), z.number().min(0).max(10)),
    ingredients: z.array(ingredientSchema).max(80),
    faqs: z.array(faqSchema).max(40),
  })
  .superRefine((r, ctx) => {
    if (r.is_published && (!r.body || !r.summary || !r.seo_title || !r.seo_desc)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Published reviews need body content, summary, SEO title and description.',
      });
    }
  });
export const collectionSchema = z.object({
  ...base,
  verdict: text.max(5000).default(''),
  product_a_id: z.uuid().nullable().optional(),
  product_b_id: z.uuid().nullable().optional(),
  items: z
    .array(
      z.object({
        review_id: z.uuid(),
        rank: z.number().int().positive(),
        why_it_made_the_list: text.max(5000),
      }),
    )
    .max(50)
    .default([]),
  faqs: z.array(faqSchema).max(40).default([]),
});
export const subscriberSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  consent: z.literal('yes'),
  website: z.string().max(0).optional(),
});
export const communitySchema = z.object({
  review_id: z.uuid(),
  reviewer_name: text.min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  review_text: text.min(20).max(3000),
  website: z.string().max(0).optional(),
});
