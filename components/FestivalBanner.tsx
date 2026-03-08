import Link from 'next/link'

const UPCOMING_FESTIVALS = [
  {
    name: 'Holi Special',
    date: 'March 14, 2026',
    emoji: '🎉',
    deal: 'Up to 60% off on fashion & home',
    color: '#FF6B35',
  },
  {
    name: 'Ugadi Deals',
    date: 'March 30, 2026',
    emoji: '🪔',
    deal: 'Best prices on home & gifts',
    color: '#10B981',
  },
] as const

function findNearestFestival() {
  const now = new Date()

  const upcoming = UPCOMING_FESTIVALS.map((festival) => {
    const festivalDate = new Date(festival.date)
    const diffMs = festivalDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return { ...festival, diffDays }
  })
    .filter((festival) => festival.diffDays >= 0)
    .sort((a, b) => a.diffDays - b.diffDays)

  return upcoming[0]
}

export default function FestivalBanner() {
  const festival = findNearestFestival()

  if (!festival || festival.diffDays > 15) {
    return null
  }

  return (
    <div
      className="border-b"
      style={{
        backgroundImage: `linear-gradient(to right, ${festival.color}33, transparent)`,
        borderBottomColor: `${festival.color}4D`,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-sm">
        <p>
          {festival.emoji} {festival.name} — {festival.deal}
        </p>
        <Link href="/deals" className="cb-btn text-xs">
          Shop Now →
        </Link>
      </div>
    </div>
  )
}
