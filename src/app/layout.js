import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in"),
  title: {
    default: "Manoj Gowda — Developer, builder, curious human",
    template: "%s | Manoj Gowda",
  },
  description:
    "The personal website of Manoj Gowda — a collection of projects, writing, and ideas about building for the web.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://manojgowda.iotkit.in",
    siteName: "Manoj Gowda",
    title: "Manoj Gowda — Developer, builder, curious human",
    description: "A collection of projects, writing, and ideas about building for the web.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manoj Gowda — Developer, builder, curious human",
    description: "A collection of projects, writing, and ideas about building for the web.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
