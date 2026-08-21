'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { TextDots } from '@/components/loading-ui/text-dots';

function isInternalNavLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    const next = `${url.pathname}${url.search}`;
    const current = `${window.location.pathname}${window.location.search}`;
    return next !== current;
  } catch {
    return false;
  }
}

export function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const lastRoute = useRef(routeKey);

  useEffect(() => {
    if (lastRoute.current !== routeKey) {
      lastRoute.current = routeKey;
      setVisible(false);
    }
  }, [routeKey]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || !isInternalNavLink(anchor)) return;

      setVisible((already) => (already ? already : true));
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-[var(--background)]/70 backdrop-blur-[2px]">
      <TextDots className="text-xl font-medium text-ink-900 dark:text-white">Loading</TextDots>
    </div>
  );
}
