'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiteHeader } from './SiteHeader';
import { CommandSearch } from './CommandSearch';
import { SiteFooter } from './SiteFooter';

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
    <div className="min-h-screen">
      <SiteHeader onOpenSearch={() => setSearchOpen(true)} />
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
