'use client'

import Link from 'next/link'
import { ExternalLink, Tag, TrendingDown, Zap, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface PromotionSidebarProps {
  selectedCategory: string
}

interface PromoItem {
  id: string
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  goId: string
  icon: LucideIcon
}

const PROMOS: PromoItem[] = [
  {
    id: 'p1',
    title: 'Flash Sale',
    subtitle: 'Up to 70% off mobiles',
    badge: 'Ends 11:59 PM',
    badgeColor: '#F97316',
    goId: 'amazon-flash1',
    icon: Zap,
  },
  {
    id: 'p2',
    title: 'Bank Offers',
    subtitle: 'Extra 10% with HDFC',
    badge: 'Limited Period',
    badgeColor: '#039BE5',
    goId: 'flipkart-bank1',
    icon: Tag,
  },
  {
    id: 'p3',
    title: 'Trending Now',
    subtitle: 'Top picks this week',
    badge: 'Hot',
    badgeColor: '#EF4444',
    goId: 'amazon-trend1',
    icon: TrendingDown,
  },
  {
    id: 'p4',
    title: 'CJ Exclusives',
    subtitle: 'Global deals, INR prices',
    badge: 'New Arrivals',
    badgeColor: '#10B981',
    goId: 'cj-exclusive1',
    icon: ExternalLink,
  },
]

const toRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '')
  const value = Number.parseInt(normalized, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export default function PromotionSidebar({ selectedCategory }: PromotionSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="mb-2 text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
        Promotions
      </h3>

      {PROMOS.map((promo) => {
        const Icon = promo.icon
        return (
          <button
            key={promo.id}
            type="button"
            onClick={() => window.open(`/go/${promo.goId}`, '_blank', 'noopener,noreferrer')}
            className="cb-card flex cursor-pointer items-start gap-3 p-4 text-start transition-colors hover:border-skyline-primary/30"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-badge"
              style={{ backgroundColor: toRgba(promo.badgeColor, 0.15) }}
            >
              <Icon size={18} style={{ color: promo.badgeColor }} />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="text-[13px] font-bold text-[var(--cb-text-primary)]">{promo.title}</span>
              <span className="mt-0.5 text-[11px] text-[var(--cb-text-muted)]">{promo.subtitle}</span>
              <span
                className="cb-badge mt-1 w-fit"
                style={{
                  backgroundColor: toRgba(promo.badgeColor, 0.1),
                  color: promo.badgeColor,
                }}
              >
                {promo.badge}
              </span>
            </span>
          </button>
        )
      })}

      <p className="mt-2 text-[10px] italic text-[var(--cb-text-muted)]">
        * Affiliate links. We may earn commission.
      </p>
      <p className="text-[10px] text-[var(--cb-text-muted)]">
        {selectedCategory === 'All' ? 'All categories' : `Category: ${selectedCategory}`}
      </p>
      <Link href={ROUTES.AFFILIATE} className="text-[10px] text-skyline-primary hover:underline">
        Read affiliate disclosure
      </Link>
    </div>
  )
}
