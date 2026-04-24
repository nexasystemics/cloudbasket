// services/email-engine/email-marketing.ts
// Email marketing pipeline for CloudBasket — newsletters, campaigns, alerts.
// Stub-safe — logs warnings when Resend/Plunk API key not configured.

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
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
      CloudBasket · cloudbasket.co · <a href="https://cloudbasket.co/unsubscribed" style="color:#9CA3AF">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`
}

class EmailMarketingPipeline {
  private resend(): Resend {
    return new Resend(env.RESEND_API_KEY)
  }

  private getSupabaseAdmin() {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL') || !isConfigured('SUPABASE_SERVICE_ROLE_KEY')) {
      return null
    }

    return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  }

  private isResendReady(): boolean {
    return isConfigured('RESEND_API_KEY')
  }

  private isPlunkReady(): boolean {
    return false
  }

  private isReady(): boolean {
    return this.isResendReady() || this.isPlunkReady()
  }

  /**
   * Sends a single deal alert email through the configured marketing provider.
   * @param {DealAlertEmail} data Deal alert payload containing recipient, pricing, and product link details.
   * @returns {Promise<boolean>} Resolves to `true` when the provider accepts the send request, otherwise `false`.
   */
  async sendDealAlert(data: DealAlertEmail): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('[EmailMarketing] No email provider configured — stub send')
      console.warn('[EmailMarketing] Would send deal alert to:', data.to)
      return false
    }

    try {
      if (this.isResendReady()) {
        const { error } = await this.resend().emails.send({
            from: 'CloudBasket <alerts@cloudbasket.co>',
            to: [data.to],
            subject: `🔥 ${data.discountPercent}% OFF — ${data.productName}`,
            html: buildDealAlertHtml(data),
        })
        return !error
      }
      return false
    } catch (err) {
      console.warn('[EmailMarketing] Send error:', err)
      return false
    }
  }

  /**
   * Sends a newsletter campaign to the deduplicated recipient list and returns the resulting campaign record.
   * @param {Omit<EmailCampaign, 'id' | 'status'>} campaign Campaign content and recipients before an id or delivery status is assigned.
   * @returns {Promise<EmailCampaign>} Resolves to the campaign record with generated id, normalized recipients, and final delivery status.
   */
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
      if (!this.isResendReady()) {
        return newCampaign
      }

      const recipients = [...new Set(campaign.recipients.map((email) => email.trim().toLowerCase()).filter(Boolean))]
      const results = await Promise.allSettled(
        recipients.map((email) =>
          this.resend().emails.send({
            from: 'CloudBasket <alerts@cloudbasket.co>',
            to: [email],
            subject: campaign.subject,
            html: campaign.htmlContent,
          }),
        ),
      )

      const failed = results.filter(
        (result) => result.status === 'rejected' || (result.status === 'fulfilled' && result.value.error),
      )

      if (failed.length > 0) {
        console.warn('[EmailMarketing] Newsletter partial failure:', `${failed.length}/${recipients.length}`)
      }

      return {
        ...newCampaign,
        recipients,
        status: failed.length === recipients.length ? 'draft' : 'sent',
        sentAt: failed.length === recipients.length ? undefined : new Date().toISOString(),
      }
    } catch (err) {
      console.warn('[EmailMarketing] Newsletter error:', err)
      return newCampaign
    }
  }

  /**
   * Subscribes or updates a marketing contact in the email subscribers table.
   * @param {EmailContact} contact Contact details to persist for newsletter subscriptions.
   * @returns {Promise<boolean>} Resolves to `true` when the subscriber is accepted or stubbed successfully, otherwise `false`.
   */
  async subscribeContact(contact: EmailContact): Promise<boolean> {
    const supabase = this.getSupabaseAdmin()
    if (!supabase) {
      console.warn('[EmailMarketing] Stub subscribe:', contact.email)
      return true
    }

    try {
      const email = contact.email.trim().toLowerCase()
      const { error } = await supabase.from('email_subscribers').upsert({
        email,
        name: contact.name?.trim() || null,
        tags: contact.tags ?? [],
        subscribed_at: contact.subscribedAt ?? new Date().toISOString(),
        unsubscribed_at: null,
      }, { onConflict: 'email' })

      if (error) {
        console.warn('[EmailMarketing] Subscribe error:', error.message)
        return false
      }

      return true
    } catch (err) {
      console.warn('[EmailMarketing] Subscribe error:', err)
      return false
    }
  }
}

export const emailMarketing = new EmailMarketingPipeline()


