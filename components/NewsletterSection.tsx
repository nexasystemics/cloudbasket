'use client'

import { useState } from 'react'

const CATEGORIES = ['All Deals', 'Mobiles', 'Laptops', 'Fashion', 'Home', 'POD Drops'] as const

export default function NewsletterSection() {
  const [email, setEmail] = useState<string>('')
  const [category, setCategory] = useState<string>('All Deals')
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = () => {
    if (!email.trim()) {
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      setSubmitted(true)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <section className="mx-auto max-w-3xl bg-gradient-to-r from-[#039BE5]/10 to-[#8B5CF6]/10 px-6 py-16 text-center">
      {!submitted ? (
        <>
          <span className="cb-badge cb-badge-blue mb-6">Weekly Deals Digest</span>
          <h2 className="text-3xl font-black tracking-tighter">Never Miss a Deal Again</h2>
          <p className="text-muted mx-auto mt-3 max-w-xl">
            Get India's best deals delivered every Monday morning. Curated from 50+ stores. Zero spam. Unsubscribe anytime.
          </p>

          <div className="mt-6 mb-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className={`cb-badge cursor-pointer ${category === cat ? 'cb-badge-blue' : 'hover:cb-badge-blue'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>

          <div className="mx-auto flex max-w-md gap-3">
            <input
              type="email"
              className="cb-input flex-1"
              placeholder="your@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="button" className="cb-btn cb-btn-primary flex-shrink-0 gap-2" onClick={handleSubmit}>
              {isLoading ? '...' : 'Subscribe Free'}
            </button>
          </div>

          <p className="text-muted mt-4 text-xs">
            Join 1,247+ smart Indian shoppers. DPDPA 2023 compliant. Unsubscribe anytime.
          </p>
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="mb-4 text-6xl">✅</p>
          <h2 className="text-2xl font-black">You're in!</h2>
          <p className="text-muted mt-2">Welcome to CloudBasket Deals Digest. First email arrives Monday morning.</p>
          <p className="text-muted mt-4 text-xs">Category: {category} deals</p>
        </div>
      )}
    </section>
  )
}
