import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

interface ComingNextCopy {
  description: string;
  lead: string;
  state: string;
  steps: { status: string; text: string; pending: boolean }[];
}

const partCopy: Record<number, ComingNextCopy> = {
  7: {
    description: 'The next homelab post is in progress and waiting for quieter logs.',
    lead: 'Part 7 is in progress and will be online when the logs become less interesting.',
    state: 'Current state: technically promising, narratively unstable.',
    steps: [
      { status: 'OK', text: 'Kept the agents inside the guardrails', pending: false },
      { status: 'OK', text: 'Recorded the decisions worth remembering', pending: false },
      { status: '....', text: 'Turning the checkpoints into a coherent story', pending: true },
    ],
  },
  8: {
    description: 'The next homelab post is in progress while the network boundaries are being mapped.',
    lead: 'Part 8 is in progress and will be online when the packets stop taking the scenic route.',
    state: 'Current state: the packets know more than the outline.',
    steps: [
      { status: 'OK', text: 'Picked the next network boundary to investigate', pending: false },
      { status: '....', text: 'Working out which connections should survive', pending: true },
      { status: 'WAIT', text: 'Moving services after the map stops changing', pending: true },
    ],
  },
  9: {
    description: 'The next homelab post is in progress while Daedalus is being prepared for compute work.',
    lead: 'Part 9 is in progress and will be online when the laptop finishes becoming a compute node.',
    state: 'Current state: reachable, useful, and not yet a dependency.',
    steps: [
      { status: 'OK', text: 'Placed Daedalus on the Compute network', pending: false },
      { status: 'OK', text: 'Reached Jupyter through an SSH tunnel', pending: false },
      { status: '....', text: 'Working out what other applications can safely depend on', pending: true },
    ],
  },
};

function getComingNextDetails() {
  const latestHomelabPost = getAllPosts().find((post) => /^building-my-homelab-part\d+$/.test(post.slug));
  if (!latestHomelabPost) {
    throw new Error('The coming-next page requires at least one numbered homelab post.');
  }

  const currentPart = Number(latestHomelabPost.slug.match(/part(\d+)$/)?.[1]);
  const nextPart = currentPart + 1;
  const copy = partCopy[nextPart] ?? {
    description: 'The next homelab post is in progress and waiting for quieter logs.',
    lead: `Part ${nextPart} is in progress and will be online when the logs become less interesting.`,
    state: 'Current state: technically promising, narratively unstable.',
    steps: [
      { status: 'OK', text: 'Found the next problem worth writing about', pending: false },
      { status: '....', text: 'Turning the evidence into a coherent story', pending: true },
    ],
  };

  return { copy, latestHomelabPost, nextPart };
}

export function generateMetadata(): Metadata {
  const { copy, nextPart } = getComingNextDetails();
  return {
    title: `Part ${nextPart} Is Still Booting – Yash Sharma`,
    description: copy.description,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function ComingNext() {
  const { copy, latestHomelabPost, nextPart } = getComingNextDetails();

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
            Part {nextPart} is still booting...
          </h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            {copy.lead}
          </p>

          <div
            role="group"
            aria-label={`Part ${nextPart} writing progress`}
            className="mx-auto mt-10 max-w-xl rounded-xl border border-brand-zaffre/25 bg-[var(--color-bg)]/75 p-5 text-left font-mono text-sm backdrop-blur-sm md:p-6"
          >
            {copy.steps.map((step) => (
              <div key={step.text} className="flex gap-4 py-1.5">
                <span className={step.pending ? 'text-muted' : 'text-brand-zaffre'}>
                  [{step.status}]
                </span>
                <span className="text-muted">{step.text}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted">
            {copy.state}
          </p>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-brand-zaffre/30 pt-5 text-sm text-muted">
          <Link
            href={`/blog/${latestHomelabPost.slug}/`}
            className="group inline-flex items-center gap-2 transition-colors hover:text-brand-zaffre"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Part {nextPart - 1}
          </Link>
          <Link href="/blog/" className="transition-colors hover:text-brand-zaffre">
            More posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
