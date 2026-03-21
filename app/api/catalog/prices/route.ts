import { NextRequest, NextResponse } from 'next/server'
import { catalogSync } from '@/services/catalog/sync-engine'
export async function GET(r: NextRequest) {
  const productId = r.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  const live = catalogSync.getLivePriceOverride(productId) || await catalogSync.getLivePriceFromSupabase(productId)
  return NextResponse.json({ productId, livePrice: live?.price, platform: live?.platform, source: live ? 'live' : 'static' })
}