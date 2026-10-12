const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

export default function robots() {
  return {
    rules: [
      // Allow everything by default, but keep the admin panel out of search
      // results and out of the crawl budget.
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
