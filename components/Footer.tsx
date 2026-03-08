import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { ROUTES, SITE_NAME } from '@/lib/constants'

const discoverLinks = [
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Deals', href: ROUTES.DEALS },
  { label: 'Compare', href: ROUTES.COMPARE },
  { label: 'POD', href: ROUTES.POD },
  { label: 'Blog', href: ROUTES.BLOG },
] as const

const companyLinks = [
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Associates', href: ROUTES.ASSOCIATES },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: ROUTES.CONTACT },
  { label: 'FAQ', href: '/faq' },
] as const

const legalLinks = [
  { label: 'Privacy Policy', href: ROUTES.PRIVACY },
  { label: 'Terms', href: ROUTES.TERMS },
  { label: 'Affiliate Disclosure', href: ROUTES.AFFILIATE },
] as const

const complianceBadges = ['DPDPA 2023', 'GDPR', 'FTC Compliant'] as const

export default function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#09090B] text-white dark:bg-[#020206]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-skyline-primary text-xl font-black text-white">
            CB
          </div>
          <p className="mt-3 text-2xl font-black tracking-tighter text-white">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#64748B]">
            India&apos;s sovereign price aggregator. Zero checkout. Pure discovery.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {complianceBadges.map((badge) => (
              <span key={badge} className="cb-badge cb-badge-blue">
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6 text-sm text-[#64748B]">
            <p>Built with sovereignty by</p>
            <a
              href="https://nexqon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-skyline-primary hover:underline"
            >
              NEXQON Engineering
            </a>
            <p className="mt-1 text-xs text-[#334155]">v2.0.0 · March 2026</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90"
              aria-label="Join CloudBasket WhatsApp Community"
            >
              <MessageCircle size={14} />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Discover</p>
          {discoverLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Company</p>
          {companyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-[#334155]">Legal</p>
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-1 text-sm text-[#64748B] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-[#1E293B] py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-[#334155]">© 2026 CloudBasket. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#1E293B]">Powered by NEXQON Sovereign Technology</p>
            <span className="cb-badge border-[#FF9933]/30 bg-[#FF9933]/10 text-xs text-[#FF9933]">🇮🇳 Made for Bharat</span>
            <span className="cb-badge text-xs">Serving India & Globe</span>
          </div>
          <p className="font-mono-cb text-xs text-[#1E293B]">v2.0.0-sovereign</p>
        </div>
      </div>
    </footer>
  )
}
