// © 2026 NEXQON HOLDINGS — CloudBasket marketing-pipeline.ts
// services/email/marketing-pipeline.ts — Automated email marketing via Resend.
import { Resend } from 'resend'
import { env, isConfigured } from '@/lib/env'

function getResend(): Resend { return new Resend(env.RESEND_API_KEY) }

const FROM = 'CloudBasket <alerts@cloudbasket.in>'

export class EmailMarketingPipeline {
  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    if (!isConfigured('RESEND_API_KEY')) return false
    try {
      const { error } = await getResend().emails.send({
        from: FROM,
        to: [email],
        subject: 'Welcome to CloudBasket',
        html: `<h1>Welcome${name ? `, ${name}` : ''}!</h1><p>You'll now receive the best deals from CloudBasket.</p><p><a href="${env.NEXT_PUBLIC_SITE_URL}/deals">Browse Deals</a></p>`,
      })
      return !error
    } catch { return false }
  }

  async sendPriceDropAlert(email: string, productName: string, oldPrice: number, newPrice: number, affiliateUrl: string): Promise<boolean> {
    if (!isConfigured('RESEND_API_KEY')) return false
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    try {
      const { error } = await getResend().emails.send({
        from: FROM,
        to: [email],
        subject: `Price Drop: ${productName} — ${discount}% off`,
        html: `<h2>Price Drop Alert</h2><p><strong>${productName}</strong></p><p>Now ₹${newPrice.toLocaleString('en-IN')} (was ₹${oldPrice.toLocaleString('en-IN')}) — ${discount}% off</p><p><a href="${affiliateUrl}">View Deal</a></p>`,
      })
      return !error
    } catch { return false }
  }

  async sendWeeklyDigest(email: string, deals: { title: string; price: number }[]): Promise<boolean> {
    if (!isConfigured('RESEND_API_KEY')) return false
    const dealRows = deals.slice(0, 3).map(d => `<li>${d.title} — ₹${d.price.toLocaleString('en-IN')}</li>`).join('')
    try {
      const { error } = await getResend().emails.send({
        from: FROM,
        to: [email],
        subject: 'Your CloudBasket Weekly Deals',
        html: `<h2>This Week's Top Deals</h2><ul>${dealRows}</ul><p><a href="${env.NEXT_PUBLIC_SITE_URL}/deals">See All Deals</a></p>`,
      })
      return !error
    } catch { return false }
  }
}

export const emailPipeline = new EmailMarketingPipeline()


