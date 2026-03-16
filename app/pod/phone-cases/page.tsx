import type { Metadata } from 'next'
import PODCollectionClient from '@/components/PODCollectionClient'
import { POD_COLLECTIONS } from '@/lib/cloudbasket-data'

export const metadata: Metadata = {
  title: 'POD Phone Cases',
  description: 'Browse CloudBasket print-on-demand phone cases with device-focused designs and verified partner redirects.',
}

export default function PodPhoneCasesPage() {
  return (
    <PODCollectionClient
      title="Phone Cases"
      description="Protect your phone with CloudBasket case designs and flexible colour previews before you buy."
      products={POD_COLLECTIONS['phone-cases']}
    />
  )
}
