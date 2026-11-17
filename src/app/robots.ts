/**
 * robots.txt configuration for Next.js 16 App Router
 * Returns a Robots configuration that Next.js converts to the robots.txt file
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/projects",
          "/blog",
          "/contact",
          "/jobs",
          "/sitemap.xml",
          "/_next/",      // Allow Next.js static assets for rendering
          "/static/",     // Allow static assets
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api",
          "/api/",
          "/_next/data/", // Block Next.js data routes (not needed for rendering)
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/projects",
          "/blog",
          "/contact",
          "/jobs",
          "/sitemap.xml",
          "/_next/",
          "/static/",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api",
          "/api/",
        ],
      },
      {
        userAgent: "AdsBot-Google",
        allow: [
          "/",
          "/projects",
          "/blog",
          "/contact",
          "/jobs",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}