import { createClient } from "./server";

function throwContentError(kind, error) {
  console.error(`Unable to load ${kind} from Supabase:`, error);
  throw new Error(
    `Unable to load ${kind}. Confirm that the Supabase content migration has been applied and the environment variables are configured.`,
    { cause: error },
  );
}

function isMissingTable(error, table) {
  return (
    error?.code === "42P01" ||
    (error?.code === "PGRST205" && error.message?.includes(`public.${table}`))
  );
}

function isRejectedKey(error) {
  return error?.status === 401 || /invalid api key/i.test(error?.message ?? "");
}

function reportMissingTable(table) {
  console.warn(
    `Supabase table public.${table} is not available yet. Apply the content migration to enable publishing.`,
  );
}

export async function getPublishedProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error && isMissingTable(error, "projects")) {
    reportMissingTable("projects");
    return { items: [], setupRequired: "migration" };
  }
  if (error && isRejectedKey(error)) {
    console.error("Supabase rejected the public API key. Verify the publishable/anon key configured for this app.");
    return { items: [], setupRequired: "configuration" };
  }
  if (error) throwContentError("projects", error);
  return { items: data ?? [], setupRequired: null };
}

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error && isMissingTable(error, "posts")) {
    reportMissingTable("posts");
    return { items: [], setupRequired: "migration" };
  }
  if (error && isRejectedKey(error)) {
    console.error("Supabase rejected the public API key. Verify the publishable/anon key configured for this app.");
    return { items: [], setupRequired: "configuration" };
  }
  if (error) throwContentError("blog posts", error);
  return { items: data ?? [], setupRequired: null };
}

export async function getPublishedProject(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error && isMissingTable(error, "projects")) {
    reportMissingTable("projects");
    return null;
  }
  if (error && isRejectedKey(error)) {
    console.error("Supabase rejected the public API key. Verify the publishable/anon key configured for this app.");
    return null;
  }
  if (error) throwContentError(`project "${slug}"`, error);
  return data;
}

export async function getPublishedPost(slug) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error && isMissingTable(error, "posts")) {
    reportMissingTable("posts");
    return null;
  }
  if (error && isRejectedKey(error)) {
    console.error("Supabase rejected the public API key. Verify the publishable/anon key configured for this app.");
    return null;
  }
  if (error) throwContentError(`blog post "${slug}"`, error);
  return data;
}
