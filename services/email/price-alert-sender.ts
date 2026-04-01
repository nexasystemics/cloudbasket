// © 2026 NEXQON HOLDINGS — CloudBasket price-alert-sender.ts
// services/email/price-alert-sender.ts — Price alert email sending via Resend.
import { Resend } from 'resend'
import { env, isConfigured } from '@/lib/env'
import crypto from 'crypto'

const DISPOSABLE = ['mailinator.com','tempmail.com','guerrillamail.com','yopmail.com','throwaway.email','trashmail.com']

export function validateEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false
  return !DISPOSABLE.includes(email.split('@')[1]?.toLowerCase())
}

export function generateUnsubscribeToken(email: string): string {
  try {
    return crypto.createHmac('sha256', env.RESEND_API_KEY.substring(0, 16) || 'cloudbasket').update(email).digest('base64url')
  } catch { return Buffer.from(email).toString('base64url') }
}

async function sendAlert(email: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured('RESEND_API_KEY')) return { success: false, error: 'Not configured' }
  if (!validateEmail(email)) return { success: false, error: 'Invalid email' }
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: 'CloudBasket <alerts@cloudbasket.in>', to: [email], subject, html })
    return error ? { success: false, error: error.message } : { success: true }
  } catch (e) { return { success: false, error: String(e) } }
}

export class PriceAlertEmailSender {
  async sendPriceDropAlert(email: string, productName: string, productImage: string, newPrice: number, oldPrice: number, affiliateUrl: string, platform: string): Promise<{ success: boolean }> {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    const unsubToken = generateUnsubscribeToken(email)
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        ${productImage ? `<img src="${productImage}" alt="${productName}" style="width:100%;max-height:200px;object-fit:contain"/>` : ''}
        <h2>${productName}</h2>
        <p>Now <strong>₹${newPrice.toLocaleString('en-IN')}</strong> (was ₹${oldPrice.toLocaleString('en-IN')}) — ${discount}% off on ${platform}</p>
        <a href="${affiliateUrl}" style="background:#039BE5;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">View Deal</a>
        <p style="font-size:11px;color:#999;margin-top:24px"><a href="${env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${unsubToken}">Unsubscribe</a></p>
      </div>`
    return sendAlert(email, `Price Drop: ${productName} — ${discount}% off`, html)
  }

  async sendBulkAlerts(alerts: { email: string; productName: string; productImage: string; newPrice: number; oldPrice: number; affiliateUrl: string; platform: string }[]): Promise<{ sent: number; failed: number }> {
    let sent = 0; let failed = 0
    for (let i = 0; i < alerts.length; i += 50) {
      await Promise.all(alerts.slice(i, i + 50).map(async a => {
        const r = await this.sendPriceDropAlert(a.email, a.productName, a.productImage, a.newPrice, a.oldPrice, a.affiliateUrl, a.platform)
        if (r.success) sent++; else failed++
      }))
      if (i + 50 < alerts.length) await new Promise(r => setTimeout(r, 100))
    }
    return { sent, failed }
  }
}

export const priceAlertSender = new PriceAlertEmailSender()
