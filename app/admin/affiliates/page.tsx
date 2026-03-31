// © 2026 NEXQON HOLDINGS — CloudBasket page.tsx
// F12: Affiliate Partners Panel
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Affiliate Partners — CloudBasket Admin' }
export default function AffiliatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Affiliate Partners</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[['Amazon','Active'],['Flipkart','Active'],['CJ Affiliate','Active'],['Custom','Setup Required']].map(([name, status]) => (
          <div key={name} className="cb-card p-5 text-center">
            <p className="font-black">{name}</p>
            <span className={`cb-badge text-[9px] mt-2 inline-block ${status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{status}</span>
          </div>
        ))}
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-4">Platform Configuration</h2>
        <div className="space-y-2 text-sm">
          {[['AMAZON_ASSOCIATE_TAG','cloudbasket-21','Active'],['FLIPKART_AFFILIATE_TOKEN','—','Add to .env'],['CJ_API_KEY','—','Add to .env'],['NEXT_PUBLIC_ADSENSE_CLIENT','—','Add to .env']].map(([key, val, status]) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-[var(--cb-surface-2)] rounded-xl">
              <code className="text-xs flex-1">{key}</code>
              <span className="text-xs text-[var(--cb-text-muted)]">{val}</span>
              <span className="text-xs">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
