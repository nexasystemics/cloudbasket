import type { Metadata } from 'next'
import PartnersPageClient from './PartnersPageClient'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_LOCALE } from '@/lib/constants'

const PARTNERS_TITLE = `Partners — ${SITE_NAME}`

export const metadata: Metadata = {
  title: PARTNERS_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/partners` },
  openGraph: {
    title: PARTNERS_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/partners`,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
    locale: DEFAULT_LOCALE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PARTNERS_TITLE,
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function PartnersPage() {
  return <PartnersPageClient />
}
