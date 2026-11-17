-- Jobs & Careers Module
-- Created: 2026-11-06

-- Jobs table - stores job postings with JSONB metadata
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  status text not null default 'DRAFT' check (status in ('PENDING', 'APPROVED', 'PUBLISHED', 'CLOSED', 'REJECTED', 'DRAFT', 'ARCHIVED')),
  source text not null default 'ADMIN' check (source in ('ADMIN', 'PUBLIC_SUBMISSION')),
  submitted_by text,
  submitted_by_email text,
  reviewed_by text,
  reviewed_at timestamptz,
  approval_reason text,
  published_at timestamptz,
  closed_at timestamptz,
  application_deadline timestamptz,
  is_published boolean not null default false,
  is_open boolean not null default true,
  is_featured boolean not null default false,
  is_verified boolean not null default false,
  views integer not null default 0,
  openings integer,
  employment_type text,
  work_mode text,
  experience_min integer,
  experience_max integer,
  experience_level text,
  location_country text,
  location_state text,
  location_city text,
  organization_type text,
  job_category text,
  organization_name text,
  organization_website text,
  organization_logo text,
  organization_description text,
  organization_industry text,
  organization_size text,
  salary_min numeric,
  salary_max numeric,
  salary_currency text default 'INR',
  salary_period text,
  salary_disclosed boolean default false,
  contact_name text,
  contact_designation text,
  contact_email text,
  contact_phone text,
  contact_website text,
  application_url text,
  application_email text,
  application_method text default 'EXTERNAL_URL',
  application_instructions text,
  short_description text,
  description text,
  responsibilities text[],
  requirements text[],
  qualifications text[],
  preferred_qualifications text[],
  skills text[],
  benefits text[],
  education_min_qualification text,
  education_preferred_qualification text,
  education_streams text[],
  metadata jsonb default '{}'::jsonb,
  status_history jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for frequently filtered fields
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_is_published_idx on public.jobs (is_published);
create index if not exists jobs_is_open_idx on public.jobs (is_open);
create index if not exists jobs_organization_type_idx on public.jobs (organization_type);
create index if not exists jobs_job_category_idx on public.jobs (job_category);
create index if not exists jobs_employment_type_idx on public.jobs (employment_type);
create index if not exists jobs_work_mode_idx on public.jobs (work_mode);
create index if not exists jobs_location_city_idx on public.jobs (location_city);
create index if not exists jobs_location_state_idx on public.jobs (location_state);
create index if not exists jobs_is_featured_idx on public.jobs (is_featured);
create index if not exists jobs_is_verified_idx on public.jobs (is_verified);
create index if not exists jobs_application_deadline_idx on public.jobs (application_deadline);
create index if not exists jobs_created_at_idx on public.jobs (created_at desc);
create index if not exists jobs_published_at_idx on public.jobs (published_at desc);
create index if not exists jobs_slug_idx on public.jobs (slug);
create index if not exists jobs_source_idx on public.jobs (source);
create index if not exists jobs_submitted_by_idx on public.jobs (submitted_by);
create index if not exists jobs_reviewed_by_idx on public.jobs (reviewed_by);

-- Full text search index
create index if not exists jobs_search_idx on public.jobs using gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(organization_name, '') || ' ' || coalesce(description, '')));

-- Enable RLS
alter table public.jobs enable row level security;

-- RLS Policies
-- Public can view published and open jobs
drop policy if exists "Anyone can view published jobs" on public.jobs;
create policy "Anyone can view published jobs"
  on public.jobs for select to anon, authenticated
  using (
    is_published = true
    or exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

-- Admins can manage all jobs
drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs"
  on public.jobs for all to authenticated
  using (
    exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.admin_users
      where admin_users.user_id = (select auth.uid())
    )
  );

-- Public can submit jobs (insert only)
drop policy if exists "Anyone can submit jobs" on public.jobs;
create policy "Anyone can submit jobs"
  on public.jobs for insert to anon, authenticated
  with check (source = 'PUBLIC_SUBMISSION' and status = 'PENDING');

-- Grant permissions
grant select on public.jobs to anon, authenticated;
grant insert, update, delete on public.jobs to authenticated;

-- Trigger for updated_at
drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();