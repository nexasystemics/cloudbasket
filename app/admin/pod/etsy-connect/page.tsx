import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Etsy Connect — Admin | CloudBasket' }
export default function EtsyConnectPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-center">
      <h1 className="text-3xl font-black tracking-tighter mb-4">Connect Etsy Shop</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Link your Etsy shop to automatically publish POD designs as Etsy listings.</p>
      <div className="cb-card p-8 mb-6">
        <h2 className="font-black mb-4">Setup Requirements</h2>
        <ol className="text-left space-y-2 text-sm text-[var(--cb-text-muted)]">
          <li>1. Create Etsy Developer account at etsy.com/developers</li>
          <li>2. Create OAuth application — get ETSY_API_KEY and ETSY_SHARED_SECRET</li>
          <li>3. Set redirect URI to: {'{SITE_URL}'}/api/auth/etsy/callback</li>
          <li>4. Add credentials to .env.local</li>
          <li>5. Click "Connect Etsy Shop" below</li>
        </ol>
      </div>
      <a href="/api/auth/etsy/connect" className="cb-btn cb-btn-primary">Connect Etsy Shop</a>
    </main>
  )
}