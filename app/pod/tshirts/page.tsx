import type { Metadata } from 'next'
import PODCollectionClient from '@/components/PODCollectionClient'
import { POD_COLLECTIONS } from '@/lib/cloudbasket-data'

export const metadata: Metadata = {
  title: 'POD Graphic T-Shirts',
  description: 'Shop CloudBasket graphic t-shirts from the print-on-demand collection with curated designs and external partner redirects.',
}

export default function TshirtsPage() {
  return (
    <PODCollectionClient
      title="Graphic T-Shirts"
      description="Premium cotton tees with CloudBasket original artwork and studio-ready colour options."
      products={POD_COLLECTIONS.tshirts}
    />
  )
}
