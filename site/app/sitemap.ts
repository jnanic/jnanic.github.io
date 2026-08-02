import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://yashsharma.dev';
  const posts = getAllPosts();

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/blog/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}/`,
      lastModified: post.updatedDate ?? post.publishedDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
