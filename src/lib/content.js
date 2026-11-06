import { createClient } from "./server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

// Create a cookie-less Supabase client for static generation (build-time)
// This is needed because generateStaticParams runs at build time without cookies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const staticSupabase = supabaseUrl && supabaseKey
  ? createSupabaseClient(supabaseUrl, supabaseKey)
  : null;

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

// Cookie-less version for static generation at build time
export async function getPublishedProjectsForStatic() {
  if (!staticSupabase) {
    return { items: [], setupRequired: "configuration" };
  }
  const { data, error } = await staticSupabase
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

// Cookie-less version for static generation at build time
export async function getPublishedPostsForStatic() {
  if (!staticSupabase) {
    return { items: [], setupRequired: "configuration" };
  }
  const { data, error } = await staticSupabase
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
