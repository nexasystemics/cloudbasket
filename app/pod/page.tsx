import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Printer, Package, Truck, Shield, ArrowRight, MousePointerClick, Paintbrush } from 'lucide-react'
import { IMAGE_ASSETS } from '@/lib/image-assets'

export const metadata: Metadata = {
  title: "CloudBasket Originals — Print on Demand",
  description:
    'Explore CloudBasket Originals for print-on-demand apparel, mugs, cases, and custom merch with fresh production, quality prints, and India-wide delivery.',
  openGraph: {
    title: "CloudBasket Originals — Print on Demand",
    description: 'Explore CloudBasket Originals for print-on-demand apparel, mugs, cases, and custom merch with fresh production, quality prints, and India-wide delivery.',
    url: 'https://cloudbasket.in/pod',
    siteName: 'CloudBasket',
    images: [
      {
        url: 'https://cloudbasket.in/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CloudBasket Originals',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CloudBasket Originals — Print on Demand",
    description: 'Explore CloudBasket Originals for print-on-demand apparel, mugs, cases, and custom merch with fresh production, quality prints, and India-wide delivery.',
    images: ['https://cloudbasket.in/og-image.svg'],
  },
}
const POD_CATEGORIES = [
  {
    slug: 'tshirts',
    name: 'T-Shirts',
    desc: 'Premium cotton tees with custom prints',
    image: IMAGE_ASSETS.pod.tshirts,
    count: 48,
    startPrice: 599,
  },
  {
    slug: 'mugs',
    name: 'Mugs & Drinkware',
    desc: 'Ceramic mugs, travel cups and more',
    image: IMAGE_ASSETS.pod.mugs,
    count: 32,
    startPrice: 349,
  },
  {
    slug: 'phone-cases',
    name: 'Phone Cases',
    desc: 'Custom cases for all major phone models',
    image: IMAGE_ASSETS.pod['phone-cases'],
    count: 64,
    startPrice: 299,
  },
  {
    slug: 'posters',
    name: 'Posters & Prints',
    desc: 'High-quality art prints for your walls',
    image: IMAGE_ASSETS.pod.posters,
    count: 28,
    startPrice: 449,
  },
  {
    slug: 'hoodies',
    name: 'Hoodies',
    desc: 'Comfortable hoodies with custom designs',
    image: IMAGE_ASSETS.pod.hoodies,
    count: 24,
    startPrice: 999,
  },
  {
    slug: 'tote-bags',
    name: 'Tote Bags',
    desc: 'Eco-friendly canvas tote bags',
    image: IMAGE_ASSETS.pod['tote-bags'],
    count: 20,
    startPrice: 449,
  },
  {
    slug: 'laptop-bags',
    name: 'Laptop Bags',
    desc: 'Custom printed sleeves and bags for laptops',
    image: IMAGE_ASSETS.pod['laptop-bags'],
    count: 16,
    startPrice: 799,
  },
] as const

const POD_FEATURES = [
  {
    icon: Printer,
    title: 'Print on Demand',
    desc: 'Printed fresh for every order. No inventory.',
  },
  {
    icon: Package,
    title: 'Quality Guaranteed',
    desc: 'Premium materials. Satisfaction guaranteed.',
  },
  {
    icon: Truck,
    title: '5-7 Day Delivery',
    desc: 'Pan-India delivery from our print partner.',
  },
  {
    icon: Shield,
    title: 'CloudBasket Assured',
    desc: 'Every order quality-checked before dispatch.',
  },
] as const

export default function PODPage() {
  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-gradient-to-br from-[#F97316]/5 via-transparent to-[#8B5CF6]/5 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="cb-badge cb-badge-orange mb-6">
            <Printer size={14} /> Print on Demand
          </span>
          <h1 className="text-5xl font-black tracking-tighter">CloudBasket Originals</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--cb-text-muted)]">
            Custom merchandise printed fresh for every order. Premium quality. Zero inventory. Ships pan-India.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/pod/tshirts" className="cb-btn cb-btn-orange gap-2">
              Shop T-Shirts <ArrowRight size={16} />
            </Link>
            <Link href="/pod/mugs" className="cb-btn cb-btn-ghost gap-2">
              Shop Mugs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">How It Works</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Your designs, printed on demand</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: MousePointerClick, 
              title: "Choose a Design", 
              desc: "Browse CloudBasket originals and pick the artwork that fits your style." 
            },
            { 
              icon: Paintbrush, 
              title: "Customise Your Product", 
              desc: "Select colours and product variations before sending it to print." 
            },
            { 
              icon: Truck, 
              title: "We Handle Printing and Delivery", 
              desc: "We print each order fresh and deliver it to your doorstep across India." 
            }
          ].map((step, i) => (
            <article key={i} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-skyline-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <step.icon size={32} className="text-skyline-primary" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Step {i + 1}</p>
              <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">{step.title}</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {POD_FEATURES.map((feature) => {
            const FeatureIcon = feature.icon
            return (
              <article key={feature.title} className="cb-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10">
                  <FeatureIcon size={22} className="text-[#F97316]" />
                </div>
                <h3 className="mt-3 text-sm font-black">{feature.title}</h3>
                <p className="mt-1 text-xs text-[var(--cb-text-muted)]">{feature.desc}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8 pb-16">
        <h2 className="mb-8 text-center text-3xl font-black tracking-tighter">Shop by Category</h2>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {POD_CATEGORIES.map((category) => (
            <Link key={category.slug} href={`/pod/${category.slug}`} className="cb-card group cursor-pointer overflow-hidden">
              <div className="relative h-52">
                <Image
                  fill
                  className="object-cover"
                  src={category.image}
                  alt={category.name}
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 24vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-black text-white">{category.name}</h3>
                  <p className="text-xs text-white/70">{category.desc}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-white/60">{category.count} designs</p>
                    <span className="cb-badge border-white/30 bg-white/20 text-white">From ₹{category.startPrice}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}



