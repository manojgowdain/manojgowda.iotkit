alter table public.projects
  add column if not exists video_url text;

alter table public.posts
  add column if not exists video_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-media',
  'content-media',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read content media" on storage.objects;
create policy "Public can read content media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'content-media');

drop policy if exists "Admins can upload content media" on storage.objects;
create policy "Admins can upload content media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'content-media'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update content media" on storage.objects;
create policy "Admins can update content media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'content-media'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'content-media'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can delete content media" on storage.objects;
create policy "Admins can delete content media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'content-media'
    and exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );
