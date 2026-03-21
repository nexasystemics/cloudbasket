import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'POD SEO — Admin | CloudBasket' }
export default function PODSEOPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">POD Listing SEO Optimiser</h1>
      <div className="cb-card p-8 text-center"><p className="text-[var(--cb-text-muted)]">Connect Etsy + Amazon Merch + Redbubble APIs to optimise listings automatically with Gemini AI.</p><p className="text-sm text-[var(--cb-text-muted)] mt-2">Required: GEMINI_API_KEY + platform API keys</p></div>
    </main>
  )
}