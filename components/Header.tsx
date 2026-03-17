'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Shield,
  Zap,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import type { CountryCode } from '@/lib/types'

type DropdownItem = {
  label: string
  href: string
  icon: LucideIcon
}

type NavigationItem = {
  id: 'products' | 'categories' | 'deals' | 'pod' | 'compare' | 'blog' | 'quiz'
  label: string
  href: string
  dropdown: DropdownItem[]
}

const PROMO_TICKER_ITEMS: readonly string[] = [
  ' Flash Sale: Up to 70% off Mobiles',
  '⚡ CJ Exclusive: Global deals in INR',
  '️ DPDPA 2023 Compliant — Your data is safe',
  ' 50+ stores compared in real-time',
]

const COUNTRY_OPTIONS: ReadonlyArray<{ value: CountryCode; label: string }> = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'Europe' },
  { value: 'GB', label: 'United Kingdom' },
]

const DEAL_DROPDOWN: readonly DropdownItem[] = [
  { label: 'Flash Sales', href: '/deals/flash', icon: Zap },
  { label: 'Top Offers', href: ROUTES.DEALS, icon: TrendingDown },
  { label: 'CJ Network', href: '/cj', icon: Globe },
]

const POD_DROPDOWN: readonly DropdownItem[] = [
  { label: '👕 T-Shirts', href: '/pod/tshirts', icon: Zap },
  { label: '☕ Mugs', href: '/pod/mugs', icon: TrendingDown },
  { label: '📱 Phone Cases', href: '/pod/phone-cases', icon: Shield },
  { label: '💼 Laptop Bags', href: '/pod/laptop-bags', icon: Globe },
  { label: '👜 Tote Bags', href: '/pod/tote-bags', icon: Globe },
  { label: '🧥 Hoodies', href: '/pod/hoodies', icon: Globe },
]

const CATEGORY_EMOJI: Record<string, string> = {
  'Mobiles': '📱', 'Laptops': '💻', 'Fashion': '👗', 'Home': '🏠',
  'Beauty': '💄', 'Sports': '⚽', 'Books': '📚', 'Toys': '🧸',
  'Gaming': '🎮', 'Health': '💊', 'Travel': '✈️', 'Grocery': '🛒',
  'Automotive': '🚗', 'Appliances': '🔌', 'Furniture': '🪑',
  'Baby': '👶', 'Pets': '🐾', 'Garden': '🌿', 'Office': '🖨️',
  'Cameras': '📷', 'Audio': '🎧',
}

const PROMO_DISMISS_KEY = 'cb-promo-dismissed'

