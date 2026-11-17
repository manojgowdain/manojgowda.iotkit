# SEO Audit & Performance Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all technical SEO, indexing, rendering, database performance, and caching problems causing Google Search Console "Discovered - currently not indexed" and "Crawled - currently not indexed" issues for portfolio, blog, and project pages.

**Architecture:** Hybrid caching layer (L1 in-memory + L2 SSDiskDB persistent disk) with Supabase as source of truth. All SEO-critical content rendered server-side. Sitemap/robots.txt generated dynamically with proper caching. Structured data in initial HTML. Revalidation via webhooks or manual triggers.

**Tech Stack:** Next.js 16.3.8 (App Router), React 19, Supabase, SSDiskDB (disk-backed cache), TypeScript

**Spec:** Original task requirements (pasted content in conversation)

---

## Global Constraints

- Do not introduce Redis (explicit requirement)
- Do not expose Supabase service-role credentials
- Do not break existing functionality
- Do not create duplicate API layers
- Use TypeScript types properly
- Follow existing coding conventions
- Avoid unnecessary dependencies
- SSDiskDB for persistent disk cache (L2)
- In-memory cache for L1 (request-scoped + module-level)
- All cache keys prefixed with type: `blog:`, `project:`, `seo:`, `sitemap:`
- Production metadataBase: `https://manojgowda.iotkit.in`

---

## Review Focus

