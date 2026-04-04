// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal — CloudBasket',
  description:
    'CloudBasket legal documents — Terms of Service, Privacy Policy, Cookie Policy, Affiliate Disclosure, Disclaimer, and DMCA policy.',
}

interface LegalCard {
  href: string
  title: string
  description: string
  pdfHref: string | null
  pdfName: string | null
  pdfLabel?: string | null
  pdfTarget?: '_blank' | null
}

const LEGAL_CARDS: LegalCard[] = [
  {
    href: '/legal/terms',
    title: 'Terms of Service',
    description:
      'Rules governing your use of CloudBasket — affiliate disclosures, intellectual property, liability limits, and Indian law compliance.',
    pdfHref: '/legal/terms-of-service.pdf',
    pdfName: 'CloudBasket-Terms-of-Service-2026.pdf',
  },
  {
    href: '/legal/privacy',
    title: 'Privacy Policy',
    description:
      'How CloudBasket collects, uses, and protects personal data under the Digital Personal Data Protection Act 2023 and applicable privacy law.',
    pdfHref: null,
    pdfName: null,
  },
  {
    href: '/legal/cookies',
    title: 'Cookie Policy',
    description:
      'What cookies we use, why we use them, and how you can manage your cookie preferences on CloudBasket.',
    pdfHref: null,
    pdfName: null,
  },
  {
    href: '/legal/affiliate-disclosure',
    title: 'Affiliate Disclosure',
    description:
      'Full disclosure of CloudBasket commercial relationships with Amazon Associates, Flipkart, CJ Affiliate, and advertising partners.',
    pdfHref: null,
    pdfName: null,
  },
  {
    href: '/legal/refund-policy',
    title: 'Refund & Returns Policy',
    description:
      'Explains how returns, cancellations, exchanges, and refunds for affiliate or third-party marketplace purchases are handled by the selling platform or merchant.',
    pdfHref: '/legal/refund-policy/pdf',
    pdfName: null,
    pdfLabel: 'Open Refund Policy PDF view',
    pdfTarget: '_blank',
  },
  {
    href: '/legal/disclaimer',
    title: 'Disclaimer',
    description:
      'Limitations on warranties, price accuracy, product information, third-party content, and professional advice.',
    pdfHref: '/legal/disclaimer/pdf',
    pdfName: null,
    pdfLabel: 'Open Disclaimer PDF view',
    pdfTarget: '_blank',
  },
  {
    href: '/legal/dmca',
    title: 'DMCA & IP Policy',
    description:
      'How CloudBasket handles copyright notices, trademark complaints, intermediary safe harbour, and intellectual property takedown requests.',
    pdfHref: null,
    pdfName: null,
  },
]

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2v8M5 7l3 3 3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function LegalIndexPage() {
  return (
    <div>
      <nav
        className="mb-6 flex items-center gap-2 text-xs text-gray-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-[#039BE5]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-gray-900">Legal</span>
      </nav>

      <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900">Legal</h1>
      <p className="mb-8 text-sm text-gray-500">
        CloudBasket legal documents covering transparency, compliance, user rights, and platform obligations.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {LEGAL_CARDS.map((card) => (
          <div
            key={card.href}
            className="flex flex-col rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="text-base font-bold text-gray-900">{card.title}</h2>
              {card.pdfHref ? (
                <a
                  href={card.pdfHref}
                  download={card.pdfName ?? undefined}
                  target={card.pdfTarget ?? undefined}
                  rel={card.pdfTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  className="shrink-0 rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[#039BE5] hover:text-white"
                  title={card.pdfLabel ?? `Download ${card.title} PDF`}
                  aria-label={card.pdfLabel ?? `Download ${card.title} as PDF`}
                >
                  <DownloadIcon />
                </a>
              ) : null}
            </div>
            <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-500">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="text-xs font-semibold text-[#039BE5] hover:underline"
            >
              Read →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border-l-4 border-[#E65100] bg-[#FFF3E0] px-4 py-3 text-xs leading-relaxed text-gray-700">
        <strong>Affiliate Disclosure:</strong> As an Amazon Associate, CloudBasket earns from
        qualifying purchases. All product links on this site are affiliate links.{' '}
        <span className="font-semibold">#affiliate</span>
      </div>
    </div>
  )
}
