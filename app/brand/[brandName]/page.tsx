// app/brand/[brandName]/page.tsx
// Purpose: Brand landing page for India Catalog brands.
// A18: generateMetadata, BreadcrumbList JSON-LD, product grid.
// A19: generateStaticParams for all unique brands.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ExternalLink, Star } from 'lucide-react'
import { INDIA_CATALOG } from '@/lib/india-catalog'
import { resolveImageSource, IMAGE_ASSETS } from '@/lib/image-assets'

// A19: generateStaticParams — all unique brands
export async function generateStaticParams() {
  if (process.env.DEV_FAST_BUILD === "true") return []
  const brands = [...new Set(INDIA_CATALOG.map(p => p.brand))]
  return brands.map(brandName => ({ brandName: encodeURIComponent(brandName) }))
}

// A18: generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ brandName: string }> }): Promise<Metadata> {
  const { brandName: encoded } = await params
  const brandName = decodeURIComponent(encoded)
  const products = INDIA_CATALOG.filter(p => p.brand.toLowerCase() === brandName.toLowerCase())
  if (products.length === 0) return { title: 'Brand Not Found | CloudBasket' }

  const title = `${brandName} Products — Best Prices in India | CloudBasket`
  const description = `Explore all ${brandName} products at the best prices. Compare across Amazon, Flipkart, Croma and more on CloudBasket.`
  const url = `https://cloudbasket.in/brand/${encoded}`

  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'CloudBasket', locale: 'en_IN', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function BrandPage({ params }: { params: Promise<{ brandName: string }> }) {
  const { brandName: encoded } = await params
  const brandName = decodeURIComponent(encoded)
  const products = INDIA_CATALOG.filter(p => p.brand.toLowerCase() === brandName.toLowerCase())

  if (products.length === 0) notFound()

  // A18: BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudbasket.in' },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://cloudbasket.in/products' },
      { '@type': 'ListItem', position: 3, name: brandName, item: `https://cloudbasket.in/brand/${encoded}` },
    ],
  }

  return (
    <main className="bg-[var(--cb-bg)] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/" className="hover:text-skyline-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-skyline-primary transition-colors">Brands</Link>
          <ChevronRight size={10} />
          <span className="text-zinc-900 dark:text-white">{brandName}</span>
        </div>
      </section>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">{brandName}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {products.length} products · Compare prices across Amazon, Flipkart, Croma and more
        </p>
      </section>

      {/* Product Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map(p => {
            const originalPrice = p.originalPrice ?? Math.round(p.price * 1.2)
            const discount = p.discount ?? Math.round(((originalPrice - p.price) / originalPrice) * 100)
            return (
              <article key={p.id} className="cb-card group flex flex-col overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                  <Image
                    fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                    src={resolveImageSource(p.image, IMAGE_ASSETS.noImage)}
                    alt={p.name}
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  {discount > 5 && (
                    <span className="absolute left-2 top-2 rounded-md bg-green-500 px-2 py-1 text-[10px] font-black text-white">{discount}% OFF</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{p.subBrand || p.brand}</p>
                  <h3 className="line-clamp-2 text-xs font-black leading-snug text-zinc-900 dark:text-white min-h-[2.5rem]">
                    <Link href={`/product/${p.id}`} className="hover:text-skyline-primary transition-colors">{p.name}</Link>
                  </h3>
                  {p.variant && <p className="text-[9px] text-zinc-400 font-medium">{p.variant}</p>}
                  <div className="flex items-center gap-1 text-[10px]">
                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                    <span className="font-black">{(p.rating ?? 4.0).toFixed(1)}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <p className="text-sm font-black text-skyline-primary">₹{p.price.toLocaleString('en-IN')}</p>
                    {discount > 0 && <p className="text-[10px] text-zinc-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</p>}
                  </div>
                  <Link href={`/product/${p.id}`} className="mt-auto pt-3 cb-btn cb-btn-primary w-full py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1">
                    View Deal <ExternalLink size={10} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
