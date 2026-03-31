// E38: Redis Caching Layer (Upstash Redis)
export type CacheOptions = { ttl?: number }

const UPSTASH_URL = process.env.UPSTASH_REDIS_URL || ''
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN || ''

function isConfigured(): boolean { return !!(UPSTASH_URL && UPSTASH_TOKEN) }

async function redisCommand(command: string[]): Promise<unknown> {
  if (!isConfigured()) return null
  try {
    const r = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: 'POST', headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([command])
    })
    const data = await r.json() as { result?: unknown }[]
    return data?.[0]?.result ?? null
  } catch { return null }
}

export async function cacheGet(key: string): Promise<string | null> {
  const result = await redisCommand(['GET', key])
  return result ? String(result) : null
}

export async function cacheSet(key: string, value: string, ttlSeconds = 300): Promise<void> {
  await redisCommand(['SET', key, value, 'EX', String(ttlSeconds)])
}

export async function cacheDel(key: string): Promise<void> {
  await redisCommand(['DEL', key])
}

export async function cacheGetOrSet<T>(key: string, fetcher: () => Promise<T>, ttl = 300): Promise<T> {
  const cached = await cacheGet(key)
  if (cached) { try { return JSON.parse(cached) as T } catch { /* no-op */ } }
  const fresh = await fetcher()
  await cacheSet(key, JSON.stringify(fresh), ttl)
  return fresh
}
