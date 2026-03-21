// services/payments/razorpay.ts
// Razorpay payment gateway for POD checkout.
import { env, isConfigured } from '@/lib/env'
import crypto from 'crypto'
export type RazorpayOrder = { id: string; amount: number; currency: string; receipt: string; status: string }
const BASE = 'https://api.razorpay.com/v1'
function authHeader() { return 'Basic ' + Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64') }
export class RazorpayService {
  private isReady() { return isConfigured('RAZORPAY_KEY_ID') && isConfigured('RAZORPAY_KEY_SECRET') }
  async createOrder(amountINR: number, currency = 'INR', receipt: string, notes?: Record<string, string>): Promise<RazorpayOrder | null> {
    if (!this.isReady()) { console.warn('[Razorpay] Not configured'); return null }
    try { const r = await fetch(`${BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authHeader() }, body: JSON.stringify({ amount: Math.round(amountINR * 100), currency, receipt, notes }) }); return r.ok ? await r.json() : null } catch { return null }
  }
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    if (!this.isReady()) return false
    try { return crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex') === signature } catch { return false }
  }
  async createRefund(paymentId: string, amountINR?: number): Promise<any> {
    if (!this.isReady()) return null
    try { const body: any = {}; if (amountINR) body.amount = Math.round(amountINR * 100); const r = await fetch(`${BASE}/payments/${paymentId}/refund`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: authHeader() }, body: JSON.stringify(body) }); return r.ok ? await r.json() : null } catch { return null }
  }
}
export const razorpayService = new RazorpayService()