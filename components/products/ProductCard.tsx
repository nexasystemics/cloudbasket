'use client'

import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink, MessageCircle, Star, TrendingDown, Zap } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useGlobal } from '@/context/GlobalContext'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
}

const STAR_INDICES: number[] = [1, 2, 3, 4, 5]
const CARD_TRANSITION = { type: 'spring', stiffness: 300, damping: 28 } as const

const toDealPath = (id: number): string => `/go/amazon-${id}`
const toProductPath = (id: number): string => `/product/${id}`

const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

const sourceBadgeClass = (source: Product['source']): string => {
  if (source === 'Amazon') {
    return 'cb-badge cb-badge-orange'
  }
  if (source === 'Flipkart') {
    return 'cb-badge cb-badge-blue'
  }
  if (source === 'CJ') {
    return 'cb-badge cb-badge-green'
  }
  return 'cb-badge cb-badge-red'
}

const getLowestPriceBadge = (product: Product): { label: string; className: string } | null => {
  if (product.originalPrice === null) {
    return null
  }

  if (product.price <= product.originalPrice * 0.75) {
    return {
      label: 'Lowest in 90 Days',
      className: 'cb-badge border-[#10B981] bg-[#10B981] text-white',
    }
  }

  if (product.price <= product.originalPrice * 0.85) {
    return {
      label: 'Near Lowest Price',
      className: 'cb-badge cb-badge-green',
    }
  }

  return null
}

export default function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const router = useRouter()
  const { formatPrice } = useGlobal()
  const [imgError, setImgError] = useState<boolean>(false)

  const roundedRating = useMemo<number>(() => Math.round(product.rating), [product.rating])
  const reviewCountLabel = useMemo<string>(() => formatCompactNumber(product.reviewCount), [product.reviewCount])
  const lowestBadge = useMemo(() => getLowestPriceBadge(product), [product])
  const isList = variant === 'list'

  const handleCardClick = useCallback((): void => {
    router.push(toDealPath(product.id))
  }, [product.id, router])

  const handleDealClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      router.push(toDealPath(product.id))
    },
    [product.id, router],
  )

  const handleQuickView = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      router.push(toProductPath(product.id))
    },
    [product.id, router],
  )

  const handleShareClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      const shareText = `${product.name} on CloudBasket`
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} https://cloudbasket.in${toDealPath(product.id)}`)}`
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    },
    [product.id, product.name],
  )

  const handleImageError = useCallback((): void => {
    setImgError(true)
  }, [])

  return (
    <motion.article
      layout
      whileHover={{ y: -3 }}
      transition={CARD_TRANSITION}
      className={`cb-card group cursor-pointer overflow-hidden ${
        isList ? 'flex flex-row' : 'flex h-full flex-col'
      }`}
      onClick={handleCardClick}
    >
      <div className={`product-card-img relative flex-shrink-0 ${isList ? 'h-[200px] w-[220px]' : 'h-[200px] w-full'}`}>
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--cb-surface-2)] text-xs text-[var(--cb-text-muted)]">
            No Image
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes={isList ? '220px' : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 22vw'}
            onError={handleImageError}
          />
        )}

        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {product.isTrending ? (
            <span className="cb-badge cb-badge-orange gap-1">
              <Zap size={10} />
              Trending
            </span>
          ) : null}
          {product.discount !== null && product.discount > 0 ? (
            <span className="cb-badge cb-badge-green gap-1">
              <TrendingDown size={10} />
              -{product.discount}%
            </span>
          ) : null}
        </div>

        {lowestBadge ? (
          <div className="absolute right-2 top-2">
            <span className={lowestBadge.className}>{lowestBadge.label}</span>
          </div>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleQuickView}
            className="rounded-md bg-white px-3 py-1 text-xs font-bold text-[#0F172A]"
          >
            Quick View
          </button>
        </div>

        <button
          type="button"
          onClick={handleShareClick}
          className="absolute bottom-2 end-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          aria-label={`Share ${product.name} on WhatsApp`}
        >
          <MessageCircle size={14} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className={`${sourceBadgeClass(product.source)} w-fit`}>{product.source}</span>

        <p className="font-mono-cb text-[10px] uppercase tracking-widest text-[var(--cb-text-muted)]">{product.brand}</p>

        <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[var(--cb-text-primary)]">{product.name}</h3>

        <div className="flex items-center gap-1">
          {STAR_INDICES.map((star) => (
            <Star
              key={`${product.id}-${star}`}
              size={12}
              className={star <= roundedRating ? 'fill-[#F5C842] text-[#F5C842]' : 'text-[var(--cb-text-muted)]'}
            />
          ))}
          <span className="ms-1 font-mono-cb text-[11px] text-[var(--cb-text-muted)]">{product.rating.toFixed(1)}</span>
          <span className="font-mono-cb text-[11px] text-[var(--cb-text-muted)]">({reviewCountLabel})</span>
        </div>

        <div className="mt-1 flex items-end gap-2">
          <span className="price-current">{formatPrice(product.price)}</span>
          {product.originalPrice !== null ? <span className="price-original">{formatPrice(product.originalPrice)}</span> : null}
          {product.discount !== null && product.discount > 0 ? (
            <span className="price-savings">SAVE {product.discount}%</span>
          ) : null}
        </div>

        <button
          type="button"
          className="cb-btn-primary mt-auto w-full justify-center gap-2"
          onClick={handleDealClick}
          aria-label={`View deal for ${product.name}`}
        >
          View Deal
          <ExternalLink size={14} />
        </button>
      </div>
    </motion.article>
  )
}
