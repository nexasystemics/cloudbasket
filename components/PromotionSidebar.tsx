'use client'

import React from 'react'
import Link from 'next/link'
import { Zap, ExternalLink, Gift, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import { PRODUCTS } from '@/lib/mock-data'
import { getProductImage } from '@/lib/utils/product-image'

interface PromotionSidebarProps {
  selectedCategory?: string
}

export default function PromotionSidebar({ selectedCategory }: PromotionSidebarProps) {
  // Pick 2 random products for "Flash Deals"
  const flashDeals = PRODUCTS.slice(0, 2)

  return (
    <div className="space-y-10 sticky top-24">
      {/* Flash Deals Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#E65100]/10 p-2 rounded-lg">
              <Zap size={18} className="text-[#E65100]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Flash Deals</h3>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-[#E65100] bg-[#E65100]/5 px-2 py-1 rounded-md animate-pulse">
            <Clock size={10} />
            04:20:15
          </div>
        </div>

        <div className="space-y-4">
          {flashDeals.map((product) => (
            <div key={product.id} className="group bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-skyline-primary">
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-[#E65100] text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">
                  -40%
                </span>
              </div>
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={getProductImage(product.image, product.mainCategory ?? 'default')}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#E65100]">₹{Math.floor(product.price * 0.6).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Ad Banner Placeholder */}
      <section>
         <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#039BE5]/10 p-2 rounded-lg">
              <Gift size={18} className="text-[#039BE5]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Special Offers</h3>
          </div>

          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#039BE5] to-[#015C94] p-8 text-white group cursor-pointer shadow-xl shadow-sky-900/10 dark:from-[#039BE5]/90 dark:to-[#015C94]/90">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative h-full flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-2">
                {selectedCategory || 'Exclusive'} Deal
              </span>
              <h4 className="text-2xl font-black leading-tight mb-4 tracking-tighter">
                Premium {selectedCategory || 'Marketplace'} Selection
              </h4>
              <p className="text-xs font-medium text-white/80 leading-relaxed mb-8">
                Curated global picks with express shipping to India. Limited time only.
              </p>
              
              <div className="mt-auto">
                <button className="bg-white text-[#039BE5] w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-sky-50 dark:bg-zinc-900 dark:text-white dark:group-hover:bg-zinc-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-skyline-primary">
                  Explore Now
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
      </section>

      {/* Trending Tag / Small Ad */}
      <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-[#039BE5]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trending Now</span>
        </div>
        <p className="text-xs font-bold text-gray-900 mb-4 leading-snug">
          Discover why CloudBasket is the #1 Price Aggregator in India.
        </p>
        <Link href="/about" className="text-[10px] font-black text-[#039BE5] uppercase tracking-widest hover:underline flex items-center gap-1">
          Learn Our Story <ArrowRight size={10} />
        </Link>
      </section>
    </div>
  )
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  )
}
