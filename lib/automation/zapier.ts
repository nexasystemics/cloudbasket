// © 2026 NEXQON HOLDINGS — CloudBasket zapier.ts
// F51: Zapier + IFTTT Integration
export type ZapierEvent = { event: string; data: Record<string, unknown> }

export type ZapierOrderItem = { id: string; name: string; quantity: number; price: number }

export async function triggerZapierWebhook(webhookUrl: string, event: ZapierEvent): Promise<boolean> {
  if (!webhookUrl) return false
  try {
    const r = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...event, timestamp: new Date().toISOString(), source: 'cloudbasket' }) })
    return r.ok
  } catch { return false }
}

export async function notifyZapierNewOrder(order: { id: string; amount: number; email: string; items: ZapierOrderItem[] }): Promise<void> {
  const url = process.env.ZAPIER_ORDER_WEBHOOK || ''
  if (url) await triggerZapierWebhook(url, { event: 'new_order', data: order as unknown as Record<string, unknown> })
}

export async function notifyZapierNewSignup(user: { email: string; name?: string; source?: string }): Promise<void> {
  const url = process.env.ZAPIER_SIGNUP_WEBHOOK || ''
  if (url) await triggerZapierWebhook(url, { event: 'new_signup', data: user as unknown as Record<string, unknown> })
}
