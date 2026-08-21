import { serverGet } from '@/lib/api';
import Link from 'next/link';
import { SeverityBadge } from '@/components/ArticleCard';
import { CategoryNav } from '@/components/CategoryNav';
import { exactDate, relativeTime } from '@/lib/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'CVE Tracker',
  description: 'Tracked CVEs with severity, exploitation status, and related cybersecurity news.',
};

interface CveItem {
  _id: string;
  cveId: string;
  title?: string;
  description?: string;
  severity?: string;
  cvssScore?: number;
  knownExploited?: boolean;
  vendor?: string;
  mitigation?: string;
  affectedProducts?: string[];
  createdAt?: string;
  updatedAt?: string;
  publishedDate?: string;
}

function normalizeCve(raw: Record<string, unknown>): CveItem | null {
  const cveId = String(raw.cveId || raw.cve_id || raw.id || '').trim();
  if (!cveId) return null;
  return {
    _id: String(raw._id || cveId),
    cveId,
    title: typeof raw.title === 'string' ? raw.title : undefined,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    severity: typeof raw.severity === 'string' ? raw.severity : undefined,
    cvssScore:
      typeof raw.cvssScore === 'number'
        ? raw.cvssScore
        : typeof raw.cvss_score === 'number'
          ? raw.cvss_score
          : undefined,
    knownExploited: Boolean(raw.knownExploited ?? raw.known_exploited),
    vendor: typeof raw.vendor === 'string' ? raw.vendor : undefined,
    mitigation: typeof raw.mitigation === 'string' ? raw.mitigation : undefined,
    affectedProducts: Array.isArray(raw.affectedProducts)
      ? (raw.affectedProducts as string[])
      : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
    publishedDate: typeof raw.publishedDate === 'string' ? raw.publishedDate : undefined,
  };
}

export default async function CveIndexPage() {
  let items: CveItem[] = [];
  try {
    const data = await serverGet<{ items?: Record<string, unknown>[] } | Record<string, unknown>[]>(
      '/cves?limit=50',
      60
    );
    const rawItems = Array.isArray(data) ? data : data.items ?? [];
    items = rawItems.map(normalizeCve).filter((c): c is CveItem => Boolean(c));
  } catch {
    items = [];
  }

  return (
    <div className="pb-16 pt-2">
      <Suspense fallback={<div className="h-12 border-b border-[var(--border)]" />}>
        <CategoryNav activeKey="cve" />
      </Suspense>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink-900 dark:text-white">CVE Tracker</h1>
          <p className="mt-1 text-sm text-ink-400">
            Indexed vulnerabilities with severity, CVSS, and vendor context.
          </p>
        </div>
        <Link href="/news?filter=cve" className="text-sm text-accent hover:underline">
          View CVE news
        </Link>
      </div>

      <div className="mt-4">
        {items.map((c) => {
          const summary =
            c.description?.trim() ||
            c.mitigation?.trim() ||
            (c.affectedProducts?.length
              ? `Affects ${c.affectedProducts.slice(0, 3).join(', ')}`
              : '');
          const when = c.publishedDate || c.updatedAt || c.createdAt;
          return (
            <article key={c._id} className="border-b border-[var(--border)] py-7">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
                <span className="font-medium text-ink-800 dark:text-ink-200">
                  {c.vendor || 'Unknown vendor'}
                </span>
                {when ? (
                  <>
                    <span className="text-ink-300">·</span>
                    <time title={exactDate(when)}>{relativeTime(when)}</time>
                  </>
                ) : null}
                <SeverityBadge severity={c.severity} />
                {typeof c.cvssScore === 'number' ? (
                  <span className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[11px]">
                    CVSS {c.cvssScore}
                  </span>
                ) : null}
                {c.knownExploited ? (
                  <span className="rounded border border-critical/30 bg-critical/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-critical">
                    KEV
                  </span>
                ) : null}
              </div>
              <h2 className="font-display text-[22px] font-bold leading-snug text-ink-900 dark:text-white">
                <Link href={`/cve/${c.cveId}`} className="hover:underline">
                  {c.cveId}
                  {c.title && c.title !== c.cveId ? ` — ${c.title}` : ''}
                </Link>
              </h2>
              {summary ? (
                <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-ink-500 dark:text-ink-300">
                  {summary}
                </p>
              ) : null}
            </article>
          );
        })}
        {!items.length && (
          <div className="py-16 text-center text-sm text-ink-400">No CVEs indexed yet.</div>
        )}
      </div>
    </div>
  );
}
