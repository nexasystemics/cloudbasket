'use client'

import Link from 'next/link'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { FormEvent, ChangeEvent, JSX, ReactNode } from 'react'
import {
  semantic,
  components,
  colors,
  transitions,
  radii,
} from '@/lib/design-system'

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

type NewsletterStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FooterLinkItem {
  readonly label: string
  readonly href:  string
}

interface FooterColumn {
  readonly heading: string
  readonly links:   readonly FooterLinkItem[]
}

// ---------------------------------------------------------------------------
// STATIC DATA
// ---------------------------------------------------------------------------

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products',   href: '/products'      },
      { label: 'Deals',          href: '/deals'         },
      { label: 'Flash Sales',    href: '/deals/flash'   },
      { label: 'New Arrivals',   href: '/#new-arrivals' },
      { label: 'Compare Prices', href: '/compare'       },
      { label: 'CJ Affiliate',   href: '/cj'            },
    ],
  },
  {
    heading: 'Create (POD)',
    links: [
      { label: 'Custom T-Shirts',    href: '/pod/tshirts'     },
      { label: 'Mugs & Drinkware',   href: '/pod/mugs'        },
      { label: 'Phone Cases',        href: '/pod/phone-cases' },
      { label: 'Posters & Prints',   href: '/pod/posters'     },
      { label: 'Custom Bags',        href: '/pod/bags'        },
      { label: 'Upload Your Design', href: '/pod/upload'      },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',          href: '/about'     },
      { label: 'Blog',              href: '/blog'      },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Contact Us',        href: '/contact'   },
      { label: 'FAQ',               href: '/faq'       },
      { label: 'Careers',           href: '/careers'   },
    ],
  },
]

const LEGAL_LINKS: readonly FooterLinkItem[] = [
  { label: 'Privacy Policy',       href: '/privacy'              },
  { label: 'Terms of Service',     href: '/terms'                },
  { label: 'Cookie Policy',        href: '/cookies'              },
  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
]

// ---------------------------------------------------------------------------
// SOCIAL ICONS — inline SVG, zero external dependencies
// ---------------------------------------------------------------------------

function IconFacebook(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconX(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Z" />
    </svg>
  )
}

