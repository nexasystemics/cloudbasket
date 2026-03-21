import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = { title: 'Support Ticket | CloudBasket' }
export default function TicketPage({ searchParams }: { searchParams: { ticket?: string } }) {
  return (<main className="mx-auto max-w-xl px-6 py-16 text-center"><h1 className="text-3xl font-black mb-4">Support Ticket</h1>{searchParams.ticket?(<div className="cb-card p-8"><p className="font-black text-xl mb-2">Ticket #{searchParams.ticket}</p><p className="text-[var(--cb-text-muted)] mb-4">We'll respond within 24 hours.</p><Link href="/contact" className="cb-btn cb-btn-ghost">Contact Support</Link></div>):(<div className="cb-card p-8"><input className="cb-input w-full mb-3" placeholder="Ticket number e.g. CB-20260321-0001"/><button type="button" className="cb-btn cb-btn-primary w-full">Check Status</button></div>)}</main>)
}