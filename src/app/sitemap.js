import { getPublishedPosts, getPublishedProjects } from "../lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const lastModified = new Date();
  const [projectsResult, postsResult] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
  ]);
  const projects = projectsResult.items;
  const posts = postsResult.items;

  const staticRoutes = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: siteUrl,
        },
      },
    },
    {
      url: `${siteUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectUrls = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : lastModified,
    changeFrequency: "monthly",
    priority: project.is_featured ? 0.7 : 0.6,
    images: project.image_url ? [{ url: project.image_url, title: project.title }] : [],
  }));

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
    images: post.cover_image_url ? [{ url: post.cover_image_url, title: post.title }] : [],
  }));

  return [...staticRoutes, ...projectUrls, ...postUrls];
}