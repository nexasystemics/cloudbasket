// © 2026 NEXQON HOLDINGS — CloudBasket
// app/api/search/route.ts — Unified product search across platforms.
// GET /api/search?q=<query>&category=<cat>&platform=amazon|flipkart|all
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/redis'
import { productSearchQuerySchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 30, 60)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  const parsed = productSearchQuerySchema.safeParse({
    q:        request.nextUrl.searchParams.get('q')        ?? '',
    category: request.nextUrl.searchParams.get('category') ?? undefined,
    platform: request.nextUrl.searchParams.get('platform') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const { q, category, platform } = parsed.data

  try {
    if (platform === 'amazon' || platform === 'all') {
      const { amazonAPI } = await import('@/services/apis/amazon-pa-api')
      const products = await amazonAPI.searchProducts(q, category)
      if (platform === 'amazon') {
        return NextResponse.json({ products, count: products.length, platform: 'amazon' })
      }
      // platform === 'all': fall through to merged response below
      const { flipkartAPI } = await import('@/services/apis/flipkart-affiliate')
      const fkProducts = await flipkartAPI.searchProducts(q)
      return NextResponse.json({
        products: [...products, ...fkProducts],
        count: products.length + fkProducts.length,
        platform: 'all',
      })
    }

    if (platform === 'flipkart') {
      const { flipkartAPI } = await import('@/services/apis/flipkart-affiliate')
      const products = await flipkartAPI.searchProducts(q)
      return NextResponse.json({ products, count: products.length, platform: 'flipkart' })
    }

    return NextResponse.json({ error: 'Unknown platform' }, { status: 400 })
  } catch (err) {
    console.error('[search] Error:', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
