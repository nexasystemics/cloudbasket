// app/category/[slug]/page.tsx
// Purpose: Category landing page — server component for metadata + hero + JSON-LD.
// A17: Product grid delegated to CategoryPageClient for client-side filtering.

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import TrackBehavior from '@/components/TrackBehavior'
import CategoryPageClient from '@/components/CategoryPageClient'
import {
  getCategoryDefinition, getCategoryProducts, CATEGORY_ALIASES,
} from '@/lib/cloudbasket-data'
import { getIndiaCatalogBySlug } from '@/lib/india-catalog/utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSlug = CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug
  const category = getCategoryDefinition(resolvedSlug)
  if (!category) return { title: 'Category Not Found' }

  const title = `${category.label} - Best Prices in India | CloudBasket`
  const description = `${category.heroDescription} Compare prices on CloudBasket across Amazon, Flipkart, and more with verified deals.`
  const url = `https://cloudbasket.in/category/${slug}`
  const ogImage = `https://cloudbasket.in/api/og?title=${encodeURIComponent(category.label)}&type=category`

  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: 'CloudBasket', locale: 'en_IN', type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: category.label }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resolvedSlug = CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug
  const category = getCategoryDefinition(resolvedSlug)
  if (!category) notFound()

  const baseProducts = getCategoryProducts(category.slug)
  const indiaProducts = getIndiaCatalogBySlug(category.slug)
  const existingIds = new Set(baseProducts.map(p => p.id))
  const products = [...baseProducts, ...indiaProducts.filter(p => !existingIds.has(p.id))]

  // A18: Combined ItemList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.label} Products on CloudBasket`,
    description: category.heroDescription,
    url: `https://cloudbasket.in/category/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        image: product.image,
        brand: { '@type': 'Brand', name: product.brand },
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: `https://cloudbasket.in/product/${product.id}` },
      },
    })),
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackBehavior category={category.slug} />

      {/* Hero */}
      <section className="relative h-64 overflow-hidden">
        <Image fill className="object-cover" src={category.image} alt={category.label} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-end px-8 pb-10">
          <div>
            <p className="mb-3 text-xs text-white/60">Home / Category / {category.label}</p>
            <h1 className="text-4xl font-black tracking-tighter text-white">{category.heroTitle}</h1>
            <p className="mt-1 text-sm text-white/70">{category.heroDescription}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-4">
        <div className="ad-slot-leaderboard">Ad Space · Contact us to advertise</div>
      </section>

      {/* Client-side filtered grid */}
      <CategoryPageClient
        products={products}
        categoryLabel={category.label}
        categorySlug={category.slug}
      />
    </main>
  )
}