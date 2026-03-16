'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star, ChevronRight, Heart, RefreshCw } from 'lucide-react'

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
const WISHLIST_KEY = 'cb_saved_products'

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
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        if (Array.isArray(parsed)) {
          setIsSaved(parsed.includes(id))
        }
      }
    } catch (error) {
      console.error('Failed to read wishlist from localStorage:', error)
    }
  }, [id])

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      let parsed: string[] = saved ? JSON.parse(saved) : []
      if (!Array.isArray(parsed)) parsed = []

      if (parsed.includes(id)) {
        parsed = parsed.filter(item => item !== id)
        setIsSaved(false)
      } else {
        parsed.push(id)
        setIsSaved(true)
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(parsed))
    } catch (error) {
      console.error('Failed to update wishlist in localStorage:', error)
    }
  }, [id])

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-black/60 transition-all duration-500 motion-reduce:transition-none flex min-h-[440px] flex-col h-full relative">
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800 flex-shrink-0">
        <Link href={`/products/${id}`} className="block w-full h-full">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out motion-reduce:transform-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white px-2.5 py-1.5 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            {platform}
          </span>
          {discountPercent > 15 && (
            <span className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg animate-pulse motion-reduce:animate-none">
              Best Price
            </span>
          )}
        </div>
        
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-400 hover:text-red-500'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>

        {discountPercent > 0 && (
          <div className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
            -{discountPercent}%
          </div>
        )}
      </div>

      <div className="p-4 flex min-h-[216px] flex-col flex-grow space-y-3">
        <Link href={`/products/${id}`} className="block group/title">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover/title:text-skyline-primary transition-colors duration-300">
            {name}
          </h3>
          {brand && (
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
              {brand}
            </p>
          )}
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            {rating}
          </div>
          {reviews && (
            <span className="text-[10px] text-zinc-400 font-medium">({reviews})</span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-lg font-black" 
              style={{ color: theme?.primaryColor || '#039BE5' }}
            >
              {discountedPrice}
            </span>
            <span className="text-xs text-zinc-400 line-through font-bold">
              {originalPrice}
            </span>
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">
            via {platform}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <a
            href={`/go/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xl py-3.5 transition-all active:scale-95 shadow-lg shadow-orange-500/20 hover:opacity-90 motion-reduce:transition-none"
            style={{ backgroundColor: theme?.accentColor || '#E65100' }}
          >
            View Deal <ExternalLink size={14} />
          </a>
          
          <div className="flex items-center justify-between">
            <Link
              href={`/compare?product=${id}`}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-skyline-primary hover:underline"
            >
              <RefreshCw size={10} /> Compare Prices
            </Link>
            <Link
              href={`/products/${id}`}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-skyline-primary transition-colors"
            >
              Specs <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