function IconInstagram(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function IconLinkedIn(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconYouTube(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// FOOTER LINK — hover colors via design tokens (same pattern as Header)
// ---------------------------------------------------------------------------

interface FooterLinkProps {
  href:     string
  children: ReactNode
}

function FooterLink({ href, children }: FooterLinkProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false)
  return (
    <Link
      href={href}
      className="block text-sm py-0.5"
      style={{
        color:      hovered ? components.footer.linkHover : components.footer.linkColor,
        transition: transitions.preset.colors,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// SOCIAL LINK
// ---------------------------------------------------------------------------

interface SocialLinkProps {
  href:  string
  label: string
  icon:  JSX.Element
}

function SocialLink({ href, label, icon }: SocialLinkProps): JSX.Element {
  const [hovered, setHovered] = useState<boolean>(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      role="listitem"
      className="flex items-center justify-center w-9 h-9 rounded-lg"
      style={{
        color:           hovered ? semantic.brand.primary : colors.neutral['400'],
        backgroundColor: hovered ? colors.charcoal['700'] : 'transparent',
        transition:      transitions.preset.default,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
    </a>
  )
}

// ---------------------------------------------------------------------------
// NEWSLETTER FORM
// ---------------------------------------------------------------------------

function NewsletterForm(): JSX.Element {
  const [email,  setEmail]  = useState<string>('')
  const [status, setStatus] = useState<NewsletterStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up pending timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [])

  const scheduleReset = useCallback((): void => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus('idle'), 5000)
  }, [])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setEmail(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      const trimmed = email.trim()
      if (!trimmed) return

      setStatus('submitting')

      try {
        const res = await fetch('/api/newsletter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: trimmed, source: 'footer' }),
        })
        if (res.ok) {
          setStatus('success')
          setEmail('')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }

      scheduleReset()
    },
    [email, scheduleReset]
  )

  const isDisabled = status === 'submitting' || status === 'success'

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Your email address"
          disabled={isDisabled}
          required
          aria-label="Email address for newsletter subscription"
          className="w-full text-sm outline-none"
          style={{
            height:          '40px',
            borderRadius:    radii.lg,
            border:          `1px solid ${colors.charcoal['600']}`,
            paddingInline:   '12px',
            backgroundColor: colors.charcoal['700'],
            color:           colors.neutral['100'],
            transition:      transitions.preset.colors,
            opacity:         isDisabled ? 0.6 : 1,
          }}
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="hover:opacity-90"
          style={{
            height:          '40px',
            borderRadius:    radii.lg,
            backgroundColor: isDisabled ? colors.charcoal['600'] : semantic.brand.cta,
            color:           semantic.text.inverse,
            border:          'none',
            cursor:          isDisabled ? 'not-allowed' : 'pointer',
            transition:      transitions.preset.colors,
            opacity:         isDisabled ? 0.7 : 1,
            fontSize:        '0.875rem',
            fontWeight:      600,
          }}
        >
          {status === 'submitting' ? 'Subscribing…'  :
           status === 'success'   ? '✓ Subscribed!'  :
                                    'Subscribe'}
        </button>
      </form>

      {status === 'success' && (
        <p
          role="status"
          className="text-xs mt-2"
          style={{ color: colors.emerald['400'] }}
        >
          You&apos;re in! Check your inbox for a confirmation.
        </p>
      )}
      {status === 'error' && (
        <p
          role="alert"
          className="text-xs mt-2"
          style={{ color: colors.red['400'] }}
        >
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// MAIN FOOTER
// ---------------------------------------------------------------------------

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      aria-label="Site footer"
      style={{
        backgroundColor: components.footer.background,
      }}
    >
      {/* ================================================================
          MAIN SECTION — Brand | Link columns | Newsletter
      ================================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">

          {/* ── BRAND COLUMN ── */}
          <div className="lg:col-span-3 md:col-span-2">

            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-3 select-none"
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
                className="text-xl font-extrabold tracking-tight"
                style={{ color: semantic.text.inverse }}
              >
                Cloud<span style={{ color: semantic.brand.accent }}>Basket</span>
              </span>
            </Link>

            {/* Tagline */}
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-widest"
              style={{ color: semantic.brand.accent }}
            >
              Design. Print. Earn.
            </p>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: components.footer.textMuted }}
            >
              Compare prices across platforms, discover exclusive affiliate deals,
              and create custom print-on-demand products — all in one place.
            </p>

            {/* Affiliate disclosure note */}
            <p
              className="text-xs mb-6 leading-relaxed"
              style={{ color: colors.neutral['500'] }}
            >
              This site contains affiliate links. We may earn a small commission
              at no extra cost to you.
            </p>

            {/* Social icons */}
            <div
              className="flex items-center gap-1"
              role="list"
              aria-label="CloudBasket on social media"
            >
              <SocialLink
                href="https://facebook.com/cloudbasket"
                label="CloudBasket on Facebook"
                icon={<IconFacebook />}
              />
              <SocialLink
                href="https://x.com/cloudbasketshop"
                label="CloudBasket on X"
                icon={<IconX />}
              />
              <SocialLink
                href="https://instagram.com/cloudbasketshop"
                label="CloudBasket on Instagram"
                icon={<IconInstagram />}
              />
              <SocialLink
                href="https://linkedin.com/company/cloudbasket"
                label="CloudBasket on LinkedIn"
                icon={<IconLinkedIn />}
              />
              <SocialLink
                href="https://youtube.com/@CloudBasketShop"
                label="CloudBasket on YouTube"
                icon={<IconYouTube />}
              />
            </div>
          </div>

          {/* ── LINK COLUMNS ── */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <h3
                className="text-sm font-semibold mb-4 uppercase tracking-wider"
                style={{ color: semantic.text.inverse }}
              >
                {col.heading}
              </h3>
              <ul className="space-y-2" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── NEWSLETTER COLUMN ── */}
          <div className="lg:col-span-3">
            <h3
              className="text-sm font-semibold mb-2 uppercase tracking-wider"
              style={{ color: semantic.text.inverse }}
            >
              Stay Connected
            </h3>
            <p
              className="text-sm mb-4 leading-relaxed"
              style={{ color: components.footer.textMuted }}
            >
              Exclusive deals, new arrivals, and POD drops — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>

        </div>
      </div>

      {/* ================================================================
          BOTTOM BAR — Legal links | Copyright | Attribution
      ================================================================ */}
      <div style={{ borderTop: components.footer.borderTop }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Legal links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 mb-5"
            aria-label="Legal links"
          >
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{ color: colors.charcoal['600'] }}
                  >
                    ·
                  </span>
                )}
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </span>
            ))}
          </nav>

          {/* Copyright + attribution */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
            style={{ color: components.footer.textMuted }}
          >
            <p>
              &copy; {currentYear} CloudBasket.{' '}
              <span style={{ color: colors.neutral['500'] }}>All rights reserved.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 text-center">
              <span>
                Designed &amp; Developed by{' '}
                <span style={{ color: components.footer.linkColor }}>Version State</span>
                {' '}
                <span style={{ color: colors.charcoal['500'] }}>{'{vs.in}'}</span>
              </span>
              <span
                aria-hidden="true"
                className="hidden sm:inline"
                style={{ color: colors.charcoal['600'] }}
              >
                |
              </span>
              <span>
                Powered by{' '}
                <span style={{ color: components.footer.linkColor }}>NEXQON Holdings</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
