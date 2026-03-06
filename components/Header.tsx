'use client'

import { useCallback, useEffect, useMemo, useState, type JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Globe, Menu, Moon, Search, Shield, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useGlobal } from '@/context/GlobalContext'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import type { CountryCode, NavItem } from '@/lib/types'

const productCategories = MAIN_CATEGORIES.slice(0, 5)

const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'products',
    label: 'Products',
    href: ROUTES.PRODUCTS,
    dropdown: productCategories.map((category) => ({
      label: category,
      href: `/category/${encodeURIComponent(category.toLowerCase())}`,
    })),
  },
  {
    id: 'deals',
    label: 'Deals',
    href: ROUTES.DEALS,
    dropdown: [
      { label: 'Flash Sales', href: '/deals/flash' },
      { label: 'Top Offers', href: ROUTES.DEALS },
      { label: 'CJ Network', href: '/cj' },
    ],
  },
  {
    id: 'pod',
    label: 'POD',
    href: ROUTES.POD,
    dropdown: [
      { label: 'T-Shirts', href: '/pod/tshirts' },
      { label: 'Mugs', href: '/pod/mugs' },
      { label: 'Phone Cases', href: '/pod/phone-cases' },
    ],
  },
  { id: 'compare', label: 'Compare', href: ROUTES.COMPARE, dropdown: [] },
  { id: 'blog', label: 'Blog', href: ROUTES.BLOG, dropdown: [] },
]

const COUNTRY_OPTIONS: ReadonlyArray<{ value: CountryCode; label: string }> = [
  { value: 'IN', label: 'IN India' },
  { value: 'US', label: 'US USA' },
  { value: 'EU', label: 'EU Europe' },
  { value: 'GB', label: 'GB UK' },
]

function ThemeToggle(): JSX.Element | null {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="glass-panel grid h-9 w-9 place-items-center rounded-button"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
    </button>
  )
}

function CurrencySelector(): JSX.Element {
  const { country, setCountry } = useGlobal()

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextCountry = event.target.value as CountryCode
      setCountry(nextCountry)
    },
    [setCountry],
  )

  return (
    <label className="glass-panel flex h-9 items-center gap-1 rounded-button px-2 text-[11px]">
      <Globe className="h-3.5 w-3.5 text-[var(--cb-text-secondary)]" />
      <select
        aria-label="Select country"
        value={country}
        onChange={handleChange}
        className="bg-transparent font-mono text-[11px] text-[var(--cb-text-primary)] outline-none"
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-[var(--cb-surface)] text-[var(--cb-text-primary)]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function SearchBar({ compact }: { compact?: boolean }): JSX.Element {
  const router = useRouter()
  const [query, setQuery] = useState<string>('')

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const normalizedQuery = query.trim()
      if (normalizedQuery.length === 0) {
        return
      }
      router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`)
    },
    [query, router],
  )

  return (
    <form onSubmit={handleSubmit} className={compact ? 'w-full' : 'min-w-72'} role="search">
      <div className="glass-panel flex h-9 items-center gap-2 rounded-button px-3">
        <Search className="h-4 w-4 shrink-0 text-[var(--cb-text-muted)]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          type="search"
          placeholder="Search products, deals..."
          className="w-full bg-transparent text-sm text-[var(--cb-text-primary)] outline-none placeholder:text-[var(--cb-text-muted)]"
          aria-label="Search products"
        />
      </div>
    </form>
  )
}

export default function Header(): JSX.Element {
  const pathname = usePathname()
  const { user } = useGlobal()
  const { resolvedTheme } = useTheme()

  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [logoReady, setLogoReady] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setLogoReady(true)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  const logoSource = useMemo(() => {
    if (!logoReady) {
      return '/brand/logo-full.svg'
    }
    return resolvedTheme === 'dark' ? '/brand/logo-full-dark.svg' : '/brand/logo-full.svg'
  }, [logoReady, resolvedTheme])

  const authRoute = user?.role === 'Admin' ? ROUTES.ADMIN : ROUTES.LOGIN
  const authLabel = user?.role === 'Admin' ? 'Admin' : 'Sign In'

  return (
    <header className={`glass-header ${scrolled ? 'shadow-glass' : ''}`}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:h-16 lg:px-6">
        <Link href={ROUTES.HOME} className="inline-flex items-center">
          <Image src={logoSource} alt="CloudBasket" width={140} height={36} priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const hasDropdown = item.dropdown.length > 0
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown((current) => (current === item.id ? null : current))}
              >
                <Link
                  href={item.href}
                  className={`inline-flex items-center gap-1 rounded-button px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'text-skyline-primary' : 'text-[var(--cb-text-secondary)] hover:text-[var(--cb-text-primary)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {hasDropdown ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                </Link>
                {hasDropdown ? (
                  <div
                    className={`glass-panel absolute [inset-inline-start:0] top-[calc(100%+8px)] z-[100] min-w-48 rounded-card p-2 transition-all duration-200 ${
                      activeDropdown === item.id
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    {item.dropdown.map((entry) => (
                      <Link
                        key={entry.href}
                        href={entry.href}
                        className="block rounded-button px-3 py-2 text-sm text-[var(--cb-text-secondary)] transition-colors hover:bg-[var(--cb-primary-glow)] hover:text-[var(--cb-text-primary)]"
                      >
                        {entry.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <SearchBar />
          <CurrencySelector />
          <ThemeToggle />
          <Link href={authRoute} className="cb-btn-primary inline-flex items-center gap-1.5">
            {user?.role === 'Admin' ? <Shield className="h-4 w-4" /> : null}
            <span>{authLabel}</span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="glass-panel grid h-9 w-9 place-items-center rounded-button lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-[var(--cb-border)] transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[75vh] border-b' : 'max-h-0'
        }`}
      >
        <div className="space-y-4 px-4 py-4">
          <SearchBar compact={true} />
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-button px-3 py-2 text-sm font-semibold text-[var(--cb-text-secondary)] transition-colors hover:bg-[var(--cb-primary-glow)] hover:text-[var(--cb-text-primary)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <CurrencySelector />
            <ThemeToggle />
          </div>
          <Link href={authRoute} className="cb-btn-primary flex w-full items-center justify-center gap-1.5">
            {user?.role === 'Admin' ? <Shield className="h-4 w-4" /> : null}
            <span>{authLabel}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
