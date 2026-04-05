// services/support/chat-support.ts
import { createClient } from '@supabase/supabase-js'
import { isConfigured } from '@/lib/env'

// ─── Types ───────────────────────────────────────────────────────────────────

export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory =
  | 'order_issue'
  | 'return_refund'
  | 'payment'
  | 'account'
  | 'product_query'
  | 'technical'
  | 'other'

export interface Ticket {
  id: string
  user_id: string
  assigned_agent_id: string | null
  subject: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  order_id: string | null
  resolved_at: string | null
  first_response_at: string | null
  created_at: string
  updated_at: string
}

export interface TicketMessage {
  id: string
  ticket_id: string
  sender_id: string
  is_agent: boolean
  message: string
  attachments: string[]
  created_at: string
}

export interface TicketWithMessages extends Ticket {
  messages: TicketMessage[]
}

export interface SupportMetrics {
  open_tickets: number
  in_progress: number
  resolved_today: number
  avg_first_response_hours: number
  avg_resolution_hours: number
  satisfaction_score: number | null
  tickets_by_category: Record<TicketCategory, number>
}

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient() {
  if (
    !isConfigured('NEXT_PUBLIC_SUPABASE_URL') ||
    !isConfigured('SUPABASE_SERVICE_ROLE_KEY')
  ) {
    console.warn('[ChatSupport] Supabase not configured — returning safe defaults')
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inferPriority(subject: string, category: TicketCategory): TicketPriority {
  if (category === 'payment') return 'high'
  if (category === 'return_refund') return 'medium'
  const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'fraud', 'scam']
  if (urgentKeywords.some((kw) => subject.toLowerCase().includes(kw))) return 'urgent'
  return 'low'
}

async function setFirstResponseTime(ticketId: string, sb: any) {
  try {
    const { data } = await sb
      .from('tickets')
      .select('first_response_at')
      .eq('id', ticketId)
      .single()

    if (!(data as any)?.first_response_at) {
      await sb
        .from('tickets')
        .update({ first_response_at: new Date().toISOString() })
        .eq('id', ticketId)
    }
  } catch (err) {
    console.warn('[ChatSupport] setFirstResponseTime error:', err)
  }
}

// ─── Create Ticket ───────────────────────────────────────────────────────────

/**
 * Creates a new support ticket with an initial message.
 * Auto-infers priority based on category and subject keywords.
 * Returns the created ticket or null on failure.
 */
export async function createTicket(
  userId: string,
  subject: string,
  message: string,
  options?: {
    category?: TicketCategory
    order_id?: string
    attachments?: string[]
  }
): Promise<Ticket | null> {
  if (!userId || !subject?.trim() || !message?.trim()) {
    console.warn('[ChatSupport] createTicket: missing required fields')
    return null
  }

  const sb = getClient()
  if (!sb) return null

  const category: TicketCategory = options?.category ?? 'other'
  const priority = inferPriority(subject, category)
  const now = new Date().toISOString()

  try {
    const { data: ticket, error: ticketErr } = await sb
      .from('tickets')
      .insert({
        user_id: userId,
        assigned_agent_id: null,
        subject: subject.trim(),
        category,
        priority,
        status: 'open' as TicketStatus,
        order_id: options?.order_id ?? null,
        resolved_at: null,
        first_response_at: null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (ticketErr) throw ticketErr

    const { error: msgErr } = await sb.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_id: userId,
      is_agent: false,
      message: message.trim(),
      attachments: options?.attachments ?? [],
      created_at: now,
    })

    if (msgErr) throw msgErr
    return ticket as Ticket
  } catch (err) {
    console.warn('[ChatSupport] createTicket error:', err)
    return null
  }
}

// ─── Reply to Ticket ─────────────────────────────────────────────────────────

/**
 * Adds a reply message to an existing ticket.
 * If the sender is an agent, records first response time and updates status to in_progress.
 * If the sender is a user, sets status back to open (waiting on agent).
 */
export async function replyToTicket(
  ticketId: string,
  senderId: string,
  message: string,
  isAgent: boolean,
  attachments: string[] = []
): Promise<TicketMessage | null> {
  if (!ticketId || !senderId || !message?.trim()) {
    console.warn('[ChatSupport] replyToTicket: missing required fields')
    return null
  }

  const sb = getClient()
  if (!sb) return null

  try {
    const now = new Date().toISOString()
    const newStatus: TicketStatus = isAgent ? 'in_progress' : 'waiting_user'

    const { data: msg, error: msgErr } = await sb
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: senderId,
        is_agent: isAgent,
        message: message.trim(),
        attachments,
        created_at: now,
      })
      .select()
      .single()

    if (msgErr) throw msgErr

    await sb
      .from('tickets')
      .update({ status: newStatus, updated_at: now })
      .eq('id', ticketId)

    if (isAgent) await setFirstResponseTime(ticketId, sb)

    return msg as TicketMessage
  } catch (err) {
    console.warn('[ChatSupport] replyToTicket error:', err)
    return null
  }
}

