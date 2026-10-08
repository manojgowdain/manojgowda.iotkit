import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("Unable to verify your Supabase session.", { cause: userError });
  }

  if (!user) redirect("/admin/login");

  const { data: adminRecord, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new Error("Unable to verify admin access. Check the Supabase migration and RLS policies.", {
      cause: adminError,
    });
  }

  if (!adminRecord) redirect("/admin/login?unauthorized=1");

  return { supabase, user };
}
