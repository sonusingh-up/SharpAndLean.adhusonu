# Affiliate recommendation links

## Setup

Apply `supabase/migrations/003_affiliate_redirects.sql` to the existing Supabase
project after migrations 001 and 002, using the project's SQL editor or the
normal migration workflow. It creates a new table; it does not change articles.
Clerk sign-in and approved-editor membership use the existing admin setup.
Set `NEXT_PUBLIC_SITE_URL=https://sharpandlean.com` in production so copied URLs
use the production domain. Local development can use `http://localhost:3000`.

## Content stays in files

Configuring Supabase does not move the site onto the database. Product
pages are assembled from `lib/articles/*.ts`, and `getReviews()` returns
database rows as-is, so pointing content at an unpopulated `reviews` table
would publish an empty catalogue. `contentFromSupabase` therefore requires
an explicit `CONTENT_SOURCE=supabase`, which is separate from `hasSupabase`.
Leave `CONTENT_SOURCE` unset until the reviews table is seeded; the admin
CMS and these redirects only need `hasSupabase` and work either way.

One consequence: with content in files, the CMS's review and list sections
read the database, so they will look empty while the public site shows the
file-based articles. The affiliate links section is unaffected — it reads
and writes `affiliate_redirects`, which is exactly what `/recommended`
serves.

## Use

Open `/admin/affiliate-links`. Enter a product name, a unique slug and the full
HTTPS affiliate URL (including its tracking parameters). Save, then copy the
generated `/recommended/{slug}` URL. Use Edit to change the destination or
disable the link. The slug cannot be renamed after creation; existing shared
URLs therefore keep their identity. There is no destructive delete control.

The destination must be an external domain, not this site's domain, localhost,
an IP literal or a credentials-bearing URL. Only approved editors can write.
Visitors cannot supply redirect destinations via query parameters. Destinations
are validated again at redirect time and are not fetched by the server.

Active links return a non-cached 302 redirect. Missing/disabled links return 404;
database/configuration failures return 503. Recommendation routes are not added
to the sitemap and send `X-Robots-Tag: noindex, nofollow`. No click tracking or
visitor data collection is added. Existing article buy links are unchanged.

Keep affiliate disclosure near links, use `rel="sponsored nofollow"`, and verify
that the relevant affiliate program permits redirected links before using them.

## Verification

Run `npm run test:unit`, `npm run typecheck`, and `npm run build`.
After applying the migration, create a link as an editor and check its response
without following it: `curl -I http://localhost:3000/recommended/your-slug`.
Confirm Location preserves the full affiliate URL; edit it and confirm the new
destination, then disable it and confirm a 404. Never use a real purchase as a test.
