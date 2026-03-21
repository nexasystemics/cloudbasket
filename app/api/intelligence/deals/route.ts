import { NextResponse } from 'next/server'
import { getDailyDeals } from '@/lib/deals-engine'
export async function GET() {
  const deals = getDailyDeals(20)
  return NextResponse.json({ deals: deals.map(d => ({ productId: d.id, name: d.title, currentPrice: d.dealPrice, dealScore: Math.min(100, Math.round(d.discountPercent * 1.5)) })) })
}