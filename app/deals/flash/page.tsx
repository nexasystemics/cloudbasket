import type { Metadata } from 'next'
import FlashSalePageClient from './FlashSalePageClient'

export const metadata: Metadata = {
  title: 'Flash Deals - Limited-Time Savings',
  description: 'Track CloudBasket flash deals across Amazon, Flipkart, and CJ Global with countdown-driven limited-time offers.',
}

export default function FlashSalePage() {
  return <FlashSalePageClient />
}
