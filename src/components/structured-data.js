// JSON-LD structured data for Manoj Gowda.
// Renders appropriate schema based on the page context.
// Uses next/script to properly inject JSON-LD in the client.

"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manoj Gowda",
  url: siteUrl,
  image: "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg",
  jobTitle: "Team Lead & Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Independent / Startup Engineer",
  },
  email: ["mail@manojgowda.in", "manojgowdabr89@gmail.com"],
  sameAs: [
    "https://www.linkedin.com/in/manojgowdain",
    "https://www.instagram.com/manojgowda.in",
    "https://github.com/manojgowdain",
    "https://manojgowda.iotkit.in",
    "https://manojgowda.in",
  ],
  knowsAbout: [
    "Full Stack Development",
    "DevOps",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "IoT Platforms",
    "Android Development",
    "React Native",
    "Cloud Infrastructure",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "India",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Manoj Gowda",
  url: siteUrl,
  publisher: {
    "@type": "Person",
    name: "Manoj Gowda",
    url: siteUrl,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Manoj Gowda — Developer, builder, curious human",
  description: "The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.",
  url: siteUrl,
  publisher: {
    "@type": "Person",
    name: "Manoj Gowda",
    url: siteUrl,
  },
  author: {
    "@type": "Person",
    name: "Manoj Gowda",
    url: siteUrl,
  },
};

function StructuredData() {
  const pathname = usePathname();

  const schemas = [];

  // Person schema only on homepage
  if (pathname === "/") {
    schemas.push(personJsonLd);
  }

  // WebSite schema on all pages
  schemas.push(websiteJsonLd);

  // WebPage schema on all pages
  const pageSchema = { ...webPageJsonLd, url: `${siteUrl}${pathname}` };
  schemas.push(pageSchema);

  if (schemas.length === 0) return null;

  const jsonLd = JSON.stringify(schemas).replace(/</g, "\\u003c");

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
      strategy="lazyOnload"
    />
  );
}

export default StructuredData;