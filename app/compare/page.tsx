'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, X, ExternalLink, Check, Minus, Search, SlidersHorizontal } from 'lucide-react'
import { PRODUCTS as MOCK_PRODUCTS } from '@/lib/mock-data'

type Product = (typeof MOCK_PRODUCTS)[number]

type SpecDefinition = {
  label: string
  key?: 'brand' | 'source'
  render?: (product: Product) => ReactNode
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const selectedProducts = MOCK_PRODUCTS.filter((product) => selectedIds.includes(String(product.id)))

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return []
    }

    return MOCK_PRODUCTS.filter(
      (product) => product.name.toLowerCase().includes(query) && !selectedIds.includes(String(product.id)),
    ).slice(0, 6)
  }, [searchQuery, selectedIds])

  const addProduct = (id: number) => {
    if (selectedIds.length >= 3) {
      return
    }

    const value = String(id)
    setSelectedIds((current) => (current.includes(value) ? current : [...current, value]))
    setSearchQuery('')
    setShowDropdown(false)
  }

  const removeProduct = (id: string) => {
    setSelectedIds((current) => current.filter((item) => item !== id))
  }

  const specs: readonly SpecDefinition[] = [
    { label: 'Brand', key: 'brand' },
    { label: 'Category', render: (product) => product.mainCategory },
    {
      label: 'Original Price',
      render: (product) => (product.originalPrice ? `₹${product.originalPrice.toLocaleString('en-IN')}` : '—'),
    },
    { label: 'Discount', render: (product) => (product.discount ? `${product.discount}%` : '—') },
    { label: 'Platform', key: 'source' },
    { label: 'Rating', render: (product) => (product.rating ? `${product.rating} ★` : '—') },
    {
      label: 'In Stock',
      render: (product) =>
        product.stock > 0 ? <Check size={16} className="mx-auto text-[#10B981]" /> : <Minus size={16} className="mx-auto text-[var(--cb-text-muted)]" />,
    },
  ]

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <SlidersHorizontal size={32} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black tracking-tighter">Compare Products</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Select up to 3 products to compare side by side</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-4 text-lg font-black">Add Products to Compare</h2>

        <div className="relative max-w-lg">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
          <input
            data-compare-search
            className="cb-input w-full pl-10"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {showDropdown && searchResults.length > 0 ? (
            <div className="cb-card absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden shadow-2xl">
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-[var(--cb-surface-2)]"
                  onClick={() => addProduct(product.id)}
                >
                  <Image
                    src={product.image || FALLBACK_IMAGE}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="line-clamp-1 text-sm font-bold">{product.name}</p>
                    <p className="text-xs text-[var(--cb-text-muted)]">
                      ₹{product.price.toLocaleString('en-IN')} · {product.brand}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <span key={product.id} className="cb-badge">
              {product.name}
              <button type="button" onClick={() => removeProduct(String(product.id))} aria-label={`Remove ${product.name}`}>
                <X size={12} />
              </button>
            </span>
          ))}

          {selectedIds.length < 3 ? (
            <button
              type="button"
              className="cb-badge cb-badge-blue cursor-pointer"
              onClick={() => document.querySelector<HTMLInputElement>('input[data-compare-search]')?.focus()}
            >
              <Plus size={12} /> Add product ({selectedIds.length}/3)
            </button>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {selectedProducts.length === 0 ? (
          <div className="cb-card mx-auto mt-4 max-w-lg p-16 text-center">
            <SlidersHorizontal size={48} className="mx-auto mb-4 text-[var(--cb-text-muted)]" />
            <h2 className="text-xl font-black">No products selected</h2>
            <p className="mt-2 text-[var(--cb-text-muted)]">Search above and add up to 3 products to compare</p>
            <Link href="/products" className="cb-btn cb-btn-primary mt-6 gap-2">
              Browse Products <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--cb-surface-2)]">
                  <th className="w-40 p-4 text-left text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
                    Specification
                  </th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="relative min-w-[200px] p-4 text-center align-top">
                      <button
                        type="button"
                        className="cb-btn absolute right-2 top-2 rounded-full bg-[var(--cb-surface-2)] p-1"
                        onClick={() => removeProduct(String(product.id))}
                        aria-label={`Remove ${product.name}`}
                      >
                        <X size={12} />
                      </button>

                      <Image
                        src={product.image || FALLBACK_IMAGE}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="mx-auto h-20 w-20 rounded-xl object-contain"
                      />
                      <p className="mt-2 line-clamp-2 text-sm font-black">{product.name}</p>
                      <p className="mt-1 text-lg font-black text-[#039BE5]">₹{product.price.toLocaleString('en-IN')}</p>
                      <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-orange mt-2 w-full gap-1 text-xs">
                        <ExternalLink size={12} /> View Deal
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={`border-t border-[var(--cb-border)] ${index % 2 === 1 ? 'bg-[var(--cb-surface-2)]/30' : ''}`}
                  >
                    <td className="p-4 text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">{spec.label}</td>
                    {selectedProducts.map((product) => {
                      const value = spec.render ? spec.render(product) : spec.key ? product[spec.key] : '—'
                      return (
                        <td key={`${spec.label}-${product.id}`} className="p-4 text-center text-sm">
                          {value ?? '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
