"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Manoj Gowda home">
          <img className="wordmark-logo" src="https://cdn.manojgowda.qzz.io/manojgowdaimg.svg" alt="" />
          <span className="wordmark-name">manoj gowda</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link
              aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}
              className={`nav-link${pathname === href || pathname.startsWith(`${href}/`) ? " nav-link-active" : ""}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
