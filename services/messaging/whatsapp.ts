// services/messaging/whatsapp.ts
// WhatsApp Business Cloud API — price alerts, OTP, deal notifications.
import { env, isConfigured } from '@/lib/env'
export type WhatsAppSendResult = { messageId: string; status: 'sent' | 'failed'; timestamp: Date }
const BASE = `https://graph.facebook.com/v18.0`
function validateIndianPhone(p: string): string | null { const c = p.replace(/\s+/g, '').replace(/^0+/, ''); const m = c.match(/^(\+91|91)?([6-9]\d{9})$/); return m ? `+91${m[2]}` : null }
async function send(body: Record<string, unknown>): Promise<WhatsAppSendResult> {
  if (!isConfigured('WHATSAPP_ACCESS_TOKEN') || !isConfigured('WHATSAPP_PHONE_NUMBER_ID')) { console.warn('[WhatsApp] Not configured'); return { messageId: '', status: 'failed', timestamp: new Date() } }
  try {
    const r = await fetch(`${BASE}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }, body: JSON.stringify({ messaging_product: 'whatsapp', ...body }) })
    if (!r.ok) return { messageId: '', status: 'failed', timestamp: new Date() }
    const j = await r.json()
    return { messageId: j.messages?.[0]?.id || '', status: 'sent', timestamp: new Date() }
  } catch { return { messageId: '', status: 'failed', timestamp: new Date() } }
}
export class WhatsAppService {
  async sendPriceDropAlert(phone: string, productName: string, newPrice: number, oldPrice: number, dealUrl: string): Promise<WhatsAppSendResult> {
    const p = validateIndianPhone(phone); if (!p) return { messageId: '', status: 'failed', timestamp: new Date() }
    return send({ to: p, type: 'template', template: { name: 'price_drop_alert', language: { code: 'en' }, components: [{ type: 'body', parameters: [{ type: 'text', text: productName }, { type: 'text', text: `₹${oldPrice.toLocaleString('en-IN')}` }, { type: 'text', text: `₹${newPrice.toLocaleString('en-IN')}` }, { type: 'text', text: dealUrl }] }] } })
  }
  async sendOTP(phone: string, otp: string): Promise<WhatsAppSendResult> {
    const p = validateIndianPhone(phone); if (!p) return { messageId: '', status: 'failed', timestamp: new Date() }
    return send({ to: p, type: 'template', template: { name: 'verification_otp', language: { code: 'en' }, components: [{ type: 'body', parameters: [{ type: 'text', text: otp }, { type: 'text', text: '10 minutes' }] }] } })
  }
}
export const whatsappService = new WhatsAppService()

