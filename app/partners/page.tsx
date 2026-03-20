import type { Metadata } from 'next'
import PartnersPageClient from './PartnersPageClient'

export const metadata: Metadata = {
  title: 'Partner With CloudBasket — Reach Millions of Indian Shoppers',
  description: 'Partner with CloudBasket to reach millions of price-conscious Indian shoppers. Sponsored listings, brand stores, homepage features and more.',
}

export default function PartnersPage() {
  return <PartnersPageClient />
}