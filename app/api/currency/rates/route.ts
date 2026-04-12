import { NextRequest, NextResponse } from 'next/server'
import { getExchangeRates } from '@/services/currency/exchange-rates'
import { rateLimit } from '@/lib/redis'
import { currencyRatesQuerySchema, zodError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const limit = await rateLimit(ip, 60, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const parsed = currencyRatesQuerySchema.safeParse({
    base: request.nextUrl.searchParams.get('base') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  return NextResponse.json(await getExchangeRates())
}
