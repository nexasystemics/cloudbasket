import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Shield,
  Star,
  Truck,
  Zap,
} from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { AFFILIATE_TAGS, ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'
import type { Product } from '@/lib/types'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

const toInr = (amount: number): string => {
  return `₹${new Intl.NumberFormat('en-IN').format(amount)}`
}

const trimName = (name: string): string => {
  return name.length > 30 ? `${name.slice(0, 30)}...` : name
}

const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find((product) => product.id === id)
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const parsedId = Number.parseInt(id, 10)
  const product = Number.isNaN(parsedId) ? undefined : getProductById(parsedId)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'Requested product could not be found.',
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0] ?? product.image],
    },
  }
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return PRODUCTS.slice(0, 100).map((product) => ({ id: String(product.id) }))
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const parsedId = Number.parseInt(id, 10)
  if (Number.isNaN(parsedId)) {
    notFound()
  }

  const product = getProductById(parsedId)
  if (!product) {
    notFound()
  }

  const roundedRating = Math.round(product.rating)
  const relatedProducts = PRODUCTS.filter(
    (item) =>
      item.mainCategory === product.mainCategory && item.id !== product.id && item.status === 'Approved',
  ).slice(0, 4)

  const savings =
    product.originalPrice !== null && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <nav className="mx-auto flex w-full max-w-7xl items-center gap-2 px-6 pt-6 text-[12px] text-[var(--cb-text-muted)]">
        <Link href={ROUTES.HOME} className="hover:text-[var(--cb-text-primary)]">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href={ROUTES.PRODUCTS} className="hover:text-[var(--cb-text-primary)]">
          Products
        </Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.mainCategory.toLowerCase()}`} className="hover:text-[var(--cb-text-primary)]">
          {product.mainCategory}
        </Link>
        <ChevronRight size={12} />
        <span className="truncate">{trimName(product.name)}</span>
      </nav>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-2">
        <section>
          <div className="relative aspect-square overflow-hidden rounded-card border cb-border bg-[var(--cb-surface-2)]">
            <Image src={product.image} alt={product.name} fill priority className="object-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.slice(0, 3).map((imageUrl, index) => (
              <div
                key={`${product.id}-thumb-${index}`}
                className="relative h-20 w-20 overflow-hidden rounded-badge border cb-border"
              >
                <Image src={imageUrl} alt={`${product.name} image ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="cb-badge bg-skyline-glow text-skyline-primary">{product.brand.toUpperCase()}</div>
          <h1 className="mt-3 font-display text-2xl font-black leading-tight tracking-tight text-[var(--cb-text-primary)]">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={`${product.id}-star-${index + 1}`}
                  size={14}
                  className={index + 1 <= roundedRating ? 'fill-[#F5C842] text-[#F5C842]' : 'text-[var(--cb-text-muted)]'}
                />
              ))}
            </div>
            <span className="font-mono text-sm text-[var(--cb-text-primary)]">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-[var(--cb-text-muted)]">
              ({new Intl.NumberFormat('en-IN').format(product.reviewCount)} reviews)
            </span>
          </div>

          <div className="mt-4">
            <p className="font-display text-4xl font-black text-[var(--cb-text-primary)]">{toInr(product.price)}</p>
            {product.originalPrice !== null && (
              <div className="mt-1 flex items-center gap-3">
                <span className="text-lg text-[var(--cb-text-muted)] line-through">
                  {toInr(product.originalPrice)}
                </span>
                {product.discount !== null && (
                  <span className="cb-badge bg-status-success/10 text-status-success">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
            )}
            {savings > 0 && <p className="mt-1 text-sm font-bold text-status-success">You save {toInr(savings)}</p>}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--cb-text-muted)]">
              <Shield size={14} />
              <span>Secure Redirect</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--cb-text-muted)]">
              <Truck size={14} />
              <span>Free Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--cb-text-muted)]">
              <RotateCcw size={14} />
              <span>{product.warranty}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
              About this product
            </h3>
            <p className="text-sm leading-relaxed text-[var(--cb-text-secondary)]">{product.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
              Specifications
            </h3>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[11px] font-bold text-[var(--cb-text-muted)]">{key}</dt>
                  <dd className="text-[13px] text-[var(--cb-text-primary)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`/go/amazon-${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View deal for ${product.name}`}
              className="cb-btn-primary w-full justify-center gap-2 py-4 text-base"
            >
              <ExternalLink size={18} />
              View Best Deal
            </a>
            <Link href={ROUTES.COMPARE} className="cb-btn-ghost w-full justify-center">
              Compare Prices
            </Link>
            <p className="mt-2 text-center text-[10px] italic text-[var(--cb-text-muted)]">
              * You will be redirected to a partner site.
            </p>
            <p className="text-center text-[10px] italic text-[var(--cb-text-muted)]">
              CloudBasket earns affiliate commission.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-[var(--cb-text-muted)]">Listed on: {product.source}</span>
            <span className="cb-badge bg-skyline-glow text-skyline-primary">
              <Zap size={11} className="me-1" />
              {AFFILIATE_TAGS.AMAZON}
            </span>
          </div>
        </section>
      </main>

      <section className="mx-auto mt-12 w-full max-w-7xl border-t cb-border px-6 pt-8">
        <h2 className="font-display text-2xl font-black uppercase text-[var(--cb-text-primary)]">
          Full Specifications
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={`full-${key}`} className="cb-card p-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{key}</p>
              <p className="mt-1 text-[13px] text-[var(--cb-text-primary)]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-6 pb-16">
        <h2 className="font-display text-2xl font-black uppercase text-[var(--cb-text-primary)]">
          Related Products
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} variant="grid" />
          ))}
        </div>
      </section>
    </div>
  )
}
