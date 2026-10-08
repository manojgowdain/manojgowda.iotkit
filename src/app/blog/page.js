import Link from "next/link";
import { ArrowLeft, ArrowUpRight, PenLine } from "lucide-react";

export const metadata = {
  title: "Writing",
  description: "Notes, ideas, and lessons learned by Manoj Gowda.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
      <section className="listing-intro">
        <p className="eyebrow">Notes from the process</p>
        <h1>Things I&apos;ve <span>been thinking.</span></h1>
        <p>Ideas, notes, and lessons worth passing along.</p>
      </section>
      <section className="empty-state">
        <span className="empty-state-icon"><PenLine size={24} strokeWidth={1.6} aria-hidden="true" /></span>
        <p className="eyebrow">THE FIRST NOTE IS BREWING</p>
        <h2>Words are on their way.</h2>
        <p>There aren&apos;t any posts just yet. Check back soon for notes from the work.</p>
        <Link className="text-link" href="/contact">Until then, say hello <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
