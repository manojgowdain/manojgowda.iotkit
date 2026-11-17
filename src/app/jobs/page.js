/**
 * Public Jobs Listing Page
 * /jobs - Displays all published jobs with filters and search
 */

import Link from "next/link";
import { ArrowRight, ExternalLink, Briefcase, Building2, Monitor, Clock, MapPin, GraduationCap, Plus } from "lucide-react";
import { getPublishedJobs } from "../../lib/content";

export async function generateMetadata() {
  return {
    title: "Jobs & Careers",
    description: "Explore latest job openings across IT, engineering, healthcare, finance, and more. Find your next opportunity with Manoj Gowda's curated job listings.",
    alternates: { canonical: "https://manojgowda.iotkit.in/jobs" },
    openGraph: {
      type: "website",
      url: "https://manojgowda.iotkit.in/jobs",
      title: "Jobs & Careers",
      description: "Explore latest job openings across IT, engineering, healthcare, finance, and more.",
      siteName: "Manoj Gowda",
      images: [{ url: "https://cdn.manojgowda.qzz.io/manojgowdaimg.svg", width: 1200, height: 630, alt: "Jobs & Careers" }],
    },
    twitter: { card: "summary_large_image", title: "Jobs & Careers", description: "Explore latest job openings across IT, engineering, healthcare, finance, and more.", images: ["https://cdn.manojgowda.qzz.io/manojgowdaimg.svg"], creator: "@manojgowdain" },
    robots: { index: true, follow: true },
  };
}

export default async function JobsPage() {
  const { items: jobs = [], setupRequired } = await getPublishedJobs();

  return (
    <main className="page-main section-wrap">
      <section className="jobs-header section-wrap">
        <div className="section-heading">
          <p className="eyebrow">JOBS & CAREERS</p>
          <h1>Find Your Next <span>Opportunity.</span></h1>
          <p className="section-heading-note">Explore opportunities across IT, engineering, healthcare, finance, government, and more.</p>
        </div>

        {/* Submit Job Button */}
        <div className="jobs-actions">
          <Link className="button button-primary" href="/jobs/submit">
            <Plus size={15} aria-hidden="true" /> Post a Job
          </Link>
        </div>
      </section>

      {setupRequired ? (
        <div className="section-wrap setup-notice" role="status">
          <p>Jobs functionality requires Supabase setup. Apply the content migration to enable job listings.</p>
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase <ExternalLink size={13} aria-hidden="true" /></a>
        </div>
      ) : jobs.length === 0 ? (
        <section className="empty-state">
          <Briefcase size={48} strokeWidth={2} aria-hidden="true" />
          <p className="eyebrow">NO JOBS YET</p>
          <h2>No open positions right now.</h2>
          <p>Check back soon for new job opportunities.</p>
          <Link className="button button-primary" href="/jobs/submit">
            Post a Job <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <>
          {/* Filters */}
          <section className="jobs-filters section-wrap">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Organization</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>PSU</option>
                  <option>Banking</option>
                  <option>Railway</option>
                  <option>Defence</option>
                  <option>Teaching</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>IT</option>
                  <option>Engineering</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Finance</option>
                  <option>Administration</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Employment Type</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Apprenticeship</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Work Mode</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Experience</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Fresher</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Location</label>
                <select className="filter-select">
                  <option>All</option>
                  <option>Bangalore</option>
                  <option>Delhi</option>
                  <option>Mumbai</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
                  <option>Chennai</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>
            <div className="filters-actions">
              <input type="text" className="search-input" placeholder="Search jobs by title, company, or skills..." />
              <button className="button button-primary">Apply Filters</button>
            </div>
          </section>

          {/* Jobs Grid */}
          <section className="jobs-grid section-wrap">
            <div className="jobs-count">
              <span>{jobs.length}</span> jobs found
            </div>
            <div className="jobs-list">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function JobCard({ job }) {
  const badgeColor = job.organization_type === "GOVERNMENT" ? "badge-gov" : "badge-private";
  const badgeText = job.organization_type === "GOVERNMENT" ? "GOVERNMENT" : job.organization_type === "PRIVATE" ? "PRIVATE" : job.organization_type || "OTHER";
  const salaryText = job.salary_disclosed && job.salary_min && job.salary_max
    ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
    : "Not disclosed";
  const experienceText = job.experience_min && job.experience_max
    ? `${job.experience_min}-${job.experience_max} years`
    : "Not specified";
  const openBadge = job.is_open ? "badge-open" : "badge-closed";
  const openText = job.is_open ? "Open" : "Closed";

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="job-badges">
          <span className={`badge ${badgeColor}`}>{badgeText}</span>
          <span className={`badge ${openBadge}`}>{openText}</span>
          {job.is_featured && <span className="badge badge-featured">Featured</span>}
        </div>
        <h3 className="job-title">
          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
        </h3>
        <div className="job-company">
          <Building2 size={16} aria-hidden="true" />
          <span>{job.organization_name}</span>
        </div>
      </div>

      <div className="job-details">
        <div className="job-detail-item">
          <Monitor size={14} aria-hidden="true" />
          <span>{job.work_mode || "Not specified"}</span>
        </div>
        <div className="job-detail-item">
          <Clock size={14} aria-hidden="true" />
          <span>{experienceText}</span>
        </div>
        <div className="job-detail-item">
          <MapPin size={14} aria-hidden="true" />
          <span>{job.location_city || job.location_state || "Remote"}</span>
        </div>
        <div className="job-detail-item">
          <GraduationCap size={14} aria-hidden="true" />
          <span>{job.openings || 1} opening{job.openings !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="job-salary">
        <span className="salary-text">{salaryText}</span>
      </div>

      <div className="job-actions">
        {job.is_open ? (
          <Link className="button button-primary" href={`/jobs/${job.slug}`}>
            Apply Now <ExternalLink size={14} aria-hidden="true" />
          </Link>
        ) : (
          <button className="button button-outline" disabled>Closed</button>
        )}
        <Link className="text-link" href={`/jobs/${job.slug}`}>
          View Details <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}