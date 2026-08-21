'use client';

import Link from 'next/link';
import { Bookmark, Hand, MessageCircle, MoreHorizontal, ThumbsDown } from 'lucide-react';
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
  const show = isDisplayableArticleImage(src);
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden bg-ink-100 dark:bg-ink-800',
        featured ? 'aspect-[16/9]' : 'aspect-[16/10]'
      )}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : null}
    </div>
  );
}

function authorLabel(article: ArticleCard) {
  return article.sources?.[0]?.name || article.author || 'CyberIntel';
}

function shortDate(date?: string) {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return relativeTime(date);
  }
}

export function MediumArticleRow({ article }: { article: ArticleCard }) {
  const showImage = isDisplayableArticleImage(article.featuredImage);
  const author = authorLabel(article);

  return (
    <article className="group border-b border-[var(--border)] py-8 first:pt-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] text-ink-500">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[9px] font-bold text-white dark:bg-white dark:text-ink-900">
          {author.slice(0, 1).toUpperCase()}
        </span>
        <span className="font-medium text-ink-800 dark:text-ink-200">{author}</span>
        {article.category ? (
          <>
            <span className="text-ink-300">in</span>
            <span className="text-ink-800 dark:text-ink-200">{article.category}</span>
          </>
        ) : null}
        <span className="text-ink-300">·</span>
        <time title={exactDate(article.publishedAt)}>{shortDate(article.publishedAt)}</time>
        {article.isBreaking ? <BreakingBadge /> : null}
        <SeverityBadge severity={article.severity} />
      </div>

      <div className="flex gap-6 sm:gap-10">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[22px] font-bold leading-[28px] tracking-tight text-ink-900 dark:text-white sm:text-[24px] sm:leading-[30px]">
            <Link href={`/news/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </h2>
          {article.excerpt ? (
            <p className="mt-2 line-clamp-2 text-[15px] leading-6 text-ink-500 dark:text-ink-300 sm:text-[16px] sm:leading-6">
              {article.excerpt}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3 text-ink-400">
            <div className="flex items-center gap-4 text-[13px]">
              <span className="inline-flex items-center gap-1.5">
                <Hand className="h-4 w-4" />
                {article.views ? Math.max(1, Math.round(article.views / 10)) : '—'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                {article.readingTime ? `${article.readingTime}m` : '—'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-full p-2 hover:bg-ink-50 hover:text-ink-700 dark:hover:bg-ink-800"
                aria-label="Show less like this"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-ink-50 hover:text-ink-700 dark:hover:bg-ink-800"
                aria-label="Save"
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-ink-50 hover:text-ink-700 dark:hover:bg-ink-800"
                aria-label="More"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showImage ? (
          <Link href={`/news/${article.slug}`} className="relative hidden shrink-0 sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.featuredImage}
              alt=""
              className="h-[72px] w-[100px] rounded-[4px] object-cover md:h-[107px] md:w-[160px]"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </Link>
        ) : null}
      </div>
    </article>
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
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] transition hover:border-ink-300 dark:hover:border-ink-600',
        featured ? 'md:p-0' : ''
      )}
    >
      <ArticleImage src={article.featuredImage} alt={article.title} featured={featured} />
      <div className={cn('flex min-h-0 flex-1 flex-col p-5', featured && 'md:p-7')}>
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
            featured ? 'line-clamp-3 text-2xl md:text-3xl' : 'line-clamp-2 text-lg leading-snug'
          )}
        >
          <Link href={`/news/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p
          className={cn(
            'mt-2 text-sm text-ink-400',
            featured ? 'line-clamp-4 min-h-[7rem] text-base leading-7' : 'line-clamp-3 min-h-[4.5rem] leading-6'
          )}
        >
          {article.excerpt || ''}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 text-xs text-ink-400">
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

export function FeedTabs({
  active = 'for-you',
}: {
  active?: 'for-you' | 'featured';
}) {
  return (
    <div className="flex gap-8 border-b border-[var(--border)]">
      <Link
        href="/"
        className={cn(
          'relative -mb-px pb-3.5 text-[15px] transition',
          active === 'for-you'
            ? 'font-medium text-ink-900 dark:text-white'
            : 'text-ink-400 hover:text-ink-700 dark:hover:text-ink-200'
        )}
      >
        For you
        {active === 'for-you' ? (
          <span className="absolute inset-x-0 bottom-0 h-[1px] bg-ink-900 dark:bg-white" />
        ) : null}
      </Link>
      <Link
        href="/news?sort=most_read"
        className={cn(
          'relative -mb-px pb-3.5 text-[15px] transition',
          active === 'featured'
            ? 'font-medium text-ink-900 dark:text-white'
            : 'text-ink-400 hover:text-ink-700 dark:hover:text-ink-200'
        )}
      >
        Featured
        {active === 'featured' ? (
          <span className="absolute inset-x-0 bottom-0 h-[1px] bg-ink-900 dark:bg-white" />
        ) : null}
      </Link>
    </div>
  );
}
