# SharpAndLean

A Next.js App Router website, built from the supplied SharpAndLean specification with the Section 15 visual direction. Uses TypeScript, Tailwind 3, Tiptap 3, Supabase and Vercel. The dependency lockfile records the installed versions. Next.js is updated from the specification's older major version; Tiptap is also updated to the patched 3.x release. Three.js is intentionally omitted because Section 15 removes it. Native Next.js sitemap and robots routes replace next-sitemap.

## Local development

1. Install dependencies with `npm install`.
2. For a fresh checkout, copy `.env.example` to `.env.local` without overwriting existing settings. Run `clerk auth login`, then `clerk init --app app_3JY9Qx4pndFSTZ79iihCIxe0gEN --no-skills` to obtain development keys securely. This workspace is already linked.
3. Run `npm run dev` and open `http://localhost:3000`. Use this hostname consistently for Clerk sessions.

Without Supabase configuration the site serves the built-in manufacturer-label overviews in `lib/products.ts`. These are sourced from published product pages rather than hands-on testing, so they carry no score, no affiliate link and no review structured data, and each one says so on the page. Setting `NEXT_PUBLIC_DEMO_MODE=true` additionally blocks indexing, empties the sitemap and marks every page `noindex, nofollow`. The admin preview is read-only. No newsletter or community submission reports success without actually being stored.

## Connect the existing Supabase project

The supplied Supabase project is `https://exukqewuvsioxkghhqoj.supabase.co`. Review and run `supabase/migrations/001_initial.sql`, followed by `002_clerk_auth.sql`, in a new schema/project. They create tables, row-level access policies, transactional publishing functions, storage policies, Clerk editor membership, and durable form rate limits. Do not run blindly over conflicting existing tables.

Set the Supabase URL, public anon key, server-only service-role key and a random revalidation secret in `.env.local` and the Vercel environment. Never expose the service-role key or revalidation secret in browser code. Leave `NEXT_PUBLIC_DEMO_MODE` unset (or `false`) and set the canonical `NEXT_PUBLIC_SITE_URL=https://sharpandlean.com` for launch.

To enable Sentry performance tracing, set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` in the local and Vercel environments. Browser navigation, Node.js requests and Edge requests are traced at 10% by default; adjust `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` and `SENTRY_TRACES_SAMPLE_RATE` as needed. Set the server-only `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` variables in Vercel to upload production source maps.

Enable Clerk's native Supabase integration: add `role: "authenticated"` to Clerk session token claims and register the Clerk frontend domain in Supabase's Third-Party Auth settings. The server and browser clients pass Clerk session tokens through Supabase's `accessToken` callback. Do not use the deprecated Supabase JWT template integration.

Create your test account using the site's **Sign up** button. To grant editorial access, add the approved account's Clerk user ID to `public.clerk_admin_users(clerk_user_id)` through the SQL editor. Public signup does not grant editor access. `002_clerk_auth.sql` preserves any existing Supabase editor records without converting or deleting them. Pages, server actions, database policies and storage policies enforce access; the allowlist cannot be edited by ordinary users or editors.

## Editorial setup

- Replace the initial author record with Sumita's verified bio, credentials, photo and LinkedIn URL.
- Upload real product imagery and create real draft reviews in the CMS. The fictional preview fixtures are not inserted into the live database.
- Publish only after evidence sources, affiliate links, dates and factual claims have been checked.
- Complete and review the legal drafts for the actual operator, jurisdiction, email provider and analytics practices.
- Configure welcome emails and other automation after the core site is live, as specified in the brief.

## Vercel

Import this directory as a Next.js project, set the environment variables and run the SQL setup before publishing. Add sharpandlean.com in the existing Vercel project and configure the domain's DNS there. No domain or live project changes are made merely by running the local preview.

## Checks

`npm run typecheck`, `npm test`, and `npm run build` validate the application. `node tests/smoke.mjs` checks a running local preview; it discovers review and guide URLs from the sitemap rather than hard-coding slugs, and adapts to whether Clerk keys are present. The database test uses an isolated PostgreSQL runtime to check the migration, editor restrictions, draft visibility, transactional rollback, list visibility and rate limits without touching an external project. Database-backed end-to-end checks still require the actual Supabase environment and an approved test editor. After connection, test login, create draft, publish, unpublish, image upload and moderation with the real project.

## Verified in this build

- Production compilation, TypeScript and prerendering passed.
- Seven local tests passed, including the PostgreSQL permission and publication workflow.
- Thirty-two routes checked, with review and guide URLs taken from the sitemap: public pages load, unknown pages return 404, unauthorized revalidation returns 401, and the unconfigured newsletter returns an honest 503. With Clerk keys present, anonymous CMS access redirects to sign-in; without them every auth route reports an honest 503.
- Browser checks covered desktop and mobile layouts, the mobile menu, category sorting, review anchor navigation, FAQ expansion, automatic slugs, rich-text typing and ingredient/FAQ rows.
- Dependency audit reported zero vulnerabilities after updating Tiptap to 3.31.3.

## Still needed for public launch

Live Supabase configuration and migrations; Vercel project details and Clerk production instance; verified review copy, ingredient research and affiliate URLs; Sumita's complete approved biography and credentials; operator contact and completed legal pages. Sumita's supplied portrait and LinkedIn URL are already included. Email delivery and the post-launch automation hooks are not connected. Clerk development configuration passes `clerk doctor`; production is not configured yet. Full signup and signed-in account verification require the user's test account.

## Artwork

`public/images/hero.png` is original artwork generated with built-in ImageGen. Prompt: “Sophisticated abstract biotech architectural 3D render, wide landscape 16:9 composition. Sculptural translucent frosted glass ribbons curve through rounded capsule-like architectural forms, with delicate botanical silhouettes visible through glass. Airy spatial depth, serene minimalist architecture, softly layered translucent planes. Pale sage, warm cream, muted blue-gray, delicate white highlights. Broad landscape artwork that crops well to a shallow banner; flowing forms occupy the middle band. Soft daylight, quiet refined editorial design, subtle refraction and matte plaster. Artwork only; no people, pills on a table, text, letters, logos, UI, or watermark.”

The photography is from [Unsplash](https://unsplash.com/), used under the Unsplash License, which permits commercial use without permission. Attribution is not required but is recorded here for provenance:

| File                             | Photographer                                           | Unsplash ID                        |
| -------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `public/images/trust-panel.webp` | [Carmen Alarcón](https://unsplash.com/@carmen_alarcon) | `photo-1658934475116-990b909c3038` |
| `public/images/card-fat.webp`    | [Tim Chow](https://unsplash.com/@rkdamedia)            | `photo-1546387903-6d82d96ccca6`    |
| `public/images/card-best.webp`   | [Diana Polekhina](https://unsplash.com/@diana_pole)    | `photo-1611255552402-4f772d00621b` |

Each was fetched as WebP from the Unsplash CDN and is served locally rather than hotlinked. Unsplash+ (`plus.unsplash.com/premium_photo-*`) assets are deliberately avoided because they require a paid subscription.

Visual reference: [Biotech Landing Page by Levi Wilson / QClay](https://dribbble.com/shots/22610094-Biotech-Landing-Page). The site uses original code and artwork rather than copied reference assets.

Implementation references: [Supabase with Clerk](https://supabase.com/docs/guides/auth/third-party/clerk), [Clerk Next.js setup](https://clerk.com/docs/nextjs/getting-started/quickstart), [Next.js caching](https://nextjs.org/docs/app/api-reference/functions/unstable_cache).
