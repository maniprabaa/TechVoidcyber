'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BookMarked, Bug, FlaskConical, Home, Plus, Shield, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY = [
  { href: '/', label: 'Home', icon: Home, exact: true },
  { href: '/news', label: 'Library', icon: BookMarked },
  { href: '/cve', label: 'CVE', icon: Bug },
  { href: '/threat-actors', label: 'Threats', icon: Skull },
  { href: '/malware', label: 'Malware', icon: Shield },
  { href: '/news?filter=research', label: 'Research', icon: FlaskConical, filter: 'research' },
];

const TOPICS = [
  { href: '/news', label: 'Latest' },
  { href: '/news?filter=breaking', label: 'Breaking' },
  { href: '/news?filter=vulnerabilities', label: 'Vulnerabilities' },
  { href: '/news?filter=threats', label: 'Threats' },
  { href: '/news?filter=breaches', label: 'Breaches' },
  { href: '/news?filter=malware', label: 'Malware' },
  { href: '/news?filter=cve', label: 'CVE' },
  { href: '/news?filter=research', label: 'Research' },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  return (
    <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-[200px] shrink-0 flex-col overflow-hidden py-8 pr-4 lg:flex xl:w-[230px]">
      <nav className="flex flex-col gap-0.5">
        {PRIMARY.map((item) => {
          const Icon = item.icon;
          const pathOnly = item.href.split('?')[0];
          let active = false;
          if (item.exact) {
            active = pathname === item.href;
          } else if ('filter' in item && item.filter) {
            active = pathname.startsWith('/news') && filter === item.filter;
          } else if (pathOnly === '/news') {
            active = pathname.startsWith('/news') && !filter;
          } else {
            active = pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-full px-3 py-2.5 text-[14px] transition',
                active
                  ? 'font-semibold text-ink-900 dark:text-white'
                  : 'text-ink-500 hover:text-ink-900 dark:hover:text-white'
              )}
            >
              <Icon className={cn('h-[22px] w-[22px]', active && 'stroke-[2.25]')} strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="my-5 border-t border-[var(--border)]" />

      <div className="px-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-ink-900 dark:text-white">Following</p>
          <button
            type="button"
            className="rounded-full p-1 text-ink-400 hover:bg-ink-50 hover:text-ink-900 dark:hover:bg-ink-800"
            aria-label="Follow topics"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[13px] leading-5 text-ink-400">
          Find topics and threat categories to follow
        </p>
        <div className="mt-4 space-y-1">
          {TOPICS.map((topic) => (
            <Link
              key={topic.href}
              href={topic.href}
              className="block rounded-md py-1.5 text-[13px] text-ink-500 transition hover:text-ink-900 dark:hover:text-white"
            >
              {topic.label}
            </Link>
          ))}
        </div>
        <Link
          href="/news"
          className="mt-3 inline-block text-[13px] text-accent hover:underline"
        >
          See suggestions
        </Link>
      </div>

      <div className="mt-auto px-3 pt-10 text-[12px] text-ink-400">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/news" className="hover:text-ink-900 dark:hover:text-white">
            Help
          </Link>
          <Link href="/rss.xml" className="hover:text-ink-900 dark:hover:text-white">
            RSS
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </aside>
  );
}
