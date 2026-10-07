import { rssResponse } from '@/lib/rss-response';

export const revalidate = 3600;

export function GET() {
  return rssResponse('supplements');
}
