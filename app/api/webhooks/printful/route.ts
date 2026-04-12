import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 60, 60)
  if (!rl.success) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  try {
    const secret = request.headers.get('x-webhook-secret')
    if (!env.PRINTFUL_WEBHOOK_SECRET || secret !== env.PRINTFUL_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    console.info('[Printful Webhook]', body?.type)
    return NextResponse.json({ok:true})
  } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
}
