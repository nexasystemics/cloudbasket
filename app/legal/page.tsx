// © 2026 NEXQON HOLDINGS — CloudBasket app/legal/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal — CloudBasket',
  description:
    'CloudBasket legal documents — Terms of Service, Privacy Policy, Cookie Policy, Affiliate Disclosure, and Disclaimer.',
}

interface LegalCard {
  href: string
  title: string
  description: string
  pdfHref: string | null
  pdfName: string | null
}

const LEGAL_CARDS: LegalCard[] = [
  {
    href: '/legal/terms',
    title: 'Terms of Service',
    description:
      'Rules governing your use of CloudBasket — affiliate disclosures, intellectual property, liability limits, and Indian law compliance (DPDP Act 2023, IT Rules 2026).',
    pdfHref: '/legal/terms-of-service.pdf',
    pdfName: 'CloudBasket-Terms-of-Service-2026.pdf',
  },
  {
    href: '/legal/privacy',
    title: 'Privacy Policy',
    description:
      'How we collect, use, and protect your personal data under the Digital Personal Data Protection Act 2023 and applicable Indian privacy laws.',
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
      'Full disclosure of our affiliate relationships with Amazon Associates India, Flipkart, CJ Affiliate, and other partner programs.',
    pdfHref: null,
    pdfName: null,
  },
  {
    href: '/legal/disclaimer',
    title: 'Disclaimer',
    description:
      'Limitations on our warranties, price accuracy, product information, third-party content, and professional advice.',
    pdfHref: null,
    pdfName: null,
  },
]

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
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
      {/* Breadcrumb */}
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

      <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900">
        Legal
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        CloudBasket legal documents — transparency, compliance, and your rights.
      </p>

      {/* Card grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {LEGAL_CARDS.map((card) => (
          <div
            key={card.href}
            className="flex flex-col rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="text-base font-bold text-gray-900">{card.title}</h2>
              {card.pdfHref && card.pdfName && (
                <a
                  href={card.pdfHref}
                  download={card.pdfName}
                  className="shrink-0 rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-[#039BE5] hover:text-white"
                  title={`Download ${card.title} PDF`}
                  aria-label={`Download ${card.title} as PDF`}
                >
                  <DownloadIcon />
                </a>
              )}
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

      {/* Affiliate notice */}
      <div className="mt-8 rounded-lg border-l-4 border-[#E65100] bg-[#FFF3E0] px-4 py-3 text-xs leading-relaxed text-gray-700">
        <strong>Affiliate Disclosure:</strong> As an Amazon Associate, CloudBasket earns from
        qualifying purchases. All product links on this site are affiliate links.{' '}
        <span className="font-semibold">#affiliate</span>
      </div>
    </div>
  )
}
