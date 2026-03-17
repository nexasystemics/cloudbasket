const PLATFORMS = [
  { name: 'Amazon', className: 'bg-orange-50 text-orange-700' },
  { name: 'Flipkart', className: 'bg-blue-50 text-blue-700' },
  { name: 'Croma', className: 'bg-green-50 text-green-700' },
  { name: 'Reliance Digital', className: 'bg-blue-50 text-blue-800' },
  { name: 'Nykaa', className: 'bg-pink-50 text-pink-700' },
  { name: 'Myntra', className: 'bg-purple-50 text-purple-700' },
] as const

export default function PlatformTrustBar() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shrink-0">
          We compare prices from
        </span>
        {PLATFORMS.map((platform) => (
          <span
            key={platform.name}
            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-transparent ${platform.className}`}
          >
            {platform.name}
          </span>
        ))}
      </div>
    </section>
  )
}
