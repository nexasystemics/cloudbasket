// © 2026 NEXQON HOLDINGS — CloudBasket hubspot.ts
// services/crm/hubspot.ts — F01: HubSpot CRM Integration
import { env, isConfigured } from '@/lib/env'
const BASE = 'https://api.hubapi.com'
function headers() { return { Authorization: `Bearer ${env.HUBSPOT_API_KEY}`, 'Content-Type': 'application/json' } }
export type HubSpotContact = { id?: string; email: string; firstname?: string; lastname?: string; phone?: string; source?: string }
export type HubSpotDeal = { id?: string; dealname: string; amount: number; dealstage: string; pipeline?: string }
export class HubSpotCRM {
  private ok() { return isConfigured('HUBSPOT_API_KEY') }
  async createContact(c: HubSpotContact) {
    if (!this.ok()) return null
    try { const r = await fetch(`${BASE}/crm/v3/objects/contacts`, { method: 'POST', headers: headers(), body: JSON.stringify({ properties: c }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  async upsertContact(email: string, props: Partial<HubSpotContact>) {
    if (!this.ok()) return null
    try { const r = await fetch(`${BASE}/crm/v3/objects/contacts/${email}?idProperty=email`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ properties: props }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  async createDeal(deal: HubSpotDeal) {
    if (!this.ok()) return null
    try { const r = await fetch(`${BASE}/crm/v3/objects/deals`, { method: 'POST', headers: headers(), body: JSON.stringify({ properties: deal }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  async trackEvent(email: string, eventName: string, props?: Record<string, string>) {
    if (!this.ok()) return
    try { await fetch(`${BASE}/events/v3/send`, { method: 'POST', headers: headers(), body: JSON.stringify({ eventName, email, properties: props || {} }) }) } catch { /* no-op */ }
  }
}
export const hubspotCRM = new HubSpotCRM()


