'use client'

import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProductGrid from '@/components/ProductGrid'
import ProductFilter from '@/components/ProductFilter'
import { PRODUCTS, MAIN_CATEGORIES, SUB_CATEGORIES } from '@/lib/mock-data'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  // Decoding slug (e.g. Mobiles or Flagship)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => 
      p.mainCategory === categoryName || 
      p.subCategory === categoryName || 
      p.category === categoryName
    )
  }, [categoryName])

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
