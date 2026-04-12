'use client'

import { useCallback, useMemo } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { MAIN_CATEGORIES } from '@/lib/constants'
import { SUB_CATEGORIES } from '@/lib/mock-data'
import { useGlobal } from '@/context/GlobalContext'

interface ProductFilterProps {
  search: string
  setSearch: (value: string) => void
  selectedMain: string
  setSelectedMain: (value: string) => void
  selectedSubs: string[]
  setSelectedSubs: (value: string[]) => void
  priceRange: number
  setPriceRange: (value: number) => void
  maxPrice: number
  onReset: () => void
}

type MainCategory = keyof typeof SUB_CATEGORIES

const ALL_CATEGORY = 'All'

const isMainCategory = (value: string): value is MainCategory => {
  return Object.prototype.hasOwnProperty.call(SUB_CATEGORIES, value)
}

export default function ProductFilter({
  search,
  setSearch,
  selectedMain,
  setSelectedMain,
  selectedSubs,
  setSelectedSubs,
  priceRange,
  setPriceRange,
  maxPrice,
  onReset,
}: ProductFilterProps) {
  const { formatPrice } = useGlobal()

  const categoryOptions = useMemo<string[]>(() => [ALL_CATEGORY, ...MAIN_CATEGORIES], [])

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setSearch(event.target.value)
    },
    [setSearch],
  )

  const handleClearSearch = useCallback((): void => {
    setSearch('')
  }, [setSearch])

  const handleCategoryClick = useCallback(
    (category: string): void => {
      setSelectedMain(category)
      setSelectedSubs([])
    },
    [setSelectedMain, setSelectedSubs],
  )

  const toggleSubCategory = useCallback(
    (subCategory: string): void => {
      if (selectedSubs.includes(subCategory)) {
        setSelectedSubs(selectedSubs.filter((value) => value !== subCategory))
        return
      }

      setSelectedSubs([...selectedSubs, subCategory])
    },
    [selectedSubs, setSelectedSubs],
  )

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setPriceRange(Number(event.target.value))
    },
    [setPriceRange],
  )

  const activeSubCategories = useMemo<string[]>(() => {
    if (!isMainCategory(selectedMain)) {
      return []
    }
    return SUB_CATEGORIES[selectedMain]
  }, [selectedMain])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-[var(--cb-text-muted)]" />
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Filters
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Search
        </label>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full rounded-button border cb-border bg-[var(--cb-surface-3)] dark:bg-zinc-800 dark:text-white py-2.5 pe-9 ps-9 text-sm text-[var(--cb-text-primary)] outline-none transition-colors focus:border-skyline-primary"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)] transition-colors hover:text-[var(--cb-text-primary)]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`rounded-pill px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition-colors ${
                selectedMain === category
                  ? 'bg-skyline-primary text-white dark:bg-skyline-primary/90 dark:text-white'
                  : 'cb-btn-ghost text-[var(--cb-text-muted)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedMain !== ALL_CATEGORY && activeSubCategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
            {selectedMain} Types
          </label>
          <div className="flex flex-col gap-2">
            {activeSubCategories.map((subCategory) => (
              <label key={subCategory} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSubs.includes(subCategory)}
                  onChange={() => toggleSubCategory(subCategory)}
                  className="h-4 w-4 [accent-color:var(--cb-primary)]"
                />
                <span className="text-[13px] text-[var(--cb-text-primary)]">{subCategory}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
          <span>Max Price</span>
          <span className="font-mono normal-case">{formatPrice(priceRange)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full [accent-color:var(--cb-primary)]"
        />
        <div className="flex items-center justify-between font-mono text-[11px] text-[var(--cb-text-muted)]">
          <span>₹0</span>
          <span>{formatPrice(maxPrice)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="cb-btn-ghost w-full justify-center gap-2 border-status-error/30 text-status-error"
      >
        <X size={14} />
        Reset Filters
      </button>
    </div>
  )
}
