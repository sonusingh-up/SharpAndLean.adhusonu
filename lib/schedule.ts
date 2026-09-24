/**
 * Timed publishing.
 *
 * Every piece of content can carry a publish time. Until that time passes it
 * does not exist as far as a reader can tell: its page is a 404, and it is left
 * out of every list, the sitemap, search, llms.txt and related links. Content
 * can therefore be merged days ahead and go live on its own.
 *
 * Nothing here runs on a timer. Pages already regenerate hourly, so a scheduled
 * piece appears within an hour of its time regardless. The GitHub Actions
 * workflow in .github/workflows/publish-slots.yml calls /api/revalidate at each
 * slot so it appears within minutes instead. If that workflow ever fails, the
 * hourly regeneration is the fallback and nothing publishes early.
 */

/** India Standard Time. Change this and the workflow's cron lines together. */
export const PUBLISH_UTC_OFFSET = '+05:30';

/** Four slots a day, in the offset above. The workflow fires at each one. */
export const PUBLISH_SLOTS = ['09:00', '13:00', '17:00', '21:00'] as const;

/**
 * The publish time for a slot on a date, e.g. slot('2026-09-25', 2) for
 * 13:00 IST on 25 September. Prefer this to writing timestamps by hand: a
 * missing offset silently shifts a piece by five and a half hours.
 */
export function slot(date: string, n: 1 | 2 | 3 | 4): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`slot(): expected YYYY-MM-DD, got "${date}"`);
  return `${date}T${PUBLISH_SLOTS[n - 1]}:00${PUBLISH_UTC_OFFSET}`;
}

/**
 * Whether content with this publish time is visible now.
 *
 * No time at all means live, which is right for everything written before
 * scheduling existed. A time that cannot be parsed means not live: a typo
 * should hide a page, never publish it early.
 */
export function isLive(published: string | null | undefined, now: number = Date.now()): boolean {
  if (!published) return true;
  const at = Date.parse(published);
  return Number.isFinite(at) && at <= now;
}
