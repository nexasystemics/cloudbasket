// © 2026 NEXQON HOLDINGS — CloudBasket pdf-generator.ts
// lib/documents/pdf-generator.ts — F20: Document generation
export type InvoiceData = { orderId: string; customerName: string; customerEmail: string; items: { name: string; qty: number; price: number }[]; subtotal: number; gst: number; total: number; date: string }
export function generateInvoiceHTML(data: InvoiceData): string {
  const itemRows = data.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${i.price.toLocaleString('en-IN')}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(i.qty * i.price).toLocaleString('en-IN')}</td></tr>`).join('')
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${data.orderId}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#333}h1{color:#039BE5}.total{font-weight:bold;font-size:1.2em}</style></head><body>
<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:40px">
  <div><h1>CloudBasket</h1><p style="color:#666">cloudbasket.in</p></div>
  <div style="text-align:right"><h2>INVOICE</h2><p>#${data.orderId}</p><p>${data.date}</p></div>
</div>
<div style="margin-bottom:30px"><h3>Bill To:</h3><p>${data.customerName}<br>${data.customerEmail}</p></div>
<table width="100%" cellspacing="0"><thead><tr style="background:#039BE5;color:white"><th style="padding:10px;text-align:left">Item</th><th style="padding:10px;text-align:center">Qty</th><th style="padding:10px;text-align:right">Price</th><th style="padding:10px;text-align:right">Total</th></tr></thead><tbody>${itemRows}</tbody></table>
<div style="margin-top:20px;text-align:right"><p>Subtotal: ₹${data.subtotal.toLocaleString('en-IN')}</p><p>GST (18%): ₹${data.gst.toLocaleString('en-IN')}</p><p class="total">Total: ₹${data.total.toLocaleString('en-IN')}</p></div>
<p style="margin-top:40px;color:#999;font-size:12px;text-align:center">Thank you for shopping with CloudBasket. This is a computer-generated invoice.</p>
</body></html>`
}
