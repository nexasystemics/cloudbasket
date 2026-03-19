'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useMemo, useState, type CSSProperties, type JSX } from 'react'
import { CATALOG_PRODUCTS, type CategorySlug } from '@/lib/cloudbasket-data'
import { getIndiaCatalogBySlug } from '@/lib/india-catalog/utils'

type CategoryItem = {
  name: string
  slug: CategorySlug
  description: string
  color: string
  href: string
  Icon: () => JSX.Element
}

type CategoryCellProps = {
  category: CategoryItem
  isMobile: boolean
}

const ROW_PATTERN = [5, 4, 5, 4, 2] as const

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function chunkByPattern(items: CategoryItem[]): CategoryItem[][] {
  const rows: CategoryItem[][] = []
  let cursor = 0
  for (const limit of ROW_PATTERN) {
    if (cursor >= items.length) break
    rows.push(items.slice(cursor, cursor + limit))
    cursor += limit
  }
  if (cursor < items.length) rows.push(items.slice(cursor))
  return rows
}

function AutomotiveIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="3.5" stroke="currentColor" strokeWidth="2.4" />
      <path d="M24 10V20M38 24H28M10 24H20M15 15L21 21M33 15L27 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function BeautyIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="15" y="15" width="18" height="18" transform="rotate(45 24 24)" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  )
}
function BooksIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 13V35M24 16C20.5 14 16.5 13 12 13V33C16.5 33 20.5 34 24 36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 16C27.5 14 31.5 13 36 13V33C31.5 33 27.5 34 24 36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ElectronicsIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M26 8L13 27H23L22 40L35 21H25L26 8Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}
function FashionIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 28L24 15L36 28M16 32H32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 15V11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function FinanceIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2.4" />
      <path d="M19 17H30M20 22H30M21 17L27 31M18 31H29" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function GroceryIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M14 29C14 21 20 13 32 12C33 24 27 33 18 34" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 18C21 22 23 26 28 29" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function GamingIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="10" y="18" width="28" height="14" rx="7" stroke="currentColor" strokeWidth="2.4" />
      <path d="M18 23V27M16 25H20M30 24.5H30.01M33 25.5H33.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function HealthIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 14V34M14 24H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
function HomeIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 23L24 13L36 23V35H12V23Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M20 35V27H28V35" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function InvestmentsIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M12 33H36M16 33V26M24 33V22M32 33V18M16 20L22 16L27 19L35 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 12H35V16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function JewelleryIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 11L36 24L24 37L12 24L24 11Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18 18L24 24L30 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function KidsIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M25 11L34 20L29 22L27 31L20 24L13 22L25 11Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M21 27L18 33M29 20L34 17" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function LaptopsIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="12" y="13" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 33H40" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function MusicIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M28 13V30.5C28 33 26 35 23.5 35C21 35 19 33.5 19 31.5C19 29 21 27.5 23.5 27.5C24.7 27.5 25.8 27.9 26.6 28.5V16L35 14V27.5C35 30 33 32 30.5 32C28 32 26 30.5 26 28.5C26 26 28 24.5 30.5 24.5C31.7 24.5 32.8 24.9 33.6 25.5V14.5L28 16V13Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}
function CoursesIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M10 21L24 14L38 21L24 28L10 21Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 24V30C16 32.5 20 34.5 24 34.5C28 34.5 32 32.5 32 30V24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function PODIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M15 17L20 13H28L33 17L30 21V34H18V21L15 17Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M20 13V20H28V13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function SportsIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  )
}
function TravelIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M10 27L21 24L30 14L34 16L28 24L38 26L40 30L26 29L18 37L15 35L18 28L10 27Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}
function WatchesIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M19 9H29L30.5 14H17.5L19 9ZM19 39H29L30.5 34H17.5L19 39Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="2.4" />
      <path d="M24 24V19M24 24L28 26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

