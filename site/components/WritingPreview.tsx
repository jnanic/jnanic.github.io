import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function WritingPreview() {
  const posts = getAllPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="relative px-4 py-12 md:py-16">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="text-4xl font-bold md:text-5xl">
            <span className="font-light text-brand-zaffre">//</span>{' '}Writing
          </h2>
          <Link
            href="/blog/"
            className="shrink-0 text-sm text-muted transition-colors hover:text-brand-zaffre"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group block rounded-2xl border border-brand-zaffre/30 bg-[var(--color-bg)]/85 p-6 backdrop-blur-md shadow-lg shadow-black/25 transition-all hover:border-brand-zaffre/60 hover:shadow-[0_0_30px_rgba(10,190,255,0.12)]"
            >
              <h3 className="mb-1 text-lg font-semibold leading-snug transition-colors group-hover:text-brand-zaffre">
                {post.title}
              </h3>
              <time className="mb-3 block text-xs text-muted" dateTime={post.publishedDate.toISOString()}>
                {formatDate(post.publishedDate)} · {post.readingTime} min read
              </time>
              <p className="text-sm leading-relaxed text-muted line-clamp-3">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
