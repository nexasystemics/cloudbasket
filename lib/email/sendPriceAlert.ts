interface PriceAlertEmailData {
  to: string
  productName: string
  currentPrice: number
  originalPrice: number
  targetPrice: number
  productUrl: string
  productImage?: string
}

export async function sendPriceAlertEmail(data: PriceAlertEmailData) {
  const PLUNK_API_KEY = process.env.PLUNK_API_KEY
  if (!PLUNK_API_KEY) {
    console.warn('PLUNK_API_KEY not set — skipping email')
    return { success: false, reason: 'no_api_key' }
  }

  const discount = Math.round(1 - data.currentPrice / data.originalPrice) * 100

  const body = {
    to: data.to,
    subject: `🔔 Price Alert: ${data.productName} dropped to ₹${data.currentPrice.toLocaleString('en-IN')}!`,
    body: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#09090B;color:#E2E8F0;padding:32px;border-radius:12px">
        <div style="text-align:center;margin-bottom:24px">
          <span style="font-size:32px;font-weight:900;color:#039BE5">CloudBasket</span>
          <p style="color:#64748B;margin:4px 0 0">Your Price Alert Triggered 🔥</p>
        </div>
        ${
          data.productImage
            ? `<img src="${data.productImage}" alt="${data.productName}" style="width:100%;max-height:200px;object-fit:contain;border-radius:8px;margin-bottom:24px"/>`
            : ''
        }
        <h2 style="color:#fff;font-size:20px;margin:0 0 16px">${data.productName}</h2>
        <div style="background:#1E293B;border-radius:8px;padding:20px;margin-bottom:24px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <p style="color:#64748B;font-size:12px;margin:0">Current Price</p>
              <p style="color:#039BE5;font-size:32px;font-weight:900;margin:4px 0">₹${data.currentPrice.toLocaleString('en-IN')}</p>
              <p style="color:#64748B;font-size:12px;margin:0;text-decoration:line-through">₹${data.originalPrice.toLocaleString('en-IN')}</p>
            </div>
            <div style="background:#EF4444;color:#fff;font-size:24px;font-weight:900;border-radius:8px;padding:12px 16px">
              ${discount}% OFF
            </div>
          </div>
        </div>
        <a href="${data.productUrl}" style="display:block;background:#039BE5;color:#fff;text-align:center;padding:16px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;margin-bottom:24px">
          View Deal → Buy Now
        </a>
        <div style="border-top:1px solid #1E293B;padding-top:16px;text-align:center">
          <p style="color:#334155;font-size:12px">This alert was set by you on CloudBasket.<br/><a href="https://cloudbasket.vercel.app/dashboard" style="color:#039BE5">Manage your alerts</a></p>
          <p style="color:#1E293B;font-size:11px;margin-top:8px">Powered by NEXQON Sovereign Technology</p>
        </div>
      </div>
    `,
    name: 'CloudBasket Deal Alerts',
    from: 'alerts@cloudbasket.in',
  }

  try {
    const response = await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PLUNK_API_KEY}`,
      },
      body: JSON.stringify(body),
    })
    const payload = await response.json()
    return { success: response.ok, data: payload }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, reason: 'network_error' }
  }
}
