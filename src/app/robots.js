const siteUrl = "https://manojgowda.iotkit.in";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/projects",
          "/projects/",
          "/blog",
          "/blog/",
          "/contact",
          "/sitemap.xml",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/_next/",
          "/static/",
          "/*.json$",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/projects",
          "/projects/",
          "/blog",
          "/blog/",
          "/contact",
          "/sitemap.xml",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
        ],
      },
      {
        userAgent: "AdsBot-Google",
        allow: [
          "/",
          "/projects",
          "/projects/",
          "/blog",
          "/blog/",
          "/contact",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}