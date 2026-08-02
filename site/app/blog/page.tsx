import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, type BlogPost } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog – Yash Sharma',
  description: 'Thoughts on engineering, homelabs, and building things.',
  openGraph: {
    title: 'Blog – Yash Sharma',
    description: 'Thoughts on engineering, homelabs, and building things.',
    type: 'website',
  },
};

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

function groupByYear(posts: BlogPost[]): [number, BlogPost[]][] {
  const map = new Map<number, BlogPost[]>();
  for (const post of posts) {
    const y = post.publishedDate.getFullYear();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(post);
  }
  return [...map.entries()].sort(([a], [b]) => b - a);
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="relative z-10 min-h-screen px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="font-light text-brand-zaffre">//</span>{' '}Blog
        </h1>
        <p className="mb-16 text-xl leading-relaxed text-muted">
          Writings on{' '}
          <span className="font-medium text-[var(--color-fg)]">engineering</span>,{' '}
          <span className="font-medium text-[var(--color-fg)]">homelabs</span>, and the
          occasional rabbit hole.
        </p>

        {posts.length === 0 ? (
          <EmptyTimeline />
        ) : (
          <Timeline groups={groupByYear(posts)} />
        )}
      </div>
    </main>
  );
}

function Timeline({ groups }: { groups: [number, BlogPost[]][] }) {
  return (
    <div className="relative">
      {/* Vertical spine */}
      <div className="absolute left-[7.5px] top-3 bottom-3 w-px bg-gradient-to-b from-brand-zaffre/60 via-brand-zaffre/30 to-brand-zaffre/10" />

      {groups.map(([year, posts]) => (
        <section key={year} className="mb-12 last:mb-0" aria-label={String(year)}>
          {/* Year marker */}
          {/* Year marker */}
          <div className="grid grid-cols-[16px_1fr] gap-5 mb-7">
            <div className="flex justify-center pt-1">
              <div className="relative z-10 h-4 w-4 rounded-full border-2 border-brand-zaffre bg-brand-zaffre/30" />
            </div>
            <span className="self-center text-sm font-bold tracking-[0.25em] text-primary uppercase">
              {year}
            </span>
          </div>

          <ul className="space-y-5" role="list">
            {posts.map((post) => (
              <li key={post.slug} className="grid grid-cols-[16px_1fr] gap-5 items-center">
                <div className="flex justify-center">
                  <div className="relative z-10 h-2 w-2 rounded-full border border-brand-zaffre/50 bg-[var(--color-bg)]" />
                </div>

                {/* Glassmorphism card */}
                <Link
                  href={`/blog/${post.slug}/`}
                  className="group block rounded-2xl border border-brand-zaffre/30 bg-[var(--color-bg)]/85 p-6 backdrop-blur-md shadow-lg shadow-black/25 transition-all hover:border-brand-zaffre/60 hover:shadow-[0_0_30px_rgba(10,190,255,0.12)]"
                >
                  <h2 className="mb-1 text-xl font-semibold transition-colors group-hover:text-brand-zaffre">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.publishedDate.toISOString()}
                    className="mb-3 block text-sm text-muted"
                  >
                    {formatDate(post.publishedDate)}
                  </time>
                  <p className="mb-4 leading-relaxed text-muted">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-brand-zaffre/30 bg-brand-zaffre/10 px-3 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Line terminator — gives the spine a deliberate end point */}
      <div className="grid grid-cols-[16px_1fr] gap-5 mt-3">
        <div className="flex justify-center">
          <div className="relative z-10 h-2 w-2 rounded-full bg-brand-zaffre/20" />
        </div>
      </div>
    </div>
  );
}

function EmptyTimeline() {
  return (
    <div className="relative grid grid-cols-[16px_1fr] gap-5">
      <div className="absolute left-[7.5px] top-0 h-full w-px bg-gradient-to-b from-brand-zaffre/30 to-transparent" />
      <div className="flex justify-center pt-2.5">
        <div className="relative z-10 h-2 w-2 rounded-full border border-brand-zaffre/40 bg-[var(--color-bg)]" />
      </div>
      <p className="py-1 text-xl text-muted">No posts yet — check back soon.</p>
    </div>
  );
}