// ─── Assign Ticket ───────────────────────────────────────────────────────────

/**
 * Assigns a ticket to a support agent and sets status to in_progress.
 */
export async function assignTicket(ticketId: string, agentId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('tickets')
      .update({
        assigned_agent_id: agentId,
        status: 'in_progress',
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[ChatSupport] assignTicket error:', err)
    return false
  }
}

// ─── Close Ticket ────────────────────────────────────────────────────────────

/**
 * Marks a ticket as closed and records resolution timestamp.
 */
export async function closeTicket(ticketId: string, resolution?: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const now = new Date().toISOString()
    const { error } = await sb
      .from('tickets')
      .update({
        status: 'closed',
        resolved_at: now,
        updated_at: now,
      })
      .eq('id', ticketId)
    if (error) throw error

    if (resolution) {
      await sb.from('ticket_messages').insert({
        ticket_id: ticketId,
        sender_id: 'system',
        is_agent: true,
        message: `[Ticket Closed] ${resolution}`,
        attachments: [],
        created_at: now,
      })
    }

    return true
  } catch (err) {
    console.warn('[ChatSupport] closeTicket error:', err)
    return false
  }
}

// ─── Reopen Ticket ───────────────────────────────────────────────────────────

/**
 * Re-opens a resolved or closed ticket.
 */
export async function reopenTicket(ticketId: string): Promise<boolean> {
  const sb = getClient()
  if (!sb) return false

  try {
    const { error } = await sb
      .from('tickets')
      .update({ status: 'open', resolved_at: null, updated_at: new Date().toISOString() })
      .eq('id', ticketId)
    if (error) throw error
    return true
  } catch (err) {
    console.warn('[ChatSupport] reopenTicket error:', err)
    return false
  }
}

// ─── Get Open Tickets ────────────────────────────────────────────────────────

/**
 * Fetches all open and in-progress tickets for admin view.
 * Sorted by priority (urgent first) then by creation date.
 */
export async function getOpenTickets(options?: {
  agentId?: string
  category?: TicketCategory
  limit?: number
}): Promise<Ticket[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    let query = sb
      .from('tickets')
      .select('*')
      .in('status', ['open', 'in_progress', 'waiting_user'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })

    if (options?.agentId) query = query.eq('assigned_agent_id', options.agentId)
    if (options?.category) query = query.eq('category', options.category)
    if (options?.limit) query = query.limit(options.limit)

    const { data, error } = await query
    if (error) throw error
    return (data as Ticket[]) ?? []
  } catch (err) {
    console.warn('[ChatSupport] getOpenTickets error:', err)
    return []
  }
}

// ─── Get User Tickets ────────────────────────────────────────────────────────

/**
 * Fetches all tickets for a specific user with their message threads.
 */
export async function getUserTickets(userId: string): Promise<TicketWithMessages[]> {
  const sb = getClient()
  if (!sb) return []

  try {
    const { data: tickets, error: tErr } = await sb
      .from('tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (tErr) throw tErr
    if (!tickets || tickets.length === 0) return []

    const ticketIds = tickets.map((t: Ticket) => t.id)

    const { data: messages, error: mErr } = await sb
      .from('ticket_messages')
      .select('*')
      .in('ticket_id', ticketIds)
      .order('created_at', { ascending: true })

    if (mErr) throw mErr

    const msgMap: Record<string, TicketMessage[]> = {}
    for (const msg of (messages as TicketMessage[]) ?? []) {
      if (!msgMap[msg.ticket_id]) msgMap[msg.ticket_id] = []
      msgMap[msg.ticket_id].push(msg)
    }

    return tickets.map((t: Ticket) => ({
      ...t,
      messages: msgMap[t.id] ?? [],
    }))
  } catch (err) {
    console.warn('[ChatSupport] getUserTickets error:', err)
    return []
  }
}

// ─── Get Support Metrics ──────────────────────────────────────────────────────

/**
 * Returns aggregate support metrics for the admin dashboard.
 */
export async function getSupportMetrics(): Promise<SupportMetrics> {
  const defaults: SupportMetrics = {
    open_tickets: 0,
    in_progress: 0,
    resolved_today: 0,
    avg_first_response_hours: 0,
    avg_resolution_hours: 0,
    satisfaction_score: null,
    tickets_by_category: {
      order_issue: 0,
      return_refund: 0,
      payment: 0,
      account: 0,
      product_query: 0,
      technical: 0,
      other: 0,
    },
  }

  const sb = getClient()
  if (!sb) return defaults

  try {
    const { data, error } = await sb
      .from('support_metrics_view')
      .select('*')
      .single()

    if (error) throw error
    return (data as SupportMetrics) ?? defaults
  } catch (err) {
    console.warn('[ChatSupport] getSupportMetrics error:', err)
    return defaults
  }
}
