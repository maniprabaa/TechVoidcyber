import { serverGet } from '@/lib/api';
import Link from 'next/link';
import { SeverityBadge } from '@/components/ArticleCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CVE Tracker',
  description: 'Tracked CVEs with severity, exploitation status, and related cybersecurity news.',
};

interface CveItem {
  _id: string;
  cveId: string;
  title?: string;
  severity?: string;
  cvssScore?: number;
  knownExploited?: boolean;
  vendor?: string;
}

export default async function CveIndexPage() {
  let items: CveItem[] = [];
  try {
    const data = await serverGet<{ items: CveItem[] }>('/cves?limit=50', 60);
    items = data.items;
  } catch {
    items = [];
  }

  return (
    <div className="container-editorial py-10 md:py-14">
      <h1 className="font-display text-4xl text-ink-900 dark:text-white">CVE Tracker</h1>
      <p className="mt-2 max-w-2xl text-ink-400">
        Vulnerability identifiers referenced across CyberIntel coverage. Patch and exploitation
        context when available from sources.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-100/70 text-xs uppercase tracking-wider text-ink-400 dark:bg-ink-900">
            <tr>
              <th className="px-4 py-3">CVE</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">CVSS</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">KEV</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3">
                  <Link href={`/cve/${c.cveId}`} className="font-medium text-accent">
                    {c.cveId}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={c.severity} />
                </td>
                <td className="px-4 py-3">{c.cvssScore ?? '—'}</td>
                <td className="px-4 py-3">{c.vendor || '—'}</td>
                <td className="px-4 py-3">{c.knownExploited ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-ink-400">
                  No CVEs indexed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
