import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedProject } from "../../../lib/content";
import pageMetadata from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const title = project.seo_title || project.title;
  const description = project.seo_description || project.summary;
  const imageUrl = project.image_url || "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg";

  return pageMetadata({
    title,
    description,
    path: `/projects/${project.slug}`,
    image: imageUrl,
    type: "website",
    section: "Technology",
    keywords: project.technologies?.length ? project.technologies : undefined,
    authors: ["Manoj Gowda"],
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.seo_description || project.summary,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, Cloud",
    image: project.image_url || "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg",
    author: { "@type": "Person", name: "Manoj Gowda", url: "https://manojgowda.iotkit.in" },
    publisher: {
      "@type": "Person",
      name: "Manoj Gowda",
      url: "https://manojgowda.iotkit.in",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: project.technologies?.length ? project.technologies : [],
    url: project.project_url || `${"https://manojgowda.iotkit.in"}/projects/${project.slug}`,
    codeRepository: project.source_url || undefined,
    datePublished: project.created_at,
    dateModified: project.updated_at,
  };

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/projects"><ArrowLeft size={15} aria-hidden="true" /> All projects</Link>
      <article className="article-page">
        {project.image_url && (
          <div className="article-cover-wrapper">
            <Image
              className="article-cover"
              src={project.image_url}
              alt={project.title}
              width={800}
              height={450}
              priority
            />
          </div>
        )}
        {project.video_url && (
          <video className="article-cover" src={project.video_url} controls preload="metadata">
            Your browser does not support the video element.
          </video>
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </article>
    </main>
  );
}