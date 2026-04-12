import { NextRequest, NextResponse } from 'next/server'
import { sendPriceAlertEmail } from '@/lib/email/sendPriceAlert'
import { rateLimit } from '@/lib/redis'

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

  try {
    const body = await req.json()
    const result = await sendPriceAlertEmail(body)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
