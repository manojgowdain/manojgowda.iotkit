import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { requireAdmin } from "../../../lib/admin";
import { saveContent, deleteContent } from "../actions";
import DeleteContentButton from "../../../components/delete-content-button";
import MediaUrlInput from "../../../components/media-url-input";

export const metadata = {
  title: "Edit content",
  robots: { index: false, follow: false },
};

export default async function EditContentPage({ searchParams }) {
  const params = await searchParams;
  const kind = params?.kind;
  if (kind !== "project" && kind !== "post" && kind !== "job") redirect("/admin");
  const table = kind === "project" ? "projects" : kind === "post" ? "posts" : "jobs";
  const id = typeof params.id === "string" ? params.id : "";
  const { supabase } = await requireAdmin();
  const { data: item, error } = id
    ? await supabase.from(table).select("*").eq("id", id).single()
    : { data: null, error: null };

  if (error) {
    if (error.code === "PGRST116") notFound();
    throw new Error(`Unable to load this ${kind}.`, { cause: error });
  }

  const summary = kind === "project" ? item?.summary : kind === "post" ? item?.excerpt : item?.short_description;
  const description = kind === "project" ? item?.description : kind === "post" ? item?.body : item?.description;
  const tags = kind === "project" ? item?.technologies : kind === "post" ? item?.tags : item?.skills;
  const imageUrl = kind === "project" ? item?.image_url : kind === "post" ? item?.cover_image_url : item?.organization_logo;

  return (
    <main className="admin-main section-wrap">
      <Link className="back-link" href="/admin"><ArrowLeft size={15} aria-hidden="true" /> Back to admin</Link>
      <section className="admin-panel admin-editor">
        <p className="eyebrow">{item ? "EDIT" : "NEW"} {kind.toUpperCase()}</p>
        <h1>{item ? "Update your content." : `Create a ${kind}.`}</h1>
        <p className="admin-intro">Drafts stay private until you publish them.</p>
        <form action={saveContent} className="admin-form">
          <input type="hidden" name="kind" value={kind} />
          {item && <input type="hidden" name="id" value={item.id} />}
          <label htmlFor="title">Title</label>
          <input id="title" name="title" required maxLength={180} defaultValue={item?.title || ""} />
          <label htmlFor="slug">URL slug</label>
          <input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={180} defaultValue={item?.slug || ""} />
          <label htmlFor="summary">{kind === "project" ? "Summary" : kind === "post" ? "Excerpt" : "Short Description"}</label>
          <textarea id="summary" name="summary" rows={3} maxLength={500} defaultValue={summary || ""} />
          <label htmlFor="description">{kind === "project" ? "Project details" : kind === "post" ? "Post content" : "Job Description"}</label>
          <textarea id="description" name="description" rows={12} maxLength={50000} defaultValue={description || ""} />
          <label htmlFor="tags">{kind === "project" ? "Technologies" : kind === "post" ? "Tags" : "Skills"} <span className="label-hint">(comma separated)</span></label>
          <input id="tags" name="tags" maxLength={2000} defaultValue={tags?.join(", ") || ""} />
          <MediaUrlInput
            id="image_url"
            name="image_url"
            label={kind === "project" ? "Project image" : kind === "post" ? "Cover image" : "Company Logo"}
            defaultValue={imageUrl || ""}
            mediaType="image"
          />
          {kind === "job" && (
            <>
              <label htmlFor="organization_name">Organization Name</label>
              <input id="organization_name" name="organization_name" maxLength={200} defaultValue={item?.organization_name || ""} />
              <label htmlFor="organization_type">Organization Type</label>
              <select id="organization_type" name="organization_type" defaultValue={item?.organization_type || ""}>
                <option value="">Select type</option>
                <option value="GOVERNMENT">Government</option>
                <option value="PRIVATE">Private</option>
                <option value="PSU">Public Sector Undertaking (PSU)</option>
                <option value="CENTRAL_GOVERNMENT">Central Government</option>
                <option value="STATE_GOVERNMENT">State Government</option>
                <option value="BANKING">Banking</option>
                <option value="RAILWAY">Railway</option>
                <option value="DEFENCE">Defence</option>
                <option value="TEACHING">Teaching</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
              </select>
              <label htmlFor="job_category">Job Category</label>
              <select id="job_category" name="job_category" defaultValue={item?.job_category || ""}>
                <option value="">Select category</option>
                <option value="IT">IT / Software</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="EDUCATION">Education</option>
                <option value="FINANCE">Finance</option>
                <option value="BANKING">Banking</option>
                <option value="ADMINISTRATION">Administration</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="OTHER">Other</option>
              </select>
              <label htmlFor="employment_type">Employment Type</label>
              <select id="employment_type" name="employment_type" defaultValue={item?.employment_type || ""}>
                <option value="">Select type</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
              <label htmlFor="work_mode">Work Mode</label>
              <select id="work_mode" name="work_mode" defaultValue={item?.work_mode || ""}>
                <option value="">Select mode</option>
                <option value="REMOTE">Remote</option>
                <option value="ON_SITE">On-site</option>
                <option value="HYBRID">Hybrid</option>
              </select>
              <label htmlFor="experience_min">Experience Min (Years)</label>
              <input id="experience_min" name="experience_min" type="number" min="0" max="50" defaultValue={item?.experience_min || ""} />
              <label htmlFor="experience_max">Experience Max (Years)</label>
              <input id="experience_max" name="experience_max" type="number" min="0" max="50" defaultValue={item?.experience_max || ""} />
              <label htmlFor="openings">Number of Openings</label>
              <input id="openings" name="openings" type="number" min="1" max="1000" defaultValue={item?.openings || ""} />
              <label htmlFor="location_city">City</label>
              <input id="location_city" name="location_city" maxLength={100} defaultValue={item?.location_city || ""} />
              <label htmlFor="location_state">State</label>
              <input id="location_state" name="location_state" maxLength={100} defaultValue={item?.location_state || ""} />
              <label htmlFor="salary_min">Minimum Salary (₹)</label>
              <input id="salary_min" name="salary_min" type="number" min="0" defaultValue={item?.salary_min || ""} />
              <label htmlFor="salary_max">Maximum Salary (₹)</label>
              <input id="salary_max" name="salary_max" type="number" min="0" defaultValue={item?.salary_max || ""} />
              <label className="checkbox-row"><input type="checkbox" name="salary_disclosed" defaultChecked={item?.salary_disclosed || false} /> Disclose Salary Range</label>
              <label className="checkbox-row"><input type="checkbox" name="is_remote" defaultChecked={item?.is_remote || false} /> Remote Position</label>
              <label className="checkbox-row"><input type="checkbox" name="is_featured" defaultChecked={item?.is_featured || false} /> Feature on the site</label>
              <label className="checkbox-row"><input type="checkbox" name="is_verified" defaultChecked={item?.is_verified || false} /> Verified Organization</label>
              <label htmlFor="application_url">Application URL</label>
              <input id="application_url" name="application_url" type="url" maxLength={2000} defaultValue={item?.application_url || ""} />
              <label htmlFor="application_email">Application Email</label>
              <input id="application_email" name="application_email" type="email" maxLength={200} defaultValue={item?.application_email || ""} />
              <label htmlFor="application_deadline">Application Deadline</label>
              <input id="application_deadline" name="application_deadline" type="date" defaultValue={item?.application_deadline ? item.application_deadline.split("T")[0] : ""} />
              <label htmlFor="contact_name">Contact Person</label>
              <input id="contact_name" name="contact_name" maxLength={200} defaultValue={item?.contact_name || ""} />
              <label htmlFor="contact_email">Contact Email</label>
              <input id="contact_email" name="contact_email" type="email" maxLength={200} defaultValue={item?.contact_email || ""} />
              <label htmlFor="contact_phone">Contact Phone</label>
              <input id="contact_phone" name="contact_phone" maxLength={50} defaultValue={item?.contact_phone || ""} />
            </>
          )}
          {kind === "project" && (
            <>
              <label htmlFor="project_url">Project URL</label>
              <input id="project_url" name="project_url" type="url" maxLength={2000} defaultValue={item?.project_url || ""} />
              <label htmlFor="source_url">Source code URL</label>
              <input id="source_url" name="source_url" type="url" maxLength={2000} defaultValue={item?.source_url || ""} />
              <label className="checkbox-row"><input type="checkbox" name="is_featured" defaultChecked={item?.is_featured || false} /> Feature on the site</label>
            </>
          )}
          <div className="seo-fields">
            <p className="eyebrow">SEARCH & SOCIAL</p>
            <label htmlFor="seo_title">SEO title <span className="label-hint">(optional)</span></label>
            <input id="seo_title" name="seo_title" maxLength={180} defaultValue={item?.seo_title || ""} />
            <label htmlFor="seo_description">SEO description <span className="label-hint">(optional)</span></label>
            <textarea id="seo_description" name="seo_description" rows={3} maxLength={320} defaultValue={item?.seo_description || ""} />
          </div>
          {kind === "job" ? (
            <label className="checkbox-row"><input type="checkbox" name="is_published" defaultChecked={item?.is_published || false} /> Publish this job</label>
          ) : (
            <label className="checkbox-row"><input type="checkbox" name="is_published" defaultChecked={item?.is_published || false} /> Publish this {kind}</label>
          )}
          <div className="admin-form-actions">
            <Button type="submit">{item ? "Save changes" : `Create ${kind}`}</Button>
          </div>
        </form>
        {item && (
          <form action={deleteContent} className="admin-delete-form">
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="id" value={item.id} />
            <DeleteContentButton />
          </form>
        )}
      </section>
    </main>
  );
}
