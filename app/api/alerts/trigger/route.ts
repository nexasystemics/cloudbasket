import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendPriceAlertEmail } from '@/lib/email/sendPriceAlert'
import { rateLimit } from '@/lib/redis'
import { zodError } from '@/lib/validation'

// Validates the full email payload + the required caller-provided identifiers.
// sendPriceAlertEmail expects PriceAlertEmailData; parsed.data is structurally
// compatible (extra productId/userId fields are ignored by the email function).
const alertTriggerSchema = z.object({
  productId:     z.string().trim().min(1, 'productId is required'),
  userId:        z.string().trim().min(1, 'userId is required'),
  to:            z.string().trim().email('to must be a valid email address'),
  productName:   z.string().trim().min(1, 'productName is required'),
  currentPrice:  z.number({ error: 'currentPrice must be a number' }).positive('currentPrice must be positive'),
  originalPrice: z.number({ error: 'originalPrice must be a number' }).positive('originalPrice must be positive'),
  targetPrice:   z.number({ error: 'targetPrice must be a number' }).positive('targetPrice must be positive'),
  productUrl:    z.string().trim().min(1, 'productUrl is required'),
  productImage:  z.string().trim().optional(),
})

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = getRequestIp(req)
  const limit = await rateLimit(ip, 10, 60)
  if (!limit.success) {
    return NextResponse.json({ success: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = alertTriggerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: zodError(parsed.error) }, { status: 400 })
  }

  try {
    const result = await sendPriceAlertEmail(parsed.data)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
