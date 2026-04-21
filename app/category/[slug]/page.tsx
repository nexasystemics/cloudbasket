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
import { getCategoryIcon, getCategoryGradient } from '@/lib/category-icons'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const resolvedSlug = CATEGORY_ALIASES[slug as keyof typeof CATEGORY_ALIASES] ?? slug
  const category = getCategoryDefinition(resolvedSlug)
  if (!category) return { title: 'Category Not Found' }

  const title = `${category.label} - Best Prices in India | CloudBasket`
  const description = `${category.heroDescription} Compare prices on CloudBasket across Amazon, Flipkart, and more with verified deals.`
  const url = `https://cloudbasket.co/category/${slug}`
  const ogImage = `https://cloudbasket.co/api/og?title=${encodeURIComponent(category.label)}&type=category`

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

  const Icon = getCategoryIcon(category.slug)
  const gradient = getCategoryGradient(category.slug)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudbasket.co' },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://cloudbasket.co/categories' },
      { '@type': 'ListItem', position: 3, name: category.label, item: `https://cloudbasket.co/category/${slug}` },
    ],
  }

  // A18: Combined ItemList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.label} Products on CloudBasket`,
    description: category.heroDescription,
    url: `https://cloudbasket.co/category/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.title,
        image: product.image,
        brand: { '@type': 'Brand', name: product.brand },
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: `https://cloudbasket.co/product/${product.id}` },
      },
    })),
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackBehavior category={category.slug} />

      {/* Hero */}
      <section className="relative h-72 overflow-hidden">
        <Image fill className="object-cover" src={category.image} alt={category.label} priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-7xl items-end px-8 pb-12">
          <div className="relative z-10 w-full">
            <div className={`mb-4 h-1 w-24 rounded-full bg-gradient-to-r ${gradient}`} />
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-white/50">Home / Category / {category.label}</p>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-skyline-primary/20`}>
                <Icon size={24} className="text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">{category.heroTitle}</h1>
            </div>
            <p className="mt-4 max-w-2xl text-sm md:text-base font-medium text-white/70 leading-relaxed">{category.heroDescription}</p>
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
