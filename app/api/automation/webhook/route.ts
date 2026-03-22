import { NextRequest, NextResponse } from 'next/server'
import { triggerZapierWebhook } from '@/lib/automation/zapier'
export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, event, data } = await request.json()
    if (!webhookUrl || !event) return NextResponse.json({ error: 'webhookUrl and event required' }, { status: 400 })
    const ok = await triggerZapierWebhook(webhookUrl, { event, data: data || {} })
    return NextResponse.json({ ok })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}