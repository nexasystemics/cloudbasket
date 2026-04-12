import Link from 'next/link'

export function TelegramCTA({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <Link
        href="https://t.me/cloudbasketdeals"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-[#039BE5] hover:underline font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
      >
        <span>✈️</span> Join Telegram for instant deal alerts
      </Link>
    )
  }

  return (
    <div className="cb-card p-5 border-[#039BE5]/30 bg-[#039BE5]/5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-3xl">✈️</div>
          <div>
            <p className="font-black text-base">Get Deals on Telegram</p>
            <p className="text-sm text-muted mt-0.5">47,000+ members · Price drops posted instantly · Free forever</p>
          </div>
        </div>
        <Link
          href="https://t.me/cloudbasketdeals"
          target="_blank"
          rel="noopener noreferrer"
          className="cb-btn cb-btn-primary flex items-center gap-2 whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
        >
          Join Channel →
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted">
        {['📱 Mobile alerts', '⚡ Instant flash deals', '🔕 Mute anytime', '🌍 Global deals'].map((text) => (
          <span key={text}>{text}</span>
        ))}
      </div>
    </div>
  )
}

