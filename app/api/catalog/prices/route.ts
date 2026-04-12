import { NextRequest, NextResponse } from 'next/server'
import { catalogSync } from '@/services/catalog/sync-engine'
import { rateLimit } from '@/lib/redis'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(r: NextRequest) {
  const ip = getRequestIp(r)
  const limit = await rateLimit(ip, 30, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const productId = r.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const live = catalogSync.getLivePriceOverride(productId) || await catalogSync.getLivePriceFromSupabase(productId)
  return NextResponse.json({ productId, livePrice: live?.price, platform: live?.platform, source: live ? 'live' : 'static' })
}
