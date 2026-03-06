'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star, ChevronRight } from 'lucide-react'

export interface ProductCardProps {
  id: string
  name: string
  brand?: string
  platform: string
  originalPrice: string
  discountedPrice: string
  rating: number
  reviews?: string
  discountPercent: number
  imageUrl: string
  category?: string
  theme?: {
    primaryColor: string
    accentColor: string
  }
}

const FALLBACK_IMAGE = '/assets/no-image.webp'

export default function ProductCard({
  id,
  name,
  brand,
  platform,
  originalPrice,
  discountedPrice,
  rating,
  reviews,
  discountPercent,
  imageUrl,
  category,
  theme
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(imageUrl)

  useEffect(() => {
    setImgSrc(imageUrl)
  }, [imageUrl])

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-black/40 transition-all duration-500 flex flex-col h-full relative">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <Link href={`/products/${id}`} className="block w-full h-full">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-white px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            {platform}
          </span>
        </div>
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
            -{discountPercent}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        <Link href={`/products/${id}`} className="block group/title">
          <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover/title:text-skyline-primary transition-colors duration-300">
            {name}
          </h3>
          {brand && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
              {brand}
            </p>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            {rating}
          </div>
          {reviews && (
            <span className="text-[10px] text-gray-400 font-medium">({reviews})</span>
          )}
        </div>

        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span 
            className="text-lg font-black" 
            style={{ color: theme?.primaryColor || '#039BE5' }}
          >
            {discountedPrice}
          </span>
          <span className="text-xs text-gray-400 line-through font-bold">
            {originalPrice}
          </span>
        </div>

        <div className="pt-2">
          <a
            href={`/go/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xl py-3.5 transition-all active:scale-95 shadow-lg shadow-orange-500/20 hover:opacity-90"
            style={{ backgroundColor: theme?.accentColor || '#E65100' }}
          >
            View Deal on {platform} <ExternalLink size={14} />
          </a>
          <Link
            href={`/products/${id}`}
            className="flex items-center justify-center gap-1 mt-3 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-skyline-primary transition-colors"
          >
            Product Specs <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
