import type { Metadata } from 'next'
import AssociatesPageClient from './AssociatesPageClient'

export const metadata: Metadata = {
  title: 'Associates Program — Earn with CloudBasket | Become a Partner',
  description: 'Join the CloudBasket Associates Program. Earn commission by sharing deals. Affiliate marketing India. Earn money blogging India. Price comparison affiliate program.',
}

export default function AssociatesPage() {
  return <AssociatesPageClient />
}