'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/news', label: 'Latest' },
  { href: '/news?breaking=true', label: 'Breaking' },
  { href: '/news?filter=vulnerabilities', label: 'Vulnerabilities' },
  { href: '/news?filter=threats', label: 'Threats' },
  { href: '/news?filter=breaches', label: 'Breaches' },
  { href: '/news?filter=malware', label: 'Malware' },
  { href: '/cve', label: 'CVE' },
  { href: '/news?filter=research', label: 'Research' },
];

export function SiteHeader({ onOpenSearch }: { onOpenSearch: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : true;
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
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl">
      <div className="container-editorial flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
              CI
            </span>
            <span className="font-display text-xl tracking-tight text-ink-900 dark:text-white">
              CyberIntel
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white',
                  pathname.startsWith(item.href.split('?')[0]) && 'text-ink-900 dark:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm text-ink-400 transition hover:border-accent/40"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-ink-400 md:inline">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-[var(--border)] p-2 text-ink-400 hover:text-ink-900 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--border)] p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] lg:hidden">
          <nav className="container-editorial flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-ink-100 dark:hover:bg-ink-800"
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
