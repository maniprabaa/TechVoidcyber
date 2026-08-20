import { notFound } from 'next/navigation';
import { serverGet } from '@/lib/api';
import type { ArticleCard } from '@/lib/api';
import { ArticleCardView, SeverityBadge } from '@/components/ArticleCard';
import { exactDate } from '@/lib/utils';
import type { Metadata } from 'next';

interface CveDetail {
  cveId: string;
  title?: string;
  description?: string;
  severity?: string;
  cvssScore?: number;
  affectedProducts?: string[];
  vendor?: string;
  publishedDate?: string;
  knownExploited?: boolean;
  patchAvailable?: boolean;
  exploitAvailable?: boolean;
  mitigation?: string;
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
  let payload: { cve: CveDetail; related: ArticleCard[] } | null = null;
  try {
    payload = await serverGet(`/cves/${cveId}`, 60);
  } catch {
    payload = null;
  }
  if (!payload) notFound();
  const { cve, related } = payload;

  return (
    <div className="container-editorial py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <SeverityBadge severity={cve.severity} />
          {cve.knownExploited && (
            <span className="rounded border border-critical/30 bg-critical/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-critical">
              Known exploited
            </span>
          )}
        </div>
        <h1 className="font-display text-4xl text-ink-900 dark:text-white">{cve.cveId}</h1>
        <p className="mt-3 text-ink-400">{cve.description || cve.title || 'No description yet.'}</p>
        <dl className="panel mt-8 grid gap-4 p-5 sm:grid-cols-2">
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
            <dd className="mt-1">{exactDate(cve.publishedDate) || '—'}</dd>
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
      <section className="mx-auto mt-12 max-w-5xl">
        <h2 className="mb-4 font-display text-2xl">Related News</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((a) => (
            <ArticleCardView key={a._id} article={a} />
          ))}
          {!related.length && <p className="text-sm text-ink-400">No related articles yet.</p>}
        </div>
      </section>
    </div>
  );
}
