import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Redbubble — Admin | CloudBasket' }
export default function RedbubblePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Redbubble Portfolio</h1>
      <div className="cb-card p-8 text-center mb-6">
        <p className="font-black text-lg mb-2">Connect Redbubble Account</p>
        <p className="text-sm text-[var(--cb-text-muted)] mb-4">Create a Redbubble artist account to enable marketplace uploads. Generate metadata automatically with AI.</p>
        <a href="https://www.redbubble.com/portfolio/signup" target="_blank" rel="noopener noreferrer" className="cb-btn cb-btn-primary">Create Redbubble Account →</a>
      </div>
    </main>
  )
}