export default function Header(): JSX.Element {
  const pathname = usePathname()
  const router = useRouter()
  const { country, setCountry, user } = useGlobal()
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState<boolean>(false)
  const [promoDismissed, setPromoDismissed] = useState<boolean>(false)
  const [promoIndex, setPromoIndex] = useState<number>(0)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [searchOpen, setSearchOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeDropdown, setActiveDropdown] = useState<NavigationItem['id'] | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)

  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownTimeoutRef = useRef<number | null>(null)

  const navItems: readonly NavigationItem[] = [

    {

      id: 'products',

      label: 'Products',

      href: ROUTES.PRODUCTS,

      dropdown: MAIN_CATEGORIES.map((category) => ({

        label: `${CATEGORY_EMOJI[category] ?? "🛍️"} ${category}`,
        href: `/category/${encodeURIComponent(category.toLowerCase())}`,
        icon: Globe,

      })),

    },

    {

      id: 'deals',

      label: 'Deals',

      href: ROUTES.DEALS,

      dropdown: [...DEAL_DROPDOWN],

    },

    { id: 'categories', label: 'Categories', href: ROUTES.CATEGORIES, dropdown: [] },

    {
      id: 'pod',
      label: 'POD',
      href: ROUTES.POD,
      dropdown: [...POD_DROPDOWN],
    },
    { id: 'quiz', label: '🧠 Deal Quiz', href: '/quiz', dropdown: [] },
    { id: 'compare', label: 'Compare', href: ROUTES.COMPARE, dropdown: [] },
    { id: 'blog', label: 'Blog', href: ROUTES.BLOG, dropdown: [] },
  ]
  useEffect(() => {
    setMounted(true)
    const dismissed = window.localStorage.getItem(PROMO_DISMISS_KEY)
    setPromoDismissed(dismissed === 'true')
  }, [])

  useEffect(() => {
    if (promoDismissed) {
      return
    }
    const interval = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % PROMO_TICKER_ITEMS.length)
    }, 3000)

    return () => {
      window.clearInterval(interval)
    }
  }, [promoDismissed])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus()
    }
  }, [searchOpen])

  const clearDropdownTimer = useCallback(() => {
    if (dropdownTimeoutRef.current !== null) {
      window.clearTimeout(dropdownTimeoutRef.current)
      dropdownTimeoutRef.current = null
    }
  }, [])

  const handleDropdownEnter = useCallback(
    (itemId: NavigationItem['id']) => {
      clearDropdownTimer()
      setActiveDropdown(itemId)
    },
    [clearDropdownTimer],
  )

  const handleDropdownLeave = useCallback(() => {
    clearDropdownTimer()
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }, [clearDropdownTimer])

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const query = searchQuery.trim()
      if (query.length === 0) {
        return
      }
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setSearchOpen(false)
    },
    [router, searchQuery],
  )

  const handlePromoDismiss = useCallback(() => {
    setPromoDismissed(true)
    window.localStorage.setItem(PROMO_DISMISS_KEY, 'true')
  }, [])

  const handleCountryChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setCountry(event.target.value as CountryCode)
    },
    [setCountry],
  )

  const toggleTheme = useCallback(() => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
      return
    }
    setTheme('dark')
  }, [resolvedTheme, setTheme])

  const authRoute = user?.role === 'Admin' ? ROUTES.ADMIN : ROUTES.LOGIN
  const authLabel = user?.role === 'Admin' ? 'Admin' : 'Sign In'
  const selectedCountry: CountryCode = mounted ? country : 'IN'

  const isItemActive = useCallback(
    (href: string): boolean => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  )

  return (
    <header className={`glass-header ${scrolled ? 'scrolled' : ''}`}>
      {!promoDismissed ? (
        <div className="promo-ticker flex h-8 items-center">
          <div className="mx-auto flex h-8 w-full max-w-7xl items-center justify-between px-3 lg:px-6">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] md:text-xs">
              <span key={promoIndex} className="inline-flex items-center gap-2 animate-fade-up">
                <Zap size={12} />
                {PROMO_TICKER_ITEMS[promoIndex]}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePromoDismiss}
              className="ms-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label="Dismiss promo ticker"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-3 lg:h-16 lg:px-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <div className="w-8 h-8 bg-[#039BE5] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs">CB</span>
          </div>
          <span className="font-black text-lg tracking-tight whitespace-nowrap hidden sm:block">
            <span className="text-[#039BE5]">Cloud</span>
            <span className="text-[var(--cb-text-primary)]">Basket</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const hasDropdown = item.dropdown.length > 0
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.id)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isItemActive(item.href)
                      ? 'font-bold text-skyline-primary'
                      : 'font-medium text-[var(--cb-text-secondary)] hover:text-[var(--cb-text-primary)]'
                  }`}
                >
                  {item.label}
                  {hasDropdown ? <ChevronDown size={14} /> : null}
                </Link>

                {hasDropdown ? (
                  <div className={`cb-dropdown ${activeDropdown === item.id ? 'open' : ''}`}>
                    {item.dropdown.map((entry) => {
                      const ItemIcon = entry.icon
                      return (
                        <Link
                          key={entry.href}
                          href={entry.href}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--cb-text-secondary)] hover:bg-[var(--cb-surface-2)] hover:text-[var(--cb-text-primary)]"
                        >
                          <ItemIcon size={14} />
                          <span>{entry.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <button
              type="button"
              onClick={() => setSearchOpen((current) => !current)}
              className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label="Toggle search"
            >
              <Search size={15} className="text-[var(--cb-text-secondary)]" />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                searchOpen ? 'ms-2 w-[220px] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                type="search"
                placeholder="Search deals"
                className="cb-input h-9"
                aria-label="Search"
              />
            </div>
          </form>

          <label className="glass-panel flex h-9 items-center gap-1 rounded-lg px-2 text-[11px]">
            <Globe size={13} className="text-[var(--cb-text-muted)]" />
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="bg-transparent text-[11px] font-semibold text-[var(--cb-text-primary)] outline-none"
              aria-label="Select country"
            >
              {COUNTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={toggleTheme}
            className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link href={authRoute} className="cb-btn-primary inline-flex h-9 items-center gap-1 px-3 text-xs">
            {user?.role === 'Admin' ? <Shield size={13} /> : null}
            {authLabel}
          </Link>
        </div>

        <button
          type="button"
          className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-expanded={mobileOpen}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[90] bg-black/45 transition-opacity duration-200 lg:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="h-full w-full bg-[var(--cb-surface)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-xl font-black">Menu</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="glass-panel inline-flex h-9 w-9 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              placeholder="Search products, deals"
              className="cb-input"
              aria-label="Search mobile"
            />
          </form>

          <div className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-[var(--cb-border)] p-2">
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--cb-text-primary)]"
                >
                  {item.label}
                </Link>
                {item.dropdown.length > 0 ? (
                  <div className="mt-1 grid grid-cols-1 gap-1 px-2 pb-1">
                    {item.dropdown.map((entry) => (
                      <Link
                        key={`${item.id}-${entry.href}`}
                        href={entry.href}
                        className="rounded-md px-2 py-1 text-xs text-[var(--cb-text-secondary)] hover:bg-[var(--cb-surface-2)]"
                      >
                        {entry.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <label className="glass-panel flex h-10 flex-1 items-center gap-2 rounded-lg px-3">
              <Globe size={14} className="text-[var(--cb-text-muted)]" />
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Select country mobile"
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={`mobile-${option.value}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={toggleTheme}
              className="glass-panel inline-flex h-10 w-10 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              aria-label="Toggle theme mobile"
            >
              {mounted && resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <Link href={authRoute} className="cb-btn-primary mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm">
            {user?.role === 'Admin' ? <Shield size={15} /> : null}
            {authLabel}
          </Link>
        </div>
      </div>
    </header>
  )
}









