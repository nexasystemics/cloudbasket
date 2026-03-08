'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="text-6xl">📴</div>
      <h1 className="font-black text-3xl tracking-tighter">You're offline</h1>
      <p className="text-muted max-w-sm">
        CloudBasket needs internet to fetch live prices and deals.
        Check your connection and try again.
      </p>
      <button onClick={() => window.location.reload()} className="cb-btn cb-btn-primary">
        Try Again
      </button>
      <p className="text-xs text-muted">Powered by NEXQON Sovereign Technology v2.0.0</p>
    </div>
  )
}
