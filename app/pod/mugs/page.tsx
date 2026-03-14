import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { IMAGE_ASSETS } from '@/lib/image-assets'

export const metadata: Metadata = {
  title: 'POD Mugs and Drinkware',
  description: 'Explore CloudBasket print-on-demand mugs and drinkware with affiliate redirects to verified creator storefronts.',
}

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
            <Image
              src={IMAGE_ASSETS.pod.mugs}
              alt="Mug"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
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




