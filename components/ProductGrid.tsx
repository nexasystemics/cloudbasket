'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, SearchX, ShoppingBag, Star, ShieldCheck, Box, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { Product } from '@/lib/mock-data'
import { useCart } from '@/context/CartContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'

interface ProductGridProps {
  products: Product[]
  onReset: () => void
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [imgSrc, setImgSrc] = useState(product.image)
  const [showFullSpecs, setShowFullSpecs] = useState(false)

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-500 flex flex-col h-full">
      {/* Optimized Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-white px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            {product.subCategory}
          </span>
        </div>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => addToCart(product)}
            className="bg-white text-[#039BE5] p-3.5 rounded-full shadow-xl hover:bg-[#039BE5] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 active:scale-90"
            aria-label="Add to basket"
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#039BE5] transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{product.brand}</p>
        </div>

        {/* 5 Key Specs Instantly */}
        <div className="grid grid-cols-2 gap-2 pb-4 border-b border-gray-50 dark:border-gray-800">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
            <Tag size={12} className="text-[#039BE5]" />
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            {product.rating} / 5
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
            <Box size={12} className="text-emerald-500" />
            {product.stock} In Stock
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400">
            <ShieldCheck size={12} className="text-sky-500" />
            {product.warranty}
          </div>
        </div>

        {/* View Full Specs Toggle */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowFullSpecs(!showFullSpecs)}
            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-1"
          >
            Full Specs
            {showFullSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showFullSpecs && (
            <div className="grid grid-cols-1 gap-1.5 pt-2 border-t border-gray-50 dark:border-gray-800 animate-in fade-in slide-in-from-top-1 duration-200">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">{key}</span>
                  <span className="text-gray-900 dark:text-gray-200 font-black">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 mt-auto pt-4">
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-gray-900 dark:bg-gray-800 hover:bg-[#039BE5] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
          
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-[#039BE5] transition-colors"
          >
            Product Details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, onReset }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-sm mb-6">
          <SearchX size={48} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm px-4 text-sm font-medium">
          We couldn&apos;t find any items matching your current filters. Try adjusting your search, 
          categories, or price range.
        </p>
        <button
          onClick={onReset}
          className="bg-[#039BE5] hover:bg-[#0288D1] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          Reset All Filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
