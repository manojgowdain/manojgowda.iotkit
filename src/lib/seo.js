// Shared SEO metadata builder. Every page should build its metadata through
// `pageMetadata` so title, description, canonical, Open Graph, and Twitter
// cards stay consistent with the site branding in layout.js.
//
// `path` is relative to the site root (e.g. "/projects", "/blog/hello-world").
// `image` is an optional absolute URL; when omitted the site logo is used.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";
const logoUrl = "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg";

export const siteMeta = {
  siteName: "Manoj Gowda",
  siteUrl,
  logoUrl,
  titleDefault: "Manoj Gowda — Developer, builder, curious human",
  descriptionDefault:
    "The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.",
};

// Verified social profiles, surfaced as <link rel="me"> so Google can expand
// the Knowledge Graph entry from the site itself.
export const socialProfiles = [
  "https://www.linkedin.com/in/manojgowdain",
  "https://www.instagram.com/manojgowda.in",
  "https://github.com/manojgowdain",
  "https://manojgowda.iotkit.in",
  "https://manojgowda.in",
];

export default function pageMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  section,
  keywords,
  authors = ["Manoj Gowda"],
  noIndex = false,
  noFollow = false,
} = {}) {
  const fullTitle = title ? `${title} | Manoj Gowda` : siteMeta.titleDefault;
  const metaDescription = description || siteMeta.descriptionDefault;
  const url = `${siteUrl}${path}`;
  const imageUrl = image || siteMeta.logoUrl;
  const canonicalUrl = url;

  const robots = {
    index: !noIndex,
    follow: !noFollow,
    googleBot: {
      index: !noIndex,
      follow: !noFollow,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };

  const metadata = {
    title: title || siteMeta.titleDefault,
    description: metaDescription,
    alternates: { canonical: canonicalUrl },
    keywords,
    authors,
    robots,
    openGraph: {
      type,
      url: canonicalUrl,
      title: fullTitle,
      description: metaDescription,
      siteName: siteMeta.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteMeta.titleDefault,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [imageUrl],
      creator: "@manojgowdain",
    },
    other: {
      "social:profile": socialProfiles,
    },
  };

  if (section) metadata.openGraph.section = section;
  if (publishedTime) metadata.openGraph.publishedTime = publishedTime;
  if (modifiedTime) metadata.openGraph.modifiedTime = modifiedTime;

  return metadata;
}