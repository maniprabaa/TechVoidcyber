'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export const CATEGORY_NAV = [
  { key: 'latest', label: 'Latest', href: '/news' },
  { key: 'breaking', label: 'Breaking', href: '/news?filter=breaking' },
  { key: 'vulnerabilities', label: 'Vulnerabilities', href: '/news?filter=vulnerabilities' },
  { key: 'threats', label: 'Threats', href: '/news?filter=threats' },
  { key: 'breaches', label: 'Breaches', href: '/news?filter=breaches' },
  { key: 'malware', label: 'Malware', href: '/news?filter=malware' },
  { key: 'cve', label: 'CVE', href: '/news?filter=cve' },
  { key: 'research', label: 'Research', href: '/news?filter=research' },
] as const;

export function CategoryNav({ activeKey }: { activeKey?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const resolved =
    activeKey ||
    (() => {
      if (pathname.startsWith('/cve')) return 'cve';
      if (pathname.startsWith('/threat-actors')) return 'threats';
      if (pathname.startsWith('/malware') && !pathname.startsWith('/news')) return 'malware';
      if (pathname === '/') return 'latest';
      if (pathname.startsWith('/news')) {
        const filter = searchParams.get('filter');
        if (filter === 'breaking' || searchParams.get('breaking') === 'true') return 'breaking';
        if (filter) return filter;
        return 'latest';
      }
      return '';
    })();

  return (
    <nav className="border-b border-[var(--border)]">
      <ul className="-mb-px flex gap-1 overflow-x-auto no-scrollbar sm:gap-2">
        {CATEGORY_NAV.map((item) => {
          const isActive = resolved === item.key;
          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={item.href}
                className={cn(
                  'relative inline-flex items-center rounded-md px-3 py-3 text-[14px] transition',
                  isActive
                    ? 'bg-ink-50 font-medium text-ink-900 dark:bg-ink-800 dark:text-white'
                    : 'text-ink-500 hover:text-ink-900 dark:hover:text-white'
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-ink-900 dark:bg-white" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
