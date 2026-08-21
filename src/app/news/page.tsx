import type { Metadata } from 'next';
import { MediumArticleRow } from '@/components/ArticleCard';
import { CategoryNav } from '@/components/CategoryNav';
import type { ArticleCard } from '@/lib/api';
import { serverGet } from '@/lib/api';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Latest Cybersecurity News',
  description: 'Current affairs coverage of cyber attacks, breaches, vulnerabilities, and research.',
};

const FILTERS = [
  { key: 'latest', label: 'Latest', query: '' },
  { key: 'breaking', label: 'Breaking', query: 'breaking=true' },
  { key: 'vulnerabilities', label: 'Vulnerabilities', query: 'category=Vulnerability' },
  { key: 'threats', label: 'Threats', query: 'category=Threat%20Actors' },
  { key: 'breaches', label: 'Breaches', query: 'category=Data%20Breaches' },
  { key: 'malware', label: 'Malware', query: 'category=Malware' },
  { key: 'cve', label: 'CVE', query: 'category=CVE' },
  { key: 'research', label: 'Research', query: 'category=Security%20Research' },
];

function resolveQuery(sp: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  params.set('limit', '24');
  if (sp.breaking === 'true') params.set('breaking', 'true');
  if (typeof sp.severity === 'string') params.set('severity', sp.severity);
  if (typeof sp.category === 'string') params.set('category', sp.category);
  if (typeof sp.sort === 'string') params.set('sort', sp.sort);
  if (typeof sp.filter === 'string') {
    const match = FILTERS.find((f) => f.key === sp.filter);
    if (match?.query) {
      match.query.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        if (k && v) params.set(k, decodeURIComponent(v));
      });
    }
  }
  return params.toString();
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const qs = resolveQuery(sp);
  let items: ArticleCard[] = [];
  try {
    const data = await serverGet<{ items: ArticleCard[] }>(`/articles?${qs}`, 30);
    items = data.items ?? [];
  } catch {
    items = [];
  }

  const active =
    (typeof sp.filter === 'string' && sp.filter) ||
    (sp.breaking === 'true' ? 'breaking' : 'latest');

  return (
    <div className="pb-16 pt-2">
      <Suspense fallback={<div className="h-12 border-b border-[var(--border)]" />}>
        <CategoryNav activeKey={active} />
      </Suspense>

      <div>
        {items.map((a) => (
          <MediumArticleRow key={a._id} article={a} />
        ))}
        {!items.length && (
          <div className="py-16 text-center text-sm text-ink-400">
            No articles match this filter yet.
          </div>
        )}
      </div>
    </div>
  );
}
