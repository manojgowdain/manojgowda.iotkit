import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedProject } from "../../../lib/content";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const title = project.seo_title || project.title;
  const description = project.seo_description || project.summary;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/projects/${project.slug}`,
      images: project.image_url ? [project.image_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/projects"><ArrowLeft size={15} aria-hidden="true" /> All projects</Link>
      <article className="article-page">
        {project.image_url && (
          <img className="article-cover" src={project.image_url} alt="" />
        )}
        <p className="eyebrow">PROJECT{project.is_featured ? " · FEATURED" : ""}</p>
        <h1>{project.title}</h1>
        <p className="article-excerpt">{project.summary}</p>
        {project.technologies?.length > 0 && (
          <ul className="tag-list" aria-label="Technologies">
            {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        )}
        <div className="article-body">{project.description}</div>
        <div className="article-actions">
          {project.project_url && <a className="button button-primary" href={project.project_url} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={15} aria-hidden="true" /></a>}
          {project.source_url && <a className="text-link" href={project.source_url} target="_blank" rel="noreferrer">View source <ArrowUpRight size={15} aria-hidden="true" /></a>}
        </div>
      </article>
    </main>
  );
}
