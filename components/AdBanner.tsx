'use client'

import React from 'react'
import { ExternalLink, Info } from 'lucide-react'

interface AdBannerProps {
  type: 'brand' | 'affiliate'
  label?: string
}

export default function AdBanner({ type, label }: AdBannerProps) {
  const isBrand = type === 'brand'

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-xl ${
      isBrand 
        ? 'bg-gradient-to-br from-skyline-primary/5 to-white dark:from-skyline-primary/10 dark:to-gray-900 border-skyline-primary/20 aspect-[4/5] p-6' 
        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 p-4 w-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-skyline-primary bg-skyline-primary/10 px-2 py-1 rounded">
            {isBrand ? 'Partner Spotlight' : 'Affiliate Ad'}
          </span>
          <Info size={12} className="text-gray-300" />
        </div>

        {isBrand ? (
          <>
            <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 tracking-tighter">
              {label || 'Premium Cloud Tech Accessories'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">
              Exclusive 20% discount for CloudBasket users. Verified global shipping.
            </p>
            <div className="mt-auto">
              <button className="w-full bg-gray-900 dark:bg-skyline-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                Claim Offer <ExternalLink size={12} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black text-gray-900 dark:text-white mb-1">
                {label || 'Join the CJ Affiliate Network'}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Monetize your content today
              </p>
            </div>
            <button className="bg-skyline-accent text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shrink-0">
              Apply Now
            </button>
          </div>
        )}
      </div>

      {/* Decorative background element for Brand ads */}
      {isBrand && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-skyline-primary/10 rounded-full blur-3xl group-hover:bg-skyline-primary/20 transition-colors" />
      )}
    </div>
  )
}
