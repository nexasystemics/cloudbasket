import { NextRequest, NextResponse } from 'next/server'
import { cjAPI } from '@/services/apis/cj-api'
import { rateLimit } from '@/lib/redis'
import { cjTrackSchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 20, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = cjTrackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { orderId, amount, advertiserId } = parsed.data

  try {
    cjAPI.trackCommission(orderId, amount, advertiserId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[cj/track] Error:', err)
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 })
  }
}
