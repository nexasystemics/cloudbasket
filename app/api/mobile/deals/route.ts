import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getFlashDeals, getDailyDeals } from '@/lib/deals-engine'
import { rateLimit } from '@/lib/redis'
import { zodError } from '@/lib/validation'

const mobileDealsQuerySchema = z.object({
  type:  z.enum(['daily', 'flash']).optional().default('daily'),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
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

  const parsed = mobileDealsQuerySchema.safeParse({
    type:  request.nextUrl.searchParams.get('type')  ?? undefined,
    limit: request.nextUrl.searchParams.get('limit') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  const { type, limit } = parsed.data
  const deals = type === 'flash' ? getFlashDeals(limit) : getDailyDeals(limit)
  return NextResponse.json(
    { data: deals, total: deals.length },
    { headers: { 'Access-Control-Allow-Origin': '*' } },
  )
}
