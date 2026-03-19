export function generatePriceDropEmail(
  productName: string,
  productImage: string,
  newPrice: number,
  oldPrice: number,
  targetPrice: number,
  affiliateUrl: string,
): string {
  const saving = oldPrice - newPrice
  const savingPercent = Math.round((saving / oldPrice) * 100)

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Price Drop Alert — CloudBasket</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#10B981;padding:24px;text-align:center;">
          <p style="margin:0;color:white;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Price Drop Alert 🎉</p>
          <h1 style="margin:8px 0 0;color:white;font-size:28px;font-weight:900;">₹${saving.toLocaleString('en-IN')} Saved!</h1>
        </td></tr>
        <tr><td style="padding:32px;text-align:center;">
          <img src="${productImage}" width="160" height="160" style="border-radius:12px;object-fit:cover;" alt="${productName}" />
          <h2 style="margin:16px 0 8px;font-size:18px;font-weight:900;color:#09090B;">${productName}</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
            <tr>
              <td style="text-align:center;padding:12px;background:#f4f4f5;border-radius:8px;">
                <p style="margin:0;font-size:12px;color:#71717A;">Was</p>
                <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#71717A;text-decoration:line-through;">₹${oldPrice.toLocaleString('en-IN')}</p>
              </td>
              <td style="text-align:center;padding:8px;font-size:20px;">→</td>
              <td style="text-align:center;padding:12px;background:#10B981/10;border-radius:8px;border:2px solid #10B981;">
                <p style="margin:0;font-size:12px;color:#10B981;font-weight:700;">Now</p>
                <p style="margin:4px 0 0;font-size:24px;font-weight:900;color:#10B981;">₹${newPrice.toLocaleString('en-IN')}</p>
              </td>
            </tr>
          </table>
          <p style="color:#71717A;font-size:14px;">Your target price was ₹${targetPrice.toLocaleString('en-IN')} — this deal beats it by ₹${(targetPrice - newPrice).toLocaleString('en-IN')}!</p>
          <p style="color:#EF4444;font-size:13px;font-weight:700;">⚡ Limited time — prices can go back up</p>
          <a href="${affiliateUrl}" style="display:inline-block;background:#039BE5;color:white;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:900;text-decoration:none;margin-top:8px;">Grab This Deal Now →</a>
          <p style="margin:16px 0 0;font-size:11px;color:#A1A1AA;">You saved ${savingPercent}% — verified by CloudBasket price tracker</p>
        </td></tr>
        <tr><td style="padding:16px 24px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#A1A1AA;">CloudBasket — Zero Checkout. Pure Discovery.</p>
          <p style="margin:8px 0 0;font-size:12px;"><a href="https://cloudbasket.in/api/newsletter/unsubscribe" style="color:#039BE5;">Unsubscribe from alerts</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}