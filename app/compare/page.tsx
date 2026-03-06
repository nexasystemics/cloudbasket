'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, ExternalLink, Plus, Search, Star, X } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'
import type { Product } from '@/lib/types'

const MAX_COMPARE = 4

export default function ComparePage() {
  const router = useRouter()
  const { formatPrice } = useGlobal()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchCategory, setSearchCategory] = useState<string>('All')

  const selectedProducts = useMemo<Product[]>(() => {
    return PRODUCTS.filter((product) => selectedIds.includes(product.id))
  }, [selectedIds])

  const searchResults = useMemo<Product[]>(() => {
    const query = searchQuery.trim().toLowerCase()
    if (query.length < 2) {
      return []
    }

    return PRODUCTS.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      const matchesCategory = searchCategory === 'All' || product.mainCategory === searchCategory
      return matchesQuery && matchesCategory && !selectedIds.includes(product.id)
    }).slice(0, 8)
  }, [searchCategory, searchQuery, selectedIds])

  const lowestPrice = useMemo<number | null>(() => {
    if (selectedProducts.length === 0) {
      return null
    }
    return selectedProducts.reduce((min, item) => (item.price < min ? item.price : min), selectedProducts[0].price)
  }, [selectedProducts])

  const highestRating = useMemo<number | null>(() => {
    if (selectedProducts.length === 0) {
      return null
    }
    return selectedProducts.reduce(
      (max, item) => (item.rating > max ? item.rating : max),
      selectedProducts[0].rating,
    )
  }, [selectedProducts])

  const addProduct = (id: number): void => {
    if (selectedIds.includes(id) || selectedIds.length >= MAX_COMPARE) {
      return
    }
    setSelectedIds([...selectedIds, id])
    setSearchQuery('')
  }

  const removeProduct = (id: number): void => {
    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
  }

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <header>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-[var(--cb-text-primary)]">
            Compare Products
          </h1>
          <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
            Add up to 4 products to compare side by side
          </p>
        </header>

        <section className="mt-8">
          <div className="relative max-w-3xl">
            <div className="glass-panel relative">
              <Search
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search product to add..."
                className="w-full rounded-card bg-transparent py-4 pe-4 ps-11 text-sm text-[var(--cb-text-primary)] outline-none"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="glass-panel absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden border cb-border rounded-card">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product.id)}
                    className="flex w-full cursor-pointer items-center gap-3 p-3 text-start transition-colors hover:bg-[var(--cb-surface-3)]"
                  >
                    <div className="relative h-10 w-10 overflow-hidden rounded-badge">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[var(--cb-text-primary)]">{product.name}</p>
                      <p className="font-mono text-xs text-skyline-primary">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative mt-3 max-w-[240px]">
            <select
              value={searchCategory}
              onChange={(event) => setSearchCategory(event.target.value)}
              className="cb-btn-ghost w-full appearance-none justify-between rounded-button pe-8 text-sm"
            >
              <option value="All">All</option>
              {MAIN_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
            />
          </div>
        </section>

        <section className="mt-10">
          {selectedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-card border cb-border bg-[var(--cb-surface-2)] py-16 text-center">
              <Plus size={48} className="text-[var(--cb-text-muted)]" />
              <p className="text-[var(--cb-text-primary)]">Add products above to start comparing</p>
              <Link href={ROUTES.PRODUCTS} className="cb-btn-ghost">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {selectedProducts.map((product) => (
                <article key={product.id} className="cb-card relative p-4">
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="absolute end-2 top-2 rounded-full p-1 text-[var(--cb-text-muted)] hover:bg-[var(--cb-surface-3)]"
                    aria-label={`Remove ${product.name}`}
                  >
                    <X size={14} />
                  </button>
                  <div className="relative aspect-square overflow-hidden rounded-card">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="mt-2 cb-badge bg-skyline-glow text-skyline-primary">{product.brand}</div>
                  <h2 className="mt-1 line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">
                    {product.name}
                  </h2>
                  <p className="mt-2 font-display text-xl font-black text-skyline-primary">
                    {formatPrice(product.price)}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={`${product.id}-star-${index + 1}`}
                        size={12}
                        className={index + 1 <= Math.round(product.rating) ? 'fill-[#F5C842] text-[#F5C842]' : 'text-[var(--cb-text-muted)]'}
                      />
                    ))}
                    <span className="ms-1 text-xs text-[var(--cb-text-muted)]">{product.rating.toFixed(1)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push('/go/amazon-' + String(product.id))}
                    className="cb-btn-primary mt-3 w-full justify-center gap-2 text-xs"
                  >
                    View Deal
                    <ExternalLink size={12} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {selectedProducts.length >= 2 && (
          <section className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border cb-border bg-[var(--cb-surface-3)] p-3 text-start text-xs font-black uppercase tracking-wider text-[var(--cb-text-muted)]">
                    Spec
                  </th>
                  {selectedProducts.map((product) => (
                    <th
                      key={`head-${product.id}`}
                      className="border cb-border bg-[var(--cb-surface-3)] p-3 text-start text-xs font-black text-[var(--cb-text-primary)]"
                    >
                      {product.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-[var(--cb-surface-2)]">
                  <td className="border cb-border p-3 text-sm font-bold text-[var(--cb-text-muted)]">Rating</td>
                  {selectedProducts.map((product) => (
                    <td
                      key={`rating-${product.id}`}
                      className={`border cb-border p-3 text-sm ${
                        highestRating !== null && product.rating === highestRating
                          ? 'font-bold text-skyline-primary'
                          : 'text-[var(--cb-text-primary)]'
                      }`}
                    >
                      {product.rating.toFixed(1)}
                    </td>
                  ))}
                </tr>
                <tr className="even:bg-[var(--cb-surface-2)]">
                  <td className="border cb-border p-3 text-sm font-bold text-[var(--cb-text-muted)]">Price</td>
                  {selectedProducts.map((product) => (
                    <td
                      key={`price-${product.id}`}
                      className={`border cb-border p-3 text-sm ${
                        lowestPrice !== null && product.price === lowestPrice
                          ? 'font-bold text-status-success'
                          : 'text-[var(--cb-text-primary)]'
                      }`}
                    >
                      {formatPrice(product.price)}
                    </td>
                  ))}
                </tr>
                <tr className="even:bg-[var(--cb-surface-2)]">
                  <td className="border cb-border p-3 text-sm font-bold text-[var(--cb-text-muted)]">Brand</td>
                  {selectedProducts.map((product) => (
                    <td key={`brand-${product.id}`} className="border cb-border p-3 text-sm text-[var(--cb-text-primary)]">
                      {product.brand}
                    </td>
                  ))}
                </tr>
                <tr className="even:bg-[var(--cb-surface-2)]">
                  <td className="border cb-border p-3 text-sm font-bold text-[var(--cb-text-muted)]">Warranty</td>
                  {selectedProducts.map((product) => (
                    <td
                      key={`warranty-${product.id}`}
                      className="border cb-border p-3 text-sm text-[var(--cb-text-primary)]"
                    >
                      {product.warranty}
                    </td>
                  ))}
                </tr>
                <tr className="even:bg-[var(--cb-surface-2)]">
                  <td className="border cb-border p-3 text-sm font-bold text-[var(--cb-text-muted)]">Stock</td>
                  {selectedProducts.map((product) => (
                    <td key={`stock-${product.id}`} className="border cb-border p-3 text-sm text-[var(--cb-text-primary)]">
                      {product.stock}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  )
}
