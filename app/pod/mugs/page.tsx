import Link from 'next/link'

export default function PodMugsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · pod</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Mugs &amp; Drinkware</h1>
          <p className="text-white/80 text-sm">
            Exclusive CloudBasket designs on ceramic mugs and drinkware.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#f0fdf4', border: '2px dashed #1B5E20' }}
        >
          <div
            className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4"
            style={{ backgroundColor: '#1B5E20' }}
          >
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=56&h=56&fit=crop" alt="Mug" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mug Collection</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Start your morning right with a CloudBasket exclusive design. Available on
            Teepublic and Redbubble.
          </p>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/pod"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#039BE5' }}
          >
            View All POD →
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E65100' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}


