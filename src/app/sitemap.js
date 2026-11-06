import { getPublishedPostsForStatic, getPublishedProjectsForStatic } from "../lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const lastModified = new Date();
  const [projectsResult, postsResult] = await Promise.all([
    getPublishedProjectsForStatic(),
    getPublishedPostsForStatic(),
  ]);
  const projects = projectsResult.items;
  const posts = postsResult.items;

  // Log any setup issues but return a valid sitemap
  if (projectsResult.setupRequired) {
    console.warn('Sitemap: projects setup required:', projectsResult.setupRequired);
  }
  if (postsResult.setupRequired) {
    console.warn('Sitemap: posts setup required:', postsResult.setupRequired);
  }

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Only include published projects
  const projectUrls = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : lastModified,
    changeFrequency: "monthly",
    priority: project.is_featured ? 0.7 : 0.6,
  }));

  // Only include published posts
  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectUrls, ...postUrls];
}