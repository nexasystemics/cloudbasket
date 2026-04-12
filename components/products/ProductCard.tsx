// DEPRECATED: Use components/ProductCard.tsx instead. Retained for backward compatibility.
'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Star, Heart, ChevronRight } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { trackClick } from '@/lib/intelligence/personalisation'
import { trackAffiliateClick } from '@/lib/analytics'
import { getProductImage } from '@/lib/utils/product-image'

type ProductSource = 'Amazon' | 'Flipkart' | 'CJ' | 'Direct'
type AffiliatePlatform = 'amazon' | 'flipkart' | 'cj' | 'pod' | 'vcm'

export interface ProductCardItem {
  id: number | string
  name: string
  image: string | undefined
  category?: string
  brand: string | undefined
  price: number
  originalPrice: number | undefined | null
  discount: number | undefined | null
  rating: number
  reviewCount?: number | undefined
  reviews?: number | undefined
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
  const { formatPrice } = useLocale()
  const [imgError, setImgError] = useState<boolean>(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isCompared, setIsCompared] = useState(false)

  const source = useMemo(() => resolveSource(product), [product])
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const roundedRating = useMemo<number>(() => Math.round(product.rating), [product.rating])
  const reviewCountLabel = useMemo<string>(() => formatCompactNumber(reviewCount), [reviewCount])
  const isList = variant === 'list'
  const discountPercent = product.discount ?? 0

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        if (Array.isArray(parsed)) {
          setIsSaved(parsed.includes(String(product.id)))
        }
      }

      const compare = localStorage.getItem('cb_compare_list')
      if (compare) {
        const parsed = JSON.parse(compare) as string[]
        if (Array.isArray(parsed)) {
          setIsCompared(parsed.includes(String(product.id)))
        }
      }
    } catch (error) {
      console.error('Failed to read wishlist/compare state from localStorage:', error)
    }
  }, [product.id])

  const toggleWishlist = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      let parsed: string[] = saved ? JSON.parse(saved) : []
      if (!Array.isArray(parsed)) parsed = []

      const productId = String(product.id)
      if (parsed.includes(productId)) {
        parsed = parsed.filter((item) => item !== productId)
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

  const handleImageError = useCallback((): void => {
    setImgError(true)
  }, [])

  const handleViewDealClick = useCallback(() => {
    trackClick(String(product.id), source)
  }, [product.id, source])

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      className={`group relative flex overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-xl focus:outline-none focus-visible:outline-none focus:ring-2 focus-visible:ring-2 focus:ring-offset-2 focus-visible:ring-offset-2 focus:ring-blue-600 focus-visible:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 ${
        isList ? 'min-h-[220px] flex-row' : 'h-full min-h-[440px] flex-col'
      }`}
      onClick={handleCardClick}
    >
      <div className={`relative flex-shrink-0 overflow-hidden bg-zinc-50 dark:bg-zinc-800 ${isList ? 'h-full w-[240px]' : 'h-[240px] w-full'}`}>
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:bg-zinc-800">
            No Image
          </div>
        ) : (
          <Image
            src={getProductImage(product.image, product.category || 'default')}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none"
            sizes={isList ? '240px' : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 22vw'}
            onError={handleImageError}
          />
        )}

        {discountPercent > 15 ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-[10px] font-black text-white shadow-sm dark:bg-red-600">
            {discountPercent}% OFF
          </span>
        ) : null}

        {product.isTrending ? (
          <span className="absolute left-3 top-12 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black text-white shadow-sm dark:bg-orange-600">
            Trending
          </span>
        ) : null}

        <button
          onClick={toggleWishlist}
          className={`absolute right-3 top-3 z-10 rounded-full p-2 backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
            isSaved
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-zinc-400 hover:text-red-500 dark:bg-zinc-900/80'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} className={isSaved ? 'fill-current' : ''} />
        </button>

        {typeof personalScore === 'number' && personalScore >= 0.7 ? (
          <div className="absolute bottom-3 left-3">
            <span className={`rounded-lg px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-md backdrop-blur-md ${
              personalScore >= 0.85 ? 'bg-indigo-600 text-white' : 'border border-green-200 bg-green-100 text-green-700'
            }`}>
              {personalScore >= 0.85 ? 'Perfect Match' : 'Great Match'}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-grow flex-col space-y-3 p-4">
        <div>
          <h3 className="min-h-[2.5rem] line-clamp-2 text-sm font-black text-zinc-900 transition-colors duration-300 group-hover:text-skyline-primary dark:text-white">
            {product.name}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
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
          <span className="text-[10px] font-medium text-zinc-400">({reviewCountLabel})</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-skyline-primary">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-xs font-bold text-zinc-400 line-through">{formatPrice(product.originalPrice)}</span>
            ) : null}
          </div>
          <p className="mt-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">{source}</p>
          <Link
            href={`/compare?product=${product.id}`}
            onClick={(event) => event.stopPropagation()}
            className="mt-1 inline-block text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-skyline-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Compare prices
          </Link>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={toDealPath(product.id, product.affiliatePlatform)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.stopPropagation()
              handleViewDealClick()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-skyline-primary dark:bg-skyline-primary/90 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-skyline-primary/20 transition-all hover:opacity-90 active:scale-95 motion-reduce:transition-none md:w-auto md:self-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            View Deal
            <ExternalLink size={14} />
          </Link>

          <div className="flex items-center justify-between">
            <Link
              href={toProductPath(product.id)}
              onClick={(event) => event.stopPropagation()}
              className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-skyline-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
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
