'use client'

import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ExternalLink, MessageCircle, Star, TrendingDown, Zap } from 'lucide-react'
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

const STAR_INDICES: number[] = [1, 2, 3, 4, 5]

const toDealPath = (id: number | string, affiliatePlatform?: AffiliatePlatform): string => {
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
  if (typeof id === 'number') {
    return `/product/${id}`
  }
  return '/products'
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

const sourceBadgeClass = (source: ProductSource): string => {
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

const getLowestPriceBadge = (product: ProductCardItem): { label: string; className: string } | null => {
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

export function ProductCard({ product, variant = 'grid', personalScore }: ProductCardProps) {
  const router = useRouter()
  const { formatPrice } = useGlobal()
  const [imgError, setImgError] = useState<boolean>(false)

  const source = useMemo(() => resolveSource(product), [product])
  const reviewCount = product.reviewCount ?? product.reviews ?? 0
  const roundedRating = useMemo<number>(() => Math.round(product.rating), [product.rating])
  const reviewCountLabel = useMemo<string>(() => formatCompactNumber(reviewCount), [reviewCount])
  const lowestBadge = useMemo(() => getLowestPriceBadge(product), [product])
  const isList = variant === 'list'

  const handleCardClick = useCallback((): void => {
    router.push(toDealPath(product.id, product.affiliatePlatform))
  }, [product.affiliatePlatform, product.id, router])

  const handleDealClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation()
      router.push(toDealPath(product.id, product.affiliatePlatform))
    },
    [product.affiliatePlatform, product.id, router],
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
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} https://cloudbasket.in${toDealPath(product.id, product.affiliatePlatform)}`)}`
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    },
    [product.affiliatePlatform, product.id, product.name],
  )

  const handleImageError = useCallback((): void => {
    setImgError(true)
  }, [])

  return (
    <article
      className={`cb-card group cursor-pointer overflow-hidden ${
        isList ? 'flex flex-row' : 'flex h-full flex-col'
      } transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
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
            className="object-cover transition-transform duration-200 group-hover:scale-105"
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

        {typeof personalScore === 'number' ? (
          <div className="absolute bottom-2 left-2">
            {personalScore >= 0.85 ? (
              <span className="cb-badge bg-[#8B5CF6] text-[10px] text-white">Perfect Match</span>
            ) : personalScore >= 0.7 ? (
              <span className="cb-badge cb-badge-green text-[10px]">✓ Great Match</span>
            ) : null}
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
        <span className={`${sourceBadgeClass(source)} w-fit`}>{source}</span>

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
        <div className="flex min-h-[20px] flex-wrap items-center gap-2">
          {product.price >= 5000 ? (
            <span className="text-[10px] text-[#10B981]">
              EMI from Rs{Math.ceil(product.price / 12).toLocaleString('en-IN')}/mo
            </span>
          ) : null}
          {product.affiliatePlatform === 'amazon' || product.affiliatePlatform === 'flipkart' ? (
            <span className="cb-badge text-[10px]">COD</span>
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
    </article>
  )
}

export default ProductCard
