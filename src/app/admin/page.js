import Link from "next/link";
import { ArrowUpRight, FileText, Layers3, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { requireAdmin } from "../../lib/admin";
import { signOut } from "./actions";

export const metadata = {
  title: "Content admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { supabase, user } = await requireAdmin();
  const [projectsResult, postsResult] = await Promise.all([
    supabase.from("projects").select("id,title,slug,is_published,updated_at").order("updated_at", { ascending: false }),
    supabase.from("posts").select("id,title,slug,is_published,updated_at").order("updated_at", { ascending: false }),
  ]);

  if (projectsResult.error) throw new Error("Unable to load projects for the admin panel.", { cause: projectsResult.error });
  if (postsResult.error) throw new Error("Unable to load posts for the admin panel.", { cause: postsResult.error });

  const sections = [
    { kind: "project", label: "Projects", items: projectsResult.data, icon: Layers3 },
    { kind: "post", label: "Blog posts", items: postsResult.data, icon: FileText },
  ];

  return (
    <main className="admin-main section-wrap">
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">CONTENT MANAGEMENT</p>
          <h1>Your writing & work.</h1>
          <p className="admin-intro">Signed in as {user.email}</p>
        </div>
        <form action={signOut}><Button variant="outline" type="submit">Sign out</Button></form>
      </div>
      {sections.map(({ kind, label, items, icon: Icon }) => (
        <section className="admin-content-section" key={kind}>
          <div className="admin-section-heading">
            <h2><Icon size={19} aria-hidden="true" /> {label} <span>{items.length}</span></h2>
            <Link className="button button-primary admin-create" href={`/admin/edit?kind=${kind}`}>
              <Plus size={15} aria-hidden="true" /> Add {kind}
            </Link>
          </div>
          {items.length === 0 ? (
            <p className="admin-empty">Nothing here yet. Add your first {kind} when you&apos;re ready.</p>
          ) : (
            <ul className="admin-item-list">
              {items.map((item) => (
                <li key={item.id}>
                  <div className="admin-item-copy">
                    <span className="admin-item-status">
                      <i className={item.is_published ? "published" : ""} />
                      {item.is_published ? "Published" : "Draft"}
                    </span>
                    <strong>{item.title}</strong>
                    <span className="admin-item-slug">/{kind === "post" ? "blog" : "projects"}/{item.slug}</span>
                  </div>
                  <Link className="admin-edit-link" href={`/admin/edit?kind=${kind}&id=${item.id}`}>
                    Edit <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
