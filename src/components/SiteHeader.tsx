'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { CATEGORY_NAV } from './CategoryNav';

const MOBILE_NAV = [
  { href: '/', label: 'Home' },
  ...CATEGORY_NAV.map((item) => ({ href: item.href, label: item.label })),
];

export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : false;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex h-[57px] w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0 font-display text-[22px] font-bold tracking-tight text-ink-900 dark:text-white">
          CyberIntel
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f2f2f2] px-4 py-2.5 text-sm text-ink-400 transition hover:bg-[#ebebeb] dark:bg-ink-800 dark:hover:bg-ink-700 sm:flex sm:max-w-[240px]"
          aria-label="Search"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search</span>
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="rounded-full p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800 sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/news"
            className="hidden rounded-full bg-ink-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100 sm:inline-flex"
          >
            Read latest
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-ink-500 hover:bg-ink-50 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/admin"
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
            aria-label="Profile"
          >
            CI
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-ink-500 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm',
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]))
                    ? 'bg-ink-50 font-semibold text-ink-900 dark:bg-ink-800 dark:text-white'
                    : 'text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
