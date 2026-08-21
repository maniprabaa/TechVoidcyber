import type { ArticleCard } from '@/lib/api';
import { serverGet } from '@/lib/api';
import { MediumArticleRow } from '@/components/ArticleCard';
import { CategoryNav } from '@/components/CategoryNav';
import { Suspense } from 'react';

export const revalidate = 60;

interface HomePayload {
  breaking: ArticleCard[];
  topStories: ArticleCard[];
  latest: ArticleCard[];
  critical: ArticleCard[];
  breaches: ArticleCard[];
  malware: ArticleCard[];
  research: ArticleCard[];
  threatIntel: ArticleCard[];
}

async function loadHome(): Promise<HomePayload | null> {
  try {
    return await serverGet<HomePayload>('/home', 60);
  } catch {
    return null;
  }
}

function dedupeArticles(...lists: ArticleCard[][]) {
  const seen = new Set<string>();
  const out: ArticleCard[] = [];
  for (const list of lists) {
    for (const item of list) {
      if (!item?._id || seen.has(item._id)) continue;
      seen.add(item._id);
      out.push(item);
    }
  }
  return out;
}

export default async function HomePage() {
  const data = await loadHome();
  const apiDown = !data;
  const feed = dedupeArticles(
    data?.breaking ?? [],
    data?.topStories ?? [],
    data?.latest ?? [],
    data?.critical ?? [],
    data?.threatIntel ?? [],
    data?.breaches ?? [],
    data?.malware ?? [],
    data?.research ?? []
  );

  return (
    <div className="pb-16 pt-2">
      <Suspense fallback={<div className="h-12 border-b border-[var(--border)]" />}>
        <CategoryNav activeKey="latest" />
      </Suspense>

      <div>
        {feed.slice(0, 12).map((article) => (
          <MediumArticleRow key={article._id} article={article} />
        ))}
        {!feed.length && (
          <div className="py-16 text-center text-sm text-ink-400">
            {apiDown
              ? 'Could not reach the API. Check NEXT_PUBLIC_API_URL and that the backend is running.'
              : 'No published articles yet. Seed sources and run discovery.'}
          </div>
        )}
      </div>
    </div>
  );
}
