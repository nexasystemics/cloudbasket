'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Star, ChevronRight, Heart } from 'lucide-react'

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
    <div className="group relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800">
        <Link href={`/products/${id}`} className="block w-full h-full">
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 25vw, 20vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </Link>

        {discountPercent > 15 ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-[10px] font-black text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        ) : null}

        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-400 hover:text-red-500'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={isSaved ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="flex min-h-[216px] flex-1 flex-col space-y-3 p-4">
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
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {platform}
          </p>
          <Link
            href={`/compare?product=${id}`}
            className="mt-1 inline-block text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-skyline-primary"
          >
            Compare prices
          </Link>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={`/go/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-500/20 transition-all hover:opacity-90 active:scale-95 motion-reduce:transition-none md:w-auto md:self-start"
            style={{ backgroundColor: theme?.accentColor || '#E65100' }}
          >
            View Deal
            <ExternalLink size={14} />
          </a>
          
          <div className="flex items-center justify-between">
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
