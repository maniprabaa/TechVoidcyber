export default function Loading() {
  // Page transition overlay handles the TextDots animation.
  // Keep this empty so Next.js Suspense doesn't show a second loader.
  return <div className="min-h-[40vh]" aria-hidden="true" />;
}
