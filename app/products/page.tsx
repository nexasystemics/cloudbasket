'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import ProductFilter from '@/components/products/ProductFilter'
import ProductGrid from '@/components/products/ProductGrid'
import PromotionSidebar from '@/components/products/PromotionSidebar'
import { MAIN_CATEGORIES, PAGINATION, ROUTES } from '@/lib/constants'
import { PRODUCTS, SUB_CATEGORIES } from '@/lib/mock-data'
import type { PaginatedResponse, Product } from '@/lib/types'

const MAX_PRICE = 100000
const PAGE_WINDOW = 5
const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 100] as const
const ALL_CATEGORY = 'All'

type MainCategory = (typeof MAIN_CATEGORIES)[number]

const isMainCategory = (value: string): value is MainCategory => {
  return (MAIN_CATEGORIES as readonly string[]).includes(value)
}

const buildVisiblePages = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= PAGE_WINDOW) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const halfWindow = Math.floor(PAGE_WINDOW / 2)
  let start = Math.max(1, currentPage - halfWindow)
  let end = Math.min(totalPages, start + PAGE_WINDOW - 1)
  start = Math.max(1, end - PAGE_WINDOW + 1)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function ProductsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState<string>('')
  const [selectedMain, setSelectedMain] = useState<string>(ALL_CATEGORY)
  const [selectedSubs, setSelectedSubs] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number>(MAX_PRICE)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGINATION.DEFAULT_PAGE_SIZE)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true

    const query = searchParams.get('q') ?? ''
    const mainCategoryParam = searchParams.get('mainCategory') ?? ALL_CATEGORY
    const pageParam = Number(searchParams.get('page') ?? '1')

    const nextMainCategory =
      mainCategoryParam === ALL_CATEGORY || isMainCategory(mainCategoryParam)
        ? mainCategoryParam
        : ALL_CATEGORY

    const parsedSubCategories = (searchParams.get('subCategory') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)

    const allowedSubCategories =
      nextMainCategory === ALL_CATEGORY ? [] : SUB_CATEGORIES[nextMainCategory]

    const nextSelectedSubs =
      nextMainCategory === ALL_CATEGORY
        ? []
        : parsedSubCategories.filter((subCategory) => allowedSubCategories.includes(subCategory))

    const safePage = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1

    if (isMounted) {
      setSearch(query)
      setSelectedMain(nextMainCategory)
      setSelectedSubs(nextSelectedSubs)
      setCurrentPage(safePage)
    }

    return () => {
      isMounted = false
    }
  }, [searchParams])

  const filteredProducts = useMemo<Product[]>(() => {
    const normalizedQuery = search.trim().toLowerCase()

    return PRODUCTS.filter((product) => {
      if (product.status !== 'Approved') {
        return false
      }

      if (
        normalizedQuery.length > 0 &&
        !product.name.toLowerCase().includes(normalizedQuery) &&
        !product.description.toLowerCase().includes(normalizedQuery)
      ) {
        return false
      }

      if (selectedMain !== ALL_CATEGORY && product.mainCategory !== selectedMain) {
        return false
      }

      if (selectedSubs.length > 0 && !selectedSubs.includes(product.subCategory)) {
        return false
      }

      if (product.price > priceRange) {
        return false
      }

      return true
    })
  }, [priceRange, search, selectedMain, selectedSubs])

  const totalPages = useMemo<number>(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  }, [filteredProducts.length, itemsPerPage])

  const paginationState = useMemo<PaginatedResponse<Product>>(() => {
    const normalizedPage = Math.min(Math.max(currentPage, 1), totalPages)
    const startIndex = (normalizedPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    return {
      data: filteredProducts.slice(startIndex, endIndex),
      total: filteredProducts.length,
      page: normalizedPage,
      pageSize: itemsPerPage,
      totalPages,
    }
  }, [currentPage, filteredProducts, itemsPerPage, totalPages])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const buildQueryString = useCallback(
    (page: number): string => {
      const params = new URLSearchParams()

      if (search.trim().length > 0) {
        params.set('q', search.trim())
      }

      if (selectedMain !== ALL_CATEGORY) {
        params.set('mainCategory', selectedMain)
      }

      if (selectedMain !== ALL_CATEGORY && selectedSubs.length > 0) {
        params.set('subCategory', selectedSubs.join(','))
      }

      if (page > 1) {
        params.set('page', String(page))
      }

      return params.toString()
    },
    [search, selectedMain, selectedSubs],
  )

  const handlePageChange = useCallback(
    (nextPage: number): void => {
      const boundedPage = Math.min(Math.max(nextPage, 1), totalPages)
      setCurrentPage(boundedPage)

      const queryString = buildQueryString(boundedPage)
      const destination = queryString.length > 0 ? `${ROUTES.PRODUCTS}?${queryString}` : ROUTES.PRODUCTS
      router.push(destination)
    },
    [buildQueryString, router, totalPages],
  )

  const resetFilters = useCallback((): void => {
    setSearch('')
    setSelectedMain(ALL_CATEGORY)
    setSelectedSubs([])
    setPriceRange(MAX_PRICE)
    setCurrentPage(1)
    setItemsPerPage(PAGINATION.DEFAULT_PAGE_SIZE)
    setIsMobileFilterOpen(false)
    router.push(ROUTES.PRODUCTS)
  }, [router])

  const visiblePages = useMemo<number[]>(() => {
    return buildVisiblePages(paginationState.page, paginationState.totalPages)
  }, [paginationState.page, paginationState.totalPages])

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <section className="mx-auto flex w-full max-w-[1800px] items-end justify-between px-6 py-8">
        <div>
          <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
            Marketplace
          </h2>
          <p className="text-sm text-[var(--cb-text-muted)]">{paginationState.total} verified deals</p>
        </div>
        <p className="text-xs text-[var(--cb-text-muted)]">Sort: Popularity</p>
      </section>

      <section className="mx-auto flex w-full max-w-[1800px]">
        <aside className="glass-sidebar hidden w-64 shrink-0 px-6 py-8 lg:block">
          <div className="custom-scrollbar sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
            <ProductFilter
              search={search}
              setSearch={setSearch}
              selectedMain={selectedMain}
              setSelectedMain={setSelectedMain}
              selectedSubs={selectedSubs}
              setSelectedSubs={setSelectedSubs}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={MAX_PRICE}
              onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="sticky top-[56px] z-40 flex items-center justify-between border-b cb-border bg-[var(--cb-surface)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen((state) => !state)}
            className="cb-btn-ghost gap-2 px-3 py-2 text-xs"
          >
            <Filter size={14} />
            {isMobileFilterOpen ? 'Close' : 'Filters'}
          </button>
          <span className="font-mono text-[11px] text-[var(--cb-text-muted)]">{paginationState.total} results</span>
        </div>

        {isMobileFilterOpen && (
          <div className="border-b cb-border bg-[var(--cb-surface-2)] p-6 lg:hidden">
            <ProductFilter
              search={search}
              setSearch={setSearch}
              selectedMain={selectedMain}
              setSelectedMain={setSelectedMain}
              selectedSubs={selectedSubs}
              setSelectedSubs={setSelectedSubs}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={MAX_PRICE}
              onReset={resetFilters}
            />
          </div>
        )}

        <main className="flex-1 px-6 py-8 lg:px-10">
          <ProductGrid products={paginationState.data} onReset={resetFilters} />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={paginationState.page === 1}
              onClick={() => handlePageChange(paginationState.page - 1)}
              className="cb-btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>

            {visiblePages.map((page) => (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`cb-btn-ghost min-w-[38px] justify-center ${
                  page === paginationState.page ? 'border-skyline-primary bg-skyline-primary text-white' : ''
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={paginationState.page === paginationState.totalPages}
              onClick={() => handlePageChange(paginationState.page + 1)}
              className="cb-btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

            <label className="ms-2 flex items-center gap-2 text-[11px] text-[var(--cb-text-muted)]">
              <span>Items:</span>
              <select
                value={itemsPerPage}
                onChange={(event) => {
                  const nextValue = Number(event.target.value)
                  setItemsPerPage(nextValue)
                  setCurrentPage(1)
                }}
                className="rounded-button border cb-border bg-[var(--cb-surface)] px-2 py-1 text-[11px] text-[var(--cb-text-primary)] outline-none"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </main>

        <aside className="glass-sidebar-right hidden w-56 shrink-0 px-4 py-8 xl:block">
          <div className="custom-scrollbar sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
            <PromotionSidebar selectedCategory={selectedMain} />
          </div>
        </aside>
      </section>
    </div>
  )
}

function ProductsPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cb-surface)]">
      <p className="text-sm text-[var(--cb-text-muted)]">Loading marketplace...</p>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}
