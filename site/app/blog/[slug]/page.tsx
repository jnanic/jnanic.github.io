import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import MermaidRendererWithTheme from '@/components/MermaidRendererWithTheme';

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

  const posts = getAllPosts();
  const postIndex = posts.findIndex((candidate) => candidate.slug === post.slug);
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextDestination = nextPost
    ? {
        href: `/blog/${nextPost.slug}/`,
        title: nextPost.title,
        ariaLabel: `Next post: ${nextPost.title}`,
      }
    : post.slug === 'building-my-homelab-part5'
      ? {
          href: '/blog/coming-next/',
          title: 'Part 6 is still booting...',
          ariaLabel: 'Part 6 status: still booting',
        }
      : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate.toISOString(),
    dateModified: (post.updatedDate ?? post.publishedDate).toISOString(),
    author: { '@type': 'Person', name: 'Yash Sharma', url: 'https://yashsharma.dev' },
    publisher: { '@type': 'Person', name: 'Yash Sharma' },
  };

  return (
    <main className="relative z-10 min-h-screen px-4 pb-10 pt-24 md:pb-12 md:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        {/* Hydrates data-mermaid placeholders into real diagrams, client-side only */}
        <MermaidRendererWithTheme />

        {/* Post footer — surfaced after finishing the article */}
        <footer className="mt-12 border-t border-brand-zaffre/30 pt-5">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <Link
              href="/blog/"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-brand-zaffre"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              More posts
            </Link>

            {nextDestination && (
              <Link
                href={nextDestination.href}
                aria-label={nextDestination.ariaLabel}
                className="group inline-flex max-w-full items-center justify-between gap-3 self-stretch text-left text-sm text-muted transition-colors hover:text-brand-zaffre focus-visible:text-brand-zaffre sm:self-auto sm:justify-end sm:text-right"
              >
                <span className="min-w-0">{nextDestination.title}</span>
                <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

        </footer>

      </div>
    </main>
  );
}
