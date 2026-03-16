import type { Metadata } from 'next'
import PODCollectionClient from '@/components/PODCollectionClient'
import { POD_COLLECTIONS } from '@/lib/cloudbasket-data'

export const metadata: Metadata = {
  title: 'POD Mugs and Drinkware',
  description: 'Explore CloudBasket print-on-demand mugs and drinkware with affiliate redirects to verified creator storefronts.',
}

export default function PodMugsPage() {
  return (
    <PODCollectionClient
      title="Mugs & Drinkware"
      description="Ceramic mugs and desk-ready drinkware with CloudBasket original designs."
      products={POD_COLLECTIONS.mugs}
    />
  )
}
