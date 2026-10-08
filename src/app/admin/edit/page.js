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
  if (kind !== "project" && kind !== "post") redirect("/admin");
  const table = kind === "project" ? "projects" : "posts";
  const id = typeof params.id === "string" ? params.id : "";
  const { supabase } = await requireAdmin();
  const { data: item, error } = id
    ? await supabase.from(table).select("*").eq("id", id).single()
    : { data: null, error: null };

  if (error) {
    if (error.code === "PGRST116") notFound();
    throw new Error(`Unable to load this ${kind}.`, { cause: error });
  }

  const summary = kind === "project" ? item?.summary : item?.excerpt;
  const description = kind === "project" ? item?.description : item?.body;
  const tags = kind === "project" ? item?.technologies : item?.tags;
  const imageUrl = kind === "project" ? item?.image_url : item?.cover_image_url;

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
          <label htmlFor="summary">{kind === "project" ? "Summary" : "Excerpt"}</label>
          <textarea id="summary" name="summary" rows={3} maxLength={500} defaultValue={summary || ""} />
          <label htmlFor="description">{kind === "project" ? "Project details" : "Post content"}</label>
          <textarea id="description" name="description" rows={12} maxLength={50000} defaultValue={description || ""} />
          <label htmlFor="tags">{kind === "project" ? "Technologies" : "Tags"} <span className="label-hint">(comma separated)</span></label>
          <input id="tags" name="tags" maxLength={2000} defaultValue={tags?.join(", ") || ""} />
          <MediaUrlInput
            id="image_url"
            name="image_url"
            label={kind === "project" ? "Project image" : "Cover image"}
            defaultValue={imageUrl || ""}
            mediaType="image"
          />
          <MediaUrlInput
            id="video_url"
            name="video_url"
            label="Video"
            defaultValue={item?.video_url || ""}
            mediaType="video"
          />
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
          <label className="checkbox-row"><input type="checkbox" name="is_published" defaultChecked={item?.is_published || false} /> Publish this {kind}</label>
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
