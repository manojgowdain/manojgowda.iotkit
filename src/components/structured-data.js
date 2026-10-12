// JSON-LD structured data for Manoj Gowda, surfaced on every page so
// Google can build the Knowledge Graph entry from the site itself.
// Mirrors the schema from the manojgowda.iotkit.in homepage.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manoj Gowda",
  url: siteUrl,
  image: `${siteUrl}/manojgowdaimg.jpg`,
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

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  );
}