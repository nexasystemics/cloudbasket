import {
  ArrowRight,
  BookOpen,
  Car,
  Dumbbell,
  Gamepad2,
  Home,
  Laptop,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'

type CategoryItem = {
  label: string
  icon: LucideIcon
  gradient: string
  image: string
  count: string
}

const CATEGORY_DATA: readonly CategoryItem[] = [
  {
    label: 'Mobiles',
    icon: Smartphone,
    gradient: 'from-blue-500 to-cyan-400',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    count: '200+ deals',
  },
  {
    label: 'Laptops',
    icon: Laptop,
    gradient: 'from-slate-600 to-slate-400',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
    count: '150+ deals',
  },
  {
    label: 'Fashion',
    icon: Shirt,
    gradient: 'from-pink-500 to-rose-400',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    count: '500+ deals',
  },
  {
    label: 'Home',
    icon: Home,
    gradient: 'from-amber-500 to-orange-400',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80',
    count: '300+ deals',
  },
  {
    label: 'Beauty',
    icon: Sparkles,
    gradient: 'from-purple-500 to-violet-400',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80',
    count: '250+ deals',
  },
  {
    label: 'Sports',
    icon: Dumbbell,
    gradient: 'from-green-500 to-emerald-400',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
    count: '180+ deals',
  },
  {
    label: 'Toys',
    icon: Gamepad2,
    gradient: 'from-yellow-500 to-amber-400',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    count: '120+ deals',
  },
  {
    label: 'Grocery',
    icon: ShoppingBasket,
    gradient: 'from-lime-500 to-green-400',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    count: '400+ deals',
  },
  {
    label: 'Automotive',
    icon: Car,
    gradient: 'from-red-500 to-orange-400',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
    count: '90+ deals',
  },
  {
    label: 'Books',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-blue-400',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    count: '200+ deals',
  },
]

export default function CategoryGrid() {
  return (
    <section className="bg-[var(--cb-surface-2)] py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div className="min-h-[60px]">
            <h2 className="font-display text-3xl font-black uppercase tracking-tighter text-[var(--cb-text-primary)]">
              Explore Categories
            </h2>
            <p className="mt-1 text-sm text-[var(--cb-text-muted)]">Find deals across every category</p>
          </div>
          <Link href={ROUTES.PRODUCTS} className="cb-btn-ghost inline-flex items-center gap-2 px-3 py-2 text-xs">
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORY_DATA.map((category) => {
            const Icon = category.icon
            const slug = encodeURIComponent(category.label.toLowerCase())
            return (
              <Link key={category.label} href={`/category/${slug}`} className="category-card min-h-[196px]">
                <div className="relative h-32 w-full overflow-hidden rounded-xl">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70`} />
                  <div className="absolute bottom-3 start-3">
                    <Icon size={24} className="text-white" />
                  </div>
                </div>

                <div className="min-h-[52px] pt-3">
                  <p className="category-card-label">{category.label}</p>
                  <span className="cb-badge cb-badge-blue mt-1">{category.count}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
