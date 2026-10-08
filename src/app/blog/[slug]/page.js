import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPublishedPost } from "../../../lib/content";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
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
    image: post.cover_image_url || undefined,
    author: { "@type": "Person", name: "Manoj Gowda" },
    mainEntityOfPage: `https://manojgowda.iotkit.in/blog/${post.slug}`,
  };

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/blog"><ArrowLeft size={15} aria-hidden="true" /> All writing</Link>
      <article className="article-page">
        {post.cover_image_url && (
          <img className="article-cover" src={post.cover_image_url} alt="" />
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
