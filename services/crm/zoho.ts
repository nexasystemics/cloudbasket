// © 2026 NEXQON HOLDINGS — CloudBasket zoho.ts
// services/crm/zoho.ts — F01: Zoho CRM Integration
import { env, isConfigured } from '@/lib/env'
export type ZohoLead = { Last_Name: string; Email: string; Phone?: string; Lead_Source?: string; Company?: string }
export class ZohoCRM {
  private ok() { return isConfigured('ZOHO_ACCESS_TOKEN') }
  private headers() { return { Authorization: `Zoho-oauthtoken ${env.ZOHO_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
  async createLead(lead: ZohoLead) {
    if (!this.ok()) return null
    try { const r = await fetch('https://www.zohoapis.in/crm/v6/Leads', { method: 'POST', headers: this.headers(), body: JSON.stringify({ data: [lead] }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  async searchLeads(email: string) {
    if (!this.ok()) return []
    try { const r = await fetch(`https://www.zohoapis.in/crm/v6/Leads/search?criteria=(Email:equals:${encodeURIComponent(email)})`, { headers: this.headers() }); return r.ok ? ((await r.json()).data || []) : [] } catch { return [] }
  }
}
export const zohoCRM = new ZohoCRM()


