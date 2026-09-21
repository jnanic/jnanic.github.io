import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Part 6 Is Still Booting – Yash Sharma',
  description: 'The next homelab post is in progress and waiting for quieter logs.',
  robots: {
    index: false,
    follow: true,
  },
};

const bootSteps = [
  { status: 'OK', text: 'Broke the test environment safely', pending: false },
  { status: 'OK', text: 'Learned why it broke', pending: false },
  { status: '....', text: 'Turning the logs into a coherent story', pending: true },
];

export default function ComingNext() {
  return (
    <main className="relative z-10 min-h-screen px-4 pb-10 pt-24 md:pb-12 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="transition-colors hover:text-brand-zaffre">Home</Link>
          <span aria-hidden="true" className="text-brand-zaffre/40">›</span>
          <Link href="/blog/" className="transition-colors hover:text-brand-zaffre">Blog</Link>
          <span aria-hidden="true" className="text-brand-zaffre/40">›</span>
          <span className="truncate text-[var(--color-fg)]">Coming next</span>
        </nav>

        <section className="mx-auto max-w-2xl py-8 text-center md:py-14">
          <p className="mb-5 font-mono text-sm text-brand-zaffre">// next transmission</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Part 6 is still booting...
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Part 6 is in progress and will be online when the logs become less interesting.
          </p>

          <div
            role="group"
            aria-label="Part 6 writing progress"
            className="mx-auto mt-10 max-w-xl rounded-xl border border-brand-zaffre/25 bg-[var(--color-bg)]/75 p-5 text-left font-mono text-sm backdrop-blur-sm md:p-6"
          >
            {bootSteps.map((step) => (
              <div key={step.text} className="flex gap-4 py-1.5">
                <span className={step.pending ? 'text-muted' : 'text-brand-zaffre'}>
                  [{step.status}]
                </span>
                <span className="text-muted">{step.text}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted">
            Current state: technically promising, narratively unstable.
          </p>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-zaffre/30 pt-5 text-sm text-muted">
          <Link
            href="/blog/building-my-homelab-part5/"
            className="group inline-flex items-center gap-2 transition-colors hover:text-brand-zaffre"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Part 5
          </Link>
          <Link href="/blog/" className="transition-colors hover:text-brand-zaffre">
            More posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
