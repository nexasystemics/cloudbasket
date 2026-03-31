// © 2026 NEXQON HOLDINGS — CloudBasket page.tsx
'use client'
import { useState, useEffect } from 'react'
import { getUserPoints } from '@/lib/gamification/points'
import { getLevel } from '@/lib/gamification/leaderboard'

export default function RewardsPage() {
  const [points, setPoints] = useState(0)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('cb_user_id') || 'demo' : 'demo'
  useEffect(() => { getUserPoints(userId).then(setPoints) }, [userId])
  const { level, badge, nextLevel } = getLevel(points)
  const progress = Math.min((points / nextLevel) * 100, 100)

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">My Rewards</h1>
      <div className="cb-card p-8 text-center mb-6">
        <div className="text-6xl mb-3">{badge}</div>
        <p className="text-4xl font-black text-skyline-primary">{points.toLocaleString()}</p>
        <p className="text-[var(--cb-text-muted)] mb-4">CloudBasket Points — {level}</p>
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-skyline-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[var(--cb-text-muted)] mt-2">{nextLevel - points} points to next level</p>
      </div>
      <div className="cb-card p-6">
        <h2 className="font-black mb-4">How to earn points</h2>
        {[['Sign Up', '100 pts'],['First Purchase', '500 pts'],['Write Review', '50 pts'],['Refer a Friend', '200 pts'],['Daily Visit', '5 pts'],['Add to Wishlist', '2 pts'],['Share Product', '10 pts']].map(([action, pts]) => (
          <div key={action} className="flex justify-between py-2 border-b border-[var(--cb-border)] last:border-0 text-sm">
            <span>{action}</span><span className="font-black text-skyline-primary">{pts}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
