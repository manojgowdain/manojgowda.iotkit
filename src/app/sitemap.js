import { getPublishedPosts, getPublishedProjects } from "../lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const routes = ["", "/projects", "/blog", "/contact"];
  const lastModified = new Date();
  const [projectsResult, postsResult] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);
  const projects = projectsResult.items;
  const posts = postsResult.items;

  const pages = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  return [
    ...pages,
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updated_at || lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
