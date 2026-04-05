// © 2026 NEXQON HOLDINGS — CloudBasket freshdesk.ts
// services/crm/freshdesk.ts — F02: Freshdesk Support CRM
import { env, isConfigured } from '@/lib/env'
export type FreshdeskTicket = { subject: string; description: string; email: string; priority?: 1|2|3|4; type?: string; tags?: string[] }
export type FreshdeskContact = { name: string; email: string; phone?: string }
export class FreshdeskAPI {
  private ok() { return isConfigured('FRESHDESK_API_KEY') && isConfigured('FRESHDESK_DOMAIN') }
  private headers() { return { Authorization: `Basic ${Buffer.from(`${env.FRESHDESK_API_KEY}:X`).toString('base64')}`, 'Content-Type': 'application/json' } }
  private base() { return `https://${env.FRESHDESK_DOMAIN}.freshdesk.com/api/v2` }
  async createTicket(ticket: FreshdeskTicket) {
    if (!this.ok()) return null
    try { const r = await fetch(`${this.base()}/tickets`, { method: 'POST', headers: this.headers(), body: JSON.stringify({ ...ticket, source: 2 }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  async getTickets(email: string) {
    if (!this.ok()) return []
    try { const r = await fetch(`${this.base()}/tickets?email=${encodeURIComponent(email)}`, { headers: this.headers() }); return r.ok ? await r.json() : [] } catch { return [] }
  }
  async createContact(contact: FreshdeskContact) {
    if (!this.ok()) return null
    try { const r = await fetch(`${this.base()}/contacts`, { method: 'POST', headers: this.headers(), body: JSON.stringify(contact) }); return r.ok ? await r.json() : null } catch { return null }
  }
}
export const freshdeskAPI = new FreshdeskAPI()


