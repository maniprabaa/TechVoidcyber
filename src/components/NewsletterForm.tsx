'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus('ok');
      setMessage('Subscribed to the Cybersecurity Brief.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Subscription failed');
    }
  }

  if (compact) {
    return (
      <section>
        <h2 className="text-[16px] font-semibold text-ink-900 dark:text-white">
          Cybersecurity Brief
        </h2>
        <p className="mt-2 text-[13px] leading-5 text-ink-400">
          A curated digest of attacks, vulnerabilities, and research — no generic tech noise.
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-10 w-full rounded-full border border-[var(--border)] bg-transparent px-4 text-sm outline-none focus:border-ink-900 dark:focus:border-white"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-10 w-full rounded-full bg-ink-900 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-60 dark:bg-white dark:text-ink-900"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {message && (
            <p className={cn('text-xs', status === 'error' ? 'text-critical' : 'text-ink-400')}>
              {message}
            </p>
          )}
        </form>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Newsletter
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink-900 dark:text-white">
            Subscribe to the Cybersecurity Brief
          </h2>
          <p className="mt-2 text-sm text-ink-400">
            A curated digest of attacks, vulnerabilities, breaches, and research — no generic tech
            noise.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col justify-center gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-11 rounded-full border border-[var(--border)] bg-transparent px-4 text-sm outline-none focus:border-ink-900 dark:focus:border-white"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-11 rounded-full bg-ink-900 px-4 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-60 dark:bg-white dark:text-ink-900"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          </button>
          {message && (
            <p className={`text-xs ${status === 'error' ? 'text-critical' : 'text-ink-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
