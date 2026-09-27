import { getCollections, getReviews } from '@/lib/data';
import { guides } from '@/lib/guides';
import { recentDigestItems, weeklyDigest } from '@/lib/email/digest';
import { newsletterEmail } from '@/lib/email/server';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const expected = secret ? Buffer.from(`Bearer ${secret}`) : Buffer.alloc(0);
  const actual = Buffer.from(request.headers.get('authorization') || '');
  if (!secret || actual.length !== expected.length || !timingSafeEqual(actual, expected))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const now = new Date();
    const [articles, reviews] = await Promise.all([getCollections('articles'), getReviews()]);
    const digest = weeklyDigest(now, recentDigestItems(now, articles, reviews, guides));
    if (!digest) return Response.json({ status: 'skipped', reason: 'no new content' });
    const email = newsletterEmail();
    const sent = await email.client.sendWeeklyDigest({ ...digest, from: email.from, segmentId: email.segment });
    return Response.json({ status: sent ? 'sent' : 'skipped', reason: sent ? undefined : 'already sent this week' });
  } catch {
    return Response.json({ error: 'Digest could not be sent.' }, { status: 503 });
  }
}
import { timingSafeEqual } from 'node:crypto';
