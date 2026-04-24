import type { Metadata } from 'next'
import CareersPageClient from './CareersPageClient'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, DEFAULT_LOCALE } from '@/lib/constants'

const CAREERS_TITLE = `Careers — ${SITE_NAME}`
const CAREERS_DESCRIPTION = `${SITE_DESCRIPTION} Join the team — explore open positions in Engineering, Marketing, Design, and more at ${SITE_NAME}.`

export const metadata: Metadata = {
  title: CAREERS_TITLE,
  description: CAREERS_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    title: CAREERS_TITLE,
    description: CAREERS_DESCRIPTION,
    url: `${SITE_URL}/careers`,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Careers`,
      },
    ],
    locale: DEFAULT_LOCALE,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: CAREERS_TITLE,
    description: CAREERS_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
}

export default function CareersPage() {
  return <CareersPageClient />
}
