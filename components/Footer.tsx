import Link from 'next/link'
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
  { label: 'Careers', href: `${ROUTES.ABOUT}#careers` },
  { label: 'Contact', href: ROUTES.CONTACT },
  { label: 'FAQ', href: `${ROUTES.CONTACT}#faq` },
] as const

const legalLinks = [
  { label: 'Privacy Policy', href: ROUTES.PRIVACY },
  { label: 'Terms', href: ROUTES.TERMS },
  { label: 'Affiliate Disclosure', href: ROUTES.AFFILIATE },
  { label: 'Cookies', href: `${ROUTES.PRIVACY}#cookies` },
] as const

const complianceBadges = ['DPDPA 2023', 'GDPR', 'FTC Compliant'] as const

export default function Footer() {
  return (
    <footer className="bg-[#36454F] py-20 text-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-5 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-skyline-primary text-xl font-black text-white">
                CB
              </div>
              <p className="text-2xl font-black tracking-tighter">{SITE_NAME}</p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Discover trusted prices across marketplaces with one sovereign, privacy-forward product discovery layer.
            </p>
            <div className="flex flex-wrap gap-2">
              {complianceBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex rounded-pill border border-skyline-primary/20 bg-[rgba(3,155,229,0.15)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-skyline-primary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="pb-4 text-[10px] uppercase tracking-widest text-white/40">Discover</p>
            <ul className="space-y-3">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="pb-4 text-[10px] uppercase tracking-widest text-white/40">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="pb-4 text-[10px] uppercase tracking-widest text-white/40">Legal</p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-300 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-500">© 2026 {SITE_NAME}. All rights reserved.</p>
          <p className="text-gray-600">Powered by sovereign technology</p>
        </div>
      </div>
    </footer>
  )
}
