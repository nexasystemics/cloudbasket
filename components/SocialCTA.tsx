import Link from 'next/link'

export function SocialCTA({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <Link href="https://t.me/cloudbasketdeals" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-[#039BE5] hover:underline font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
        <span>✈️</span> Join for instant deal alerts
      </Link>
    )
  }
  return (
    <div className="cb-card p-5 border-[#039BE5]/30 bg-[#039BE5]/5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="text-3xl">🔔</div>
          <div>
            <p className="font-black text-base">Never Miss a Deal</p>
            <p className="text-sm text-muted mt-0.5">47,000+ members · Price drops posted instantly · Free forever</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        <Link href="https://t.me/cloudbasketdeals" target="_blank" rel="noopener noreferrer"
          className="cb-btn cb-btn-primary flex items-center gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
          ✈️ Telegram
        </Link>
        <Link href="https://wa.me/cloudbasketdeals" target="_blank" rel="noopener noreferrer"
          className="cb-btn flex items-center gap-2 bg-[#25D366] text-white hover:opacity-90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
          💬 WhatsApp
        </Link>
        <Link href="https://facebook.com/cloudbasketin" target="_blank" rel="noopener noreferrer"
          className="cb-btn flex items-center gap-2 bg-[#1877F2] text-white hover:opacity-90 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
          📘 Facebook
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
        {['📱 Mobile alerts', '⚡ Instant flash deals', '🔕 Mute anytime', '🌍 Exclusive Deals · Free Forever'].map((text) => (
          <span key={text}>{text}</span>
        ))}
      </div>
    </div>
  )
}

export function TelegramCTA({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  return <SocialCTA variant={variant} />
}
