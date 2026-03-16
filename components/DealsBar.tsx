'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data'

export default function DealsBar() {
  const topDeals = [...CATALOG_PRODUCTS]
    .filter(p => p.mrp > p.price)
    .sort((a, b) => {
      const discountA = ((a.mrp - a.price) / a.mrp) * 100
      const discountB = ((b.mrp - b.price) / b.mrp) * 100
      return discountB - discountA
    })
    .slice(0, 6)

  return (
    <div className="bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-3">
        <Link 
          href="/deals/flash"
          className="flex flex-shrink-0 items-center gap-2 pr-6 border-r border-zinc-100 dark:border-zinc-800 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
            Flash Deals
          </span>
        </Link>

        <div className="flex flex-1 overflow-x-auto no-scrollbar gap-6 px-6 items-center snap-x">
          {topDeals.map((deal) => {
            const discount = Math.round(((deal.mrp - deal.price) / deal.mrp) * 100)
            return (
              <Link
                key={deal.id}
                href={`/products/${deal.id}`}
                className="flex flex-shrink-0 items-center gap-3 snap-start group"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-50 border border-zinc-100 dark:border-zinc-800">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-900 dark:text-white truncate max-w-[120px]">
                    {deal.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-red-500 uppercase">
                      {discount}% OFF
                    </span>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase">
                      {deal.platform}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
