'use client';

import dynamic from 'next/dynamic';

const Projects = dynamic(() => import('@/components/Projects'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-4xl px-4">
      <h2 className="mb-16 text-center text-4xl font-bold md:text-5xl">Projects</h2>
      <div className="space-y-8">
        <div className="h-48 rounded-3xl border border-brand-zaffre/20 bg-[var(--color-bg)]/40" />
        <div className="h-48 rounded-3xl border border-brand-zaffre/20 bg-[var(--color-bg)]/40" />
      </div>
    </div>
  ),
});

export default function LazyProjects() {
  return <Projects />;
}
