/**
 * robots.txt configuration for Next.js 16 App Router
 * Returns a Robots configuration that Next.js converts to the robots.txt file
 * @returns {import('next').MetadataRoute.Robots}
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
          "/sitemap.xml",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api",
          "/api/",
          "/_next",
          "/_next/",
          "/static",
          "/static/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/projects",
          "/blog",
          "/contact",
          "/sitemap.xml",
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