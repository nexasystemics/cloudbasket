'use client'

import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Plus, ExternalLink, Check, Minus, TrendingDown } from 'lucide-react'
import { IMAGE_ASSETS, resolveImageSource } from '@/lib/image-assets'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

const MAX_PRODUCTS = 5

const SPEC_KEYS = [
  { key: 'price', label: 'Price', format: 'price' },
  { key: 'brand', label: 'Brand', format: 'text' },
  { key: 'rating', label: 'Rating', format: 'stars' },
  { key: 'reviews', label: 'Reviews', format: 'number' },
  { key: 'display', label: 'Display', format: 'text' },
  { key: 'processor', label: 'Processor', format: 'text' },
  { key: 'ram', label: 'RAM', format: 'text' },
  { key: 'storage', label: 'Storage', format: 'text' },
  { key: 'battery', label: 'Battery', format: 'text' },
  { key: 'camera', label: 'Camera', format: 'text' },
  { key: 'os', label: 'OS', format: 'text' },
  { key: 'warranty', label: 'Warranty', format: 'text' },
  { key: 'delivery', label: 'Delivery', format: 'text' },
  { key: 'platform', label: 'Platform', format: 'badge' },
  { key: 'savings', label: 'You Save', format: 'savings' },
] as const

type SpecKey = (typeof SPEC_KEYS)[number]['key']
type SpecFormat = (typeof SPEC_KEYS)[number]['format']

type ProductSpecs = {
  price: number
  brand: string
  rating: number
  reviews: number
  display: string
  processor: string
  ram: string
  storage: string
  battery: string
  camera: string
  os: string
  warranty: string
  delivery: string
  platform: string
  savings: number
}

type CompareEntry = {
  product: (typeof MOCK_PRODUCTS)[number]
  specs: ProductSpecs
}

type CompareProduct = (typeof MOCK_PRODUCTS)[number] & Partial<{
  reviews: number
  display: string
  processor: string
  ram: string
  storage: string
  battery: string
  camera: string
  os: string
  warranty: string
  delivery: string
  platform: string
}>

function getProductSpecs(product: CompareProduct): ProductSpecs {
  return {
    price: product.price,
    brand: product.brand ?? 'N/A',
    rating: product.rating ?? 4.0,
    reviews: product.reviews ?? product.reviewCount ?? 1200,
    display: product.display ?? '6.7" AMOLED, 120Hz',
    processor: product.processor ?? 'Snapdragon 8 Gen 3',
    ram: product.ram ?? '8GB LPDDR5',
    storage: product.storage ?? '128GB UFS 3.1',
    battery: product.battery ?? '5000mAh, 45W Fast Charge',
    camera: product.camera ?? '50MP + 12MP + 10MP Triple',
    os: product.os ?? 'Android 15',
    warranty: product.warranty ?? '1 Year Manufacturer',
    delivery: product.delivery ?? 'Free · 2-4 Days',
    platform: product.platform ?? product.source ?? 'Amazon',
    savings: product.originalPrice ? product.originalPrice - product.price : Math.floor(product.price * 0.15),
  }
}

function getPlatformClass(platform: string): string {
  const normalized = platform.toLowerCase()
  if (normalized.includes('amazon')) {
    return 'bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/20'
  }
  if (normalized.includes('flipkart')) {
    return 'bg-[#2874F0]/10 text-[#2874F0] border-[#2874F0]/20'
  }
  return 'cb-badge-green'
}

function getBestIds(compareEntries: CompareEntry[]): Record<SpecKey, Set<string>> {
  const best: Record<SpecKey, Set<string>> = {
    price: new Set<string>(),
    brand: new Set<string>(),
    rating: new Set<string>(),
    reviews: new Set<string>(),
    display: new Set<string>(),
    processor: new Set<string>(),
    ram: new Set<string>(),
    storage: new Set<string>(),
    battery: new Set<string>(),
    camera: new Set<string>(),
    os: new Set<string>(),
    warranty: new Set<string>(),
    delivery: new Set<string>(),
    platform: new Set<string>(),
    savings: new Set<string>(),
  }

  if (compareEntries.length === 0) {
    return best
  }

  const specsById = new Map(compareEntries.map((entry) => [String(entry.product.id), entry.specs]))

  const minPrice = Math.min(...compareEntries.map((entry) => entry.specs.price))
  compareEntries.forEach((entry) => {
    if (entry.specs.price === minPrice) {
      best.price.add(String(entry.product.id))
    }
  })

  const maxRating = Math.max(...compareEntries.map((entry) => entry.specs.rating))
  compareEntries.forEach((entry) => {
    if (entry.specs.rating === maxRating) {
      best.rating.add(String(entry.product.id))
    }
  })

  const maxReviews = Math.max(...compareEntries.map((entry) => entry.specs.reviews))
  compareEntries.forEach((entry) => {
    if (entry.specs.reviews === maxReviews) {
      best.reviews.add(String(entry.product.id))
    }
  })

  const maxSavings = Math.max(...compareEntries.map((entry) => entry.specs.savings))
  compareEntries.forEach((entry) => {
    if (entry.specs.savings === maxSavings) {
      best.savings.add(String(entry.product.id))
    }
  })

  const deliveryDays = compareEntries.map((entry) => {
    const value = specsById.get(String(entry.product.id))?.delivery ?? ''
    const match = value.match(/(\d+)(?:\s*-\s*(\d+))?\s*days?/i)
    if (!match) {
      return { id: String(entry.product.id), days: Number.POSITIVE_INFINITY }
    }
    const low = Number.parseInt(match[1], 10)
    const high = match[2] ? Number.parseInt(match[2], 10) : low
    return { id: String(entry.product.id), days: Math.min(low, high) }
  })
  const minDelivery = Math.min(...deliveryDays.map((item) => item.days))
  deliveryDays.forEach((item) => {
    if (item.days === minDelivery) {
      best.delivery.add(item.id)
    }
  })

  return best
}

