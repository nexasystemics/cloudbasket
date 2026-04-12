import { NextRequest, NextResponse } from 'next/server'
import { priceAlertSender } from '@/services/email/price-alert-sender'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'
import { emailSendAlertSchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 10, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const apiKey = request.headers.get('x-internal-api-key')
  if (env.INTERNAL_API_KEY && apiKey !== env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = emailSendAlertSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { email, productName, productImage, newPrice, oldPrice, affiliateUrl, platform } = parsed.data

  try {
    const result = await priceAlertSender.sendPriceDropAlert(
      email, productName, productImage ?? '', newPrice, oldPrice, affiliateUrl ?? '', platform ?? 'amazon'
    )
    return NextResponse.json(result)
  } catch (err) {
    console.error('[email/send-alert] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send alert' }, { status: 500 })
  }
}
