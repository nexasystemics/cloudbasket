import { NextRequest, NextResponse } from 'next/server'
import { getDailyDeals } from '@/lib/deals-engine'
import { rateLimit } from '@/lib/redis'

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

  const deals = getDailyDeals(20)
  return NextResponse.json({
    deals: deals.map((d) => ({
      productId:    d.id,
      name:         d.title,
      currentPrice: d.dealPrice,
      dealScore:    Math.min(100, Math.round(d.discountPercent * 1.5)),
    })),
  })
}
