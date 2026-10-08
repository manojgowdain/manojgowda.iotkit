"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/server";
import { requireAdmin } from "../../lib/admin";

function getTable(kind) {
  if (kind === "project") return "projects";
  if (kind === "post") return "posts";
  throw new Error("Choose a valid content type.");
}

function getText(formData, name, maxLength) {
  const value = formData.get(name);
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new Error(`${name} must be shorter than ${maxLength} characters.`);
  return trimmed;
}

function getList(formData, name) {
  return getText(formData, name, 2000)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 40);
}

export async function signIn(formData) {
  const email = getText(formData, "email", 320);
  const password = formData.get("password");

  if (!email || typeof password !== "string" || !password) {
    redirect("/admin/login?error=missing");
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    if (/invalid api key/i.test(signInError.message)) {
      redirect("/admin/login?error=configuration");
    }
    redirect("/admin/login?error=invalid");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    await supabase.auth.signOut();
    throw new Error("Unable to verify the signed-in account.", { cause: userError });
  }
  if (!user) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=invalid");
  }

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    await supabase.auth.signOut();
    throw new Error("Unable to verify admin access. Apply the Supabase migration first.", {
      cause: adminError,
    });
  }

  if (!adminRecord) {
    await supabase.auth.signOut();
    redirect("/admin/login?unauthorized=1");
  }

  redirect("/admin");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Unable to sign out.", { cause: error });
  redirect("/admin/login");
}

export async function saveContent(formData) {
  const { supabase } = await requireAdmin();
  const kind = getText(formData, "kind", 20);
  const table = getTable(kind);
  const id = getText(formData, "id", 64);
  const title = getText(formData, "title", 180);
  const slug = getText(formData, "slug", 180);

  if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Enter a title and a lowercase, hyphen-separated URL slug.");
  }

  const isPublished = formData.get("is_published") === "on";
  const payload = {
    title,
    slug,
    is_published: isPublished,
    seo_title: getText(formData, "seo_title", 180) || null,
    seo_description: getText(formData, "seo_description", 320) || null,
  };

  if (kind === "project") {
    Object.assign(payload, {
      summary: getText(formData, "summary", 500),
      description: getText(formData, "description", 50000),
      technologies: getList(formData, "tags"),
      image_url: getText(formData, "image_url", 2000) || null,
      video_url: getText(formData, "video_url", 2000) || null,
      project_url: getText(formData, "project_url", 2000) || null,
      source_url: getText(formData, "source_url", 2000) || null,
      is_featured: formData.get("is_featured") === "on",
    });
  } else {
    Object.assign(payload, {
      excerpt: getText(formData, "summary", 500),
      body: getText(formData, "description", 50000),
      tags: getList(formData, "tags"),
      cover_image_url: getText(formData, "image_url", 2000) || null,
      video_url: getText(formData, "video_url", 2000) || null,
      published_at: isPublished ? new Date().toISOString() : null,
    });
  }

  if (kind === "post" && id && isPublished) {
    const { data: existing, error: existingError } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .single();

    if (existingError) throw new Error("Unable to load the existing post.", { cause: existingError });
    if (existing.published_at) payload.published_at = existing.published_at;
  }

  const result = id
    ? await supabase.from(table).update(payload).eq("id", id).select("id").single()
    : await supabase.from(table).insert(payload).select("id").single();

  if (result.error) {
    throw new Error(`Unable to save ${kind}. Check that the slug is unique and all fields are valid.`, {
      cause: result.error,
    });
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  redirect("/admin");
}

export async function deleteContent(formData) {
  const { supabase } = await requireAdmin();
  const kind = getText(formData, "kind", 20);
  const table = getTable(kind);
  const id = getText(formData, "id", 64);

  if (!id) throw new Error("The content item to delete is missing.");

  const { error } = await supabase.from(table).delete().eq("id", id).select("id").single();
  if (error) throw new Error(`Unable to delete ${kind}.`, { cause: error });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  redirect("/admin");
}
