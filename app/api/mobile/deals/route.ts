import { NextRequest, NextResponse } from 'next/server'
import { getFlashDeals, getDailyDeals } from '@/lib/deals-engine'
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'daily'
  const limit = Number(request.nextUrl.searchParams.get('limit') || 10)
  const deals = type === 'flash' ? getFlashDeals(limit) : getDailyDeals(limit)
  return NextResponse.json({ data: deals, total: deals.length }, { headers: { 'Access-Control-Allow-Origin': '*' } })
}