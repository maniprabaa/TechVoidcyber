'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { CommandSearch } from './CommandSearch';
import { LeftSidebar } from './LeftSidebar';
import { PageTransitionLoader } from './PageTransitionLoader';

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function open() {
      setSearchOpen(true);
    }
    document.addEventListener('open-search', open);
    return () => document.removeEventListener('open-search', open);
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Suspense fallback={null}>
        <PageTransitionLoader />
      </Suspense>
      <div className="mx-auto flex w-full max-w-[1400px] px-4 sm:px-6">
        <Suspense fallback={<aside className="hidden w-[200px] shrink-0 lg:block xl:w-[230px]" />}>
          <LeftSidebar />
        </Suspense>
        <main className="min-w-0 flex-1 py-2 lg:pl-8 lg:pr-2">{children}</main>
      </div>
    </div>
  );
}
