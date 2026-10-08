# Manoj Gowda — personal site

Personal portfolio and blog for `manojgowda.iotkit.in`, built with Next.js 16, React, Tailwind CSS, shadcn/ui, and Supabase.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable/anon key.
3. Apply `supabase/migrations/202610080001_create_content.sql` in the Supabase SQL Editor.
4. Start the app with `npm run dev`.

The site uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` when set and falls back to the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Neither is a secret. Do not put a Supabase secret/service-role key in a `NEXT_PUBLIC_` variable or expose it to the browser.

## Set up the private admin

1. Create your own user through Supabase Auth. Public sign-up is not part of this site.
2. Copy that user's UUID from **Authentication → Users**.
3. As the project owner, add the UUID to `admin_users` in the Supabase SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('YOUR_AUTH_USER_UUID');
   ```

4. Visit `/admin/login` and sign in with that Supabase account.

The admin pages and every write action verify the signed-in user against `admin_users`. Supabase Row Level Security independently enforces the same allowlist. Admin membership cannot be added through the public site. Public queries expose only published projects and posts; unpublished entries are excluded from public pages and the sitemap.

## Content

The `/admin` panel can create, edit, publish/unpublish, and delete projects and blog posts. It includes per-item SEO title/description fields, tags/technologies, and project or cover image URLs. Blog post content is stored as plain text with line breaks preserved.

The public site includes:

- Home, project listing/detail, blog listing/article, and contact pages.
- Canonical URLs, Open Graph metadata, Article structured data, `robots.txt`, and a sitemap.
- A responsive navigation/footer and persisted light/dark/system theme selection.
- A contact page that links to the main site's contact form at `https://manojgowda.in/contact`.

Set `NEXT_PUBLIC_SITE_URL` to the production origin when deploying. The default is `https://manojgowda.iotkit.in`.

## Checks

```bash
npm run lint
npm run build
```
