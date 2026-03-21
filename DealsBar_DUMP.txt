// Purpose: Displays a horizontally scrollable strip of the strongest flash-worthy deals on the homepage.
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { getDailyDeals } from '@/lib/deals-engine'
import type { Deal } from '@/lib/deals-engine'

export default function DealsBar() {
  // Get top 6 deals from the engine
  const topDeals = getDailyDeals(6)

  return (
    <div className="bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-3">
        <Link
          href="/deals/flash"
          className="flex flex-shrink-0 items-center gap-2 pr-6 border-r border-zinc-100 dark:border-zinc-800 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-lg"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
            Flash Deals
          </span>
        </Link>

        <div className="no-scrollbar flex flex-1 items-center gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
          {topDeals.map((deal) => {
            return (
              <Link
                key={deal.id}
                href={`/products/${deal.product.id}`}
                className="group flex min-w-[220px] flex-shrink-0 snap-start items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded-xl"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-50 border border-zinc-100 dark:border-zinc-800">
                  <Image
                    src={deal.product.image}
                    alt={deal.product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="block truncate text-[11px] font-bold text-zinc-900 dark:text-white">
                    {deal.product.title}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-black text-white">
                      {deal.discountPercent}% OFF
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

