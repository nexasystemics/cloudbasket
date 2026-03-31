import { NextRequest, NextResponse } from 'next/server'
import { redeemGiftCard } from '@/services/pod/gift-cards'
export async function POST(request: NextRequest) {
  try {
    const { code, amount } = await request.json()
    if (!code || !amount) return NextResponse.json({ error: 'code and amount required' }, { status: 400 })
    const result = await redeemGiftCard(code, amount)
    return NextResponse.json(result)
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
