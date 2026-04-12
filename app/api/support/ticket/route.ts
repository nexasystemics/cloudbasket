// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { freshdeskAPI } from '@/services/crm/freshdesk'
import { supportTicketSchema, zodError } from '@/lib/validation'
import { rateLimit } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = supportTicketSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { subject, description, email, type } = parsed.data

  try {
    const ticket = await freshdeskAPI.createTicket({
      subject,
      description: description || subject,
      email,
      priority: 2,
      type: type || 'Question',
      tags: ['cloudbasket'],
    })
    return NextResponse.json({ ok: !!ticket, ticketId: ticket?.id })
  } catch (err) {
    console.error('[support/ticket] Error:', err)
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
  }
}
