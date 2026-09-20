import { searchSite } from '@/lib/search';

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get('q') || '';
  try {
    return Response.json(
      { hits: await searchSite(term) },
      { headers: { 'Cache-Control': 'public, max-age=60' } },
    );
  } catch {
    return Response.json({ error: 'Search is unavailable.' }, { status: 503 });
  }
}
