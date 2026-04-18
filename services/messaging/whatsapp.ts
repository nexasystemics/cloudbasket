// services/messaging/whatsapp.ts
// WhatsApp Business Cloud API — price alerts, OTP, deal notifications.
import { env, isConfigured } from '@/lib/env'

export type WhatsAppSendResult = {
  messageId: string
  status: 'sent' | 'failed'
  timestamp: Date
}

interface WhatsAppApiResponse {
  messages?: { id: string }[]
}

const BASE = `https://graph.facebook.com/v18.0`

const FAILED_RESULT: WhatsAppSendResult = { messageId: '', status: 'failed', timestamp: new Date() }

function validateIndianPhone(p: string): string | null {
  const c = p.replace(/\s+/g, '').replace(/^0+/, '')
  const m = c.match(/^(\+91|91)?([6-9]\d{9})$/)
  return m ? `+91${m[2]}` : null
}

function isReady(): boolean {
  return isConfigured('WHATSAPP_ACCESS_TOKEN') && isConfigured('WHATSAPP_PHONE_NUMBER_ID')
}

async function send(body: Record<string, unknown>): Promise<WhatsAppSendResult> {
  if (!isReady()) {
    console.warn('[WhatsApp] Not configured')
    return { ...FAILED_RESULT, timestamp: new Date() }
  }
  try {
    const r = await fetch(`${BASE}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
    })
    if (!r.ok) {
      console.warn('[WhatsApp] API error', r.status)
      return { messageId: '', status: 'failed', timestamp: new Date() }
    }
    const j = (await r.json()) as WhatsAppApiResponse
    return { messageId: j.messages?.[0]?.id ?? '', status: 'sent', timestamp: new Date() }
  } catch (err) {
    console.warn('[WhatsApp] send() threw', err)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
}

/**
 * Sends a plain text message to a phone number.
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<WhatsAppSendResult> {
  const p = validateIndianPhone(phone)
  if (!p) {
    console.warn('[WhatsApp] Invalid phone number:', phone)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
  try {
    return await send({ to: p, type: 'text', text: { body: message } })
  } catch (err) {
    console.warn('[WhatsApp] sendWhatsAppMessage failed', err)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
}

/**
 * Sends a deal notification with product name, price, and link.
 */
export async function sendDealAlert(
  phone: string,
  productName: string,
  price: number,
  url: string
): Promise<WhatsAppSendResult> {
  const p = validateIndianPhone(phone)
  if (!p) {
    console.warn('[WhatsApp] Invalid phone number:', phone)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
  try {
    return await send({
      to: p,
      type: 'template',
      template: {
        name: 'deal_alert',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: productName },
              { type: 'text', text: `₹${price.toLocaleString('en-IN')}` },
              { type: 'text', text: url },
            ],
          },
        ],
      },
    })
  } catch (err) {
    console.warn('[WhatsApp] sendDealAlert failed', err)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
}

/**
 * Sends a price drop alert showing old vs new price with a link.
 */
export async function sendPriceDropAlert(
  phone: string,
  productName: string,
  oldPrice: number,
  newPrice: number,
  url: string
): Promise<WhatsAppSendResult> {
  const p = validateIndianPhone(phone)
  if (!p) {
    console.warn('[WhatsApp] Invalid phone number:', phone)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
  try {
    return await send({
      to: p,
      type: 'template',
      template: {
        name: 'price_drop_alert',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: productName },
              { type: 'text', text: `₹${oldPrice.toLocaleString('en-IN')}` },
              { type: 'text', text: `₹${newPrice.toLocaleString('en-IN')}` },
              { type: 'text', text: url },
            ],
          },
        ],
      },
    })
  } catch (err) {
    console.warn('[WhatsApp] sendPriceDropAlert failed', err)
    return { messageId: '', status: 'failed', timestamp: new Date() }
  }
}

export class WhatsAppService {
  async sendPriceDropAlert(
    phone: string,
    productName: string,
    newPrice: number,
    oldPrice: number,
    dealUrl: string
  ): Promise<WhatsAppSendResult> {
    return sendPriceDropAlert(phone, productName, oldPrice, newPrice, dealUrl)
  }

  async sendOTP(phone: string, otp: string): Promise<WhatsAppSendResult> {
    const p = validateIndianPhone(phone)
    if (!p) return { messageId: '', status: 'failed', timestamp: new Date() }
    return send({
      to: p,
      type: 'template',
      template: {
        name: 'verification_otp',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: otp },
              { type: 'text', text: '10 minutes' },
            ],
          },
        ],
      },
    })
  }
}

export const whatsappService = new WhatsAppService()