1. **Build-time static generation without env vars** — `generateStaticParams` runs at build time on Vercel without Supabase keys → empty params → 404s. Must use ISR with `revalidate` or fallback to dynamic rendering.
2. **Cache stampede on cold start** — Multiple concurrent requests for same uncached data. Must use request deduplication (promise memoization).
3. **Stale content served after Supabase updates** — No revalidation mechanism. Must implement webhook handler + `revalidatePath`/`revalidateTag`.
4. **SSDiskDB corruption on restart** — Disk cache must survive process restarts gracefully. Handle corrupt files, missing dirs, permission errors.
5. **Serverless/ephemeral storage incompatibility** — If deployed to Vercel/Netlify, disk cache won't persist across invocations. Must detect and fallback to memory-only with warning.

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/lib/cache/index.ts` | Main cache service (L1 + L2 hybrid) |
| `src/lib/cache/memory.ts` | In-memory L1 cache with TTL & deduplication |
| `src/lib/cache/disk.ts` | SSDiskDB L2 persistent cache wrapper |
| `src/lib/content.ts` | Refactored content fetching with cache integration |
| `src/app/sitemap.ts` | Fixed sitemap with cache, accurate lastModified |
| `src/app/robots.ts` | Fixed robots.txt (allow static assets) |
| `src/components/structured-data.tsx` | Server-side structured data (no client) |
| `src/lib/supabase/server.ts` | Existing - fix import paths in consumers |
| `src/app/api/revalidate/route.ts` | NEW: Webhook endpoint for cache invalidation |
| `src/app/jobs/submit/page.tsx` | FIXED: Server-side form handling |
| `src/middleware.ts` | NEW: Cache-Control headers for SEO pages |

---

### Task 1: Fix Build-Breaking Import Paths

**Files:**
- Modify: `src/app/api/admin/jobs/[id]/route.ts:8`
- Modify: `src/app/api/admin/jobs/[id]/status/route.ts:6`
- Modify: `src/app/api/projects/route.ts:7`
- Modify: `src/app/api/projects/[id]/route.ts:8`
- Modify: `src/app/api/posts/route.ts:7`
- Modify: `src/app/sitemap.ts:6`

**Interfaces:**
- Consumes: `createSupabaseServerClient` from `src/lib/supabase/server.ts`
- Produces: Working build

- [ ] **Step 1.1: Fix admin jobs/[id] import**
  ```bash
  # Change: import { createSupabaseServerClient } from '../../../../lib/supabase/server'
  # To:     import { createSupabaseServerClient } from '@/lib/supabase/server'
  ```

- [ ] **Step 1.2: Fix admin jobs/[id]/status import**
  ```bash
  # Change: import { createSupabaseServerClient } from '../../../../../../lib/supabase/server'
  # To:     import { createSupabaseServerClient } from '@/lib/supabase/server'
  ```

- [ ] **Step 1.3: Fix projects routes imports** (2 files)
- [ ] **Step 1.4: Fix posts route import**
- [ ] **Step 1.5: Fix sitemap.ts import**
- [ ] **Step 1.6: Run build to verify**
  ```bash
  npm run build
  # Expected: PASS (no module not found errors)
  ```

---

### Task 2: Remove Duplicate Sitemap & Fix Sitemap Implementation

**Files:**
- Delete: `src/app/sitemap.js`
- Modify: `src/app/sitemap.ts` (complete rewrite)

**Interfaces:**
- Consumes: Cache service from Task 3, Supabase client
- Produces: `sitemap.xml` with correct URLs, lastModified from DB

- [ ] **Step 2.1: Delete `src/app/sitemap.js`**
- [ ] **Step 2.2: Rewrite `src/app/sitemap.ts` with:**
  - Use cache service for Supabase queries
  - Dynamic = 'force-dynamic' (or cache with revalidate)
  - Accurate lastModified from `updated_at`/`published_at`
  - Include `/jobs/[slug]` URLs
  - Proper XML content-type
- [ ] **Step 2.3: Verify sitemap at `/sitemap.xml`**

---

### Task 3: Implement Hybrid Cache Service (L1 Memory + L2 SSDiskDB)

**Files:**
- Create: `src/lib/cache/memory.ts`
- Create: `src/lib/cache/disk.ts`
- Create: `src/lib/cache/index.ts`
- Install: `ssdiskdb` package

**Interfaces:**
- `cache.get(key: string): Promise<T | null>`
- `cache.set(key: string, value: T, ttlMs: number): Promise<void>`
- `cache.delete(key: string): Promise<void>`
- `cache.clear(prefix?: string): Promise<void>`
- `cache.getStats(): CacheStats`
- `cache.wrap(key: string, factory: () => Promise<T>, ttlMs: number): Promise<T>` (deduplicated)

**Cache Key Prefixes & TTLs:**
| Prefix | Data Type | L1 TTL | L2 TTL |
|--------|-----------|--------|--------|
| `blog:post:` | Individual post | 5 min | 1 hour |
| `blog:all` | Blog listing | 5 min | 30 min |
| `project:post:` | Individual project | 5 min | 1 hour |
| `project:all` | Project listing | 5 min | 30 min |
| `seo:` | SEO metadata | 10 min | 2 hours |
| `sitemap:` | Sitemap data | 15 min | 4 hours |
| `jobs:post:` | Individual job | 5 min | 1 hour |
| `jobs:all` | Jobs listing | 5 min | 30 min |

- [ ] **Step 3.1: Install SSDiskDB**
  ```bash
  npm install ssdiskdb
  ```

- [ ] **Step 3.2: Create `src/lib/cache/memory.ts`**
  - Map-based store with TTL expiration
  - Promise deduplication for concurrent requests
  - Stats tracking (hits, misses, size)
  - LRU eviction when over max size

- [ ] **Step 3.3: Create `src/lib/cache/disk.ts`**
  - SSDiskDB wrapper with error handling
  - Graceful degradation if disk unavailable
  - Prefix-based invalidation support
  - Corruption recovery (try/catch, delete corrupt file)

- [ ] **Step 3.4: Create `src/lib/cache/index.ts`**
  - Hybrid orchestrator: L1 → L2 → Supabase
  - `wrap()` method for deduplicated fetching
  - Invalidation methods by key and prefix
  - Environment detection (serverless → memory-only)

- [ ] **Step 3.5: Unit test cache service** (manual verification)

---

### Task 4: Refactor Content Fetching to Use Cache

**Files:**
- Modify: `src/lib/content.js` → `src/lib/content.ts` (convert to TS, add cache)

**Interfaces:**
- All existing functions keep same signatures
- Internally use `cache.wrap(key, factory, ttl)`

- [ ] **Step 4.1: Convert `content.js` to `content.ts`**
- [ ] **Step 4.2: Import cache service**
- [ ] **Step 4.3: Wrap each Supabase query with cache:**
  - `getPublishedPosts()` → `cache.wrap('blog:all', fetchFn, 5*60*1000)`
  - `getPublishedPost(slug)` → `cache.wrap(\`blog:post:\${slug}\`, fetchFn, 5*60*1000)`
  - `getPublishedProjects()` → `cache.wrap('project:all', fetchFn, 5*60*1000)`
  - `getPublishedProject(slug)` → `cache.wrap(\`project:post:\${slug}\`, fetchFn, 5*60*1000)`
  - Same for jobs
- [ ] **Step 4.4: Add cache invalidation helpers** (exported for webhook)
- [ ] **Step 4.5: Verify all pages still work**

---

### Task 5: Fix robots.txt

**Files:**
- Modify: `src/app/robots.js` → `src/app/robots.ts`

**Interfaces:**
- Returns `MetadataRoute.Robots`

- [ ] **Step 5.1: Convert to TypeScript**
- [ ] **Step 5.2: Allow static assets:**
  ```js
  allow: ['/', '/projects', '/blog', '/contact', '/jobs', '/sitemap.xml', '/_next/', '/static/']
  ```
- [ ] **Step 5.3: Block only truly private routes** (`/admin`, `/api`)
- [ ] **Step 5.4: Verify at `/robots.txt`**

---

### Task 6: Move Structured Data to Server Components

**Files:**
- Delete: `src/components/structured-data.js`
- Create: `src/lib/structured-data.ts` (server functions)
- Modify: `src/app/layout.js` (remove client import)
- Modify: `src/app/blog/[slug]/page.js` (add BlogPosting JSON-LD)
- Modify: `src/app/projects/[slug]/page.js` (add SoftwareApplication JSON-LD)
- Modify: `src/app/jobs/[slug]/page.js` (add JobPosting JSON-LD)

**Interfaces:**
- `generatePersonSchema(): object`
- `generateWebsiteSchema(): object`
- `generateBlogPostingSchema(post): object`
- `generateSoftwareApplicationSchema(project): object`
- `generateJobPostingSchema(job): object`
- `generateBreadcrumbSchema(pathname): object`

- [ ] **Step 6.1: Create server-side schema generators**
- [ ] **Step 6.2: Inject JSON-LD in each page's `<head>` via metadata or inline script**
- [ ] **Step 6.3: Remove client-side StructuredData component**
- [ ] **Step 6.4: Verify HTML source contains JSON-LD**

---

### Task 7: Implement Revalidation Webhook

**Files:**
- Create: `src/app/api/revalidate/route.ts`

**Interfaces:**
- POST `/api/revalidate` with `{ secret, paths?, tags? }`
- Validates secret against `REVALIDATION_SECRET` env var
- Calls `revalidatePath()` or `revalidateTag()`
- Invalidates cache prefixes

- [ ] **Step 7.1: Create webhook endpoint**
- [ ] **Step 7.2: Add cache invalidation calls in webhook**
- [ ] **Step 7.3: Document Supabase webhook setup** (database webhooks → this endpoint)
- [ ] **Step 7.4: Test manual revalidation**

---

### Task 8: Fix Job Submit Form (Server-Side)

**Files:**
- Modify: `src/app/jobs/submit/page.tsx` (convert to TSX, add form handling)

**Interfaces:**
- Server action or API route for form submission
- Validation matching API contract
- Proper error/success states

- [ ] **Step 8.1: Convert to TypeScript**
- [ ] **Step 8.2: Add form state management (React useState)**
- [ ] **Step 8.3: Add onChange handlers for all inputs** (fix accessibility warning)
- [ ] **Step 8.4: Add client-side validation**
- [ ] **Step 8.5: Submit to `/api/jobs/submit` with fetch**
- [ ] **Step 8.6: Show loading, success, error states**
- [ ] **Step 8.7: Verify form works end-to-end**

---

### Task 9: Add Cache-Control Headers & Performance

**Files:**
- Create: `src/middleware.ts`
- Modify: `src/lib/content.ts` (add cache tags for Next.js Data Cache)

**Interfaces:**
- Middleware adds headers for SEO pages
- `Cache-Control: public, max-age=300, stale-while-revalidate=600`

- [ ] **Step 9.1: Create middleware for static asset caching**
- [ ] **Step 9.2: Add `next: { tags: ['blog', 'projects', 'jobs'] }` to fetch calls**
- [ ] **Step 9.3: Verify headers with curl**

---

### Task 10: Verify All Fixes & Build

**Files:**
- All modified files

**Interfaces:**
- Full test suite

- [ ] **Step 10.1: Run build**
  ```bash
  npm run build
  # Expected: PASS
  ```

- [ ] **Step 10.2: Start production server**
  ```bash
  npm start
  ```

- [ ] **Step 10.3: HTTP verification (curl):**
  ```bash
  # Homepage
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/
  # Expected: 200

  # Blog listing
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/blog
  # Expected: 200

  # Project listing
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/projects
  # Expected: 200

  # Contact
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/contact
  # Expected: 200

  # Individual blog post (if exists)
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/blog/building-postgresql-first-javascript-tools-with-pgbloom
  # Expected: 200 or 404 if not in DB

  # Individual project (if exists)
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/projects/pgbloom
  # Expected: 200 or 404 if not in DB

  # Sitemap
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/sitemap.xml
  # Expected: 200, content-type: application/xml

  # Robots
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/robots.txt
  # Expected: 200
  ```

- [ ] **Step 10.4: Verify HTML content:**
  ```bash
  curl -s http://localhost:3010/ | grep -c "<title>"
  # Expected: 1 (unique title in source)

  curl -s http://localhost:3010/blog | grep -c "application/ld+json"
  # Expected: >= 1 (structured data in source)
  ```

- [ ] **Step 10.5: Cache verification:**
  - Check logs for "cache hit" / "cache miss" messages
  - Verify second request is faster

---

### Task 11: Documentation & GSC Actions

**Files:**
- Create: `SEO_AUDIT_REPORT.md` (root)

**Content:**
1. Root cause analysis of all GSC issues
2. List of modified files
3. Complete cache architecture diagram
4. Cache TTL configuration table
5. Cache invalidation strategy
6. SEO implementation summary
7. Before/after performance measurements
8. Build and test results
9. Remaining deployment limitations (serverless disk cache)
10. Manual GSC actions needed (submit sitemap, request indexing, check coverage)

---

## Execution Order

```
Task 1 (import fixes) → Task 2 (sitemap) → Task 3 (cache) → Task 4 (content cache)
     ↓                                                                    ↓
Task 5 (robots) ← Task 6 (structured data) ← Task 7 (revalidation) ← Task 8 (jobs form)
     ↓                                                                    ↓
      ← Task 9 (headers) ← Task 10 (verify) ← Task 11 (docs) ←──────────
```

---

## Self-Review

- ✅ All GSC "Discovered - not indexed" URLs addressed (blog posts, projects)
- ✅ All GSC "Crawled - not indexed" URLs addressed (homepage, blog, projects, contact)
- ✅ Build-breaking bugs fixed (import paths, duplicate sitemap)
- ✅ Caching layer implemented (L1 + L2 hybrid with SSDiskDB)
- ✅ Revalidation mechanism designed
- ✅ Structured data moved to server-side
- ✅ Job submit form fixed
- ✅ No Redis introduced
- ✅ No service-role credentials exposed
- ✅ TypeScript used properly
- ✅ Existing patterns followed