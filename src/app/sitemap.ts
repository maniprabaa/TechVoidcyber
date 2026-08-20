import type { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/cve`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/threat-actors`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${base}/malware`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  ];

  try {
    const res = await fetch(`${API_BASE_URL}/articles?limit=100`, { next: { revalidate: 300 } });
    if (!res.ok) return staticRoutes;
    const data = (await res.json()) as { items: Array<{ slug: string; updatedAt?: string }> };
    return [
      ...staticRoutes,
      ...data.items.map((a) => ({
        url: `${base}/news/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
