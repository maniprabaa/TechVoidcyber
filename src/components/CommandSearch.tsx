'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { TextDots } from '@/components/loading-ui/text-dots';

interface SearchResult {
  articles: Array<{ _id: string; title: string; slug: string; category: string }>;
  cves: Array<{ _id: string; cveId: string }>;
  threatActors: Array<{ _id: string; name: string; slug: string }>;
  malware: Array<{ _id: string; name: string; slug: string }>;
}

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResult | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
        else document.dispatchEvent(new CustomEvent('open-search'));
      }
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(async () => {
      if (!q.trim()) {
        setData(null);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get<SearchResult>(`/search?q=${encodeURIComponent(q.trim())}`);
        setData(res);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [q, open]);

  const empty = useMemo(() => {
    if (!data) return true;
    return (
      !data.articles.length &&
      !data.cves.length &&
      !data.threatActors.length &&
      !data.malware.length
    );
  }, [data]);

  if (!open) return null;

  function go(path: string) {
    onClose();
    setQ('');
    router.push(path);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm">
      <div className="panel w-full max-w-2xl overflow-hidden shadow-panel animate-fadeUp">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, CVEs, threat actors, malware…"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X className="h-4 w-4 text-ink-400" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading && (
            <p className="px-3 py-4 text-sm text-ink-400">
              <TextDots>Searching</TextDots>
            </p>
          )}
          {!loading && q && empty && (
            <p className="px-3 py-4 text-sm text-ink-400">No cybersecurity results found.</p>
          )}
          {data?.articles.map((a) => (
            <button
              key={a._id}
              type="button"
              onClick={() => go(`/news/${a.slug}`)}
              className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <span className="text-sm font-medium">{a.title}</span>
              <span className="text-xs text-ink-400">{a.category}</span>
            </button>
          ))}
          {data?.cves.map((c) => (
            <button
              key={c._id}
              type="button"
              onClick={() => go(`/cve/${c.cveId}`)}
              className="flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              {c.cveId}
            </button>
          ))}
          {data?.threatActors.map((t) => (
            <button
              key={t._id}
              type="button"
              onClick={() => go(`/threat-actors/${t.slug}`)}
              className="flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              Threat actor · {t.name}
            </button>
          ))}
          {data?.malware.map((m) => (
            <button
              key={m._id}
              type="button"
              onClick={() => go(`/malware/${m.slug}`)}
              className="flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              Malware · {m.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
