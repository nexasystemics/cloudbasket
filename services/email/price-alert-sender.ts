// services/email/price-alert-sender.ts
// Price alert email sending via Plunk API.
import { env, isConfigured } from '@/lib/env'
import crypto from 'crypto'
const DISPOSABLE = ['mailinator.com','tempmail.com','guerrillamail.com','yopmail.com','throwaway.email','trashmail.com']
export function validateEmail(email: string): boolean { if (!email || !email.includes('@')) return false; return !DISPOSABLE.includes(email.split('@')[1]?.toLowerCase()) }
export function generateUnsubscribeToken(email: string): string { try { return crypto.createHmac('sha256', env.PLUNK_API_KEY.substring(0, 16) || 'cloudbasket').update(email).digest('base64url') } catch { return Buffer.from(email).toString('base64url') } }
async function sendPlunkEvent(event: string, email: string, data: Record<string, string>): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured('PLUNK_API_KEY')) return { success: false, error: 'Not configured' }
  if (!validateEmail(email)) return { success: false, error: 'Invalid email' }
  try { const r = await fetch('https://api.useplunk.com/v1/track', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}` }, body: JSON.stringify({ event, email, data: { ...data, unsubscribeToken: generateUnsubscribeToken(email), siteUrl: env.NEXT_PUBLIC_SITE_URL } }) }); return { success: r.ok } } catch (e) { return { success: false, error: String(e) } }
}
export class PriceAlertEmailSender {
  async sendPriceDropAlert(email: string, productName: string, productImage: string, newPrice: number, oldPrice: number, affiliateUrl: string, platform: string): Promise<{ success: boolean }> {
    return sendPlunkEvent('price-drop-alert', email, { productName, productImage, oldPrice: `₹${oldPrice.toLocaleString('en-IN')}`, newPrice: `₹${newPrice.toLocaleString('en-IN')}`, discount: String(Math.round(((oldPrice - newPrice) / oldPrice) * 100)), affiliateUrl, platform })
  }
  async sendBulkAlerts(alerts: { email: string; productName: string; productImage: string; newPrice: number; oldPrice: number; affiliateUrl: string; platform: string }[]): Promise<{ sent: number; failed: number }> {
    let sent = 0; let failed = 0
    for (let i = 0; i < alerts.length; i += 50) { await Promise.all(alerts.slice(i, i + 50).map(async a => { const r = await this.sendPriceDropAlert(a.email, a.productName, a.productImage, a.newPrice, a.oldPrice, a.affiliateUrl, a.platform); if (r.success) sent++; else failed++ })); if (i + 50 < alerts.length) await new Promise(r => setTimeout(r, 100)) }
    return { sent, failed }
  }
}
export const priceAlertSender = new PriceAlertEmailSender()