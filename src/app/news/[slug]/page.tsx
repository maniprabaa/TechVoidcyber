import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ArticleDetail, ArticleCard } from '@/lib/api';
import { serverGet } from '@/lib/api';
import { ArticleCardView, BreakingBadge, SeverityBadge } from '@/components/ArticleCard';
import { exactDate, isDisplayableArticleImage, relativeTime } from '@/lib/utils';
import Link from 'next/link';

export const revalidate = 60;

async function loadArticle(slug: string) {
  try {
    return await serverGet<{ article: ArticleDetail; related: ArticleCard[] }>(
      `/articles/${slug}`,
      60
    );
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadArticle(slug);
  if (!data) return { title: 'Article' };
  const a = data.article;
  return {
    title: a.seoTitle || a.title,
    description: a.seoDescription || a.excerpt,
    openGraph: {
      title: a.seoTitle || a.title,
      description: a.seoDescription || a.excerpt,
      type: 'article',
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      ...(a.featuredImage ? { images: [{ url: a.featuredImage }] } : {}),
    },
    alternates: { canonical: `/news/${a.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadArticle(slug);
  if (!data) notFound();
  const { article, related } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: article.author || 'CyberIntel Desk' },
    publisher: { '@type': 'Organization', name: 'CyberIntel' },
  };

  return (
    <article className="container-editorial py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {article.isBreaking && <BreakingBadge />}
          <SeverityBadge severity={article.severity} />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            {article.category}
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-tight text-ink-900 dark:text-white md:text-5xl">
          {article.title}
        </h1>
        {article.subtitle && <p className="mt-4 text-lg text-ink-400">{article.subtitle}</p>}
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-y border-[var(--border)] py-4 text-xs text-ink-400">
          <span>{article.author || 'CyberIntel Desk'}</span>
          {article.publishedAt && (
            <time title={exactDate(article.publishedAt)}>
              Published {relativeTime(article.publishedAt)}
            </time>
          )}
          {article.updatedAt && article.publishedAt !== article.updatedAt && (
            <time title={exactDate(article.updatedAt)}>Updated {relativeTime(article.updatedAt)}</time>
          )}
          {article.readingTime ? <span>{article.readingTime} min read</span> : null}
        </div>

        {article.featuredImage && isDisplayableArticleImage(article.featuredImage) ? (
          <div className="mt-8 overflow-hidden border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.featuredImage}
              alt={article.title}
              className="aspect-[16/9] w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : null}

        {!!article.keyTakeaways?.length && (
          <section className="panel mt-8 p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Key Takeaways
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-300">
              {article.keyTakeaways.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div
          className="prose-article mt-10"
          dangerouslySetInnerHTML={{
            __html: article.content
              .split(/\n{2,}/)
              .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
              .join(''),
          }}
        />

        {(article.securityDetails || article.mitigation || article.affectedProducts?.length) && (
          <section className="panel mt-10 space-y-4 p-5">
            <h2 className="font-display text-xl text-ink-900 dark:text-white">Security Details</h2>
            {article.securityDetails && <p className="text-sm text-ink-300">{article.securityDetails}</p>}
            {!!article.affectedProducts?.length && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Affected products</p>
                <p className="mt-1 text-sm">{article.affectedProducts.join(', ')}</p>
              </div>
            )}
            {article.mitigation && (
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Mitigation</p>
                <p className="mt-1 text-sm">{article.mitigation}</p>
              </div>
            )}
            {!!article.cveIds?.length && (
              <div className="flex flex-wrap gap-2">
                {article.cveIds.map((cve) => (
                  <Link
                    key={cve}
                    href={`/cve/${cve}`}
                    className="rounded border border-[var(--border)] px-2 py-1 text-xs hover:border-accent"
                  >
                    {cve}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl text-ink-900 dark:text-white">Sources</h2>
          <ul className="mt-3 space-y-3">
            {(article.sources || []).map((s) => (
              <li key={s.url} className="panel p-4 text-sm">
                <p className="font-medium">{s.name}</p>
                <p className="text-ink-400">{s.title}</p>
                {s.publishedAt && <p className="text-xs text-ink-400">{exactDate(s.publishedAt)}</p>}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent">
                  Original link
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {!!related.length && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-5 font-display text-2xl text-ink-900 dark:text-white">
            Related Security News
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCardView key={a._id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
