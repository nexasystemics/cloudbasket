// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
// F87: Telegram Bot Integration
import { NextRequest, NextResponse } from 'next/server'
import { getDailyDeals } from '@/lib/deals-engine'
import { rateLimit } from '@/lib/redis'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''

async function sendTelegramMessage(chatId: number | string, text: string): Promise<void> {
  if (!TELEGRAM_TOKEN) return
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }) })
  } catch { /* no-op */ }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 30, 60)
  if (!rl.success) return NextResponse.json({ ok: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  try {
    const body = await request.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })
    const chatId = message.chat.id
    const text = message.text || ''

    if (text === '/start') {
      await sendTelegramMessage(chatId, '<b>Welcome to CloudBasket Bot!</b>\n\nCommands:\n/deals — Top deals today\n/flash — Flash deals\n/search [query] — Search products')
    } else if (text === '/deals') {
      const deals = getDailyDeals(5)
      const msg = deals.map(d => `• <b>${d.title}</b>\n  ₹${d.dealPrice} (${d.discountPercent}% off) — ${d.platform}`).join('\n\n')
      await sendTelegramMessage(chatId, `<b>Top Deals Today</b>\n\n${msg}`)
    } else if (text === '/flash') {
      const { getFlashDeals } = await import('@/lib/deals-engine')
      const deals = getFlashDeals(5)
      if (!deals.length) { await sendTelegramMessage(chatId, 'No flash deals right now. Check back soon!'); return NextResponse.json({ ok: true }) }
      const msg = deals.map(d => `<b>${d.title}</b>\n  ₹${d.dealPrice} (${d.discountPercent}% off)`).join('\n\n')
      await sendTelegramMessage(chatId, `<b>Flash Deals</b>\n\n${msg}`)
    } else if (text.startsWith('/search ')) {
      const query = text.replace('/search ', '').trim()
      const { searchProducts } = await import('@/lib/search')
      const results = searchProducts(query, { sortBy: 'price-asc' }).slice(0, 3)
      if (!results.length) { await sendTelegramMessage(chatId, `No results for "${query}"`); return NextResponse.json({ ok: true }) }
      const msg = results.map(r => `• <b>${r.name}</b>\n  ₹${r.price} — ${r.platform}`).join('\n\n')
      await sendTelegramMessage(chatId, `Results for "${query}"\n\n${msg}`)
    } else {
      await sendTelegramMessage(chatId, 'Unknown command. Type /start for help.')
    }
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