export default function ComparePageClient() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const filteredProducts = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase()
    return MOCK_PRODUCTS.filter((product) => {
      if (!query) {
        return true
      }
      return (product.name?.toLowerCase().includes(query) || false) || (product.brand?.toLowerCase().includes(query) || false)
    })
  }, [deferredSearchQuery])

  const productById = useMemo(() => {
    return new Map(MOCK_PRODUCTS.map((product) => [String(product.id), product]))
  }, [])

  const compareEntries = useMemo<CompareEntry[]>(() => {
    return selectedProducts
      .map((id) => {
        const product = productById.get(id)
        if (!product) {
          return null
        }

        return {
          product,
          specs: getProductSpecs(product),
        }
      })
      .filter((entry): entry is CompareEntry => entry !== null)
  }, [productById, selectedProducts])

  const bestIdsBySpec = useMemo(() => getBestIds(compareEntries), [compareEntries])

  const winnerScores = useMemo(() => {
    const scores: Record<string, number> = {}
    compareEntries.forEach(({ product }) => {
      scores[String(product.id)] = 0
    })

    ;(['price', 'rating', 'reviews', 'delivery', 'savings'] as SpecKey[]).forEach((spec) => {
      bestIdsBySpec[spec].forEach((id) => {
        scores[id] = (scores[id] ?? 0) + 1
      })
    })

    return scores
  }, [compareEntries, bestIdsBySpec])

  const topScore = useMemo(() => {
    const values = Object.values(winnerScores)
    return values.length ? Math.max(...values) : 0
  }, [winnerScores])

  const addProduct = (id: string) => {
    startTransition(() => {
      setSelectedProducts((current) => {
        if (current.includes(id) || current.length >= MAX_PRODUCTS) {
          return current
        }
        return [...current, id]
      })
    })
  }

  const removeProduct = (id: string) => {
    startTransition(() => {
      setSelectedProducts((current) => current.filter((item) => item !== id))
    })
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-black tracking-tighter">Compare Products</h1>
          <p className="text-muted mt-2">
            Compare up to 5 products across 15 specifications. Apple-to-apple comparison.
          </p>
          <div className="md:hidden mt-4 text-[10px] font-black uppercase tracking-widest text-skyline-primary flex items-center gap-2">
            <TrendingDown size={14} className="rotate-90" />
            ← Swipe to compare →
          </div>
          <span className="cb-badge cb-badge-blue mt-3">{selectedProducts.length}/5 products selected</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="cb-btn cb-btn-primary gap-2"
            onClick={() => {
              startTransition(() => {
                setShowSearch((value) => !value)
              })
            }}
          >
            <Plus size={16} />
            Add Product
            {selectedProducts.length > 0 ? ` (${selectedProducts.length}/5)` : ''}
          </button>

          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((id) => {
              const product = MOCK_PRODUCTS.find((item) => String(item.id) === id)
              if (!product) {
                return null
              }
              const shortName = product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name
              return (
                <span key={id} className="cb-badge cb-badge-blue flex items-center gap-2">
                  {shortName}
                  <button type="button" onClick={() => removeProduct(id)} aria-label={`Remove ${product.name}`}>
                    <X size={12} />
                  </button>
                </span>
              )
            })}
          </div>
        </div>

        {showSearch ? (
          <div className="cb-card mt-4 w-full p-4">
            <div className="relative mb-3">
              <Search size={14} className="text-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="cb-input w-full pl-9"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(event) => {
                  const nextQuery = event.target.value
                  startTransition(() => {
                    setSearchQuery(nextQuery)
                  })
                }}
              />
            </div>
            <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto md:grid-cols-4">
              {filteredProducts.slice(0, 20).map((product) => {
                const isSelected = selectedProducts.includes(String(product.id))
                return (
                  <div
                    key={product.id}
                    className={`cb-card p-3 ${isSelected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#039BE5]/50'}`}
                    onClick={() => {
                      if (isSelected) {
                        return
                      }
                      addProduct(String(product.id))
                      setShowSearch(false)
                    }}
                  >
                    <p className="line-clamp-1 text-xs font-bold">{product.name}</p>
                    <p className="text-muted text-xs">{product.brand}</p>
                    <p className="price-current text-xs">Rs{product.price.toLocaleString('en-IN')}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </section>

      {compareEntries.length === 0 ? (
        <section className="mx-auto my-8 max-w-lg px-6">
          <div className="cb-card p-16 text-center">
            <TrendingDown size={48} className="text-muted mx-auto mb-4" />
            <h2 className="text-xl font-black">Add Products to Compare</h2>
            <p className="text-muted mt-2">
              Click 'Add Product' and select up to 5 products to compare across 15 specifications.
            </p>
            <p className="text-muted mt-4 text-sm">
              Compare price · brand · specs · camera · battery · delivery · platform and more
            </p>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-6 pb-16 relative">
          <div className="absolute right-6 top-0 bottom-16 w-12 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none z-20 md:hidden" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="sticky top-0 z-10 bg-[var(--cb-bg)]">
                  <th className="sticky left-0 z-30 bg-white dark:bg-zinc-950 w-32 p-3 text-left text-xs font-black uppercase tracking-wider text-muted border-r border-zinc-100 dark:border-zinc-800">Spec</th>
                  {compareEntries.map(({ product }) => (
                    <th key={product.id} className="min-w-48 p-3 text-center align-top">
                      <div className="cb-card p-4 text-center">
                        <div className="relative mx-auto mb-2 h-32 w-32">
                          <Image
                            fill
                            className="rounded-lg object-cover"
                            src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)}
                            alt={product.name}
                            sizes="128px"
                          />
                        </div>
                        <p className="line-clamp-2 text-xs font-black">{product.name}</p>
                        <p className="text-muted text-xs">{product.brand}</p>
                        <p className="price-current mt-1 text-sm">Rs{product.price.toLocaleString('en-IN')}</p>
                        <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary mt-2 w-full gap-1 text-xs">
                          <ExternalLink size={10} />
                          Buy Now
                        </Link>
                        <button
                          type="button"
                          className="cb-btn cb-btn-ghost mt-1 w-full text-xs"
                          onClick={() => removeProduct(String(product.id))}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {SPEC_KEYS.map((spec, index) => {
                  const lowestPrice = spec.format === 'price'
                    ? Math.min(...compareEntries.map((entry) => entry.specs.price))
                    : 0

                  return (
                    <tr key={spec.key} className={index % 2 === 1 ? 'bg-[var(--cb-surface-2)]/30' : ''}>
                      <td className="sticky left-0 z-20 bg-white dark:bg-zinc-950 w-32 px-4 py-3 text-xs font-black uppercase tracking-wider text-muted border-r border-zinc-100 dark:border-zinc-800">{spec.label}</td>
                      {compareEntries.map(({ product, specs }) => {
                        const value = specs[spec.key]

                        const renderCell = (format: SpecFormat) => {
                          if (format === 'price') {
                            const isBestPrice = Number(value) === lowestPrice
                            return (
                              <div>
                                <p className={isBestPrice ? 'font-black text-[#10B981]' : ''}>
                                  Rs{Number(value).toLocaleString('en-IN')}
                                </p>
                                {isBestPrice ? <p className="text-xs font-black text-[#10B981]">✓ Best</p> : null}
                              </div>
                            )
                          }

                          if (format === 'stars') {
                            return <p className="text-[#F5C842]">{Number(value).toFixed(1)} ★</p>
                          }

                          if (format === 'number') {
                            return <p>{Number(value).toLocaleString('en-IN')}</p>
                          }

                          if (format === 'badge') {
                            return <span className={`cb-badge ${getPlatformClass(String(value))}`}>{String(value)}</span>
                          }

                          if (format === 'savings') {
                            return <span className="cb-badge cb-badge-green">Rs{Number(value).toLocaleString('en-IN')}</span>
                          }

                          return <p>{String(value)}</p>
                        }

                        return (
                          <td key={`${spec.key}-${product.id}`} className="px-4 py-3 text-center text-sm">
                            {renderCell(spec.format)}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                <tr className="border-t border-[var(--cb-border)]">
                  <td className="sticky left-0 z-20 bg-white dark:bg-zinc-950 px-4 py-4 text-xs font-black uppercase tracking-wider border-r border-zinc-100 dark:border-zinc-800">Best Deal</td>
                  {compareEntries.map(({ product }) => {
                    const id = String(product.id)
                    const isWinner = topScore > 0 && winnerScores[id] === topScore
                    return (
                      <td key={`winner-${product.id}`} className="px-4 py-4 text-center">
                        {isWinner ? (
                          <span className="cb-badge cb-badge-green inline-flex items-center gap-1">
                            <Check size={12} /> Best Choice
                          </span>
                        ) : (
                          <span className="cb-badge inline-flex items-center gap-1 text-muted">
                            <Minus size={12} /> Good Option
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}
