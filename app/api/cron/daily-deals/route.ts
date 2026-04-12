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

  const secret = r.headers.get('x-cron-secret')
  if (env.CRON_SECRET && secret !== env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const deals = getDailyDeals(5); console.info('[DailyDeals Cron] triggered, deals:', deals.length)
  return NextResponse.json({ ok: true, dealsCount: deals.length, triggeredAt: new Date().toISOString() })
}
