'use client'
import { useState } from 'react'
import { Building2, FileText } from 'lucide-react'
import { createB2BQuote, calculateB2BPrice, type B2BQuoteRequest, type B2BQuote } from '@/services/pod/b2b-orders'

export default function B2BOrdersPage() {
  const [form, setForm] = useState<Partial<B2BQuoteRequest>>({ productType: 'tshirt', quantity: 50 })
  const [quote, setQuote] = useState<B2BQuote | null>(null)
  const [loading, setLoading] = useState(false)

  const previewPrice = form.productType && form.quantity ? calculateB2BPrice(form.productType, form.quantity) : 0

  const submit = async () => {
    if (!form.companyName || !form.contactEmail || !form.productType || !form.quantity || !form.designDescription || !form.deliveryDeadline) return
    setLoading(true)
    const q = await createB2BQuote(form as B2BQuoteRequest)
    setQuote(q); setLoading(false)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2 flex items-center gap-3"><Building2 size={28} /> B2B Bulk Orders</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Corporate bulk POD orders with GST invoicing. Min 50 units.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cb-card p-6 space-y-4">
          <h2 className="font-black">Request Quote</h2>
          {[['companyName','Company Name','text'],['contactEmail','Contact Email','email'],['contactPhone','Contact Phone','tel'],['gstNumber','GST Number (optional)','text']].map(([k, label, type]) => (
            <div key={k}><label className="text-xs font-black uppercase tracking-widest block mb-1">{label}</label>
              <input type={type} className="cb-input w-full" value={(form as any)[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} /></div>
          ))}
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Product</label>
            <select className="cb-input w-full" value={form.productType} onChange={e => setForm(p => ({ ...p, productType: e.target.value }))}>
              {['tshirt','mug','hoodie','tote-bag','phone-case'].map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Quantity (min 50)</label>
            <input type="number" min={50} className="cb-input w-full" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))} /></div>
          {previewPrice > 0 && <div className="p-3 bg-skyline-primary/10 rounded-xl text-sm"><p className="font-black">Unit Price: ₹{previewPrice}</p><p className="text-[var(--cb-text-muted)]">Total: ₹{(previewPrice * (form.quantity || 0)).toLocaleString('en-IN')} + 18% GST</p></div>}
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Design Description</label>
            <textarea className="cb-input w-full h-20 resize-none" value={form.designDescription || ''} onChange={e => setForm(p => ({ ...p, designDescription: e.target.value }))} /></div>
          <div><label className="text-xs font-black uppercase tracking-widest block mb-1">Delivery Deadline</label>
            <input type="date" className="cb-input w-full" value={form.deliveryDeadline || ''} onChange={e => setForm(p => ({ ...p, deliveryDeadline: e.target.value }))} /></div>
          <button type="button" onClick={submit} disabled={loading} className="cb-btn cb-btn-primary w-full gap-2"><FileText size={16} />{loading ? 'Generating...' : 'Generate Quote'}</button>
        </div>
        {quote && (
          <div className="cb-card p-6">
            <h2 className="font-black mb-4">Quote #{quote.id}</h2>
            <div className="space-y-2 text-sm">
              {[['Company', quote.companyName],['Product', quote.productType],['Quantity', quote.quantity],['Unit Price', `₹${quote.unitPrice}`],['Subtotal', `₹${quote.totalPrice.toLocaleString('en-IN')}`],['GST 18%', `₹${quote.gstAmount.toLocaleString('en-IN')}`],['Grand Total', `₹${quote.grandTotal.toLocaleString('en-IN')}`],['Valid Until', new Date(quote.validUntil).toLocaleDateString('en-IN')]].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between border-b border-[var(--cb-border)] pb-1"><span className="text-[var(--cb-text-muted)]">{k}</span><span className="font-bold">{v}</span></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}