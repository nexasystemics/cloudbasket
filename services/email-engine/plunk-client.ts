// © 2026 NEXQON HOLDINGS — CloudBasket plunk-client.ts
// services/email-engine/plunk-client.ts — Email engine via Resend (replaces Plunk).
import { Resend } from 'resend'

const FROM = 'CloudBasket <noreply@cloudbasket.in>'

interface EmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export class EmailEngine {
  private resend(): Resend {
    return new Resend(process.env.RESEND_API_KEY)
  }

  async sendEmail(params: EmailParams): Promise<boolean> {
    if (!process.env.RESEND_API_KEY) return false
    try {
      const { error } = await this.resend().emails.send({
        from: params.from || FROM,
        to: [params.to],
        subject: params.subject,
        html: params.html,
      })
      return !error
    } catch { return false }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to CloudBasket',
      html: `<h1>Welcome to CloudBasket!</h1><p>Hi ${name},</p><p>Thanks for subscribing! You'll now receive weekly deals, price drops, and exclusive offers.</p><a href="https://cloudbasket.in">Browse Deals</a>`,
    })
  }

  async sendDealAlert(email: string, dealTitle: string, discountValue: number): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Deal Alert: ${dealTitle}`,
      html: `<h2>New Deal Alert!</h2><p><strong>${dealTitle}</strong></p><p>Save ${discountValue}% — Limited time only!</p><a href="https://cloudbasket.in/deals">View Deal</a>`,
    })
  }

  async sendNewsletter(subscribers: string[], subject: string, html: string): Promise<number> {
    const results = await Promise.allSettled(
      subscribers.map(email => this.sendEmail({ to: email, subject, html }))
    )
    return results.filter(r => r.status === 'fulfilled' && r.value).length
  }
}

export const emailEngine = new EmailEngine()
