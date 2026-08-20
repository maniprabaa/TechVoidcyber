import type { Metadata } from 'next';
import { ArticleCardView, SectionHeader } from '@/components/ArticleCard';
import type { ArticleCard } from '@/lib/api';
import { serverGet } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Latest Cybersecurity News',
  description: 'Current affairs coverage of cyber attacks, breaches, vulnerabilities, and research.',
};

const FILTERS = [
  { key: 'all', label: 'All', query: '' },
  { key: 'breaking', label: 'Breaking', query: 'breaking=true' },
  { key: 'critical', label: 'Critical', query: 'severity=critical' },
  { key: 'vulnerabilities', label: 'Vulnerabilities', query: 'category=Vulnerability' },
  { key: 'breaches', label: 'Breaches', query: 'category=Data%20Breaches' },
  { key: 'ransomware', label: 'Ransomware', query: 'category=Ransomware' },
  { key: 'malware', label: 'Malware', query: 'category=Malware' },
  { key: 'threats', label: 'Threat Actors', query: 'category=Threat%20Actors' },
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
    items = data.items;
  } catch {
    items = [];
  }

  const active =
    (typeof sp.filter === 'string' && sp.filter) ||
    (sp.breaking === 'true' ? 'breaking' : 'all');

  return (
    <div className="container-editorial py-10 md:py-14">
      <SectionHeader title="Latest Security News" eyebrow="Newsroom" />
      <div className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === 'all' ? '/news' : `/news?filter=${f.key}`}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              active === f.key
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-[var(--border)] text-ink-400 hover:border-accent/40'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2 text-xs text-ink-400">
        <span>Sort:</span>
        {[
          ['latest', 'Latest'],
          ['most_read', 'Most Read'],
          ['critical_first', 'Critical First'],
        ].map(([value, label]) => (
          <Link key={value} href={`/news?sort=${value}`} className="hover:text-accent">
            {label}
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCardView key={a._id} article={a} />
        ))}
        {!items.length && (
          <div className="panel col-span-full p-8 text-sm text-ink-400">
            No articles match this filter yet.
          </div>
        )}
      </div>
    </div>
  );
}
