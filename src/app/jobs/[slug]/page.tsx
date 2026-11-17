/**
 * Job Detail Page
 * /jobs/[slug] - Displays full job details with Apply button
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Copy, Building2, Monitor, Clock, MapPin, GraduationCap, Share2 } from "lucide-react";
import Script from "next/script";
import { getPublishedJob } from "../../../lib/content";
import pageMetadata from "../../../lib/seo";
import { generateJobPostingSchema, generateBreadcrumbSchema } from "../../../lib/structured-data";
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const job = await getPublishedJob(params.slug);
  if (!job) return { title: "Job not found", robots: { index: false } };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";
  const title = job.title;
  const description = job.short_description || job.description?.slice(0, 160) || `Job opportunity: ${job.title} at ${job.organization_name}`;
  const imageUrl = job.organization_logo || "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg";

  return pageMetadata({
    title,
    description,
    path: `/jobs/${job.slug}`,
    image: imageUrl,
    type: "article",
    section: "Jobs",
  });
}

export default async function JobDetailPage({ params }) {
  const job = await getPublishedJob(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://manojgowda.iotkit.in";

  if (!job) {
    notFound();
  }

  const salaryText = job.salary_disclosed && job.salary_min && job.salary_max
    ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
    : "Not disclosed";
  const experienceText = job.experience_min && job.experience_max
    ? `${job.experience_min}-${job.experience_max} years`
    : "Not specified";

  const jobPostingSchema = generateJobPostingSchema({
    title: job.title,
    description: job.description || job.short_description || "",
    datePosted: job.created_at,
    validThrough: job.application_deadline,
    employmentType: job.employment_type || "FULL_TIME",
    hiringOrganization: {
      name: job.organization_name,
      url: job.organization_website || siteUrl,
    },
    jobLocation: {
      address: {
        addressLocality: job.location_city,
        addressRegion: job.location_state,
        addressCountry: job.location_country || "India",
      },
    },
    baseSalary: job.salary_disclosed && job.salary_min
      ? {
          currency: job.salary_currency || "INR",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min,
            maxValue: job.salary_max,
            unitText: job.salary_period || "YEARLY",
          },
        }
      : undefined,
    url: `${siteUrl}/jobs/${job.slug}`,
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Jobs", url: `${siteUrl}/jobs` },
    { name: job.title, url: `${siteUrl}/jobs/${job.slug}` },
  ]);

  return (
    <main className="page-main section-wrap">
      <section className="job-detail-header section-wrap">
        <div className="job-detail-back">
          <Link className="button button-outline" href="/jobs">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Jobs
          </Link>
        </div>
        <div className="job-detail-actions">
          <button className="button button-outline" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            <Copy size={15} aria-hidden="true" /> Copy Link
          </button>
          <button className="button button-outline" onClick={() => {
            if (navigator.share) {
              navigator.share({ title: job.title, url: window.location.href });
            }
          }}>
            <Share2 size={15} aria-hidden="true" /> Share
          </button>
        </div>
      </section>

      <section className="job-detail-content section-wrap">
        <div className="job-detail-main">
          <div className="job-detail-badges">
            <span className={`badge ${job.organization_type === "GOVERNMENT" ? "badge-gov" : "badge-private"}`}>
              {job.organization_type === "GOVERNMENT" ? "GOVERNMENT" : job.organization_type === "PRIVATE" ? "PRIVATE" : "OTHER"}
            </span>
            <span className={`badge ${job.is_open ? "badge-open" : "badge-closed"}`}>
              {job.is_open ? "Open" : "Closed"}
            </span>
            {job.is_featured && <span className="badge badge-featured">Featured</span>}
            {job.is_verified && <span className="badge badge-verified">Verified</span>}
          </div>

          <h1 className="job-detail-title">{job.title}</h1>

          <div className="job-detail-company">
            <Building2 size={24} aria-hidden="true" />
            <div>
              <h2>{job.organization_name}</h2>
              <p>{job.organization_industry || ""} • {job.organization_size || ""}</p>
            </div>
            {job.organization_website && (
              <a href={job.organization_website} target="_blank" rel="noreferrer" className="text-link">
                Visit Company <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="job-detail-description">
            <h3>Job Description</h3>
            <div dangerouslySetInnerHTML={{ __html: job.description || job.short_description || "" }} />
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="job-detail-section">
              <h3>Responsibilities</h3>
              <ul className="detail-list">
                {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="job-detail-section">
              <h3>Requirements</h3>
              <ul className="detail-list">
                {job.requirements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <div className="job-detail-section">
              <h3>Qualifications</h3>
              <ul className="detail-list">
                {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="job-detail-section">
              <h3>Skills</h3>
              <div className="skills-list">
                {job.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-detail-sidebar">
          <div className="job-detail-card">
            <h3>Apply Now</h3>
            {job.is_open ? (
              <>
                {job.application_url && (
                  <Link className="button button-primary" href={job.application_url} target="_blank" rel="noreferrer">
                    Apply Online <ExternalLink size={15} aria-hidden="true" />
                  </Link>
                )}
                {job.application_email && (
                  <a href={`mailto:${job.application_email}`} className="button button-primary" style={{ marginTop: "12px" }}>
                    Apply via Email
                  </a>
                )}
              </>
            ) : (
              <button className="button button-outline" disabled>Closed</button>
            )}
            {job.application_instructions && (
              <div className="application-instructions">
                <h4>How to Apply</h4>
                <p>{job.application_instructions}</p>
              </div>
            )}
          </div>

          <div className="job-detail-card">
            <h3>Job Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <Monitor size={16} aria-hidden="true" />
                <span>{job.work_mode || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} aria-hidden="true" />
                <span>{experienceText}</span>
              </div>
              <div className="detail-item">
                <MapPin size={16} aria-hidden="true" />
                <span>{job.location_city || job.location_state || "Remote"}</span>
              </div>
              <div className="detail-item">
                <GraduationCap size={16} aria-hidden="true" />
                <span>{job.education_min_qualification || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="label">Openings</span>
                <span>{job.openings || 1}</span>
              </div>
              <div className="detail-item">
                <span className="label">Salary</span>
                <span>{salaryText}</span>
              </div>
              {job.application_deadline && (
                <div className="detail-item">
                  <span className="label">Deadline</span>
                  <span>{new Date(job.application_deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {job.contact_name || job.contact_email || job.contact_phone && (
            <div className="job-detail-card">
              <h3>Contact</h3>
              <div className="contact-info">
                {job.contact_name && <p><strong>{job.contact_name}</strong> - {job.contact_designation || ""}</p>}
                {job.contact_email && <p><a href={`mailto:${job.contact_email}`}>{job.contact_email}</a></p>}
                {job.contact_phone && <p>{job.contact_phone}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <Script
        id="job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jobPostingSchema, breadcrumbs]).replace(/</g, "\\u003c") }}
        strategy="lazyOnload"
      />
    </main>
  );
}