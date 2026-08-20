import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--border)]">
      <div className="container-editorial grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-ink-900 dark:text-white">CyberIntel</p>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            Know what happened in cybersecurity today. Source-driven intelligence, AI-assisted
            reporting, editorially reviewed.
          </p>
        </div>
        <div className="text-sm text-ink-400">
          <p className="mb-2 font-medium text-ink-900 dark:text-white">Sections</p>
          <div className="flex flex-col gap-1">
            <Link href="/news">Latest news</Link>
            <Link href="/cve">CVE tracker</Link>
            <Link href="/threat-actors">Threat actors</Link>
            <Link href="/malware">Malware</Link>
          </div>
        </div>
        <div className="text-sm text-ink-400">
          <p className="mb-2 font-medium text-ink-900 dark:text-white">Feeds</p>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/rss.xml`}>RSS</a>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} CyberIntel. Accuracy over SEO.</p>
        </div>
      </div>
    </footer>
  );
}
