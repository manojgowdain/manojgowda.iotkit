import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Code2, Layers3, PenLine } from "lucide-react";

const highlights = [
  {
    number: "01",
    title: "Selected projects",
    description: "A home for useful things I've built and ideas I've brought to life.",
    href: "/projects",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Notes & writing",
    description: "Practical notes, lessons learned, and thoughts worth sharing.",
    href: "/blog",
    icon: PenLine,
  },
  {
    number: "03",
    title: "The craft",
    description: "A little about the tools and principles behind the work.",
    href: "/contact",
    icon: Code2,
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> A personal corner of the internet</p>
          <h1>Making the web a little more <span>thoughtful.</span></h1>
          <p className="hero-description">
            I&apos;m Manoj Gowda. This is where I share the projects I&apos;m working on,
            the things I&apos;m learning, and ideas I hope are useful to someone else.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/projects">
              Explore my work <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/contact">
              Get in touch <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstract illustration of a creative workspace">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-sun" />
          <div className="art-card">
            <span className="art-card-label">A note to self</span>
            <span className="art-card-title">Stay curious.<br />Build with care.</span>
            <span className="art-card-rule" />
            <span className="art-card-footer">MANOJ GOWDA <ArrowDownRight size={15} /></span>
          </div>
          <span className="art-caption">Ideas, in progress <span>↗</span></span>
        </div>
        <a className="scroll-cue" href="#explore" aria-label="Scroll to explore">
          <span>SCROLL TO EXPLORE</span><ArrowDownRight size={15} aria-hidden="true" />
        </a>
      </section>

      <section className="intro-strip">
        <div className="section-wrap intro-inner">
          <p className="eyebrow">A little about this space</p>
          <p className="intro-statement">
            A living collection of <span>work, words, and what I&apos;m learning</span> along the way.
          </p>
        </div>
      </section>

      <section className="explore-section section-wrap" id="explore">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Find your way around</p>
            <h2>A few things to explore.</h2>
          </div>
          <p className="section-heading-note">More is on the way. Start anywhere.</p>
        </div>
        <div className="highlight-grid">
          {highlights.map(({ number, title, description, href, icon: Icon }) => (
            <Link className="highlight-card" href={href} key={number}>
              <div className="highlight-top">
                <span className="highlight-number">{number}</span>
                <span className="highlight-icon"><Icon size={18} strokeWidth={1.7} aria-hidden="true" /></span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="card-link">Take a look <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-contact">
        <div className="section-wrap contact-banner">
          <div>
            <p className="eyebrow">Have something in mind?</p>
            <h2>Good things start with a hello.</h2>
          </div>
          <Link className="button button-light" href="/contact">
            Let&apos;s talk <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <span className="banner-decoration" aria-hidden="true">✳</span>
        </div>
      </section>
    </main>
  );
}
