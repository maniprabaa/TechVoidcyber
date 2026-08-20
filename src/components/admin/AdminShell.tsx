'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Bot,
  FileText,
  LayoutDashboard,
  Newspaper,
  Radio,
  Settings,
  Shield,
  Bug,
  Skull,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/stories', label: 'Stories', icon: Newspaper },
  { href: '/admin/generation', label: 'AI Generation', icon: Bot },
  { href: '/admin/sources', label: 'RSS Sources', icon: Radio },
  { href: '/admin/cves', label: 'CVEs', icon: Shield },
  { href: '/admin/threat-actors', label: 'Threat Actors', icon: Skull },
  { href: '/admin/malware', label: 'Malware', icon: Bug },
  { href: '/admin/analytics', label: 'Analytics', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem('token');
    router.push('/admin/login');
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100 md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-ink-800 md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/admin" className="font-display text-lg text-white">
            CyberIntel Admin
          </Link>
          <button type="button" onClick={logout} className="rounded p-2 text-ink-400 hover:text-white" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-ink-800 hover:text-white',
                  active && 'bg-ink-800 text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
}
