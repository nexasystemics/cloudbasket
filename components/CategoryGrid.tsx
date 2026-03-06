import {
  BookOpen,
  Car,
  Dumbbell,
  Gamepad2,
  Home,
  Laptop,
  type LucideProps,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import type { ComponentType } from 'react'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'

type CategoryIcon = ComponentType<LucideProps>

const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  Mobiles: Smartphone,
  Laptops: Laptop,
  Fashion: Shirt,
  Home,
  Beauty: Sparkles,
  Sports: Dumbbell,
  Toys: Gamepad2,
  Grocery: ShoppingBasket,
  Automotive: Car,
  Books: BookOpen,
}

export default function CategoryGrid() {
  return (
    <section className="bg-[var(--cb-surface-2)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
          Explore Categories
        </h2>
        <p className="mb-16 mt-2 text-sm text-[var(--cb-text-muted)]">Find the best deals across every category</p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {MAIN_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category]
            const categorySlug = encodeURIComponent(category.toLowerCase())

            return (
              <Link key={category} href={`${ROUTES.HOME}category/${categorySlug}`} className="cb-card group cursor-pointer p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cb-surface-3)] transition-all duration-200 group-hover:scale-110 group-hover:bg-skyline-primary/10">
                  <Icon size={28} className="text-[var(--cb-text-muted)] transition-colors duration-200 group-hover:text-skyline-primary" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">{category}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
