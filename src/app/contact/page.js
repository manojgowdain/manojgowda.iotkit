import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Globe2, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Manoj Gowda about a project, an idea, or just to say hello.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Manoj Gowda",
    description: "Have a project or an idea? Get in touch with Manoj.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="page-main section-wrap">
      <Link className="back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
      <section className="contact-page-intro">
        <p className="eyebrow"><span className="status-dot" /> The conversation starts here</p>
        <h1>Let&apos;s make<br /><span>something good.</span></h1>
        <p className="contact-lede">
          Have a project in mind, a question, or something interesting to share?
          I&apos;d love to hear from you.
        </p>
      </section>
      <section className="contact-options" aria-label="Ways to get in touch">
        <a className="contact-option-card" href="https://manojgowda.in/contact" target="_blank" rel="noreferrer">
          <span className="contact-option-icon"><MessageCircle size={20} aria-hidden="true" /></span>
          <span className="contact-option-copy">
            <span className="contact-option-label">SEND A MESSAGE</span>
            <span className="contact-option-title">Use the contact form</span>
            <span className="contact-option-detail">Head to my main site to leave a note.</span>
          </span>
          <ArrowUpRight className="contact-option-arrow" size={19} aria-hidden="true" />
        </a>
        <a className="contact-option-card" href="https://manojgowda.in" target="_blank" rel="noreferrer">
          <span className="contact-option-icon"><Globe2 size={20} aria-hidden="true" /></span>
          <span className="contact-option-copy">
            <span className="contact-option-label">MY MAIN WEBSITE</span>
            <span className="contact-option-title">manojgowda.in</span>
            <span className="contact-option-detail">More about me and what I do.</span>
          </span>
          <ArrowUpRight className="contact-option-arrow" size={19} aria-hidden="true" />
        </a>
      </section>
      <p className="contact-note">I usually reply as soon as I can. Thanks for stopping by.</p>
    </main>
  );
}
