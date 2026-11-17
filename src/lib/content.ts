/**
 * Content Fetching with Cache Integration
 *
 * All Supabase queries go through the hybrid cache (L1 Memory + L2 SSDiskDB).
 * Provides deduplicated, cached access to blog posts, projects, and jobs.
 */

import { createClient } from './server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cache, CachePrefix, CacheTTL } from './cache';

function throwContentError(kind: string, error: unknown): never {
  console.error(`Unable to load ${kind} from Supabase:`, error);
  throw new Error(
    `Unable to load ${kind}. Confirm that the Supabase content migration has been applied and the environment variables are configured.`,
    { cause: error },
  );
}

interface SupabaseError {
  code?: string;
  message?: string;
  status?: number;
}

function isMissingTable(error: unknown, table: string): boolean {
  const e = error as SupabaseError | undefined;
  return (
    e?.code === '42P01' ||
    (e?.code === 'PGRST205' && e?.message?.includes(`public.${table}`))
  );
}

function isRejectedKey(error: unknown): boolean {
  const e = error as SupabaseError | undefined;
  return e?.status === 401 || /invalid api key/i.test(e?.message ?? '');
}

function reportMissingTable(table: string): void {
  console.warn(
    `Supabase table public.${table} is not available yet. Apply the content migration to enable publishing.`,
  );
}

// Cookie-less Supabase client for static generation (build-time)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const staticSupabase = supabaseUrl && supabaseKey
  ? createSupabaseClient(supabaseUrl, supabaseKey)
  : null;

// Generic cached fetch helper
async function fetchWithCache<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  return cache.wrap(cacheKey, fetchFn, ttlSeconds);
}

// ===== PROJECTS =====

export async function getPublishedProjects() {
  return fetchWithCache(
    CachePrefix.PROJECT_LIST,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error && isMissingTable(error, 'projects')) {
        reportMissingTable('projects');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('projects', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.PROJECT_LIST
  );
}

// Cookie-less version for static generation at build time
export async function getPublishedProjectsForStatic() {
  if (!staticSupabase) {
    return { items: [], setupRequired: 'configuration' };
  }
  return fetchWithCache(
    CachePrefix.PROJECT_LIST,
    async () => {
      const { data, error } = await staticSupabase!
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error && isMissingTable(error, 'projects')) {
        reportMissingTable('projects');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('projects', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.PROJECT_LIST
  );
}

export async function getPublishedProject(slug: string) {
  return fetchWithCache(
    CachePrefix.PROJECT_POST + slug,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error && isMissingTable(error, 'projects')) {
        reportMissingTable('projects');
        return null;
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return null;
      }
      if (error) throwContentError(`project "${slug}"`, error);
      return data;
    },
    CacheTTL.PROJECT_POST
  );
}

// ===== POSTS =====

export async function getPublishedPosts() {
  return fetchWithCache(
    CachePrefix.BLOG_LIST,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error && isMissingTable(error, 'posts')) {
        reportMissingTable('posts');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('blog posts', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.BLOG_LIST
  );
}

export async function getPublishedPostsForStatic() {
  if (!staticSupabase) {
    return { items: [], setupRequired: 'configuration' };
  }
  return fetchWithCache(
    CachePrefix.BLOG_LIST,
    async () => {
      const { data, error } = await staticSupabase!
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error && isMissingTable(error, 'posts')) {
        reportMissingTable('posts');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('blog posts', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.BLOG_LIST
  );
}

export async function getPublishedPost(slug: string) {
  return fetchWithCache(
    CachePrefix.BLOG_POST + slug,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error && isMissingTable(error, 'posts')) {
        reportMissingTable('posts');
        return null;
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return null;
      }
      if (error) throwContentError(`blog post "${slug}"`, error);
      return data;
    },
    CacheTTL.BLOG_POST
  );
}

// ===== JOBS =====

export async function getPublishedJobs() {
  return fetchWithCache(
    CachePrefix.JOB_LIST,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_published', true)
        .eq('is_open', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error && isMissingTable(error, 'jobs')) {
        reportMissingTable('jobs');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('jobs', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.JOB_LIST
  );
}

export async function getPublishedJobsForStatic() {
  if (!staticSupabase) {
    return { items: [], setupRequired: 'configuration' };
  }
  return fetchWithCache(
    CachePrefix.JOB_LIST,
    async () => {
      const { data, error } = await staticSupabase!
        .from('jobs')
        .select('*')
        .eq('is_published', true)
        .eq('is_open', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error && isMissingTable(error, 'jobs')) {
        reportMissingTable('jobs');
        return { items: [], setupRequired: 'migration' };
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return { items: [], setupRequired: 'configuration' };
      }
      if (error) throwContentError('jobs', error);
      return { items: data ?? [], setupRequired: null };
    },
    CacheTTL.JOB_LIST
  );
}

export async function getPublishedJob(slug: string) {
  return fetchWithCache(
    CachePrefix.JOB_POST + slug,
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error && isMissingTable(error, 'jobs')) {
        reportMissingTable('jobs');
        return null;
      }
      if (error && isRejectedKey(error)) {
        console.error('Supabase rejected the public API key. Verify the publishable/anon key configured for this app.');
        return null;
      }
      if (error) throwContentError(`job "${slug}"`, error);
      return data;
    },
    CacheTTL.JOB_POST
  );
}

export async function getAllJobsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throwContentError('jobs', error);
  return { items: data ?? [], setupRequired: null };
}

// ===== CACHE INVALIDATION HELPERS =====

export async function invalidateBlogCache(slug?: string) {
  await cache.invalidateBlog(slug);
}

export async function invalidateProjectCache(slug?: string) {
  await cache.invalidateProject(slug);
}

export async function invalidateJobCache(slug?: string) {
  await cache.invalidateJob(slug);
}

export async function invalidateSitemapCache() {
  await cache.invalidateSitemap();
}

export async function invalidateSEOCache() {
  await cache.invalidateSEO();
}