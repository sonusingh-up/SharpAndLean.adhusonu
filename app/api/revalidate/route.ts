import { timingSafeEqual } from 'node:crypto';
import { refreshContent } from '@/lib/revalidate';
export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  const actual = request.headers.get('x-revalidate-secret') || '';
  if (
    !expected ||
    Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  )
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  refreshContent();
  return Response.json({ revalidated: true });
}
