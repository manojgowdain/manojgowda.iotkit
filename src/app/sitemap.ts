/**
 * Dynamic sitemap for Next.js 16 App Router.
 * Fetches published projects, blog posts, and jobs from Supabase with caching.
 */

import { CachePrefix, CacheTTL } from '../lib/cache';
import { getPublishedProjectsForStatic, getPublishedPostsForStatic, getPublishedJobsForStatic } from '../lib/content';

export const revalidate = 3600; // Revalidate every hour

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://manojgowda.iotkit.in';
  const lastModified = new Date();

  const staticRoutes = [
    { url: `${siteUrl}`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/projects`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/jobs`, lastModified, changeFrequency: 'daily', priority: 0.9 },
  ];

  // Use cached fetchers (which use the hybrid cache)
  const { items: projects = [] } = await getPublishedProjectsForStatic();
  const { items: posts = [] } = await getPublishedPostsForStatic();
  const { items: jobs = [] } = await getPublishedJobsForStatic();

  const projectUrls = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const postUrls = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : p.updated_at ? new Date(p.updated_at) : lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const jobUrls = jobs.map((j) => ({
    url: `${siteUrl}/jobs/${j.slug}`,
    lastModified: j.updated_at ? new Date(j.updated_at) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const allUrls = [...staticRoutes, ...projectUrls, ...postUrls, ...jobUrls];

  return allUrls;
}