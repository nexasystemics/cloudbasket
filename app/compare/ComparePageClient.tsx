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
  const [savedCompare, setSavedCompare] = useState<string[] | null>(null)
  const deferredSearchQuery = useDeferredValue(searchQuery)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cb_compare_list')
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setSavedCompare(parsed)
      }

      const preselect = localStorage.getItem('cb_compare_selected')
      if (preselect) {
        const parsed = JSON.parse(preselect) as string[]
        setSelectedProducts(parsed)
      }
    } catch {
      // no-op
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cb_compare_selected', JSON.stringify(selectedProducts))
    } catch {
      // no-op
    }
  }, [selectedProducts])

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

  const recommendations = useMemo(() => {
    if (selectedProducts.length === 0) {
      return MOCK_PRODUCTS.slice(0, 4)
    }

    const selected = new Set(selectedProducts)
    const selectedItems = MOCK_PRODUCTS.filter((product) => selected.has(String(product.id)))
    const categories = new Set(selectedItems.map((item) => item.mainCategory))
    const avgPrice = Math.round(
      selectedItems.reduce((sum, item) => sum + item.price, 0) / Math.max(1, selectedItems.length),
    )

    return MOCK_PRODUCTS
      .filter((product) => !selected.has(String(product.id)))
      .map((product) => ({
        product,
        score:
          (categories.has(product.mainCategory) ? 30 : 0) +
          Math.max(0, 30 - Math.abs(product.price - avgPrice) / 1000) +
          (product.rating ?? 4) * 5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product)
  }, [selectedProducts])

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
          <div className="md:hidden mt-4 text-[10px] font-black uppercase tracking-widest text-skyline-primary flex items-center gap-3">
            <div className="flex items-center gap-1 animate-pulse">
              <TrendingDown size={14} className="rotate-90" />
              <span>Swipe horizontally to compare</span>
              <div className="flex gap-1 ml-1">
                <span className="animate-[bounce_1s_infinite] inline-block">←</span>
                <span className="animate-[bounce_1s_infinite_0.2s] inline-block">→</span>
              </div>
            </div>
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
            aria-expanded={showSearch}
            aria-controls="product-search-panel"
          >
            <Plus size={16} />
            Add Product
            {selectedProducts.length > 0 ? ` (${selectedProducts.length}/5)` : ''}
          </button>

          <div className="flex flex-wrap gap-2" aria-label="Selected products">
            {selectedProducts.map((id) => {
              const product = MOCK_PRODUCTS.find((item) => String(item.id) === id)
              if (!product) {
                return null
              }
              const shortName = product.name.length > 20 ? `${product.name.slice(0, 20)}...` : product.name
              return (
                <span key={id} className="cb-badge cb-badge-blue flex items-center gap-2">
                  {shortName}
                  <button 
                    type="button" 
                    onClick={() => removeProduct(id)} 
                    aria-label={`Remove ${product.name} from comparison`}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="cb-btn cb-btn-primary text-xs"
              onClick={() => {
                try {
                  localStorage.setItem('cb_compare_list', JSON.stringify(selectedProducts))
                  setSavedCompare(selectedProducts.length ? selectedProducts : null)
                } catch {
                  // no-op
                }
              }}
            >
              Save compare list
            </button>

            {savedCompare && savedCompare.length > 0 ? (
              <button
                type="button"
                className="cb-btn cb-btn-ghost text-xs"
                onClick={() => setSelectedProducts(savedCompare)}
              >
                Load saved compare
              </button>
            ) : null}
          </div>
        </div>

        {showSearch ? (
          <div id="product-search-panel" className="cb-card mt-4 w-full p-4 animate-fade-up">
            <div className="relative mb-3">
              <Search size={14} className="text-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="cb-input w-full pl-9"
                placeholder="Search products to add..."
                value={searchQuery}
                aria-label="Search products"
                onChange={(event) => {
                  const nextQuery = event.target.value
                  startTransition(() => {
                    setSearchQuery(nextQuery)
                  })
                }}
              />
            </div>
            <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto md:grid-cols-4 custom-scrollbar">
              {filteredProducts.slice(0, 20).map((product) => {
                const isSelected = selectedProducts.includes(String(product.id))
                return (
                  <div
                    key={product.id}
                    role="button"
                    tabIndex={isSelected ? -1 : 0}
                    className={`cb-card p-3 ${isSelected ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#039BE5]/50 active:scale-95'}`}
                    onClick={() => {
                      if (isSelected) {
                        return
                      }
                      addProduct(String(product.id))
                      setShowSearch(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (isSelected) return;
                        addProduct(String(product.id))
                        setShowSearch(false)
                      }
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
          {/* Mobile Scroll Indicators */}
          <div className="absolute right-6 top-0 bottom-16 w-12 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none z-20 md:hidden" />
          <div className="absolute left-[152px] top-0 bottom-16 w-8 bg-gradient-to-r from-black/5 dark:from-black/20 to-transparent pointer-events-none z-20 md:hidden" />
          
          <div className="overflow-x-auto custom-scrollbar shadow-sm rounded-xl">
            <table className="w-full border-collapse" aria-label="Product comparison table">
              <thead>
                <tr className="sticky top-0 z-10 bg-[var(--cb-bg)]">
                  <th scope="col" className="sticky left-0 z-30 bg-white dark:bg-zinc-950 w-32 p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted border-r border-zinc-100 dark:border-zinc-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                    Specification
                  </th>
                  {compareEntries.map(({ product }) => (
                    <th key={product.id} scope="col" className="min-w-56 p-4 text-center align-top">
                      <div className="cb-card p-4 text-center hover:scale-[1.02] transition-transform">
                        <div className="relative mx-auto mb-3 h-32 w-32 grayscale-[0.2] hover:grayscale-0 transition-all">
                          <Image
                            fill
                            className="rounded-lg object-cover"
                            src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)}
                            alt={product.name}
                            sizes="128px"
                          />
                        </div>
                        <p className="line-clamp-2 text-[11px] font-black leading-tight h-8 mb-1">{product.name}</p>
                        <p className="text-muted text-[10px] uppercase tracking-widest font-bold mb-1">{product.brand}</p>
                        <p className="price-current mt-1 text-base">Rs{product.price.toLocaleString('en-IN')}</p>
                        <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary mt-3 w-full gap-2 text-[10px] uppercase tracking-widest py-2">
                          <ExternalLink size={12} />
                          View Deal
                        </Link>
                        <button
                          type="button"
                          className="cb-btn cb-btn-ghost mt-2 w-full text-[9px] uppercase tracking-widest py-1 h-8 opacity-70 hover:opacity-100"
                          onClick={() => removeProduct(String(product.id))}
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {SPEC_KEYS.map((spec, index) => {
                  const lowestPrice = spec.format === 'price'
                    ? Math.min(...compareEntries.map((entry) => entry.specs.price))
                    : 0

                  return (
                    <tr key={spec.key} className={index % 2 === 1 ? 'bg-[var(--cb-surface-2)]/40' : 'bg-white/50 dark:bg-zinc-950/50'}>
                      <td className="sticky left-0 z-20 bg-white dark:bg-zinc-950 w-32 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-muted border-r border-zinc-100 dark:border-zinc-800 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                        {spec.label}
                      </td>
                      {compareEntries.map(({ product, specs }) => {
                        const value = specs[spec.key]

                        const renderCell = (format: SpecFormat) => {
                          if (format === 'price') {
                            const isBestPrice = Number(value) === lowestPrice
                            return (
                              <div className="flex flex-col items-center justify-center">
                                <p className={`text-sm ${isBestPrice ? 'font-black text-status-success scale-110' : 'font-bold'}`}>
                                  Rs{Number(value).toLocaleString('en-IN')}
                                </p>
                                {isBestPrice ? (
                                  <span className="mt-1 px-1.5 py-0.5 rounded bg-status-success/10 text-[8px] font-black text-status-success uppercase tracking-widest">
                                    Best Value
                                  </span>
                                ) : null}
                              </div>
                            )
                          }

                          if (format === 'stars') {
                            return (
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-status-warning font-black">{Number(value).toFixed(1)}</span>
                                <span className="text-status-warning">★</span>
                              </div>
                            )
                          }

                          if (format === 'number') {
                            return <p className="font-bold">{Number(value).toLocaleString('en-IN')}</p>
                          }

                          if (format === 'badge') {
                            return <span className={`cb-badge ${getPlatformClass(String(value))} text-[9px]`}>{String(value)}</span>
                          }

                          if (format === 'savings') {
                            return (
                              <span className="cb-badge cb-badge-green text-[9px] font-black">
                                Save Rs{Number(value).toLocaleString('en-IN')}
                              </span>
                            )
                          }

                          return <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{String(value)}</p>
                        }

                        return (
                          <td key={`${spec.key}-${product.id}`} className="px-4 py-5 text-center text-sm">
                            {renderCell(spec.format)}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}

                <tr className="border-t-2 border-[var(--cb-border)]">
                  <td className="sticky left-0 z-20 bg-[var(--cb-surface-2)] dark:bg-zinc-900 w-32 px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] border-r border-zinc-200 dark:border-zinc-800 shadow-[2px_0_10px_rgba(0,0,0,0.1)]">
                    Verdict
                  </td>
                  {compareEntries.map(({ product }) => {
                    const id = String(product.id)
                    const isWinner = topScore > 0 && winnerScores[id] === topScore
                    return (
                      <td key={`winner-${product.id}`} className="px-4 py-6 text-center bg-[var(--cb-surface-2)]/30 dark:bg-zinc-900/30">
                        {isWinner ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="cb-badge cb-badge-green px-3 py-1.5 rounded-lg border-2 border-status-success/30 shadow-lg shadow-status-success/10 scale-110 animate-pulse-glow">
                              <Check size={14} className="stroke-[3px]" /> Recommended
                            </span>
                            <p className="text-[9px] font-black uppercase tracking-widest text-status-success">Top rated specs</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 opacity-60">
                            <span className="cb-badge inline-flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-none">
                              <Minus size={12} /> Solid Choice
                            </span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {recommendations.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 pb-16">
            <h2 className="mb-4 text-2xl font-black">Recommended For You</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((product) => (
                <article key={product.id} className="cb-card overflow-hidden">
                  <div className="relative h-36">
                    <Image src={product.image || ''} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-bold">{product.name}</p>
                    <p className="text-xs text-[var(--cb-text-muted)]">{product.brand}</p>
                    <p className="price-current mt-2">₹{product.price.toLocaleString('en-IN')}</p>
                    <Link href={`/product/${product.id}`} className="cb-btn cb-btn-ghost mt-3 text-xs">
                      View Product
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      )}
    </main>
  )
}
