import { isConfigured, env } from '@/lib/env'

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  productName: string
  productUrl: string
  targetPrice: number
  currentPrice: number
  platform: 'amazon' | 'flipkart' | 'cj' | 'any'
  channel: 'email' | 'whatsapp' | 'push' | 'all'
  userEmail?: string
  userPhone?: string
  isActive: boolean
  createdAt: string
  lastChecked?: string
  triggeredAt?: string
}

export interface AlertCheckResult {
  alertId: string
  triggered: boolean
  currentPrice: number
  targetPrice: number
  savings: number
  savingsPercent: number
  notificationsSent: string[]
}

export interface AlertStats {
  total: number
  active: number
  triggered: number
  avgSavings: number
}

async function sendEmailAlert(alert: PriceAlert, currentPrice: number): Promise<boolean> {
  if (!isConfigured('RESEND_API_KEY')) {
    console.warn('[PriceAlert] RESEND_API_KEY not configured — skipping email')
    return false
  }

  const savings = alert.currentPrice - currentPrice
  const savingsPercent = ((savings / alert.currentPrice) * 100).toFixed(1)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'alerts@cloudbasket.in',
        to: alert.userEmail,
        subject: `🎉 Price Drop! ${alert.productName} is now ₹${currentPrice.toLocaleString('en-IN')}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#f97316;">Price Alert Triggered!</h2>
            <p><strong>${alert.productName}</strong> has dropped to your target price.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr>
                <td style="padding:8px;background:#f3f4f6;">Was</td>
                <td style="padding:8px;background:#f3f4f6;text-decoration:line-through;color:#ef4444;">
                  ₹${alert.currentPrice.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td style="padding:8px;background:#dcfce7;">Now</td>
                <td style="padding:8px;background:#dcfce7;color:#16a34a;font-weight:bold;font-size:1.25rem;">
                  ₹${currentPrice.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td style="padding:8px;">You Save</td>
                <td style="padding:8px;color:#f97316;font-weight:bold;">
                  ₹${savings.toLocaleString('en-IN')} (${savingsPercent}%)
                </td>
              </tr>
            </table>
            <a href="${alert.productUrl}" style="
              display:inline-block;background:#f97316;color:white;
              padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;
            ">Buy Now →</a>
            <p style="color:#6b7280;font-size:0.875rem;margin-top:24px;">
              This alert was set by you on CloudBasket.in.
              <a href="https://cloudbasket.in/alerts">Manage alerts</a>
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.warn('[PriceAlert] Resend error:', error)
      return false
    }

    return true
  } catch (err) {
    console.warn('[PriceAlert] Email send failed:', err)
    return false
  }
}

async function sendWhatsAppAlert(alert: PriceAlert, currentPrice: number): Promise<boolean> {
  if (!isConfigured('WHATSAPP_ACCESS_TOKEN') || !isConfigured('WHATSAPP_PHONE_NUMBER_ID')) {
    console.warn('[PriceAlert] WhatsApp not configured — skipping')
    return false
  }

  if (!alert.userPhone) return false

  const savings = alert.currentPrice - currentPrice
  const message = [
    `🎉 *Price Alert — CloudBasket*`,
    ``,
    `*${alert.productName}*`,
    ``,
    `Price dropped!`,
    `✅ Now: ₹${currentPrice.toLocaleString('en-IN')}`,
    `❌ Was: ₹${alert.currentPrice.toLocaleString('en-IN')}`,
    `💰 Save: ₹${savings.toLocaleString('en-IN')}`,
    ``,
    `Shop now: ${alert.productUrl}`,
    ``,
    `_Manage alerts at cloudbasket.in/alerts_`,
  ].join('\n')

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: alert.userPhone,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.warn('[PriceAlert] WhatsApp error:', error)
      return false
    }

    return true
  } catch (err) {
    console.warn('[PriceAlert] WhatsApp send failed:', err)
    return false
  }
}

export async function checkAndTriggerAlert(
  alert: PriceAlert,
  livePrice: number
): Promise<AlertCheckResult> {
  const savings = alert.currentPrice - livePrice
  const savingsPercent = (savings / alert.currentPrice) * 100
  const triggered = livePrice <= alert.targetPrice
  const notificationsSent: string[] = []

  if (triggered && alert.isActive) {
    const channel = alert.channel

    if ((channel === 'email' || channel === 'all') && alert.userEmail) {
      const ok = await sendEmailAlert(alert, livePrice)
      if (ok) notificationsSent.push('email')
    }

    if ((channel === 'whatsapp' || channel === 'all') && alert.userPhone) {
      const ok = await sendWhatsAppAlert(alert, livePrice)
      if (ok) notificationsSent.push('whatsapp')
    }
  }

  return {
    alertId: alert.id,
    triggered,
    currentPrice: livePrice,
    targetPrice: alert.targetPrice,
    savings: Math.max(0, savings),
    savingsPercent: Math.max(0, savingsPercent),
    notificationsSent,
  }
}

export async function getAlertStats(alerts: PriceAlert[]): Promise<AlertStats> {
  const active = alerts.filter((a) => a.isActive).length
  const triggeredAlerts = alerts.filter((a) => Boolean(a.triggeredAt))
  const avgSavings =
    triggeredAlerts.length > 0
      ? triggeredAlerts.reduce((sum, a) => sum + (a.currentPrice - a.targetPrice), 0) /
        triggeredAlerts.length
      : 0

  return {
    total: alerts.length,
    active,
    triggered: triggeredAlerts.length,
    avgSavings: Math.round(avgSavings),
  }
}

export function createAlertDefaults(partial: Partial<PriceAlert>): PriceAlert {
  return {
    id: crypto.randomUUID(),
    userId: '',
    productId: '',
    productName: '',
    productUrl: '',
    targetPrice: 0,
    currentPrice: 0,
    platform: 'any',
    channel: 'email',
    isActive: true,
    createdAt: new Date().toISOString(),
    ...partial,
  }
}
