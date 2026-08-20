'use client';

import Link from 'next/link';
import type { ArticleCard } from '@/lib/api';
import { cn, exactDate, isDisplayableArticleImage, relativeTime, severityClass } from '@/lib/utils';

export function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        severityClass(severity as 'critical')
      )}
    >
      {severity}
    </span>
  );
}

export function BreakingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-critical">
      <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-critical" />
      Breaking
    </span>
  );
}

function ArticleImage({
  src,
  alt,
  featured,
}: {
  src?: string;
  alt: string;
  featured?: boolean;
}) {
  if (!isDisplayableArticleImage(src)) return null;
  return (
    <div
      className={cn(
        'relative mb-4 overflow-hidden bg-ink-100 dark:bg-ink-900',
        featured ? 'aspect-[16/9]' : 'aspect-[16/10]'
      )}
    >
      {/* External crawled URLs — plain img avoids Next image domain allowlist */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(event) => {
          const img = event.currentTarget;
          const wrap = img.parentElement;
          img.style.display = 'none';
          if (wrap) wrap.style.display = 'none';
        }}
      />
    </div>
  );
}

export function ArticleCardView({
  article,
  featured = false,
}: {
  article: ArticleCard;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        'group panel relative overflow-hidden transition hover:border-accent/40',
        featured ? 'md:p-0' : ''
      )}
    >
      {isDisplayableArticleImage(article.featuredImage) ? (
        <div className={cn(featured ? '' : 'px-0 pt-0')}>
          <ArticleImage src={article.featuredImage} alt={article.title} featured={featured} />
        </div>
      ) : null}
      <div
        className={cn(
          'p-5',
          featured && 'md:p-7',
          isDisplayableArticleImage(article.featuredImage) && 'pt-0'
        )}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {article.isBreaking && <BreakingBadge />}
          <SeverityBadge severity={article.severity} />
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
            {article.category}
          </span>
        </div>
        <h3
          className={cn(
            'font-display font-semibold tracking-tight text-ink-900 transition group-hover:text-accent dark:text-white',
            featured ? 'text-2xl md:text-3xl' : 'text-lg'
          )}
        >
          <Link href={`/news/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className={cn('mt-2 text-sm text-ink-400', featured && 'text-base leading-7')}>
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
          {article.sources?.[0]?.name && <span>{article.sources[0].name}</span>}
          {article.publishedAt && (
            <time title={exactDate(article.publishedAt)}>{relativeTime(article.publishedAt)}</time>
          )}
          {article.readingTime ? <span>{article.readingTime} min read</span> : null}
        </div>
      </div>
    </article>
  );
}

export function SectionHeader({
  title,
  href,
  eyebrow,
}: {
  title: string;
  href?: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl tracking-tight text-ink-900 dark:text-white md:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="text-sm text-accent hover:underline">
          View all
        </Link>
      )}
    </div>
  );
}
