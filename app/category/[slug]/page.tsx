'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import { PRODUCTS } from '@/lib/mock-data'
import { ChevronLeft, SearchX, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // Decoding slug (e.g. Mobiles or Flagship)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      (p.mainCategory === categoryName || 
      p.subCategory === categoryName || 
      p.category === categoryName) &&
      p.status === 'Approved'
    )
  }, [categoryName])

  if (filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1D1D1F] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-gray-50 dark:bg-gray-900 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 max-w-md w-full shadow-xl">
          <div className="w-20 h-20 bg-skyline-primary/10 rounded-2xl flex items-center justify-center text-skyline-primary mx-auto mb-8">
            <SearchX size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Node Empty</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed text-sm">
            We couldn&apos;t find any verified listings for <span className="text-skyline-primary font-black">&quot;{categoryName}&quot;</span>. 
            The hub is currently fetching latest global deals.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-3 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-skyline-primary dark:hover:bg-skyline-primary dark:hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
            Back to Home Hub
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1D1D1F] font-sans">
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors mb-8 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
            {categoryName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
            Discover {filteredProducts.length} verified items in the {categoryName} collection.
          </p>
        </div>

        <ProductGrid 
          products={filteredProducts} 
          onReset={() => router.push('/')} 
        />
      </div>
    </div>
  )
}
