import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import StructuredData from "../components/structured-data";

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
  },
  // Verified social profiles, surfaced as <link rel="me"> so Google can
  // expand the Knowledge Graph entry from the site itself.
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
    images: [{ url: logoUrl }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj Gowda — Developer, builder, curious human",
    description: "A collection of projects, writing, and ideas about building for the web.",
    images: [logoUrl],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
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
