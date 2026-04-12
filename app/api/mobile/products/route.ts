// E42: Mobile App API Endpoints (React Native ready)
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getDailyDeals } from '@/lib/deals-engine'
import { searchProducts, type SearchFilters } from '@/lib/search'
import { rateLimit } from '@/lib/redis'
import { zodError } from '@/lib/validation'

const VALID_SORTS = ['relevance', 'price-asc', 'price-desc', 'discount-desc', 'newest'] as const

const mobileProductsQuerySchema = z.object({
  q:        z.string().trim().max(200).optional().default(''),
  category: z.string().trim().max(100).optional().default(''),
  page:     z.coerce.number().int().min(1).max(1000).optional().default(1),
  limit:    z.coerce.number().int().min(1).max(100).optional().default(20),
  sort:     z.enum(VALID_SORTS).optional().default('relevance'),
})

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const parsed = mobileProductsQuerySchema.safeParse({
    q:        request.nextUrl.searchParams.get('q')        ?? undefined,
    category: request.nextUrl.searchParams.get('category') ?? undefined,
    page:     request.nextUrl.searchParams.get('page')     ?? undefined,
    limit:    request.nextUrl.searchParams.get('limit')    ?? undefined,
    sort:     request.nextUrl.searchParams.get('sort')     ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const { q, category, page, limit, sort } = parsed.data

  const results = q || category
    ? searchProducts(q, {
        categories: category ? [category] : undefined,
        sortBy: sort as SearchFilters['sortBy'],
      })
    : getDailyDeals(limit).map((d) => ({
        id:            d.id,
        name:          d.title,
        price:         d.dealPrice,
        originalPrice: d.originalPrice,
        discount:      d.discountPercent,
        image:         d.imageUrl,
        platform:      d.platform,
        brand:         d.brand,
        category:      d.category,
      }))

  const paginated = results.slice((page - 1) * limit, page * limit)
  return NextResponse.json(
    { data: paginated, total: results.length, page, limit, hasMore: page * limit < results.length },
    { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' } },
  )
}
