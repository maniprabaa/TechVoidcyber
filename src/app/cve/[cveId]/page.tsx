import { notFound } from 'next/navigation';
import { serverGet } from '@/lib/api';
import type { ArticleCard } from '@/lib/api';
import { MediumArticleRow, SeverityBadge } from '@/components/ArticleCard';
import { exactDate } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';

interface CveDetail {
  cveId: string;
  title?: string;
  description?: string;
  severity?: string;
  cvssScore?: number;
  affectedProducts?: string[];
  vendor?: string;
  publishedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  knownExploited?: boolean;
  patchAvailable?: boolean;
  exploitAvailable?: boolean;
  mitigation?: string;
}

function normalizeDetail(raw: Record<string, unknown>): CveDetail {
  return {
    cveId: String(raw.cveId || raw.cve_id || ''),
    title: typeof raw.title === 'string' ? raw.title : undefined,
    description: typeof raw.description === 'string' ? raw.description : undefined,
    severity: typeof raw.severity === 'string' ? raw.severity : undefined,
    cvssScore:
      typeof raw.cvssScore === 'number'
        ? raw.cvssScore
        : typeof raw.cvss_score === 'number'
          ? raw.cvss_score
          : undefined,
    affectedProducts: Array.isArray(raw.affectedProducts)
      ? (raw.affectedProducts as string[])
      : undefined,
    vendor: typeof raw.vendor === 'string' ? raw.vendor : undefined,
    publishedDate: typeof raw.publishedDate === 'string' ? raw.publishedDate : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : undefined,
    knownExploited: Boolean(raw.knownExploited ?? raw.known_exploited),
    patchAvailable: Boolean(raw.patchAvailable ?? raw.patch_available),
    exploitAvailable: Boolean(raw.exploitAvailable ?? raw.exploit_available),
    mitigation: typeof raw.mitigation === 'string' ? raw.mitigation : undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cveId: string }>;
}): Promise<Metadata> {
  const { cveId } = await params;
  return { title: cveId.toUpperCase(), description: `Cybersecurity coverage for ${cveId}` };
}

export default async function CvePage({ params }: { params: Promise<{ cveId: string }> }) {
  const { cveId } = await params;
  let cve: CveDetail | null = null;
  let related: ArticleCard[] = [];
  try {
    const payload = await serverGet<{ cve?: Record<string, unknown>; related?: ArticleCard[] }>(
      `/cves/${cveId}`,
      60
    );
    if (payload?.cve) {
      cve = normalizeDetail(payload.cve);
      related = payload.related ?? [];
    }
  } catch {
    cve = null;
  }
  if (!cve?.cveId) notFound();

  const published = cve.publishedDate || cve.updatedAt || cve.createdAt;
  const summary = cve.description?.trim() || cve.mitigation?.trim() || 'No description yet.';

  return (
    <div className="pb-16 pt-6">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={cve.severity} />
          {cve.knownExploited && (
            <span className="rounded border border-critical/30 bg-critical/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-critical">
              Known exploited
            </span>
          )}
          <Link href="/news?filter=cve" className="text-xs text-accent hover:underline">
            All CVE news
          </Link>
        </div>
        <h1 className="font-display text-4xl text-ink-900 dark:text-white">{cve.cveId}</h1>
        {cve.title && cve.title !== cve.cveId ? (
          <p className="mt-2 text-lg text-ink-500">{cve.title}</p>
        ) : null}
        <p className="mt-3 text-ink-400">{summary}</p>
        <dl className="mt-8 grid gap-4 rounded-xl border border-[var(--border)] p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-400">CVSS</dt>
            <dd className="mt-1 text-lg">{cve.cvssScore ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-400">Vendor</dt>
            <dd className="mt-1">{cve.vendor || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-400">Published</dt>
            <dd className="mt-1">{exactDate(published) || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-ink-400">Patch</dt>
            <dd className="mt-1">{cve.patchAvailable ? 'Available' : 'Unknown / not confirmed'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-ink-400">Affected products</dt>
            <dd className="mt-1">{(cve.affectedProducts || []).join(', ') || '—'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-wider text-ink-400">Mitigation</dt>
            <dd className="mt-1 text-sm">{cve.mitigation || 'See related advisories.'}</dd>
          </div>
        </dl>
      </div>
      <section className="mt-12">
        <h2 className="mb-2 font-display text-2xl text-ink-900 dark:text-white">Related News</h2>
        <div>
          {related.map((a) => (
            <MediumArticleRow key={a._id} article={a} />
          ))}
          {!related.length && <p className="py-8 text-sm text-ink-400">No related articles yet.</p>}
        </div>
      </section>
    </div>
  );
}
