import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Search Console — Admin | CloudBasket' }
export default function SearchConsolePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Google Search Console</h1>
      <div className="cb-card p-8 text-center">
        <p className="font-black mb-2">Connect Google Search Console</p>
        <p className="text-sm text-[var(--cb-text-muted)] mb-4">Add GOOGLE_SERVICE_ACCOUNT_JSON to .env.local</p>
        <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="cb-btn cb-btn-primary">Open Search Console →</a>
      </div>
    </main>
  )
}