const CATEGORIES: readonly CategoryItem[] = [
  { name: 'Automotive', slug: 'automotive', description: 'Vehicle essentials', color: '#FF6B35', href: '/category/automotive', Icon: AutomotiveIcon },
  { name: 'Beauty & Care', slug: 'beauty', description: 'Glow and self-care', color: '#FF69B4', href: '/category/beauty', Icon: BeautyIcon },
  { name: 'Books', slug: 'books', description: 'Read and learn', color: '#A78BFA', href: '/category/books', Icon: BooksIcon },
  { name: 'Electronics', slug: 'electronics', description: 'Smart tech gear', color: '#039BE5', href: '/category/electronics', Icon: ElectronicsIcon },
  { name: 'Fashion', slug: 'fashion', description: 'Style picks', color: '#F472B6', href: '/category/fashion', Icon: FashionIcon },
  { name: 'Finance', slug: 'finance', description: 'Money and cards', color: '#10B981', href: '/category/finance', Icon: FinanceIcon },
  { name: 'Food & Grocery', slug: 'grocery', description: 'Daily kitchen needs', color: '#84CC16', href: '/category/food', Icon: GroceryIcon },
  { name: 'Gaming', slug: 'gaming', description: 'Consoles and games', color: '#C084FC', href: '/category/gaming', Icon: GamingIcon },
  { name: 'Health', slug: 'health', description: 'Wellness essentials', color: '#2DD4BF', href: '/category/health', Icon: HealthIcon },
  { name: 'Home & Kitchen', slug: 'home', description: 'Home must-haves', color: '#FBBF24', href: '/category/home', Icon: HomeIcon },
  { name: 'Investments', slug: 'investments', description: 'Grow your money', color: '#22C55E', href: '/category/investments', Icon: InvestmentsIcon },
  { name: 'Jewellery', slug: 'jewellery', description: 'Fine accessories', color: '#F5C842', href: '/category/jewellery', Icon: JewelleryIcon },
  { name: 'Kids & Toys', slug: 'toys', description: 'Playtime picks', color: '#FB923C', href: '/category/toys', Icon: KidsIcon },
  { name: 'Laptops & PCs', slug: 'laptops', description: 'Computing devices', color: '#94A3B8', href: '/category/laptops', Icon: LaptopsIcon },
  { name: 'Music', slug: 'music', description: 'Audio and instruments', color: '#F9A8D4', href: '/category/music', Icon: MusicIcon },
  { name: 'Online Courses', slug: 'courses', description: 'Learn new skills', color: '#818CF8', href: '/category/courses', Icon: CoursesIcon },
  { name: 'Print on Demand', slug: 'pod', description: 'Custom creations', color: '#F97316', href: '/pod', Icon: PODIcon },
  { name: 'Sports', slug: 'sports', description: 'Fitness and outdoors', color: '#EF4444', href: '/category/sports', Icon: SportsIcon },
  { name: 'Travel & Hotels', slug: 'travel', description: 'Trips and stays', color: '#38BDF8', href: '/category/travel', Icon: TravelIcon },
  { name: 'Watches', slug: 'watches', description: 'Timeless classics', color: '#CBD5E1', href: '/category/watches', Icon: WatchesIcon },
]

function CategoryCell({ category, isMobile }: CategoryCellProps): JSX.Element {
  const [hovered, setHovered] = useState(false)
  const baseCount = CATALOG_PRODUCTS.filter((p) => p.category === category.slug).length
  const indiaCount = getIndiaCatalogBySlug(category.slug).length
  const totalCount = baseCount + indiaCount

  const borderColor = hovered ? hexToRgba(category.color, 0.5) : hexToRgba(category.color, 0.19)
  const bgColor = hovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'
  const shadow = hovered ? `0 0 24px ${hexToRgba(category.color, 0.25)}` : 'none'
  const iconTransform = hovered ? 'scale(1.08)' : 'scale(1)'
  const style: CSSProperties = {
    borderColor,
    backgroundColor: bgColor,
    boxShadow: shadow,
    transform: hovered ? 'scale(1.06) translateY(-4px)' : 'scale(1) translateY(0)',
    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease',
  }

  return (
    <Link
      href={category.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
      className={`group relative flex flex-col items-center justify-center border text-center no-underline ${
        isMobile ? 'h-[112px] w-full rounded-xl px-2 py-3' : 'h-[138px] w-[160px] px-4'
      } ${isMobile ? '' : 'md:[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]'}`}
    >
      {totalCount > 0 && (
        <span 
          className="absolute top-2 right-4 md:right-6 rounded-full px-1.5 py-0.5 text-[8px] font-black text-white"
          style={{ backgroundColor: category.color }}
        >
          {totalCount}
        </span>
      )}
      <span
        className="mb-2 inline-flex h-10 w-10 items-center justify-center"
        style={{ color: category.color, transform: iconTransform, transition: 'transform 220ms ease, color 220ms ease' }}
      >
        <category.Icon />
      </span>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">{category.name}</p>
      <p className="mt-1 text-[10px] text-[#94A3B8]">{category.description}</p>
    </Link>
  )
}

export default function CategoriesHubClient(): JSX.Element {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const filtered = useMemo(
    () =>
      CATEGORIES.filter((category) =>
        `${category.name} ${category.description}`.toLowerCase().includes(normalized),
      ),
    [normalized],
  )

  const rows = useMemo(() => chunkByPattern(filtered), [filtered])

  return (
    <section className="min-h-screen bg-[#09090B] px-4 py-10 text-white md:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">Browse All Categories</h1>
          <p className="mt-3 text-sm text-[#94A3B8] md:text-base">20 categories · 8,000+ products · Zero hidden fees</p>
        </div>

        <div className="mx-auto mb-8 w-full max-w-2xl">
          <label htmlFor="category-search" className="mb-2 block text-center text-xs uppercase tracking-[0.12em] text-[#64748B]">
            Search Categories
          </label>
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              id="category-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search categories..."
              className="h-11 w-full rounded-xl border border-[#1E293B] bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#039BE5] focus:ring-2 focus:ring-[#039BE5]/25"
            />
          </div>
          <p className="mt-3 text-center text-xs text-[#94A3B8]">{filtered.length} of 20 categories</p>
        </div>

        <div className="hidden md:block">
          {rows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={`flex justify-center gap-5 ${rowIndex === 0 ? '' : '-mt-8'}`}>
              {row.map((category) => (
                <CategoryCell key={category.name} category={category} isMobile={false} />
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 md:hidden">
          {filtered.map((category) => (
            <CategoryCell key={`mobile-${category.name}`} category={category} isMobile />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#1E293B] bg-white/[0.03] px-4 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#CBD5E1] md:text-sm">
            20 Categories · 8K+ Products · 459 Links · ₹0 Fees
          </p>
        </div>
      </div>
    </section>
  )
}
