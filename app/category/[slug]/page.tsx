import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const toCategoryLabel = (slug: string): string => {
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase()
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = toCategoryLabel(slug)

  return {
    title: `${category} Deals | CloudBasket`,
    description: `Best ${category.toLowerCase()} deals from Amazon, Flipkart & more.`,
  }
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return MAIN_CATEGORIES.map((category) => ({ slug: category.toLowerCase() }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = toCategoryLabel(slug)

  if (!(MAIN_CATEGORIES as readonly string[]).includes(category)) {
    notFound()
  }

  const categoryProducts = PRODUCTS.filter(
    (product) => product.mainCategory === category && product.status === 'Approved',
  )

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <nav className="mx-auto w-full max-w-7xl px-6 pt-8 text-[12px] text-[var(--cb-text-muted)]">
        <Link href={ROUTES.HOME} className="transition-colors hover:text-[var(--cb-text-primary)]">
          Home
        </Link>
        <span className="px-2">/</span>
        <span>{category}</span>
      </nav>

      <header className="mx-auto w-full max-w-7xl px-6 py-6">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-[var(--cb-text-primary)]">
          {category}
        </h1>
        <p className="text-sm text-[var(--cb-text-muted)]">{categoryProducts.length} verified deals</p>
      </header>

      {categoryProducts.length === 0 ? (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-16 text-center">
          <p className="text-[var(--cb-text-primary)]">No products found in this category</p>
          <Link href={ROUTES.PRODUCTS} className="mt-3 cb-btn-ghost">
            Back to all products
          </Link>
        </div>
      ) : (
        <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </section>
      )}
    </div>
  )
}
