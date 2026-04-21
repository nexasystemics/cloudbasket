import type { Metadata } from 'next'
import { Suspense } from 'react'
import TicketClient from './TicketClient'

export const metadata: Metadata = { title: 'Support Ticket | CloudBasket' }

export default function TicketPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-xl px-6 py-16 text-center"><div className="cb-card p-8 h-40" /></main>}>
      <TicketClient />
    </Suspense>
  )
}
