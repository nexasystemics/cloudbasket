'use client'

import { Calendar, MapPin, Sparkles } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { usePersonalization } from '@/hooks/usePersonalization'

export default function PersonalizedGrid() {
  const { products, profile, isLoading, seasonLabel, festivalLabel } = usePersonalization(48)

  if (isLoading) {
    return (
      <section className="min-h-[640px] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="cb-card mb-8 flex animate-pulse items-center gap-3 p-4">
            <div className="h-6 w-6 rounded-full bg-[#039BE5]/20" />
            <div className="h-4 w-64 rounded bg-[var(--cb-surface-2)]" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="cb-card h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[640px] py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="cb-card mb-8 min-h-[88px] border-[#039BE5]/30 bg-[#039BE5]/5 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="flex-shrink-0 text-[#039BE5]" />
              <div>
                <p className="text-sm font-black tracking-tight">{festivalLabel ?? seasonLabel ?? 'Personalised For You'}</p>
                <p className="text-muted mt-0.5 text-xs">
                  {profile?.preferredCategories.length
                    ? `Based on your interest in ${profile.preferredCategories[0]}`
                    : 'Curated from 8,000+ products'}
                  {' · '}
                  {profile?.activeFestivals.length
                    ? `${profile.activeFestivals.length} active festivals detected`
                    : seasonLabel}
                </p>
              </div>
            </div>
            <div className="text-muted flex items-center gap-4 text-xs">
              {profile?.cityTier ? (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {profile.cityTier === 'tier1' ? 'Metro' : profile.cityTier === 'tier2' ? 'City' : 'Local'} Picks
                </span>
              ) : null}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date().toLocaleDateString('en-IN', { month: 'long' })}
              </span>
            </div>
          </div>
        </div>

        {products.slice(0, 4).some((product) => product.matchReasons.length > 0) ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {[...new Set(products.slice(0, 8).flatMap((product) => product.matchReasons))]
              .slice(0, 5)
              .map((reason) => (
                <span key={reason} className="cb-badge cb-badge-blue text-xs">
                  ✓ {reason}
                </span>
              ))}
          </div>
        ) : null}

        <div className="mb-6 flex min-h-[40px] items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter">
            {festivalLabel ? '🎯 Festival Deals For You' : seasonLabel ?? '✨ Picked For You'}
          </h2>
          <span className="text-muted text-xs">{products.length} unique picks</span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              personalScore={product.personalScore}
              product={{
                id: product.id,
                name: product.name,
                image: product.image,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: Math.max(0, Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)),
                rating: product.rating,
                reviews: product.reviews,
                source:
                  product.affiliatePlatform === 'amazon'
                    ? 'Amazon'
                    : product.affiliatePlatform === 'flipkart'
                      ? 'Flipkart'
                      : 'CJ',
                affiliatePlatform: product.affiliatePlatform,
                isTrending: product.personalScore >= 0.8,
              }}
            />
          ))}
        </div>

        {process.env.NODE_ENV === 'development' ? (
          <div className="cb-card text-muted mt-8 p-4 font-mono text-xs">
            <p className="mb-2 font-bold">🧠 Intelligence Engine Debug</p>
            {products.slice(0, 3).map((product) => (
              <p key={product.id}>
                [{product.personalScore.toFixed(2)}] {product.name} — {product.matchReasons.join(', ')}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

