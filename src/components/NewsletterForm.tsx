'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';

export function NewsletterForm() {
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

  return (
    <section className="panel overflow-hidden">
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
            className="h-11 rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-11 rounded-lg bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent-deep disabled:opacity-60"
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
