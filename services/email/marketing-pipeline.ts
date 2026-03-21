// services/email/marketing-pipeline.ts
// Automated email marketing via Plunk API.

import { env, isConfigured } from '@/lib/env'

async function callPlunk(event: string, email: string, data: Record<string, string>): Promise<boolean> {
  if (!isConfigured('PLUNK_API_KEY')) { console.warn('[Plunk] Not configured'); return false }
  try {
    const r = await fetch('https://api.useplunk.com/v1/track', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}` }, body: JSON.stringify({ event, email, data: { ...data, siteUrl: env.NEXT_PUBLIC_SITE_URL } }) })
    return r.ok
  } catch { return false }
}

export class EmailMarketingPipeline {
  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> { return callPlunk('user-welcome', email, { name: name || 'there' }) }
  async sendPriceDropAlert(email: string, productName: string, oldPrice: number, newPrice: number, affiliateUrl: string): Promise<boolean> {
    return callPlunk('price-drop-alert', email, { productName, oldPrice: `₹${oldPrice.toLocaleString('en-IN')}`, newPrice: `₹${newPrice.toLocaleString('en-IN')}`, discount: String(Math.round(((oldPrice - newPrice) / oldPrice) * 100)), affiliateUrl })
  }
  async sendWeeklyDigest(email: string, deals: { title: string; price: number }[]): Promise<boolean> {
    return callPlunk('weekly-deal-digest', email, { deal1: deals[0]?.title || '', deal2: deals[1]?.title || '', deal3: deals[2]?.title || '', dealsUrl: `${env.NEXT_PUBLIC_SITE_URL}/deals` })
  }
}
export const emailPipeline = new EmailMarketingPipeline()