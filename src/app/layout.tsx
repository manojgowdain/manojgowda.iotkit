import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";
const logoUrl = "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg";

// Shared JSON-LD schemas for all pages
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Manoj Gowda",
  url: siteUrl,
  image: logoUrl,
  jobTitle: "Team Lead & Software Engineer",
  worksFor: { "@type": "Organization", name: "Independent / Startup Engineer" },
  email: ["mail@manojgowda.in", "manojgowdabr89@gmail.com"],
  sameAs: [
    "https://www.linkedin.com/in/manojgowdain",
    "https://www.instagram.com/manojgowda.in",
    "https://github.com/manojgowdain",
    "https://manojgowda.iotkit.in",
    "https://manojgowda.in",
  ],
  knowsAbout: [
    "Full Stack Development", "DevOps", "React", "Node.js", "AWS",
    "Docker", "IoT Platforms", "Android Development", "React Native",
    "Cloud Infrastructure",
  ],
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Manoj Gowda",
  url: siteUrl,
  publisher: { "@type": "Person", name: "Manoj Gowda", url: siteUrl },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Manoj Gowda — Developer, builder, curious human",
  description: "The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.",
  url: siteUrl,
  publisher: { "@type": "Person", name: "Manoj Gowda", url: siteUrl },
  author: { "@type": "Person", name: "Manoj Gowda", url: siteUrl },
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Manoj Gowda — Developer, builder, curious human",
    template: "%s | Manoj Gowda",
  },
  description:
    "The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: logoUrl, type: "image/svg+xml" }],
    shortcut: [logoUrl],
    apple: [logoUrl],
  },
  other: {
    "social:profile": [
      "https://www.linkedin.com/in/manojgowdain",
      "https://www.instagram.com/manojgowda.in",
      "https://github.com/manojgowdain",
      "https://manojgowda.iotkit.in",
      "https://manojgowda.in",
    ],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Manoj Gowda",
    title: "Manoj Gowda — Developer, builder, curious human",
    description: "A collection of projects, writing, and ideas about building for the web.",
    images: [
      {
        url: logoUrl,
        width: 1200,
        height: 630,
        alt: "Manoj Gowda — Developer, builder, curious human",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj Gowda — Developer, builder, curious human",
    description: "A collection of projects, writing, and ideas about building for the web.",
    images: [logoUrl],
    creator: "@manojgowdain",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const schemas = [personJsonLd, websiteJsonLd, webPageJsonLd];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, "\\u003c") }}
          strategy="lazyOnload"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="site-shell">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}