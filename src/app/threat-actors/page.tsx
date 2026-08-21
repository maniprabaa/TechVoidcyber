import Link from 'next/link';
import { serverGet } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Actors',
  description: 'Tracked threat actors and APT groups with attribution confidence labels.',
};

interface Actor {
  _id: string;
  name: string;
  slug: string;
  aliases?: string[];
  attributionConfidence?: string;
  targetIndustries?: string[];
}

export default async function ThreatActorsPage() {
  let items: Actor[] = [];
  try {
    const data = await serverGet<{ items: Actor[] }>('/threat-actors', 60);
    items = data.items;
  } catch {
    items = [];
  }

  return (
    <div className="pb-16 pt-6">
      <h1 className="font-display text-4xl text-ink-900 dark:text-white">Threat Actors</h1>
      <p className="mt-2 max-w-2xl text-ink-400">
        Attribution is labeled as confirmed, reported, suspected, or disputed. Speculation is not
        presented as fact.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((a) => (
          <Link key={a._id} href={`/threat-actors/${a.slug}`} className="panel p-5 hover:border-accent/40">
            <h2 className="font-display text-xl text-ink-900 dark:text-white">{a.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-wider text-ink-400">
              {a.attributionConfidence || 'reported'}
            </p>
            {!!a.aliases?.length && (
              <p className="mt-2 text-sm text-ink-400">Also known as: {a.aliases.join(', ')}</p>
            )}
          </Link>
        ))}
        {!items.length && <p className="text-sm text-ink-400">No threat actors indexed yet.</p>}
      </div>
    </div>
  );
}
