// services/email/marketing-pipeline.ts
// Automated email marketing pipeline using Plunk API.
// Stubs return gracefully when PLUNK_API_KEY not configured.

import { env, isConfigured } from '@/lib/env'

export type EmailSequence = {
  id: string
  steps: { delay: number; templateId: string; subject: string }[]
}

export const EMAIL_SEQUENCES: Record<string, EmailSequence> = {
  welcome: {
    id: 'welcome',
    steps: [
      { delay: 0, templateId: 'welcome', subject: 'Welcome to CloudBasket — Your first deal is waiting' },
      { delay: 3, templateId: 'how-it-works', subject: 'How to save money on every purchase with CloudBasket' },
      { delay: 7, templateId: 'top-deals', subject: "This week's top 10 deals — curated for you" },
      { delay: 14, templateId: 'price-alert-intro', subject: 'Never miss a price drop again — set your first alert' },
    ],
  },
  price_drop: {
    id: 'price_drop',
    steps: [{ delay: 0, templateId: 'price-drop-alert', subject: '🔥 Price drop alert: {productName} is now ₹{price}' }],
  },
  weekly_digest: {
    id: 'weekly_digest',
    steps: [{ delay: 0, templateId: 'weekly-digest', subject: 'Your weekly deal digest — deals this week' }],
  },
  win_back: {
    id: 'win_back',
    steps: [
      { delay: 30, templateId: 'win-back', subject: 'We miss you — here are deals you might have missed' },
      { delay: 45, templateId: 'win-back-2', subject: 'Last chance: exclusive deals just for you' },
    ],
  },
}

async function callPlunk(event: string, email: string, data: Record<string, string>): Promise<boolean> {
  if (!isConfigured('PLUNK_API_KEY')) { console.warn('[Plunk] API key not configured'); return false }
  try {
    const res = await fetch('https://api.useplunk.com/v1/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.PLUNK_API_KEY}` },
      body: JSON.stringify({ event, email, data }),
    })
    return res.ok
  } catch { return false }
}

export class EmailMarketingPipeline {
  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    return callPlunk('user-welcome', email, { name: name || 'there', siteUrl: env.NEXT_PUBLIC_SITE_URL })
  }

  async sendPriceDropAlert(email: string, productName: string, oldPrice: number, newPrice: number, affiliateUrl: string): Promise<boolean> {
    return callPlunk('price-drop-alert', email, {
      productName,
      oldPrice: `₹${oldPrice.toLocaleString('en-IN')}`,
      newPrice: `₹${newPrice.toLocaleString('en-IN')}`,
      discount: String(Math.round(((oldPrice - newPrice) / oldPrice) * 100)),
      affiliateUrl,
      siteUrl: env.NEXT_PUBLIC_SITE_URL,
    })
  }

  async sendWeeklyDigest(email: string, deals: { title: string; price: number; discount: number }[]): Promise<boolean> {
    return callPlunk('weekly-deal-digest', email, {
      deal1: deals[0]?.title || '',
      deal2: deals[1]?.title || '',
      deal3: deals[2]?.title || '',
      dealsUrl: `${env.NEXT_PUBLIC_SITE_URL}/deals`,
    })
  }

  async enrollSubscriber(email: string, sequenceId: string): Promise<void> {
    await callPlunk(`enroll-${sequenceId}`, email, { sequenceId, enrolledAt: new Date().toISOString() })
  }
}

export const emailPipeline = new EmailMarketingPipeline()