'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import type { ReactNode, FormEvent, ChangeEvent, JSX } from 'react'
import { Star, Layout } from 'lucide-react'
import {
  semantic,
  components,
  shadows,
  radii,
  transitions,
  colors,
} from '@/lib/design-system'

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

// ---------------------------------------------------------------------------
// NAV CONFIGURATION — only routes that exist in app/
// ---------------------------------------------------------------------------

const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    dropdown: [
      { label: 'Featured Today', href: '/#featured'     },
      { label: 'New Arrivals',   href: '/#new-arrivals' },
      { label: 'Trending Now',   href: '/#trending'     },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    dropdown: [
      { label: 'All Products',   href: '/products' },
      { label: 'Compare Prices', href: '/compare'  },
    ],
  },
  {
    id: 'pod',
    label: 'POD',
    href: '/pod',
    dropdown: [
      { label: 'POD Store',         href: '/pod'       },
      { label: 'Affiliate Program', href: '/affiliate' },
    ],
  },
  {
    id: 'deals',
    label: 'Deals',
    href: '/deals',
    dropdown: [
      { label: "Today's Deals",  href: '/deals'   },
      { label: 'Compare Prices', href: '/compare' },
    ],
  },
  {
    id: 'more',
    label: 'More',
    href: '/blog',
    dropdown: [
      { label: 'Blog & Reviews',    href: '/blog'      },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'CJ Partner Hub',    href: '/cj'        },
    ],
  },
]

// ---------------------------------------------------------------------------
// ICONS — inline SVG, zero external dependencies
// ---------------------------------------------------------------------------

