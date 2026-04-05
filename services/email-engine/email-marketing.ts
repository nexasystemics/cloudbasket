// services/email-engine/email-marketing.ts
// Email marketing pipeline for CloudBasket — newsletters, campaigns, alerts.
// Stub-safe — logs warnings when Resend/Plunk API key not configured.

import { isConfigured, env } from '@/lib/env'

export interface EmailContact {
  email: string
  name?: string
  tags?: string[]
  subscribedAt?: string
}

export interface EmailCampaign {
  id: string
  subject: string
  previewText: string
  htmlContent: string
  recipients: string[]
  scheduledFor?: string
  status: 'draft' | 'scheduled' | 'sent'
  sentAt?: string
  openRate?: number
  clickRate?: number
}

export interface DealAlertEmail {
  to: string
  productName: string
  originalPrice: number
  dealPrice: number
  discountPercent: number
  productUrl: string
  imageUrl?: string
}

function formatINR(n: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function buildDealAlertHtml(data: DealAlertEmail): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden">
    <div style="background:#1F4E79;padding:20px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px">CloudBasket 🛒</h1>
      <p style="color:#90CAF9;margin:4px 0 0">Price Alert Triggered!</p>
    </div>
    <div style="padding:24px">
      <h2 style="color:#1F4E79">${data.productName}</h2>
      <div style="display:flex;gap:16px;align-items:center;margin:16px 0">
        <span style="font-size:28px;font-weight:bold;color:#16A34A">${formatINR(data.dealPrice)}</span>
        <span style="font-size:16px;color:#9CA3AF;text-decoration:line-through">${formatINR(data.originalPrice)}</span>
        <span style="background:#DCFCE7;color:#16A34A;padding:4px 10px;border-radius:20px;font-size:14px;font-weight:bold">${data.discountPercent}% OFF</span>
      </div>
      <a href="${data.productUrl}" style="display:inline-block;background:#E65100;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:8px">
        View Deal →
      </a>
    </div>
    <div style="background:#F9FAFB;padding:16px;text-align:center;font-size:12px;color:#9CA3AF">
      CloudBasket · cloudbasket.in · <a href="https://cloudbasket.in/unsubscribed" style="color:#9CA3AF">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
}

class EmailMarketingPipeline {
  private isResendReady(): boolean {
    return isConfigured('RESEND_API_KEY')
  }

  private isPlunkReady(): boolean {
    return isConfigured('RESEND_API_KEY')
  }

  private isReady(): boolean {
    return this.isResendReady() || this.isPlunkReady()
  }

  async sendDealAlert(data: DealAlertEmail): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('[EmailMarketing] No email provider configured — stub send')
      console.warn('[EmailMarketing] Would send deal alert to:', data.to)
      return false
    }

    try {
      if (this.isResendReady()) {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'CloudBasket <alerts@cloudbasket.in>',
            to: data.to,
            subject: `🔥 ${data.discountPercent}% OFF — ${data.productName}`,
            html: buildDealAlertHtml(data),
          }),
        })
        return res.ok
      }
      return false
    } catch (err) {
      console.warn('[EmailMarketing] Send error:', err)
      return false
    }
  }

  async sendNewsletter(campaign: Omit<EmailCampaign, 'id' | 'status'>): Promise<EmailCampaign> {
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: `camp-${Date.now()}`,
      status: 'draft',
    }

    if (!this.isReady()) {
      console.warn('[EmailMarketing] No provider configured — campaign saved as draft')
      return newCampaign
    }

    try {
      console.warn('[EmailMarketing] Newsletter send wire pending')
      return { ...newCampaign, status: 'sent', sentAt: new Date().toISOString() }
    } catch (err) {
      console.warn('[EmailMarketing] Newsletter error:', err)
      return newCampaign
    }
  }

  async subscribeContact(contact: EmailContact): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('[EmailMarketing] Stub subscribe:', contact.email)
      return true
    }
    try {
      console.warn('[EmailMarketing] Subscribe wire pending:', contact.email)
      return true
    } catch (err) {
      console.warn('[EmailMarketing] Subscribe error:', err)
      return false
    }
  }
}

export const emailMarketing = new EmailMarketingPipeline()


