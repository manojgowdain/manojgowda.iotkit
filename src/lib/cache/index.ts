/**
 * Hybrid Cache Service using node-cache
 *
 * Uses node-cache (in-memory with TTL) for caching Supabase queries.
 * Provides deduplication to prevent cache stampedes.
 * Note: In serverless environments, cache is per-instance and does not persist across cold starts.
 */

import NodeCache from 'node-cache';

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  deduplicated: number;
}

export const CacheTTL = {
  BLOG_POST: 5 * 60,        // 5 min
  BLOG_LIST: 5 * 60,        // 5 min
  PROJECT_POST: 5 * 60,     // 5 min
  PROJECT_LIST: 5 * 60,     // 5 min
  JOB_POST: 5 * 60,         // 5 min
  JOB_LIST: 5 * 60,         // 5 min
  SEO: 10 * 60,             // 10 min
  SITEMAP: 15 * 60,         // 15 min
} as const;

export const CachePrefix = {
  BLOG_POST: 'blog:post:',
  BLOG_LIST: 'blog:all',
  PROJECT_POST: 'project:post:',
  PROJECT_LIST: 'project:all',
  JOB_POST: 'job:post:',
  JOB_LIST: 'job:all',
  SEO: 'seo:',
  SITEMAP: 'sitemap:',
} as const;

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPrefix(prefix: string): Promise<number>;
  clear(): Promise<void>;
  wrap<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T>;
  getStats(): Promise<CacheStats & { instanceId: string }>;
  invalidateBlog(slug?: string): Promise<void>;
  invalidateProject(slug?: string): Promise<void>;
  invalidateJob(slug?: string): Promise<void>;
  invalidateSitemap(): Promise<void>;
  invalidateSEO(): Promise<void>;
}

// Instance identifier for debugging
const INSTANCE_ID = Math.random().toString(36).substring(2, 10);

class HybridCache implements CacheService {
  private readonly cache: NodeCache;
  private readonly pending = new Map<string, Promise<unknown>>();
  private stats: CacheStats = { hits: 0, misses: 0, evictions: 0, size: 0, deduplicated: 0 };

  constructor() {
    // node-cache uses seconds for TTL
    this.cache = new NodeCache({
      stdTTL: 300,        // 5 min default
      checkperiod: 60,    // Check for expired keys every 60 seconds
      useClones: false,   // Don't clone objects (faster, but caller must not mutate)
      maxKeys: 1000,      // Limit cache size
    });

    // Hook into node-cache events for stats
    this.cache.on('set', () => {
      this.stats.size = this.cache.keys().length;
    });
    this.cache.on('del', () => {
      this.stats.size = this.cache.keys().length;
    });
    this.cache.on('expired', () => {
      this.stats.evictions++;
    });
    this.cache.on('flush', () => {
      this.stats.size = 0;
    });
  }

  /**
   * Get a cached value. Returns null if missing or expired.
   */
  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get<T>(key);
    if (value === undefined) {
      this.stats.misses++;
      return null;
    }
    this.stats.hits++;
    return value;
  }

  /**
   * Set a cached value with TTL in seconds.
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    this.cache.set(key, value, ttlSeconds);
    this.stats.size = this.cache.keys().length;
  }

  /**
   * Delete a single key.
   */
  async del(key: string): Promise<void> {
    this.cache.del(key);
    this.stats.size = this.cache.keys().length;
  }

  /**
   * Delete all keys matching a prefix.
   */
  async delPrefix(prefix: string): Promise<number> {
    const keys = this.cache.keys().filter(k => k.startsWith(prefix));
    this.cache.del(keys);
    this.stats.size = this.cache.keys().length;
    return keys.length;
  }

  /**
   * Clear all cached entries.
   */
  async clear(): Promise<void> {
    this.cache.flushAll();
    this.pending.clear();
    this.stats.size = 0;
  }

  /**
   * Check if a key exists and is not expired.
   */
  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  /**
   * Deduplicated fetch: if a request for this key is already in-flight,
   * return the same promise instead of executing the factory again.
   * Prevents cache stampedes.
   */
  async wrap<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T> {
    // Check cache first
    const cached = this.cache.get<T>(key);
    if (cached !== undefined) {
      this.stats.hits++;
      return cached;
    }

    this.stats.misses++;

    // Check if already pending
    const existing = this.pending.get(key);
    if (existing) {
      this.stats.deduplicated++;
      return existing as Promise<T>;
    }

    const promise = (async () => {
      try {
        const value = await factory();
        this.cache.set(key, value, ttlSeconds);
        return value;
      } finally {
        this.pending.delete(key);
      }
    })();

    this.pending.set(key, promise);
    return promise;
  }

  /**
   * Get current cache statistics.
   */
  async getStats(): Promise<CacheStats & { instanceId: string }> {
    return {
      ...this.stats,
      size: this.cache.keys().length,
      instanceId: INSTANCE_ID,
    };
  }

  /**
   * Reset statistics.
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0, evictions: 0, size: this.cache.keys().length, deduplicated: 0 };
  }

  async invalidateBlog(slug?: string): Promise<void> {
    if (slug) {
      await this.del(CachePrefix.BLOG_POST + slug);
    } else {
      await this.delPrefix(CachePrefix.BLOG_POST);
    }
    await this.del(CachePrefix.BLOG_LIST);
    await this.invalidateSitemap();
    await this.invalidateSEO();
  }

  async invalidateProject(slug?: string): Promise<void> {
    if (slug) {
      await this.del(CachePrefix.PROJECT_POST + slug);
    } else {
      await this.delPrefix(CachePrefix.PROJECT_POST);
    }
    await this.del(CachePrefix.PROJECT_LIST);
    await this.invalidateSitemap();
    await this.invalidateSEO();
  }

  async invalidateJob(slug?: string): Promise<void> {
    if (slug) {
      await this.del(CachePrefix.JOB_POST + slug);
    } else {
      await this.delPrefix(CachePrefix.JOB_POST);
    }
    await this.del(CachePrefix.JOB_LIST);
    await this.invalidateSitemap();
  }

  async invalidateSitemap(): Promise<void> {
    await this.del(CachePrefix.SITEMAP);
  }

  async invalidateSEO(): Promise<void> {
    await this.delPrefix(CachePrefix.SEO);
  }
}

// Singleton instance
let cacheInstance: HybridCache | null = null;

export function getCache(): CacheService {
  if (!cacheInstance) {
    cacheInstance = new HybridCache();
  }
  return cacheInstance;
}

// Convenience proxy
export const cache = new Proxy({} as CacheService, {
  get(_target, prop) {
    return (getCache() as any)[prop];
  },
});

export default getCache;