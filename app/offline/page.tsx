import type { Metadata } from 'next'
import OfflinePageClient from './OfflinePageClient'

export const metadata: Metadata = {
  title: 'Offline | CloudBasket',
  description: 'It looks like you are offline. Please check your internet connection to continue using CloudBasket.',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return <OfflinePageClient />
}
