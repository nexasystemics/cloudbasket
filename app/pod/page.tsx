import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Coffee,
  Printer,
  Shirt,
  Smartphone,
  Star,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Print-on-Demand Designs | CloudBasket POD',
  description: 'Custom mugs, t-shirts and phone cases. Unique designs, global delivery.',
}

type PodCategory = {
  id: string
  label: string
  icon: typeof Shirt
  desc: string
  count: string
  href: string
  goId: string
  color: string
  image: string
}

const POD_CATEGORIES: PodCategory[] = [
  {
    id: 'tshirts',
    label: 'Graphic T-Shirts',
    icon: Shirt,
    desc: 'Premium cotton. Unique sovereign designs.',
    count: '200+ designs',
    href: '/pod/tshirts',
    goId: 'cj-pod-tshirts',
    color: '#039BE5',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'mugs',
    label: 'Custom Mugs',
    icon: Coffee,
    desc: 'Ceramic & travel mugs. Print your vision.',
    count: '150+ designs',
    href: '/pod/mugs',
    goId: 'cj-pod-mugs',
    color: '#F97316',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'phone-cases',
    label: 'Phone Cases',
    icon: Smartphone,
    desc: 'Fits all major models. Shockproof & stylish.',
    count: '300+ designs',
    href: '/pod/phone-cases',
    goId: 'cj-pod-cases',
    color: '#10B981',
    image:
      'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=900',
  },
]

export default function PODPage() {
  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Printer size={48} className="mx-auto text-skyline-primary" />
        <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tight text-[var(--cb-text-primary)]">
          Print-on-Demand
        </h1>
        <p className="mt-3 text-lg text-[var(--cb-text-muted)]">
          Unique designs. Printed on demand. Shipped globally.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3">
        {POD_CATEGORIES.map((category) => {
          const Icon = category.icon
          return (
            <article
              key={category.id}
              className="cb-card group cursor-pointer overflow-hidden p-8 text-center transition-colors hover:border-skyline-primary/40"
            >
              <div className="relative mb-5 h-36 overflow-hidden rounded-card">
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <Icon size={32} style={{ color: category.color }} />
              </div>
              <h2 className="font-display text-xl font-black text-[var(--cb-text-primary)]">{category.label}</h2>
              <p className="mt-2 text-sm text-[var(--cb-text-muted)]">{category.desc}</p>
              <span
                className="cb-badge mt-3"
                style={{ backgroundColor: `${category.color}10`, color: category.color }}
              >
                {category.count}
              </span>
              <div className="mt-6 flex flex-col gap-2">
                <Link href={category.href} className="cb-btn-primary justify-center gap-2">
                  Browse Designs
                  <ArrowRight size={14} />
                </Link>
                <a
                  href={`/go/${category.goId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cb-btn-ghost justify-center"
                >
                  Buy on CJ
                </a>
              </div>
            </article>
          )
        })}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-8 px-6 pb-16">
        <div className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)]">
          <Star size={14} />
          Premium Quality
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)]">
          <Printer size={14} />
          Print on Demand
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)]">
          <ArrowRight size={14} />
          Global Shipping
        </div>
      </section>

      <section className="pb-12 text-center">
        <Link href={ROUTES.POD} className="text-xs text-[var(--cb-text-muted)]">
          CloudBasket POD Catalog
        </Link>
      </section>
    </div>
  )
}
