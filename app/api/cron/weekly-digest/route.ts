import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getDailyDeals } from '@/lib/deals-engine'
import { rateLimit } from '@/lib/redis'

export async function GET(r: NextRequest) {
  const ip = r.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? r.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 5, 60)
  if (!rl.success) return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  const authHeader = r.headers.get('authorization')
  const secret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!secret || secret !== env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const deals = getDailyDeals(5)
    console.info('[WeeklyDigest Cron] triggered, deals:', deals.length)
    return NextResponse.json({ ok: true, dealsCount: deals.length, triggeredAt: new Date().toISOString() })
  } catch (err) {
    console.error('[WeeklyDigest Cron] failed:', err)
    return NextResponse.json({ ok: false, error: 'Cron failed' }, { status: 500 })
  }
}
