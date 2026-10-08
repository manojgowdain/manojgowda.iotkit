import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const year = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-main">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/">
            <img className="wordmark-logo" src="https://cdn.manojgowda.qzz.io/manojgowdaimg.svg" alt="" />
            <span className="wordmark-name">manoj gowda</span>
          </Link>
          <p>A small corner of the internet for things worth building and sharing.</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">EXPLORE</span>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Writing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-column">
          <span className="footer-label">ELSEWHERE</span>
          <a href="https://manojgowda.in" target="_blank" rel="noreferrer">
            Main website <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://manojgowda.in/contact" target="_blank" rel="noreferrer">
            Contact Manoj <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="section-wrap footer-bottom">
        <span>© {year} Manoj Gowda. Made with care.</span>
        <a href="https://manojgowda.in" target="_blank" rel="noreferrer">manojgowda.in <ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </footer>
  );
}
