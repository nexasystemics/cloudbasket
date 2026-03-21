import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { getDailyDeals } from '@/lib/deals-engine'
export async function GET(r: NextRequest) {
  const secret = r.headers.get('x-cron-secret')
  if (env.CRON_SECRET && secret !== env.CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const deals = getDailyDeals(5); console.info('[DailyDeals Cron] triggered, deals:', deals.length)
  return NextResponse.json({ ok: true, dealsCount: deals.length, triggeredAt: new Date().toISOString() })
}