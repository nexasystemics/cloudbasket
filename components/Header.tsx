'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import type { FormEvent, ChangeEvent, JSX } from 'react'
import { Search, Menu, X, ChevronDown, Sun, Moon, Shield } from 'lucide-react'
import { useTheme } from 'next-themes'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface DropdownItem {
  readonly label: string
  readonly href: string
}

interface NavItem {
  readonly id: string
  readonly label: string
  readonly href: string
  readonly dropdown: readonly DropdownItem[]
}

const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    dropdown: [
      { label: 'All Mobiles',   href: '/products?mainCategory=Mobiles' },
      { label: 'Laptops Hub',   href: '/products?mainCategory=Laptops' },
      { label: 'Fashion Feed',  href: '/products?mainCategory=Fashion' },
      { label: 'Home Living',   href: '/products?mainCategory=Home' },
    ],
  },
  {
    id: 'pod',
    label: 'POD Designs',
    href: '/pod',
    dropdown: [
      { label: 'Graphic T-Shirts',  href: '/pod/tshirts' },
      { label: 'Custom Mugs',       href: '/pod/mugs' },
      { label: 'Phone Cases',       href: '/pod/phone-cases' },
    ],
  },
  {
    id: 'deals',
    label: 'Exclusive Deals',
    href: '/deals',
    dropdown: [
      { label: "Flash Sales",    href: '/deals/flash' },
      { label: 'CJ Network Ads',  href: '/deals/cj' },
      { label: 'Supplier Picks',  href: '/deals/picks' },
    ],
  },
]

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function ThemeToggle({ mounted, theme, setTheme }: { mounted: boolean, theme?: string, setTheme: (t: string) => void }): JSX.Element | null {
  if (!mounted) return <div className="w-10 h-10" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl text-gray-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center border border-gray-200 dark:border-white/10"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

function AdminLoginButton(): JSX.Element {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg dark:shadow-white/10 group"
    >
      <Shield size={16} className="group-hover:rotate-12 transition-transform" />
      Admin Login
    </Link>
  )
}

// ---------------------------------------------------------------------------
// MAIN HEADER
// ---------------------------------------------------------------------------

export default function Header(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [searchValue,    setSearchValue]    = useState<string>('')
  const [mounted,        setMounted]        = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      const q = searchValue.trim()
      if (q) {
        window.location.href = `/products?q=${encodeURIComponent(q)}`
      }
    },
    [searchValue]
  )

  const logoSrc = (mounted && theme === 'dark') ? '/brand/logo-full-dark.svg' : '/brand/logo-full.svg'

  return (
    <header className="glass-header transition-all duration-300 z-50">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo - Start */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-[180px] h-[40px]">
               <Image 
                src={logoSrc} 
                alt="CloudBasket" 
                fill 
                className="object-contain group-hover:scale-105 transition-transform"
                priority
               />
            </div>
          </Link>

          {/* Desktop Nav - Middle */}
          <nav className="hidden xl:flex items-center gap-1 mx-4 h-full">
            {NAV_ITEMS.map((item) => (
              <div 
                key={item.id} 
                className="relative group h-full flex items-center"
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-skyline-primary dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  {item.label}
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </Link>

                <div className="absolute top-[80%] left-0 pt-4 w-56 hidden group-hover:flex z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-black/50 border border-gray-100 dark:border-gray-800 py-3 overflow-hidden backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 flex flex-col">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-5 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-skyline-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Search & Actions - End */}
          <div className="flex items-center gap-2 sm:gap-4">
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-64 lg:w-96">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                placeholder="Search deals..."
                className="w-full bg-black/5 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-xl py-2.5 ps-12 pe-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 outline-none focus:bg-white dark:focus:bg-white/20 focus:border-skyline-primary transition-all"
              />
            </form>

            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle mounted={mounted} theme={theme} setTheme={setTheme} />
              <div className="hidden sm:block">
                <AdminLoginButton />
              </div>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 text-gray-700 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top duration-300 transition-colors duration-300">
          <div className="px-4 py-6 space-y-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="space-y-3">
                <Link href={item.href} className="text-lg font-black text-gray-900 dark:text-white block">{item.label}</Link>
                <div className="grid grid-cols-1 gap-2 ps-4">
                  {item.dropdown.map((sub) => (
                    <Link key={sub.href} href={sub.href} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-skyline-primary">{sub.label}</Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
               <AdminLoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
