import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Layers3 } from "lucide-react";

export const metadata = {
  title: "Projects",
  description: "Projects and experiments by Manoj Gowda.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
      <section className="listing-intro">
        <p className="eyebrow">Things made with intention</p>
        <h1>Selected <span>projects.</span></h1>
        <p>A growing collection of work, experiments, and useful things.</p>
      </section>
      <section className="empty-state">
        <span className="empty-state-icon"><Layers3 size={24} strokeWidth={1.6} aria-hidden="true" /></span>
        <p className="eyebrow">WORK IN PROGRESS</p>
        <h2>Good things take a little time.</h2>
        <p>Projects will find their way here soon. In the meantime, feel free to say hello.</p>
        <Link className="text-link" href="/contact">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
