import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl text-ink-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-ink-400">
        This cybersecurity brief does not exist or is no longer published.
      </p>
      <Link href="/" className="mt-6 rounded-lg bg-accent px-4 py-2 text-sm text-white">
        Back to homepage
      </Link>
    </div>
  );
}
