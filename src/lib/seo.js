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
  section,
  keywords,
} = {}) {
  const fullTitle = title ? `${title} | Manoj Gowda` : siteMeta.titleDefault;
  const metaDescription = description || siteMeta.descriptionDefault;
  const url = `${siteUrl}${path}`;
  const imageUrl = image || siteMeta.logoUrl;

  const metadata = {
    title,
    description: metaDescription,
    alternates: { canonical: path },
    keywords,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description: metaDescription,
      siteName: siteMeta.siteName,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [imageUrl],
    },
  };

  if (section) metadata.openGraph.section = section;
  if (publishedTime) metadata.openGraph.publishedTime = publishedTime;

  return metadata;
}