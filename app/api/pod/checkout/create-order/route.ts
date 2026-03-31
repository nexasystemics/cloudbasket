import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/services/payments/razorpay'
import { env, isConfigured } from '@/lib/env'
const GST: Record<string, number> = { tshirt: 0.05, mug: 0.12, 'phone-case': 0.18, poster: 0.12, hoodie: 0.12, 'tote-bag': 0.05 }
export async function POST(r: NextRequest) {
  try {
    const { items, shippingAddress } = await r.json()
    if (!items?.length || !shippingAddress?.name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (!isConfigured('RAZORPAY_KEY_ID') || !isConfigured('RAZORPAY_KEY_SECRET')) {
      return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })
    }
    const subtotal = items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0)
    const gst = items.reduce((s: number, i: any) => s + (i.unitPrice * i.quantity * (GST[i.productType] || 0.12)), 0)
    const total = subtotal + gst
    const order = await razorpayService.createOrder(total, 'INR', `pod_${Date.now()}`, { customerName: shippingAddress.name })
    if (!order) return NextResponse.json({ error: 'Unable to create payment order' }, { status: 502 })
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID, total, subtotal, gst })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
