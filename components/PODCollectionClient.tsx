'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CatalogProduct } from '@/lib/cloudbasket-data'
import { getProductImage } from '@/lib/utils/product-image'

interface PODCollectionClientProps {
  title: string
  description: string
  products: CatalogProduct[]
}

const COLOR_OPTIONS = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'White', value: '#ffffff' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Grey', value: '#6b7280' },
  { name: 'Red', value: '#dc2626' },
] as const

export default function PODCollectionClient({ title, description, products }: PODCollectionClientProps) {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})

  const getSelectedColor = (productId: string): string => {
    return selectedColors[productId] ?? COLOR_OPTIONS[0].value
  }

  return (
    <main className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <nav className="text-sm text-[var(--cb-text-muted)]">
          <span>POD</span>
          <span className="px-2">/</span>
          <span>{title}</span>
        </nav>

        <Link
          href="/pod"
          className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]"
        >
          Back to POD
        </Link>

        <header className="mt-6">
          <h1 className="font-display text-3xl font-black uppercase text-[var(--cb-text-primary)]">{title}</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">{description}</p>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const selectedColor = getSelectedColor(product.id)

            return (
              <article key={product.id} className="cb-card overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={getProductImage(product.image, product.category)}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <h2 className="line-clamp-2 text-lg font-black text-[var(--cb-text-primary)]">{product.title}</h2>
                    <p className="mt-1 text-sm text-[var(--cb-text-muted)]">{product.brand}</p>
                  </div>

                  <p className="font-mono text-xl text-skyline-primary">
                    ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Choose colour</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {COLOR_OPTIONS.map((color) => {
                        const isSelected = selectedColor === color.value
                        return (
                          <button
                            key={`${product.id}-${color.name}`}
                            type="button"
                            onClick={() =>
                              setSelectedColors((current) => ({
                                ...current,
                                [product.id]: color.value,
                              }))
                            }
                            className={`h-8 w-8 rounded-full border border-zinc-200 ${isSelected ? 'ring-2 ring-skyline-primary ring-offset-2' : ''}`}
                            style={{ backgroundColor: color.value }}
                            aria-label={`${product.title} in ${color.name}`}
                          />
                        )
                      })}
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
                      <div
                        className="h-20 w-20 rounded-2xl border border-zinc-200"
                        style={{ backgroundColor: selectedColor }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Preview colour</p>
                        <p className="mt-1 text-sm font-semibold text-[var(--cb-text-primary)]">{selectedColor}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cb-btn-primary w-full justify-center text-xs"
                  >
                    View Design
                  </a>
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-12 rounded-3xl border border-skyline-primary/20 bg-skyline-primary/5 p-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-sm font-semibold text-[var(--cb-text-primary)]">
              Need a bulk order or custom design? Contact us.
            </p>
            <Link href="/contact" className="cb-btn-primary text-sm">
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
