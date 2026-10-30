import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Code2, Layers3, PenLine, Briefcase, Server, Database, Globe } from "lucide-react";
import { getPublishedPosts, getPublishedProjects } from "../lib/content";

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

const expertise = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "Building scalable web applications with React, Next.js, Node.js, and TypeScript. Focus on clean architecture, performance, and developer experience.",
  },
  {
    icon: Server,
    title: "DevOps & Cloud",
    description: "Designing and operating cloud infrastructure on AWS. CI/CD pipelines, containerization with Docker, infrastructure as code, and observability.",
  },
  {
    icon: Database,
    title: "Data & Backend",
    description: "Database design (PostgreSQL, DynamoDB), API development (REST, GraphQL), real-time systems, and event-driven architectures.",
  },
  {
    icon: Globe,
    title: "Mobile & IoT",
    description: "Cross-platform mobile apps with React Native, Android native development, and IoT platform integrations for connected devices.",
  },
];

const experience = [
  {
    role: "Team Lead & Software Engineer",
    company: "Independent / Startup Engineer",
    period: "2021 — Present",
    details: "Leading end-to-end product development for early-stage startups. Architecture decisions, team mentorship, and hands-on delivery across web, mobile, and cloud.",
  },
  {
    role: "Senior Software Engineer",
    company: "Technology Companies",
    period: "2017 — 2021",
    details: "Built and scaled full-stack applications, designed microservices, and implemented DevOps practices. Worked across fintech, e-commerce, and SaaS domains.",
  },
  {
    role: "Software Engineer",
    company: "Early Career",
    period: "2014 — 2017",
    details: "Full-stack web development, Android applications, and backend services. Strong foundation in computer science principles and software craftsmanship.",
  },
];

const technologies = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS",
  "Docker", "Kubernetes", "Terraform", "React Native", "Android", "GraphQL",
  "Redis", "DynamoDB", "Prisma", "Tailwind CSS", "GitHub Actions",
];

export default async function Home() {
  const [projectsResult, postsResult] = await Promise.all([getPublishedProjects(), getPublishedPosts()]);
  const projects = projectsResult.items;
  const posts = postsResult.items;
  const contentSetupRequired =
    projectsResult.setupRequired === "configuration" || postsResult.setupRequired === "configuration"
      ? "configuration"
      : projectsResult.setupRequired || postsResult.setupRequired;
  const recentContent = [
    ...projects.filter((project) => project.is_featured).slice(0, 2).map((item) => ({
      ...item,
      type: "project",
      href: `/projects/${item.slug}`,
      excerpt: item.summary,
    })),
    ...posts.slice(0, 2).map((item) => ({
      ...item,
      type: "post",
      href: `/blog/${item.slug}`,
      excerpt: item.excerpt,
    })),
  ].slice(0, 3);

  return (
    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> A personal corner of the internet</p>
          <h1>Making the web a little more <span>thoughtful.</span></h1>
          <p className="hero-description">
            I&apos;m <strong>Manoj Gowda</strong>, a Team Lead & Software Engineer based in Bengaluru.
            I build full-stack web applications, design cloud infrastructure, and write about the craft.
            This is where I share the projects I&apos;m working on, the things I&apos;m learning, and ideas I hope are useful to someone else.
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

      <section className="about-section section-wrap" id="about">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Who I am</p>
            <h2>Software engineer.<br />Team lead.<br />Builder.</h2>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-bio">
            <p>
              I&apos;ve been writing code professionally for over a decade. My journey started with Android and
              backend services, evolved through full-stack web development, and now centers on leading
              engineering teams and architecting systems that scale.
            </p>
            <p>
              Today I work as an independent engineer helping startups go from idea to production. I care deeply
              about clean code, thoughtful architecture, and building tools that make developers&apos; lives easier.
              When I&apos;m not coding, I&apos;m probably reading about distributed systems, experimenting with new
              frameworks, or sharing what I&apos;ve learned here.
            </p>
            <p>
              <strong>Core strengths:</strong> Full-stack development (React, Next.js, Node.js), cloud infrastructure
              (AWS, Docker, Terraform), DevOps culture, database design, and mentoring engineering teams.
            </p>
          </div>
          <div className="about-experience">
            <h3>Experience</h3>
            <dl className="experience-list">
              {experience.map((exp, i) => (
                <div key={i} className="experience-item">
                  <dt>
                    <strong>{exp.role}</strong> <span className="exp-company">— {exp.company}</span>
                  </dt>
                  <dd className="exp-period">{exp.period}</dd>
                  <dd className="exp-details">{exp.details}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="expertise-section section-wrap" id="expertise">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What I do</p>
            <h2>Areas of <span>expertise.</span></h2>
          </div>
        </div>
        <div className="expertise-grid">
          {expertise.map((item, i) => (
            <article className="expertise-card" key={i}>
              <span className="expertise-icon"><item.icon size={22} strokeWidth={1.7} aria-hidden="true" /></span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tech-section section-wrap" id="technologies">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tools of the trade</p>
            <h2>Technologies <span>I work with.</span></h2>
          </div>
        </div>
        <ul className="tech-tag-list" aria-label="Technologies">
          {technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </section>

      {contentSetupRequired && (
        <div className="section-wrap setup-notice" role="status">
          {contentSetupRequired === "configuration"
            ? "Supabase rejected the configured API key. Check the publishable/anon key in .env.local and restart the site."
            : "Projects and writing will appear here after the Supabase content migration is applied."}
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      )}

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

      {recentContent.length > 0 && (
        <section className="recent-section section-wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fresh from the desk</p>
              <h2>Recent work & words.</h2>
            </div>
            <Link className="text-link" href="/blog">Browse everything <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="content-grid">
            {recentContent.map((item) => (
              <Link className="content-card" href={item.href} key={`${item.type}-${item.id}`}>
                <span className="content-card-meta">{item.type === "project" ? "FEATURED PROJECT" : "WRITING"}</span>
                <h2>{item.title}</h2>
                <p>{item.excerpt}</p>
                <span className="content-card-link">Read more <ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

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