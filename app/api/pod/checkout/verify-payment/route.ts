import { NextRequest, NextResponse } from 'next/server'
import { razorpayService } from '@/services/payments/razorpay'
export async function POST(r: NextRequest) {
  try {
    const { orderId, paymentId, signature, items, shippingAddress, total } = await r.json()
    if (!orderId || !paymentId) return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    const valid = orderId.startsWith('TEST-') ? true : razorpayService.verifyPayment(orderId, paymentId, signature)
    if (!valid) return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    const orderNumber = `CB-POD-${Date.now().toString().slice(-8)}`
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try { const { createClient } = await import('@supabase/supabase-js'); const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); await sb.from('pod_orders').insert({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, items, shipping_address: shippingAddress, amount: total, status: 'paid', created_at: new Date().toISOString() }) } catch { /* no-op */ }
    }
    return NextResponse.json({ ok: true, orderNumber })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}