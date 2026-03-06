'use client'

import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExternalLink, Star, TrendingDown, Zap } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useGlobal } from '@/context/GlobalContext'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'list'
}

const STAR_INDICES: number[] = [1, 2, 3, 4, 5]
const CARD_TRANSITION = { type: 'spring', stiffness: 300, damping: 28 } as const

const toDealPath = (id: number): string => `/go/amazon-${id}`

const formatCompactNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export default function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const router = useRouter()
  const { formatPrice } = useGlobal()
  const [imgError, setImgError] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const roundedRating = useMemo<number>(() => Math.round(product.rating), [product.rating])
  const reviewCountLabel = useMemo<string>(
    () => formatCompactNumber(product.reviewCount),
    [product.reviewCount],
  )

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

  const handleImageError = useCallback((): void => {
    setImgError(true)
  }, [])

  const handleMouseEnter = useCallback((): void => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback((): void => {
    setIsHovered(false)
  }, [])

  const isList = variant === 'list'

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      transition={CARD_TRANSITION}
      className={`cb-card group cursor-pointer overflow-hidden ${
        isList ? 'flex min-h-[180px] flex-row' : 'flex h-full flex-col'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      <div className={`relative overflow-hidden ${isList ? 'w-[120px] min-w-[120px]' : 'aspect-square w-full'}`}>
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--cb-surface-3)]">
            <span className="text-[11px] text-[var(--cb-text-muted)]">No Image</span>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            sizes={isList ? '120px' : '(max-width: 768px) 100vw, (max-width: 1280px) 30vw, 22vw'}
            onError={handleImageError}
          />
        )}

        <div className="absolute start-0 top-0 flex flex-col gap-1 p-2">
          {product.isTrending && (
            <span className="cb-badge gap-1 bg-[#F97316]/10 text-[#F97316]">
              <Zap size={10} />
              Trending
            </span>
          )}
          {product.discount !== null && product.discount > 0 && (
            <span className="cb-badge gap-1 bg-status-success/10 text-status-success">
              <TrendingDown size={10} />
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--cb-text-muted)]">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-[var(--cb-text-primary)]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          {STAR_INDICES.map((star) => (
            <Star
              key={`${product.id}-${star}`}
              size={12}
              className={star <= roundedRating ? 'fill-[#F5C842] text-[#F5C842]' : 'text-[var(--cb-text-muted)]'}
            />
          ))}
          <span className="ms-1 font-mono text-[11px] text-[var(--cb-text-muted)]">{product.rating.toFixed(1)}</span>
          <span className="font-mono text-[11px] text-[var(--cb-text-muted)]">({reviewCountLabel})</span>
        </div>

        <div className="mt-1 flex items-end gap-2">
          <span className="font-display text-xl font-black text-[var(--cb-text-primary)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice !== null && (
            <span className="text-sm text-[var(--cb-text-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount !== null && product.discount > 0 && (
            <span className="text-xs font-bold text-status-success">-{product.discount}%</span>
          )}
        </div>

        <button
          type="button"
          className="cb-btn-primary mt-2 w-full justify-center gap-2"
          onClick={handleDealClick}
          aria-label={`View deal for ${product.name}`}
        >
          View Deal
          <ExternalLink size={14} />
        </button>
      </div>
    </motion.div>
  )
}
