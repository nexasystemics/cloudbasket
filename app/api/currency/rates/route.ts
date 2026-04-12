import { NextRequest, NextResponse } from 'next/server'
import { getExchangeRates } from '@/services/currency/exchange-rates'
import { currencyRatesQuerySchema, zodError } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const parsed = currencyRatesQuerySchema.safeParse({
    base: request.nextUrl.searchParams.get('base') ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }

  return NextResponse.json(await getExchangeRates())
}
