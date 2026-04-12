import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { competitiveIntel } from '@/services/intelligence/competitive-intel'
import { rateLimit } from '@/lib/redis'
import { zodError } from '@/lib/validation'

const competitiveQuerySchema = z.object({
  name:  z.string().trim().min(1, 'name is required').max(200, 'name too long'),
  brand: z.string().trim().max(100).optional().default(''),
})

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function GET(r: NextRequest) {
  const ip = getRequestIp(r)
  const rl = await rateLimit(ip, 20, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const parsed = competitiveQuerySchema.safeParse({
    name:  r.nextUrl.searchParams.get('name')  ?? '',
    brand: r.nextUrl.searchParams.get('brand') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const { name, brand } = parsed.data
  const prices = await competitiveIntel.getMarketPrices(name, brand)
  return NextResponse.json({
    prices,
    spread:    competitiveIntel.calculatePriceSpread(prices),
    bestPrice: competitiveIntel.findBestPrice(prices),
  })
}
