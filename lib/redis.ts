// © 2026 NEXQON HOLDINGS — CloudBasket redis.ts
// lib/redis.ts — Upstash Redis REST client singleton with cache helpers and rate limiting.
// Fail-open: all exports return safe defaults when UPSTASH env vars are absent or on error.

import { Redis } from '@upstash/redis'
import { Ratelimit, type Duration } from '@upstash/ratelimit'
import { isConfigured } from '@/lib/env'

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

function isReady(): boolean {
  return isConfigured('UPSTASH_REDIS_REST_URL') && isConfigured('UPSTASH_REDIS_REST_TOKEN')
}

let _client: Redis | null = null

function getClient(): Redis | null {
  if (!isReady()) return null
  if (!_client) {
    _client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _client
}

if (!isReady()) {
  console.warn('[Redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not configured — cache disabled')
}

/** Upstash Redis client. null when env vars are absent (fail-open). */
export const redis: Redis | null = getClient()

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------

/**
 * Reads a cached value. Returns null on cache miss, unconfigured client, or error.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getClient()
  if (!client) return null
  try {
    return await client.get<T>(key)
  } catch (err) {
    console.warn('[Redis] getCache error:', err)
    return null
  }
}

/**
 * Writes a value to cache with an optional TTL (default 3600 s).
 * No-ops silently when client is unconfigured or on error.
 */
export async function setCache(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
  const client = getClient()
  if (!client) return
  try {
    await client.set(key, JSON.stringify(value), { ex: ttlSeconds })
  } catch (err) {
    console.warn('[Redis] setCache error:', err)
  }
}

/**
 * Deletes a cache key.
 * No-ops silently when client is unconfigured or on error.
 */
export async function deleteCache(key: string): Promise<void> {
  const client = getClient()
  if (!client) return
  try {
    await client.del(key)
  } catch (err) {
    console.warn('[Redis] deleteCache error:', err)
  }
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  /** Whether the request is within the rate limit. */
  success: boolean
  /** Maximum requests allowed in the window. */
  limit: number
  /** Requests remaining in the current window. */
  remaining: number
  /** Unix timestamp (ms) when the window resets. */
  reset: number
}

const _limiters = new Map<string, Ratelimit>()

function getLimiter(limit: number, windowSeconds: number, client: Redis): Ratelimit {
  const key = `${limit}:${windowSeconds}`
  if (!_limiters.has(key)) {
    _limiters.set(key, new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s` as Duration),
      prefix: 'cb:rl',
    }))
  }
  return _limiters.get(key)!
}

/**
 * Sliding-window rate limiter. Pass an IP, max requests, and window in seconds.
 *
 * Returns `{ success: true }` (fail-open) when Redis is unconfigured or on error
 * so that a missing cache layer never blocks legitimate traffic.
 *
 * @example
 *   const { success } = await rateLimit(ip, 60, 60)  // 60 req/min
 *   if (!success) return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
 */
export async function rateLimit(
  ip: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const PASS: RateLimitResult = { success: true, limit, remaining: limit, reset: 0 }

  const client = getClient()
  if (!client) return PASS

  try {
    const limiter = getLimiter(limit, windowSeconds, client)
    const result = await limiter.limit(ip)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (err) {
    console.warn('[Redis] rateLimit error:', err)
    return PASS
  }
}
