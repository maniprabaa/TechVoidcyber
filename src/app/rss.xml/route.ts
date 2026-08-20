import { API_BASE_URL } from '@/lib/api';

export async function GET() {
  const res = await fetch(`${API_BASE_URL}/rss.xml`, { next: { revalidate: 300 } });
  const xml = await res.text();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
