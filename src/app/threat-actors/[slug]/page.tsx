import { notFound } from 'next/navigation';
import { serverGet } from '@/lib/api';
import type { ArticleCard } from '@/lib/api';
import { ArticleCardView } from '@/components/ArticleCard';

interface Actor {
  name: string;
  slug: string;
  aliases?: string[];
  description?: string;
  knownCampaigns?: string[];
  malware?: string[];
  targetIndustries?: string[];
  targetRegions?: string[];
  attributionConfidence?: string;
}

export default async function ThreatActorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let payload: { actor: Actor; related: ArticleCard[] } | null = null;
  try {
    payload = await serverGet(`/threat-actors/${slug}`, 60);
  } catch {
    payload = null;
  }
  if (!payload) notFound();
  const { actor, related } = payload;

  return (
    <div className="pb-16 pt-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Attribution: {actor.attributionConfidence || 'reported'}
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink-900 dark:text-white">{actor.name}</h1>
        {!!actor.aliases?.length && (
          <p className="mt-2 text-sm text-ink-400">Aliases: {actor.aliases.join(', ')}</p>
        )}
        <p className="mt-5 text-ink-300">{actor.description || 'Profile assembled from related reporting.'}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-wider text-ink-400">Known campaigns</p>
            <p className="mt-2 text-sm">{(actor.knownCampaigns || []).join(', ') || '—'}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-wider text-ink-400">Malware</p>
            <p className="mt-2 text-sm">{(actor.malware || []).join(', ') || '—'}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-wider text-ink-400">Target industries</p>
            <p className="mt-2 text-sm">{(actor.targetIndustries || []).join(', ') || '—'}</p>
          </div>
          <div className="panel p-4">
            <p className="text-xs uppercase tracking-wider text-ink-400">Target regions</p>
            <p className="mt-2 text-sm">{(actor.targetRegions || []).join(', ') || '—'}</p>
          </div>
        </div>
      </div>
      <section className="mx-auto mt-12 max-w-5xl">
        <h2 className="mb-4 font-display text-2xl">Related Articles</h2>
        <div className="grid items-stretch gap-4 md:grid-cols-3">
          {related.map((a) => (
            <ArticleCardView key={a._id} article={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
