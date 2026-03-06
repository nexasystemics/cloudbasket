import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Globe, Shield, Target, Zap } from 'lucide-react'
import { ROUTES, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About CloudBasket',
  description: SITE_DESCRIPTION,
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="font-display text-5xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
          About CloudBasket
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[var(--cb-text-muted)]">
          We built CloudBasket because finding the best price in India&apos;s fragmented e-commerce market
          was too hard. Now it takes one search.
        </p>
      </section>

      <section className="mx-auto mt-6 w-full max-w-4xl px-6">
        <article className="cb-card p-10">
          <Target size={40} className="text-skyline-primary" />
          <h2 className="mt-4 font-display text-2xl font-black text-[var(--cb-text-primary)]">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-[var(--cb-text-secondary)]">
            CloudBasket exists to deliver sovereign price discovery that is fast, transparent and trustworthy.
            We follow a strict zero-checkout model so users always complete purchases on retailer-owned secure
            infrastructure. Our focus remains on Indian market realities while maintaining global discovery depth.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
        <article className="cb-card p-6">
          <Globe size={32} className="text-skyline-primary" />
          <h3 className="mt-3 text-lg font-bold text-[var(--cb-text-primary)]">Global Coverage</h3>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Compare prices in INR, USD, EUR and GBP across multiple affiliate networks.
          </p>
        </article>
        <article className="cb-card p-6">
          <Shield size={32} className="text-skyline-primary" />
          <h3 className="mt-3 text-lg font-bold text-[var(--cb-text-primary)]">Privacy First</h3>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            DPDPA 2023 aligned processing with strict minimization and zero payment-data storage.
          </p>
        </article>
        <article className="cb-card p-6">
          <Zap size={32} className="text-skyline-primary" />
          <h3 className="mt-3 text-lg font-bold text-[var(--cb-text-primary)]">Speed</h3>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Fast listing search and frequent price refresh cycles across verified products.
          </p>
        </article>
      </section>

      <section className="mx-auto mt-16 w-full max-w-4xl px-6">
        <div className="rounded-card bg-skyline-glow p-8">
          <h3 className="font-display text-xl font-black text-skyline-primary">The Zero-Checkout Promise</h3>
          <p className="mt-3 leading-relaxed text-[var(--cb-text-secondary)]">
            CloudBasket is a discovery engine. We never process payments. We never store financial data.
            Every purchase happens on the retailer&apos;s own secure platform.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-16 text-center">
        <Link href={ROUTES.PRODUCTS} className="cb-btn-primary inline-flex items-center gap-2 px-8 py-4">
          Start Finding Deals
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
