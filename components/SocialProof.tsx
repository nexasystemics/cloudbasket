'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, Eye, TrendingUp, type LucideIcon } from 'lucide-react'

interface SocialProofProps {
  productId?: string
  className?: string
}

type NotificationItem = {
  type: 'viewing' | 'saved' | 'bought'
  text: string
  icon: LucideIcon
}

const NOTIFICATIONS: NotificationItem[] = [
  { type: 'viewing', text: '{n} people viewing this deal', icon: Eye },
  { type: 'saved', text: 'Priya from Mumbai saved this', icon: TrendingUp },
  { type: 'saved', text: 'Rahul from Delhi saved this', icon: TrendingUp },
  { type: 'viewing', text: '{n} people viewing this deal', icon: Eye },
  { type: 'bought', text: 'Arjun from Bengaluru got this deal', icon: Users },
  { type: 'saved', text: 'Sneha from Pune added to wishlist', icon: TrendingUp },
  { type: 'viewing', text: '{n} people viewing this deal', icon: Eye },
  { type: 'bought', text: 'Vikram from Chennai saved Rs3,200', icon: Users },
  { type: 'viewing', text: '{n} people viewing this', icon: Eye },
  { type: 'saved', text: 'Anjali from Hyderabad saved this', icon: TrendingUp },
  { type: 'bought', text: 'Suresh from Jaipur got this deal', icon: Users },
  { type: 'viewing', text: '{n} people viewing this deal', icon: Eye },
]

const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function SocialProofWidget({ className = '' }: SocialProofProps) {
  const [current, setCurrent] = useState<number>(0)
  const [visible, setVisible] = useState<boolean>(true)
  const [viewingCount, setViewingCount] = useState<number>(() => randomBetween(8, 47))

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setCurrent(Math.floor(Math.random() * NOTIFICATIONS.length))
        setViewingCount(randomBetween(8, 47))
        setVisible(true)
      }, 400)
    }, 4000)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  const notification = NOTIFICATIONS[current]
  const text = useMemo(() => notification.text.replace('{n}', String(viewingCount)), [notification.text, viewingCount])
  const Icon = notification.icon

  return (
    <div className={className}>
      <div className={`text-muted flex items-center gap-2 text-xs transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <Icon size={12} className="text-[#10B981]" />
        <p>{text}</p>
      </div>
    </div>
  )
}
