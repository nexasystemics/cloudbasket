// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { triggerZapierWebhook } from '@/lib/automation/zapier'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/redis'

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

  try {
    const key = request.headers.get('x-internal-api-key')
    if (!key || key !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { webhookUrl, event, data } = await request.json()
    if (!webhookUrl || !event) return NextResponse.json({ error: 'webhookUrl and event required' }, { status: 400 })
    const ok = await triggerZapierWebhook(webhookUrl, { event, data: (data as Record<string, unknown>) || {} })
    return NextResponse.json({ ok })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
