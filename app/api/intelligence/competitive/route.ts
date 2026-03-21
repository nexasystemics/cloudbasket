import { NextRequest, NextResponse } from 'next/server'
import { competitiveIntel } from '@/services/intelligence/competitive-intel'
export async function GET(r: NextRequest) {
  const name = r.nextUrl.searchParams.get('name') || ''; const brand = r.nextUrl.searchParams.get('brand') || ''
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  const prices = await competitiveIntel.getMarketPrices(name, brand)
  return NextResponse.json({ prices, spread: competitiveIntel.calculatePriceSpread(prices), bestPrice: competitiveIntel.findBestPrice(prices) })
}