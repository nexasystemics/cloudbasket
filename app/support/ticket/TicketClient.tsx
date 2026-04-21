'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TicketClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ticket = searchParams.get('ticket') ?? ''
  const [input, setInput] = useState('')

  function handleCheck() {
    const trimmed = input.trim()
    if (!trimmed) return
    router.push(`/support/ticket?ticket=${encodeURIComponent(trimmed)}`)
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-3xl font-black mb-4">Support Ticket</h1>
      {ticket ? (
        <div className="cb-card p-8">
          <p className="font-black text-xl mb-2">Ticket #{ticket}</p>
          <p className="text-[var(--cb-text-muted)] mb-4">We&apos;ll respond within 48 hours.</p>
          <Link href="/contact" className="cb-btn cb-btn-ghost">Contact Support</Link>
        </div>
      ) : (
        <div className="cb-card p-8">
          <input
            className="cb-input w-full mb-3"
            placeholder="Ticket number e.g. CB-20260321-0001"
            aria-label="Ticket number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCheck() }}
          />
          <button
            type="button"
            className="cb-btn cb-btn-primary w-full"
            onClick={handleCheck}
            disabled={!input.trim()}
          >
            Check Status
          </button>
        </div>
      )}
    </main>
  )
}
