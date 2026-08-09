import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, type Tokens } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedDate: Date;
  updatedDate?: Date;
  draft: boolean;
  tags: string[];
  coverImage?: string;
  contentHtml: string;
  readingTime: number; // minutes
}

const postsDir = path.join(process.cwd(), 'content/blog');

// Custom renderer: emit a data-attribute placeholder for mermaid blocks so the
// client-side MermaidRenderer component can hydrate them into real SVGs.
// Supports optional width in the info string:  ```mermaid width=600
const renderer = new marked.Renderer();
renderer.code = function ({ text, lang }: Tokens.Code): string {
  const infoLang = (lang ?? '').trim();

  if (infoLang.startsWith('mermaid')) {
    const encoded = Buffer.from(text).toString('base64');
    // Parse optional  width=<number>  from the info string, e.g. "mermaid width=500"
    const widthMatch = infoLang.match(/\bwidth=(\d+)\b/);
    const widthAttr = widthMatch ? ` data-mermaid-width="${widthMatch[1]}"` : '';
    return `<div data-mermaid="${encoded}"${widthAttr} aria-label="Mermaid diagram"></div>\n`;
  }

  // For all other fenced code blocks, produce the same HTML marked would by default.
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const langClass = infoLang ? ` class="language-${infoLang}"` : '';
  return `<pre><code${langClass}>${escaped}\n</code></pre>\n`;
};

// Synchronous parse — safe as long as we don't register async marked extensions
function toHtml(markdown: string): string {
  const result = marked.parse(markdown, { renderer });
  return typeof result === 'string' ? result : '';
}

function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function readPost(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    publishedDate: new Date(data.publishedDate),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
    draft: Boolean(data.draft ?? false),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    contentHtml: toHtml(content),
    readingTime: readingTime(content),
  };
}

const isProduction = process.env.NODE_ENV === 'production';

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPost)
    .filter((p) => !isProduction || !p.draft)
    .sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

// Used only in generateStaticParams. Next.js 14.2 output:'export' throws a build
// error when generateStaticParams returns [] — it requires at least one path.
// Draft posts are included here so the build succeeds; the page renders notFound()
// for drafts in production so they are never served as real content.
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(postsDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const post = readPost(`${slug}${ext}`);
      return isProduction && post.draft ? null : post;
    }
  }
  return null;
}
