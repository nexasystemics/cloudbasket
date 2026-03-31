import { NextRequest, NextResponse } from 'next/server'
import { createGiftCard } from '@/services/pod/gift-cards'
export async function POST(request: NextRequest) {
  try {
    const { amount, purchaserEmail, recipientEmail, message } = await request.json()
    if (!amount || !purchaserEmail) return NextResponse.json({ error: 'amount and purchaserEmail required' }, { status: 400 })
    if (amount < 100 || amount > 10000) return NextResponse.json({ error: 'Amount must be between ₹100 and ₹10,000' }, { status: 400 })
    const card = await createGiftCard(amount, purchaserEmail, recipientEmail, message)
    return NextResponse.json({ ok: !!card, card })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
