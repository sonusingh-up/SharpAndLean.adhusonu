import { rssResponse } from '@/lib/rss-response';

export const revalidate = 600;

export function GET() {
  return rssResponse('fitness');
}
