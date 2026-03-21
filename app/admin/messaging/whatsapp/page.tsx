import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'WhatsApp — Admin | CloudBasket' }
export default function WhatsAppAdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">WhatsApp Business</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">{['Subscribers', 'Sent Today', 'Unsubscribed'].map(l => <div key={l} className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">--</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">{l}</p></div>)}</div>
      <div className="cb-card p-6"><h2 className="font-black mb-3">Setup</h2><ol className="space-y-1 text-sm text-[var(--cb-text-muted)] list-decimal ml-4"><li>Create Meta Business account</li><li>Setup WhatsApp Business API</li><li>Add WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN to .env.local</li><li>Set webhook URL to /api/whatsapp/webhook</li></ol></div>
    </main>
  )
}