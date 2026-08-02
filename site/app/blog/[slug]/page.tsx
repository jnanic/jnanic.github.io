import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} – Yash Sharma`,
    description: post.description,
    alternates: { canonical: `/blog/${params.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedDate.toISOString(),
      modifiedTime: post.updatedDate?.toISOString(),
    },
  };
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="relative z-10 min-h-screen px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="transition-colors hover:text-brand-zaffre">Home</Link>
          <span aria-hidden="true" className="text-brand-zaffre/40">›</span>
          <Link href="/blog/" className="transition-colors hover:text-brand-zaffre">Blog</Link>
          <span aria-hidden="true" className="text-brand-zaffre/40">›</span>
          <span className="truncate text-[var(--color-fg)]">{post.title}</span>
        </nav>

        <header className="mb-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>
          <p className="mb-5 text-lg text-muted">{post.description}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <time dateTime={post.publishedDate.toISOString()}>
              Published {formatDate(post.publishedDate)}
            </time>
            {post.updatedDate && (
              <time dateTime={post.updatedDate.toISOString()}>
                Updated {formatDate(post.updatedDate)}
              </time>
            )}
            <span>{post.readingTime} min read</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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
        </header>

        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Post footer — surfaced after finishing the article */}
        <footer className="mt-16 border-t border-brand-zaffre/35 pt-8 flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/blog/"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand-zaffre"
          >
            <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            More posts
          </Link>
          <span className="text-xs text-muted/50">// {post.tags.join(' · ')}</span>
        </footer>

      </div>
    </main>
  );
}
