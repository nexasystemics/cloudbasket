// app/api/prices/route.ts
// Purpose: API route to fetch live prices for given product IDs.
// GET /api/prices?productIds=IN-PC-HUL-001,IN-EL-BOAT-001
// Returns JSON array of LivePriceResult. Falls back to static on error.

import { NextRequest, NextResponse } from 'next/server'
import {
  fetchAmazonPrices,
  fetchFlipkartPrices,
  type LivePriceResult,
} from '@/services/price-engine/india-apis'
import { rateLimit, getCache, setCache } from '@/lib/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 30, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('productIds') ?? ''

    if (!raw.trim()) {
      return NextResponse.json({ error: 'productIds query param is required' }, { status: 400 })
    }

    const productIds = raw.split(',').map((id) => id.trim()).filter(Boolean)

    if (productIds.length === 0) {
      return NextResponse.json({ error: 'No valid product IDs provided' }, { status: 400 })
    }

    if (productIds.length > 50) {
      return NextResponse.json({ error: 'Max 50 product IDs per request' }, { status: 400 })
    }

    // Redis cache — only for small requests (≤10 IDs) to keep key size bounded
    const cacheKey = productIds.length <= 10
      ? `cb:cache:prices:${[...productIds].sort().join(',')}`
      : null

    if (cacheKey) {
      const cached = await getCache<LivePriceResult[]>(cacheKey)
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
          },
        })
      }
    }

    // Route by product ID prefix
    const amazonIds = productIds.filter((id) =>
      id.startsWith('IN-PC') || id.startsWith('IN-HA') || id.startsWith('IN-EL')
    )
    const flipkartIds = productIds.filter((id) =>
      id.startsWith('IN-FA') || id.startsWith('IN-FG')
    )
    const otherIds = productIds.filter(
      (id) => !amazonIds.includes(id) && !flipkartIds.includes(id)
    )

    const results: LivePriceResult[] = []

    // Fetch in parallel with try/catch per source
    const [amazonResults, flipkartResults] = await Promise.allSettled([
      amazonIds.length > 0 ? fetchAmazonPrices(amazonIds) : Promise.resolve([]),
      flipkartIds.length > 0 ? fetchFlipkartPrices(flipkartIds) : Promise.resolve([]),
    ])

    if (amazonResults.status === 'fulfilled') results.push(...amazonResults.value)
    if (flipkartResults.status === 'fulfilled') results.push(...flipkartResults.value)

    // Static fallback for unrouted IDs
    if (otherIds.length > 0) {
      results.push(
        ...otherIds.map((id) => ({
          productId: id,
          platform: 'Static',
          price: 0,
          inStock: true,
          url: `https://cloudbasket.co/go/${id}`,
          fetchedAt: new Date(),
          source: 'static' as const,
        }))
      )
    }

    if (cacheKey) await setCache(cacheKey, results, 900)

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('[api/prices] Unhandled error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
