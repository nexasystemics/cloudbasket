// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { triggerZapierWebhook } from '@/lib/automation/zapier'
import { env } from '@/lib/env'
export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('x-internal-api-key')
    if (env.INTERNAL_API_KEY && key !== env.INTERNAL_API_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { webhookUrl, event, data } = await request.json()
    if (!webhookUrl || !event) return NextResponse.json({ error: 'webhookUrl and event required' }, { status: 400 })
    const ok = await triggerZapierWebhook(webhookUrl, { event, data: (data as Record<string, unknown>) || {} })
    return NextResponse.json({ ok })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
