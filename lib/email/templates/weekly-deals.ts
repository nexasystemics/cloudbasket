import type { Deal } from '@/lib/deals-engine'

export function generateWeeklyDealsEmail(deals: Deal[], userName?: string): string {
  const greeting = userName ? `Hi ${userName},` : 'Hi there,'
  const topDeals = deals.slice(0, 5)

  const dealsRows = topDeals.map((deal) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="60">
              <img src="${deal.image}" width="60" height="60" style="border-radius:8px;object-fit:cover;" alt="${deal.title}" />
            </td>
            <td style="padding-left:12px;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#09090B;">${deal.title}</p>
              <p style="margin:4px 0 0;font-size:12px;color:#71717A;">${deal.subtitle}</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:900;color:#039BE5;">₹${deal.dealPrice.toLocaleString('en-IN')}</p>
            </td>
            <td width="120" style="text-align:right;">
              <span style="background:#10B981;color:white;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;">${deal.discountPercent}% OFF</span>
              <br/><br/>
              <a href="https://cloudbasket.co/product/${deal.id}" style="background:#039BE5;color:white;padding:8px 16px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">View Deal</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Your Weekly Deal Digest — CloudBasket</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#039BE5;padding:24px;text-align:center;">
          <h1 style="margin:0;color:white;font-size:24px;font-weight:900;letter-spacing:-0.5px;">CloudBasket</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Weekly Deal Digest</p>
        </td></tr>
        <tr><td style="padding:24px;">
          <p style="color:#09090B;font-size:16px;">${greeting}</p>
          <p style="color:#71717A;font-size:14px;">Here are this week's top deals — hand-picked for you.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">${dealsRows}</table>
          <div style="text-align:center;margin-top:24px;">
            <a href="https://cloudbasket.co/deals" style="background:#039BE5;color:white;padding:14px 32px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;">View All Deals →</a>
          </div>
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#A1A1AA;">You received this because you subscribed to CloudBasket deal alerts.</p>
          <p style="margin:8px 0 0;font-size:12px;"><a href="https://cloudbasket.co/api/newsletter/unsubscribe" style="color:#039BE5;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
