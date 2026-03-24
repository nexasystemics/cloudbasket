import {
  BookOpen,
  Car,
  Dumbbell,
  Gamepad2,
  Home,
  Laptop,
  Music,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
  TrendingUp,
  Heart,
  Puzzle,
  Watch,
  GraduationCap,
  BarChart2,
  Gem,
  Plane,
  Printer,
  Cpu,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import type { CategorySlug } from '@/lib/cloudbasket-data'

export const CATEGORY_ICON_MAP: Record<CategorySlug, LucideIcon> = {
  automotive: Car,
  beauty: Sparkles,
  books: BookOpen,
  courses: GraduationCap,
  electronics: Cpu,
  fashion: Shirt,
  finance: TrendingUp,
  gaming: Gamepad2,
  grocery: ShoppingBasket,
  health: Heart,
  home: Home,
  investments: BarChart2,
  jewellery: Gem,
  laptops: Laptop,
  mobiles: Smartphone,
  music: Music,
  pod: Printer,
  sports: Dumbbell,
  toys: Puzzle,
  travel: Plane,
  watches: Watch,
}

export const GRADIENT_MAP: Record<CategorySlug, string> = {
  electronics: 'from-blue-600 to-blue-400',
  mobiles: 'from-indigo-600 to-indigo-400',
  fashion: 'from-rose-600 to-rose-400',
  home: 'from-amber-600 to-amber-400',
  books: 'from-emerald-600 to-emerald-400',
  sports: 'from-orange-600 to-orange-400',
  automotive: 'from-slate-600 to-slate-400',
  gaming: 'from-purple-600 to-purple-400',
  beauty: 'from-pink-600 to-pink-400',
  finance: 'from-cyan-600 to-cyan-400',
  grocery: 'from-lime-600 to-lime-400',
  health: 'from-red-600 to-red-400',
  music: 'from-violet-600 to-violet-400',
  toys: 'from-yellow-600 to-yellow-400',
  watches: 'from-sky-600 to-sky-400',
  courses: 'from-teal-600 to-teal-400',
  investments: 'from-green-600 to-green-400',
  jewellery: 'from-fuchsia-600 to-fuchsia-400',
  travel: 'from-blue-500 to-cyan-500',
  pod: 'from-zinc-600 to-zinc-400',
  laptops: 'from-slate-700 to-slate-500',
}

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICON_MAP[slug as CategorySlug] || ShoppingBag
}

export function getCategoryGradient(slug: string): string {
  return GRADIENT_MAP[slug as CategorySlug] || 'from-zinc-600 to-zinc-400'
}
