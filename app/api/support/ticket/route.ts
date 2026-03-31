// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { freshdeskAPI } from '@/services/crm/freshdesk'
export async function POST(request: NextRequest) {
  try {
    const { subject, description, email, type } = await request.json()
    if (!subject || !email) return NextResponse.json({ error: 'subject and email required' }, { status: 400 })
    const ticket = await freshdeskAPI.createTicket({ subject, description: description || subject, email, priority: 2, type: type || 'Question', tags: ['cloudbasket'] })
    return NextResponse.json({ ok: !!ticket, ticketId: ticket?.id })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
