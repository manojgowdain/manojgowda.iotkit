import { redirect } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { createClient } from "../../../lib/server";
import { signIn } from "../actions";

export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  let authConfigurationError = false;
  const errorMessage = params?.unauthorized
    ? "This account isn't authorized to manage the site."
    : params?.error === "configuration"
      ? "Supabase rejected the configured API key. Replace it with the current publishable or anon key."
    : params?.error === "missing"
      ? "Enter your email and password."
      : params?.error === "invalid"
        ? "Those credentials could not be verified."
        : "";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error && /invalid api key/i.test(error.message)) {
      authConfigurationError = true;
    } else if (error && error.name !== "AuthSessionMissingError") {
      throw new Error("Unable to verify your Supabase session.", { cause: error });
    }
    if (user) {
      const { data: adminRecord, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (adminError) throw new Error("Unable to verify admin access.", { cause: adminError });
      if (adminRecord) redirect("/admin");
      await supabase.auth.signOut();
    }
  } else {
    authConfigurationError = true;
  }

  return (
    <main className="admin-login-wrap">
      <section className="admin-panel">
        <p className="eyebrow">MANOJ GOWDA · PRIVATE AREA</p>
        <h1>Welcome back.</h1>
        <p className="admin-intro">Sign in with the Supabase account authorized to manage this site.</p>
        {(errorMessage || authConfigurationError) && (
          <p className="form-error" role="alert">
            {authConfigurationError
              ? "Add a valid Supabase URL and publishable/anon key to .env.local before signing in."
              : errorMessage}
          </p>
        )}
        <form action={signIn} className="admin-form">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={320} />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          <Button className="admin-submit" type="submit" disabled={authConfigurationError}>Sign in</Button>
        </form>
      </section>
    </main>
  );
}
