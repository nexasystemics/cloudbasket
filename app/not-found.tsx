import Link from 'next/link'
import { Search, Home } from 'lucide-react'
import {
  semantic,
  components,
  shadows,
  spacing,
  typography,
  radii,
  transitions,
} from '@/lib/design-system'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
      style={{ backgroundColor: semantic.surface.base }}
    >
      {/* Top accent bar */}
      <div
        className="mb-8"
        style={{
          width:           spacing['16'],
          height:          spacing['1'],
          borderRadius:    radii.full,
          backgroundColor: semantic.brand.primary,
        }}
      />

      {/* 404 */}
      <p
        className="select-none font-black leading-none mb-4"
        style={{
          fontSize: typography.fontSize['8xl'],
          color:    semantic.brand.primary,
        }}
      >
        404
      </p>

      {/* Heading */}
      <h1
        className="text-3xl md:text-4xl font-bold text-center mb-3"
        style={{ color: semantic.brand.text }}
      >
        Page Not Found
      </h1>

      {/* Body copy */}
      <p
        className="text-base text-center max-w-md mb-10"
        style={{
          color:      semantic.text.secondary,
          lineHeight: typography.lineHeight.relaxed,
        }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching for what you need, or head back home.
      </p>

      {/* Search form — plain GET to /products, zero external calls */}
      <form
        action="/products"
        method="GET"
        className="w-full max-w-lg flex items-center gap-3 mb-5"
      >
        <div
          className="flex-1 flex items-center gap-3 px-4"
          style={{
            height:          components.searchBar.height,
            border:          components.searchBar.border,
            borderRadius:    components.searchBar.borderRadius,
            backgroundColor: components.searchBar.background,
            boxShadow:       components.searchBar.shadow,
          }}
        >
          <Search
            size={18}
            style={{ color: semantic.text.muted, flexShrink: 0 }}
            aria-hidden="true"
          />
          <input
            type="text"
            name="q"
            placeholder="Search products, deals, designs…"
            autoComplete="off"
            aria-label="Search CloudBasket"
            className="flex-1 bg-transparent outline-none min-w-0"
            style={{
              fontSize: typography.fontSize.base,
              color:    semantic.text.primary,
            }}
          />
        </div>

        <button
          type="submit"
          className="flex-shrink-0 font-semibold text-white hover:opacity-90"
          style={{
            height:        components.searchBar.height,
            paddingInline: spacing['5'],
            borderRadius:  components.searchBar.borderRadius,
            backgroundColor: semantic.brand.primary,
            fontSize:      typography.fontSize.sm,
            fontWeight:    typography.fontWeight.semibold,
            transition:    transitions.preset.colors,
            boxShadow:     shadows.brand,
          }}
        >
          Search
        </button>
      </form>

      {/* Home CTA — orange brand CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-white hover:opacity-90 mb-14"
        style={{
          height:          components.button.height.lg,
          paddingInline:   spacing['8'],
          borderRadius:    radii.full,
          backgroundColor: semantic.brand.cta,
          fontSize:        typography.fontSize.base,
          fontWeight:      typography.fontWeight.semibold,
          transition:      transitions.preset.colors,
          boxShadow:       shadows.cta,
        }}
      >
        <Home size={18} aria-hidden="true" />
        Back to Home
      </Link>

      {/* Quick navigation */}
      <nav aria-label="Helpful links" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        {([
          { label: 'Products',  href: '/products'  },
          { label: 'Deals',     href: '/deals'     },
          { label: 'Compare',   href: '/compare'   },
          { label: 'Blog',      href: '/blog'      },
          { label: 'Affiliate', href: '/affiliate' },
        ] as const).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:underline"
            style={{
              color:      semantic.text.link,
              transition: transitions.preset.colors,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  )
}
