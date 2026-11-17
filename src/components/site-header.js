"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

const profileLinks = [
  { href: "https://manojgowda.in", label: "Main website" },
  { href: "https://manojgowda.in/contact", label: "Contact" },
  { href: "https://manojgowda.in/linkedin", label: "LinkedIn" },
  { href: "https://manojgowda.in/github", label: "GitHub" },
  { href: "https://manojgowda.in/instagram", label: "Instagram" },
  { href: "https://manojgowda.in/skills", label: "Skills" },
  { href: "https://manojgowda.in/experience", label: "Experience" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Manoj Gowda home">
          <Image
            className="wordmark-logo"
            src="https://cdn.manojgowda.qzz.io/manojgowdaimg.svg"
            alt="Manoj Gowda"
            width={32}
            height={32}
          />
          <span className="wordmark-name">manoj gowda</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <div className="nav-group">
            {navLinks.map(({ href, label }) => (
              <Link
                aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
                className={`nav-link${pathname === href || pathname.startsWith(`${href}/`) ? " nav-link-active" : ""}`}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
          <span className="nav-separator" />
          <ThemeToggle />
          <span className="nav-separator" />
          <div className="profile-links">
            {profileLinks.map(({ href, label }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="profile-link"
                key={href}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}