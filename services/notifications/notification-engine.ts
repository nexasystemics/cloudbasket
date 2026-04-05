// services/notifications/notification-engine.ts
// D19: Smart Notification Engine — stub-safe, multi-channel

import { isConfigured } from '@/lib/env'

export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'push' | 'telegram'

export type NotificationPayload = {
  userId: string
  channel: NotificationChannel
  title: string
  body: string
  data?: Record<string, string>
  imageUrl?: string
}

export type NotificationResult = {
  channel: NotificationChannel
  success: boolean
  messageId?: string
  error?: string
  sentAt: string
}

export type PriceAlertPayload = {
  userId: string
  productId: string
  productName: string
  targetPrice: number
  currentPrice: number
  platform: string
  productUrl: string
}

class NotificationEngine {
  private isEmailReady(): boolean {
    return isConfigured('RESEND_API_KEY')
  }

  private isWhatsAppReady(): boolean {
    return isConfigured('WHATSAPP_ACCESS_TOKEN') && isConfigured('WHATSAPP_PHONE_NUMBER_ID')
  }

  private isSMSReady(): boolean {
    return isConfigured('MSG91_AUTH_KEY')
  }

  private isPushReady(): boolean {
    return isConfigured('VAPID_PRIVATE_KEY') && isConfigured('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
  }

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const sentAt = new Date().toISOString()

    try {
      switch (payload.channel) {
        case 'email':
          if (!this.isEmailReady()) {
            console.warn('[notification-engine] Resend not configured — skipping email')
            return { channel: 'email', success: false, error: 'not_configured', sentAt }
          }
          console.info('[notification-engine] Would send email via Resend to userId:', payload.userId)
          return { channel: 'email', success: true, messageId: `email_${Date.now()}`, sentAt }

        case 'whatsapp':
          if (!this.isWhatsAppReady()) {
            console.warn('[notification-engine] WhatsApp not configured — skipping')
            return { channel: 'whatsapp', success: false, error: 'not_configured', sentAt }
          }
          console.info('[notification-engine] Would send WhatsApp to userId:', payload.userId)
          return { channel: 'whatsapp', success: true, messageId: `wa_${Date.now()}`, sentAt }

        case 'sms':
          if (!this.isSMSReady()) {
            console.warn('[notification-engine] MSG91 not configured — skipping SMS')
            return { channel: 'sms', success: false, error: 'not_configured', sentAt }
          }
          console.info('[notification-engine] Would send SMS via MSG91 to userId:', payload.userId)
          return { channel: 'sms', success: true, messageId: `sms_${Date.now()}`, sentAt }

        case 'push':
          if (!this.isPushReady()) {
            console.warn('[notification-engine] VAPID not configured — skipping push')
            return { channel: 'push', success: false, error: 'not_configured', sentAt }
          }
          console.info('[notification-engine] Would send push to userId:', payload.userId)
          return { channel: 'push', success: true, messageId: `push_${Date.now()}`, sentAt }

        default:
          return { channel: payload.channel, success: false, error: 'unsupported_channel', sentAt }
      }
    } catch (err) {
      console.warn('[notification-engine] send failed:', err)
      return { channel: payload.channel, success: false, error: String(err), sentAt }
    }
  }

  async sendPriceAlert(alert: PriceAlertPayload): Promise<NotificationResult[]> {
    const channels: NotificationChannel[] = ['email', 'whatsapp', 'push']
    const results: NotificationResult[] = []

    for (const channel of channels) {
      const result = await this.send({
        userId: alert.userId,
        channel,
        title: `Price Drop Alert — ${alert.productName}`,
        body: `Price dropped to ₹${alert.currentPrice.toLocaleString('en-IN')} on ${alert.platform}. Your target: ₹${alert.targetPrice.toLocaleString('en-IN')}`,
        data: {
          productId: alert.productId,
          productUrl: alert.productUrl,
          currentPrice: String(alert.currentPrice),
        },
      })
      results.push(result)
    }

    return results
  }

  async sendBulk(payloads: NotificationPayload[]): Promise<NotificationResult[]> {
    const results: NotificationResult[] = []
    for (const payload of payloads) {
      const result = await this.send(payload)
      results.push(result)
    }
    return results
  }
}

export const notificationEngine = new NotificationEngine()
