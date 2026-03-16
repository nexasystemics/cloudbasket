'use client'

import { useCallback, useMemo, useState, useEffect, type MouseEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Star, TrendingDown, Zap, Heart, RefreshCw, ChevronRight } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'

type ProductSource = 'Amazon' | 'Flipkart' | 'CJ' | 'Direct'
type AffiliatePlatform = 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'

export interface ProductCardItem {
  id: number | string
  name: string
  image: string
  brand: string
  price: number
  originalPrice: number | null
  discount: number | null
  rating: number
  reviewCount?: number
  reviews?: number
  source?: ProductSource
  affiliatePlatform?: AffiliatePlatform
  isTrending?: boolean
}

interface ProductCardProps {
  product: ProductCardItem
  variant?: 'grid' | 'list'
  personalScore?: number
}

const WISHLIST_KEY = 'cb_saved_products'
const STAR_INDICES: number[] = [1, 2, 3, 4, 5]

const toDealPath = (id: number | string, affiliatePlatform?: AffiliatePlatform): string => {
  if (String(id).includes('-')) return `/go/${id}`
  const platform =
    affiliatePlatform === 'flipkart'
      ? 'flipkart'
      : affiliatePlatform === 'cj'
        ? 'cj'
        : affiliatePlatform === 'pod'
          ? 'pod'
          : 'amazon'
  return `/go/${platform}-${id}`
}

const toProductPath = (id: number | string): string => {
  return `/products/${id}`
}

const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

const resolveSource = (product: ProductCardItem): ProductSource => {
  if (product.source) return product.source
  if (product.affiliatePlatform === 'flipkart') return 'Flipkart'
  if (product.affiliatePlatform === 'cj') return 'CJ'
  return 'Amazon'
}

export function ProductCard({ product, variant = 'grid', personalScore }: ProductCardProps) {
  const router = useRouter()
  const { formatPrice } = useGlobal()
  const [imgError, setImgError] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState(false)

  const source = useMemo(() => resolveSource(product), [product])
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const roundedRating = useMemo<number>(() => Math.round(product.rating), [product.rating])
  const reviewCountLabel = useMemo<string>(() => formatCompactNumber(reviewCount), [reviewCount])
  const isList = variant === 'list'

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        if (Array.isArray(parsed)) {
          setIsSaved(parsed.includes(String(product.id)))
        }
      }
    } catch (error) {
      console.error('Failed to read wishlist from localStorage:', error)
    }
  }, [product.id])

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      let parsed: string[] = saved ? JSON.parse(saved) : []
      if (!Array.isArray(parsed)) parsed = []

      const productId = String(product.id)
      if (parsed.includes(productId)) {
        parsed = parsed.filter(item => item !== productId)
        setIsSaved(false)
      } else {
        parsed.push(productId)
        setIsSaved(true)
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(parsed))
    } catch (error) {
      console.error('Failed to update wishlist in localStorage:', error)
    }
  }, [product.id])

  const handleCardClick = useCallback((): void => {
    router.push(toProductPath(product.id))
  }, [product.id, router])

  const handleDealClick = useCallback(
    (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
      event.stopPropagation()
      // Already handled by link href but for consistency
    },
    [],
  )

  const handleImageError = useCallback((): void => {
    setImgError(true)
  }, [])

  const discountPercent = product.discount ?? 0

  return (
    <article
      className={`group relative bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-black/60 transition-all duration-500 motion-reduce:transition-none flex ${
        isList ? 'flex-row min-h-[220px]' : 'flex-col h-full min-h-[440px]'
      }`}
      onClick={handleCardClick}
    >
      <div className={`relative flex-shrink-0 bg-zinc-50 dark:bg-zinc-800 overflow-hidden ${
        isList ? 'h-full w-[240px]' : 'h-[240px] w-full'
      }`}>
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400 font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800">
            No Image
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 motion-reduce:transform-none"
            sizes={isList ? '240px' : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 22vw'}
            onError={handleImageError}
          />
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white px-2.5 py-1.5 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-800">
            {source}
          </span>
          {discountPercent > 15 && (
            <span className="bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg animate-pulse motion-reduce:animate-none">
              Best Price
            </span>
          )}
          {product.isTrending && (
            <span className="bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg">
              Trending
            </span>
          )}
        </div>

        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
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
        
        {typeof personalScore === 'number' && personalScore >= 0.7 && (
          <div className="absolute bottom-3 left-3">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-md backdrop-blur-md ${
              personalScore >= 0.85 ? 'bg-indigo-600 text-white' : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {personalScore >= 0.85 ? 'Perfect Match' : 'Great Match'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div>
          <h3 className="text-sm font-black text-zinc-900 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover:text-skyline-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {product.brand}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {STAR_INDICES.map((star) => (
              <Star
                key={`${product.id}-${star}`}
                size={12}
                className={star <= roundedRating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-200 dark:text-zinc-700'}
              />
            ))}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">({reviewCountLabel})</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-skyline-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through font-bold">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-0.5">
            via {source}
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href={toDealPath(product.id, product.affiliatePlatform)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-skyline-primary rounded-xl py-3.5 transition-all active:scale-95 shadow-lg shadow-skyline-primary/20 hover:opacity-90 motion-reduce:transition-none"
          >
            View Deal <ExternalLink size={14} />
          </Link>
          
          <div className="flex items-center justify-between">
            <Link
              href={`/compare?product=${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-skyline-primary hover:underline"
            >
              <RefreshCw size={10} /> Compare Prices
            </Link>
            <Link
              href={toProductPath(product.id)}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-skyline-primary transition-colors"
            >
              Specs <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

