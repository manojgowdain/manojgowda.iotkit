import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPost } from "../../../lib/content";
import pageMetadata, { siteMeta } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const imageUrl = post.cover_image_url || siteMeta.logoUrl;

  return pageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    image: imageUrl,
    type: "article",
    publishedTime: post.published_at || undefined,
    modifiedTime: post.updated_at || undefined,
    section: "Technology",
    keywords: post.tags?.length ? post.tags : undefined,
    authors: ["Manoj Gowda"],
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || siteMeta.logoUrl,
    author: { "@type": "Person", name: "Manoj Gowda", url: siteMeta.siteUrl },
    publisher: {
      "@type": "Person",
      name: "Manoj Gowda",
      url: siteMeta.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: siteMeta.logoUrl,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteMeta.siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/blog"><ArrowLeft size={15} aria-hidden="true" /> All writing</Link>
      <article className="article-page">
        {post.cover_image_url && (
          <div className="article-cover-wrapper">
            <Image
              className="article-cover"
              src={post.cover_image_url}
              alt={post.title}
              width={800}
              height={450}
              priority
            />
          </div>
        )}
        {post.video_url && (
          <video className="article-cover" src={post.video_url} controls preload="metadata">
            Your browser does not support the video element.
          </video>
        )}
        <p className="eyebrow">
          {post.published_at ? new Date(post.published_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "NOTES"}
        </p>
        <h1>{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>
        {post.tags?.length > 0 && (
          <ul className="tag-list" aria-label="Article tags">
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}
        <div className="article-body">{post.body}</div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </article>
    </main>
  );
}