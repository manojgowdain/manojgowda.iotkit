import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, PenLine } from "lucide-react";
import { getPublishedPosts } from "../../lib/content";
import pageMetadata from "../../lib/seo";

export async function generateMetadata() {
  const { items: posts, setupRequired } = await getPublishedPosts();
  const count = setupRequired ? null : posts.length;
  const description =
    count === null
      ? "Notes, ideas, and lessons learned by Manoj Gowda."
      : count > 0
        ? `${count} article${count === 1 ? "" : "s"} on software engineering, web development, and building for the internet. Notes, ideas, and lessons learned by Manoj Gowda.`
        : "Notes, ideas, and lessons learned by Manoj Gowda — new articles coming soon.";

  return pageMetadata({
    title: "Writing",
    description,
    path: "/blog",
    section: "Technology",
    keywords: [
      "Manoj Gowda blog",
      "software engineering",
      "React",
      "Node.js",
      "DevOps",
      "AWS",
      "web development",
      "engineering notes",
    ],
  });
}

export default async function BlogPage() {
  const { items: posts, setupRequired } = await getPublishedPosts();

  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
      <section className="listing-intro">
        <p className="eyebrow">Notes from the process</p>
        <h1>Things I&apos;ve <span>been thinking.</span></h1>
        <p>Ideas, notes, and lessons worth passing along.</p>
      </section>
      {setupRequired ? (
        <p className="setup-notice" role="status">
          {setupRequired === "configuration"
            ? "Supabase rejected the configured API key. Check .env.local and restart the site."
            : "The Supabase content tables are not set up yet. Apply the migration described in the project README to publish writing here."}
        </p>
      ) : posts.length === 0 ? (
        <section className="empty-state">
          <span className="empty-state-icon"><PenLine size={24} strokeWidth={1.6} aria-hidden="true" /></span>
          <p className="eyebrow">THE FIRST NOTE IS BREWING</p>
          <h2>Words are on their way.</h2>
          <p>There aren&apos;t any posts just yet. Check back soon for notes from the work.</p>
          <Link className="text-link" href="/contact">Until then, say hello <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </section>
      ) : (
        <section className="content-grid" aria-label="Published blog posts">
          {posts.map((post) => (
            <Link className="content-card" href={`/blog/${post.slug}`} key={post.id}>
              <span className="content-card-meta">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "ARTICLE"}
              </span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="content-card-link">Read article <ArrowRight size={15} aria-hidden="true" /></span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}