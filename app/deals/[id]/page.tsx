import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ExternalLink, Shield, Tag } from 'lucide-react'
import { DEALS } from '@/lib/deals-data'
import { PRODUCTS } from '@/lib/mock-data'
import { ROUTES } from '@/lib/constants'
import { getProductImage } from '@/lib/utils/product-image'

interface DealDetailPageProps {
  params: Promise<{ id: string }>
}

const formatInr = (amount: number): string => `₹${new Intl.NumberFormat('en-IN').format(amount)}`

const trimTitle = (value: string): string => {
  return value.length > 40 ? `${value.slice(0, 40)}...` : value
}

export async function generateMetadata({ params }: DealDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const deal = DEALS.find((item) => item.id === id)

  return {
    title: deal ? `${deal.title} | CloudBasket Deals` : 'Deal Not Found | CloudBasket Deals',
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return DEALS.map((deal) => ({ id: deal.id }))
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params
  const deal = DEALS.find((item) => item.id === id)
  if (!deal) {
    notFound()
  }

  const product = PRODUCTS.find((item) => item.id === deal.productId)
  const expiresLabel = new Date(deal.expiresAt).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const hasPrice = product && product.originalPrice !== undefined && product.originalPrice !== null
  const savings = hasPrice ? (product!.originalPrice as number) - product!.price : 0
  const description =
    product && product.description && product.description.length > 200
      ? `${product.description.slice(0, 200)}...`
      : product?.description ?? 'Verified affiliate deal available for a limited period.'

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <nav className="mb-6 text-[12px] text-[var(--cb-text-muted)]">
          <Link href={ROUTES.HOME} className="hover:text-[var(--cb-text-primary)]">
            Home
          </Link>
          <span className="px-2">/</span>
          <Link href={ROUTES.DEALS} className="hover:text-[var(--cb-text-primary)]">
            Deals
          </Link>
          <span className="px-2">/</span>
          <span>{trimTitle(deal.title)}</span>
        </nav>

        <article className="cb-card overflow-hidden">
          <div className="relative h-72">
            {product ? (
              <Image src={getProductImage(product.image, product.mainCategory ?? 'default')} alt={deal.title} fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[var(--cb-surface-3)]" />
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="cb-badge bg-skyline-glow text-skyline-primary">
                <Tag size={11} className="me-1" />
                {deal.badge ?? 'Deal'}
              </span>
              {deal.isFlash && <span className="cb-badge bg-[#F97316]/20 text-[#F97316]">Flash</span>}
            </div>

            <h1 className="mt-3 font-display text-2xl font-black text-[var(--cb-text-primary)]">{deal.title}</h1>
            <p className="mt-3 font-display text-5xl font-black text-[#F97316]">-{deal.discount}% OFF</p>

            <p className="mt-2 flex items-center gap-1 text-sm text-status-warning">
              <Clock size={14} />
              Expires: {expiresLabel}
            </p>

            {product && (
              <div className="mt-5">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="font-display text-3xl font-black text-[var(--cb-text-primary)]">
                    {formatInr(product.price)}
                  </span>
                  {product.originalPrice !== undefined && product.originalPrice !== null && (
                    <span className="text-lg text-[var(--cb-text-muted)] line-through">
                      {formatInr(product.originalPrice)}
                    </span>
                  )}
                  {savings > 0 && <span className="text-sm font-bold text-status-success">Save {formatInr(savings)}</span>}
                </div>
                <p className="mt-3 text-sm text-[var(--cb-text-secondary)]">{description}</p>
              </div>
            )}

            <div className="mt-8">
              <a
                href={`/go/amazon-${deal.productId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cb-btn-primary flex w-full items-center justify-center gap-2 py-5 text-base"
              >
                <ExternalLink size={18} />
                Claim This Deal Now
              </a>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-[var(--cb-text-muted)]">
                <Shield size={12} />
                Secure affiliate redirect
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] italic text-[var(--cb-text-muted)]">
              Affiliate disclosure: CloudBasket may earn commission when you buy through this link.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}

