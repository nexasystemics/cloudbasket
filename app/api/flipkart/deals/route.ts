import { NextRequest, NextResponse } from 'next/server'
import { flipkartAPI } from '@/services/apis/flipkart-affiliate'
import { rateLimit, getCache, setCache } from '@/lib/redis'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

const CACHE_KEY = 'cb:cache:flipkart:deals'

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const rl = await rateLimit(ip, 30, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const cached = await getCache<Awaited<ReturnType<typeof flipkartAPI.getDeals>>>(CACHE_KEY)
  if (cached) {
    return NextResponse.json({ deals: cached, count: cached.length })
  }

  const deals = await flipkartAPI.getDeals()
  await setCache(CACHE_KEY, deals, 600)
  return NextResponse.json({ deals, count: deals.length })
}
