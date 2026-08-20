import type { ArticleCard } from '@/lib/api';
import { serverGet } from '@/lib/api';
import { ArticleCardView, BreakingBadge, SectionHeader } from '@/components/ArticleCard';
import { NewsletterForm } from '@/components/NewsletterForm';
import Link from 'next/link';
import { isDisplayableArticleImage, relativeTime } from '@/lib/utils';

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

export default async function HomePage() {
  const data = await loadHome();
  const breaking = data?.breaking ?? [];
  const latest = data?.latest ?? [];
  const critical = data?.critical ?? [];
  const top = data?.topStories ?? [];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(29,78,216,0.12),transparent_35%)]" />
        <div className="container-editorial relative grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="animate-fadeUp">
            <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-accent">
              Cybersecurity Intelligence
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight text-ink-900 dark:text-white md:text-6xl">
              What happened in cybersecurity today.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink-400 md:text-lg">
              The latest attacks, vulnerabilities, breaches, malware campaigns, and security
              research — source-driven and editorially reviewed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/news"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-deep"
              >
                Read latest
              </Link>
              <Link
                href="/cve"
                className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm hover:border-accent/40"
              >
                Browse CVEs
              </Link>
            </div>
          </div>

          <div className="panel animate-fadeUp p-5 md:p-6" style={{ animationDelay: '120ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <BreakingBadge />
              <span className="text-xs text-ink-400">Live desk</span>
            </div>
            {breaking.length === 0 ? (
              <p className="text-sm text-ink-400">No breaking alerts right now. Check latest news.</p>
            ) : (
              <ul className="space-y-4">
                {breaking.slice(0, 4).map((item) => (
                  <li key={item._id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                    <Link href={`/news/${item.slug}`} className="flex gap-3">
                      {item.featuredImage && isDisplayableArticleImage(item.featuredImage) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.featuredImage}
                          alt=""
                          className="h-14 w-20 shrink-0 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <span className="min-w-0">
                        <p className="font-medium leading-snug text-ink-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-ink-400">{relativeTime(item.publishedAt)}</p>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="container-editorial space-y-16 py-12 md:py-16">
        <section>
          <SectionHeader title="Top Stories" eyebrow="Priority" href="/news" />
          <div className="grid gap-4 md:grid-cols-2">
            {(top.length ? top : latest).slice(0, 1).map((a) => (
              <ArticleCardView key={a._id} article={a} featured />
            ))}
            <div className="grid gap-4">
              {(top.length ? top : latest).slice(1, 4).map((a) => (
                <ArticleCardView key={a._id} article={a} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader title="Latest Security News" eyebrow="Current affairs" href="/news" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.slice(0, 6).map((a) => (
              <ArticleCardView key={a._id} article={a} />
            ))}
            {!latest.length && (
              <div className="panel col-span-full p-8 text-sm text-ink-400">
                No published articles yet. Start the backend, seed sources, and run discovery.
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader
            title="Critical Vulnerabilities"
            eyebrow="Severity"
            href="/news?filter=vulnerabilities"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {critical.slice(0, 6).map((a) => (
              <ArticleCardView key={a._id} article={a} />
            ))}
            {!critical.length && (
              <p className="text-sm text-ink-400">No critical vulnerability stories published yet.</p>
            )}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeader title="Threat Intelligence" href="/news?filter=threats" />
            <div className="space-y-4">
              {(data?.threatIntel ?? []).slice(0, 4).map((a) => (
                <ArticleCardView key={a._id} article={a} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Data Breaches" href="/news?filter=breaches" />
            <div className="space-y-4">
              {(data?.breaches ?? []).slice(0, 4).map((a) => (
                <ArticleCardView key={a._id} article={a} />
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeader title="Malware Watch" href="/news?filter=malware" />
            <div className="space-y-4">
              {(data?.malware ?? []).slice(0, 4).map((a) => (
                <ArticleCardView key={a._id} article={a} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Security Research" href="/news?filter=research" />
            <div className="space-y-4">
              {(data?.research ?? []).slice(0, 4).map((a) => (
                <ArticleCardView key={a._id} article={a} />
              ))}
            </div>
          </section>
        </div>

        <NewsletterForm />
      </div>
    </div>
  );
}
