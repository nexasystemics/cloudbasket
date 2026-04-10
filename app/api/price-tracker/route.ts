import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { priceTracker } from '@/services/price-engine/tracker'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

const priceTrackerPostSchema = z.object({
  productId: z.string().trim().min(1, 'Product ID is required.').max(120, 'Product ID must be 120 characters or fewer.'),
  price: z.number({ error: 'Price is required.' }).positive('Price must be greater than zero.'),
  platform: z.string().trim().max(64, 'Platform must be 64 characters or fewer.').optional(),
}).strict()

type PriceTrackerPayload = z.infer<typeof priceTrackerPostSchema>
type PriceTrackerField = keyof PriceTrackerPayload
type PriceTrackerFieldErrors = Partial<Record<PriceTrackerField, string>>

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

function getFieldErrors(error: z.ZodError<PriceTrackerPayload>): PriceTrackerFieldErrors {
  const fieldErrors: PriceTrackerFieldErrors = {}
  const flattened = error.flatten().fieldErrors

  if (flattened.productId?.[0]) {
    fieldErrors.productId = flattened.productId[0]
  }

  if (flattened.price?.[0]) {
    fieldErrors.price = flattened.price[0]
  }

  if (flattened.platform?.[0]) {
    fieldErrors.platform = flattened.platform[0]
  }

  return fieldErrors
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 20, 60)
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  const apiKey = request.headers.get('x-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = priceTrackerPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please correct the highlighted fields.',
        fieldErrors: getFieldErrors(parsed.error),
      },
      { status: 400 },
    )
  }
  const { productId, price, platform } = parsed.data

  try {
    await priceTracker.trackProduct(productId, price, platform ?? 'manual')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[price-tracker] Error:', err)
    return NextResponse.json({ error: 'Failed to track price' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 30, 60)
  if (!limit.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  const productId = request.nextUrl.searchParams.get('productId')
  const daysRaw = request.nextUrl.searchParams.get('days')
  const days = daysRaw ? parseInt(daysRaw, 10) : 30

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId query parameter' }, { status: 400 })
  }
  if (Number.isNaN(days) || days < 1 || days > 365) {
    return NextResponse.json({ error: 'days must be an integer between 1 and 365' }, { status: 400 })
  }

  try {
    const history = await priceTracker.getPriceHistory(productId, days)
    const drop = await priceTracker.getPriceDrop(productId)
    return NextResponse.json({ history, priceDrop: drop })
  } catch (err) {
    console.error('[price-tracker] GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 })
  }
}
