import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers3 } from "lucide-react";
import { getPublishedProjects } from "../../lib/content";
import pageMetadata from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects and experiments by Manoj Gowda — web, mobile, IoT, and cloud products built with React, Node.js, and AWS.",
  path: "/projects",
  section: "Technology",
  keywords: [
    "Manoj Gowda projects",
    "React projects",
    "Node.js",
    "AWS",
    "IoT",
    "Android",
    "React Native",
    "open source",
  ],
});

export default async function ProjectsPage() {
  const { items: projects, setupRequired } = await getPublishedProjects();

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
      <section className="listing-intro">
        <p className="eyebrow">Things made with intention</p>
        <h1>Selected <span>projects.</span></h1>
        <p>A growing collection of work, experiments, and useful things.</p>
      </section>
      {setupRequired ? (
        <p className="setup-notice" role="status">
          {setupRequired === "configuration"
            ? "Supabase rejected the configured API key. Check .env.local and restart the site."
            : "The Supabase content tables are not set up yet. Apply the migration described in the project README to publish projects here."}
        </p>
      ) : projects.length === 0 ? (
        <section className="empty-state">
          <span className="empty-state-icon"><Layers3 size={24} strokeWidth={1.6} aria-hidden="true" /></span>
          <p className="eyebrow">WORK IN PROGRESS</p>
          <h2>Good things take a little time.</h2>
          <p>Projects will find their way here soon. In the meantime, feel free to say hello.</p>
          <Link className="text-link" href="/contact">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </section>
      ) : (
        <section className="content-grid" aria-label="Published projects">
          {projects.map((project) => (
            <Link className="content-card" href={`/projects/${project.slug}`} key={project.id}>
              <span className="content-card-meta">
                {project.is_featured ? "FEATURED PROJECT" : "PROJECT"}
              </span>
              <h2>{project.title}</h2>
              <p>{project.summary}</p>
              <span className="content-card-link">Explore project <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
