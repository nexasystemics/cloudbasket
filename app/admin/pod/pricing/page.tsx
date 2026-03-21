'use client'
import { useState } from 'react'
import { podPricingEngine } from '@/services/pod/pricing-engine'

const PRODUCT_TYPES = ['tshirt','mug','phone-case','poster','hoodie','tote-bag']

export default function PODPricingPage() {
  const [selected, setSelected] = useState('tshirt')
  const rec = podPricingEngine.calculateRecommendedPrice(selected)

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">POD Pricing Engine</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {PRODUCT_TYPES.map(t=><button key={t} type="button" onClick={()=>setSelected(t)} className={`cb-btn text-sm ${selected===t?'cb-btn-primary':'cb-btn-ghost'}`}>{t}</button>)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-orange-500">₹{rec.baseCost}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Base Cost</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-skyline-primary">₹{rec.recommendedPrice}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Recommended Price</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black text-green-500">{Math.round(rec.margin*100)}%</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">Margin</p></div>
        <div className="cb-card p-5 text-center"><p className="text-3xl font-black">{rec.competitiveAnalysis.ourPricePosition.toUpperCase()}</p><p className="text-xs text-[var(--cb-text-muted)] mt-1">vs Market</p></div>
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-4">Competitive Analysis</h2>
        {[['Amazon Merch',rec.competitiveAnalysis.amazonMerchAvgPrice],['Redbubble',rec.competitiveAnalysis.redbubbleAvgPrice],['Etsy',rec.competitiveAnalysis.etsyAvgPrice],['Our Price',rec.recommendedPrice]].map(([name,price])=>(
          <div key={String(name)} className="flex items-center gap-3 mb-3">
            <span className="w-28 text-sm">{name}</span>
            <div className="flex-1 h-6 bg-[var(--cb-surface-2)] rounded-lg overflow-hidden">
              <div className={`h-full ${name==='Our Price'?'bg-skyline-primary':'bg-zinc-400'} rounded-lg`} style={{width:`${Math.round((Number(price)/3000)*100)}%`}} />
            </div>
            <span className="text-sm font-black w-20 text-right">₹{Number(price).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    </main>
  )
}