function IconSearch(): JSX.Element {
  return (
    <svg
      width="18" height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconCart(): JSX.Element {
  return (
    <svg
      width="22" height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9"  cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconHamburger(): JSX.Element {
  return (
    <svg
      width="22" height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconClose(): JSX.Element {
  return (
    <svg
      width="22" height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  )
}

function IconChevronDown(): JSX.Element {
  return (
    <svg
      width="12" height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// DROPDOWN LINK
// ---------------------------------------------------------------------------

interface DropdownLinkProps {
  href:     string
  children: ReactNode
}

function DropdownLink({ href, children }: DropdownLinkProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false)
  return (
    <a
      href={href}
      role="menuitem"
      className="block px-4 py-2.5 text-sm font-medium"
      style={{
        color:           hovered ? semantic.brand.primary : semantic.text.primary,
        backgroundColor: hovered ? semantic.surface.brand  : 'transparent',
        transition:      transitions.preset.colors,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

// ---------------------------------------------------------------------------
// DESKTOP NAV ITEM
// Handlers on BOTH trigger <a> AND dropdown <div> — prevents gap-close bug.
// mt-0 + pt-2 on panel: no physical gap, visual breathing room inside.
// ---------------------------------------------------------------------------

interface DesktopNavItemProps {
  item:     NavItem
  isActive: boolean
  onEnter:  (id: string) => void
  onLeave:  () => void
}

function DesktopNavItem({
  item,
  isActive,
  onEnter,
  onLeave,
}: DesktopNavItemProps): JSX.Element {
  return (
    <div className="relative">
      {/* Trigger — onMouseEnter/Leave here */}
      <a
        href={item.href}
        className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md"
        style={{
          color:           semantic.text.inverse,
          backgroundColor: isActive ? colors.sky['700'] : 'transparent',
          transition:      transitions.preset.colors,
        }}
        aria-haspopup="menu"
        aria-expanded={isActive}
        onMouseEnter={() => onEnter(item.id)}
        onMouseLeave={onLeave}
      >
        {item.label}
        <span
          style={{
            display:    'inline-flex',
            transition: 'transform 200ms ease',
            transform:  isActive ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <IconChevronDown />
        </span>
      </a>

      {/* Dropdown panel — onMouseEnter/Leave here too, mt-0 removes gap */}
      {isActive && (
        <div
          role="menu"
          aria-label={`${item.label} submenu`}
          className="absolute top-full left-0 mt-0 pt-2 pb-1 rounded-xl overflow-hidden"
          style={{
            minWidth:        '200px',
            backgroundColor: semantic.surface.base,
            boxShadow:       shadows.lg,
            border:          `1px solid ${semantic.border.subtle}`,
            zIndex:          200,
          }}
          onMouseEnter={() => onEnter(item.id)}
          onMouseLeave={onLeave}
        >
          {item.dropdown.map((sub) => (
            <DropdownLink key={sub.href} href={sub.href}>
              {sub.label}
            </DropdownLink>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MOBILE NAV ITEM — tap to accordion open
// ---------------------------------------------------------------------------

interface MobileNavItemProps {
  item:     NavItem
  isOpen:   boolean
  onToggle: (id: string) => void
}

function MobileNavItem({
  item,
  isOpen,
  onToggle,
}: MobileNavItemProps): JSX.Element {
  return (
    <div style={{ borderBottom: `1px solid ${colors.sky['500']}` }}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-5 py-4 text-base font-semibold text-left hover:bg-white/10 transition-colors"
        style={{ color: semantic.text.inverse }}
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`mobile-panel-${item.id}`}
      >
        {item.label}
        <span
          style={{
            display:    'inline-flex',
            transition: 'transform 200ms ease',
            transform:  isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <IconChevronDown />
        </span>
      </button>

      {isOpen && (
        <div
          id={`mobile-panel-${item.id}`}
          role="menu"
          aria-label={`${item.label} submenu`}
          style={{ backgroundColor: colors.sky['700'] }}
        >
          {item.dropdown.map((sub) => (
            <a
              key={sub.href}
              href={sub.href}
              role="menuitem"
              className="block px-8 py-3 text-sm font-medium"
              style={{ color: colors.sky['100'] }}
            >
              {sub.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CART BADGE — links to /products (no /cart page exists yet)
// ---------------------------------------------------------------------------

interface CartBadgeProps {
  count: number
}

function CartBadge({ count }: CartBadgeProps): JSX.Element {
  const label = `Shopping cart${count > 0 ? `, ${count} ${count === 1 ? 'item' : 'items'}` : ', empty'}`
  return (
    <Link
      href="/products"
      aria-label={label}
      className="relative flex items-center justify-center p-2 rounded-lg"
      style={{ color: semantic.text.inverse, transition: transitions.preset.colors }}
    >
      <IconCart />
      {count > 0 && (
        <span
          className="absolute flex items-center justify-center rounded-full font-bold leading-none"
          aria-hidden="true"
          style={{
            top:             '-2px',
            right:           '-2px',
            minWidth:        '18px',
            height:          '18px',
            paddingInline:   '3px',
            backgroundColor: semantic.brand.cta,
            color:           semantic.text.inverse,
            fontSize:        '10px',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// AFFILIATE DISCLOSURE BADGE
// ---------------------------------------------------------------------------

function AffiliateBadge(): JSX.Element {
  return (
    <span
      role="note"
      aria-label="Affiliate partner disclosure — we may earn a commission"
      title="CloudBasket contains affiliate links. We may earn a small commission at no extra cost to you."
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none"
      style={{
        backgroundColor: semantic.brand.accent,
        color:           semantic.text.onAccent,
      }}
    >
      <Star size={14} fill="currentColor" />
      Affiliate Partner
    </span>
  )
}

// ---------------------------------------------------------------------------
// MAIN HEADER
// ---------------------------------------------------------------------------

export default function Header(): JSX.Element {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [mobileOpenItem, setMobileOpenItem] = useState<string | null>(null)
  const [searchValue,    setSearchValue]    = useState<string>('')

  const cartCount = 3

  const handleDropdownEnter = useCallback((id: string): void => {
    setActiveDropdown(id)
  }, [])

  const handleDropdownLeave = useCallback((): void => {
    setActiveDropdown(null)
  }, [])

  const handleMobileItemToggle = useCallback((id: string): void => {
    setMobileOpenItem((prev) => (prev === id ? null : id))
  }, [])

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setSearchValue(e.target.value)
    },
    []
  )

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

  return (
    <header
      style={{
        position:        'sticky',
        top:             0,
        zIndex:          components.navbar.zIndex,
        backgroundColor: semantic.brand.primary,
        boxShadow:       components.navbar.shadow,
      }}
    >
      {/* ================================================================
          ROW 1 — Logo | Search | Cart + Hamburger
      ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex items-center gap-4"
          style={{ height: components.navbar.height }}
        >

          {/* ── LOGO ── */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 select-none"
            aria-label="CloudBasket — go to homepage"
          >
            <span
              className="flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                width:           '36px',
                height:          '36px',
                borderRadius:    radii.lg,
                backgroundColor: semantic.brand.cta,
                color:           semantic.text.inverse,
              }}
            >
              CB
            </span>
            <span
              className="hidden sm:block text-xl font-extrabold tracking-tight"
              style={{ color: semantic.text.inverse }}
            >
              Cloud
              <span style={{ color: semantic.brand.accent }}>Basket</span>
            </span>
          </Link>

          {/* ── SEARCH BAR ── */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 mx-auto"
            style={{ maxWidth: '540px' }}
            role="search"
            aria-label="Site search"
          >
            <div className="relative flex items-center">
              <input
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Search products, deals, designs…"
                aria-label="Search CloudBasket"
                className="w-full outline-none"
                style={{
                  height:          components.searchBar.height,
                  borderRadius:    components.searchBar.borderRadius,
                  border:          'none',
                  paddingLeft:     '20px',
                  paddingRight:    '52px',
                  backgroundColor: semantic.surface.base,
                  color:           semantic.text.primary,
                  boxShadow:       components.searchBar.shadow,
                  transition:      components.searchBar.transition,
                  fontSize:        components.searchBar.fontSize,
                }}
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="hover:opacity-90"
                style={{
                  position:        'absolute',
                  right:           0,
                  top:             0,
                  bottom:          0,
                  width:           '48px',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  backgroundColor: semantic.brand.cta,
                  color:           semantic.text.inverse,
                  borderRadius:    `0 ${radii.full} ${radii.full} 0`,
                  border:          'none',
                  cursor:          'pointer',
                  transition:      transitions.preset.colors,
                }}
              >
                <IconSearch />
              </button>
            </div>
          </form>

          {/* ── RIGHT ICONS ── */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <CartBadge count={cartCount} />

            <button
              type="button"
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: semantic.text.inverse }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="header-mobile-menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <IconClose /> : <IconHamburger />}
            </button>
          </div>

        </div>
      </div>

      {/* ================================================================
          ROW 2 — Desktop Nav + Affiliate Badge
      ================================================================ */}
      <div
        className="hidden md:block"
        style={{ borderTop: `1px solid ${colors.sky['500']}` }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
          style={{ height: '44px' }}
          aria-label="Primary navigation"
        >
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <DesktopNavItem
                key={item.id}
                item={item}
                isActive={activeDropdown === item.id}
                onEnter={handleDropdownEnter}
                onLeave={handleDropdownLeave}
              />
            ))}
          </div>

          <div className="ml-auto">
            <AffiliateBadge />
          </div>
        </nav>
      </div>

      {/* ================================================================
          MOBILE MENU — accordion
      ================================================================ */}
      {mobileMenuOpen && (
        <div
          id="header-mobile-menu"
          className="md:hidden"
          role="navigation"
          aria-label="Mobile navigation"
          style={{
            backgroundColor: semantic.brand.primary,
            borderTop:       `1px solid ${colors.sky['500']}`,
          }}
        >
          <div
            className="flex items-center justify-center py-3"
            style={{ borderBottom: `1px solid ${colors.sky['500']}` }}
          >
            <AffiliateBadge />
          </div>

          {NAV_ITEMS.map((item) => (
            <MobileNavItem
              key={item.id}
              item={item}
              isOpen={mobileOpenItem === item.id}
              onToggle={handleMobileItemToggle}
            />
          ))}
        </div>
      )}
    </header>
  )
}
