'use client'
import { useMemo, useState } from 'react'
import { Gift, Copy, Check, MessageCircle, ChevronDown } from 'lucide-react'
import { copyToClipboard, shareToWhatsApp } from '@/lib/share'

export default function ReferralWidget() {
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const refCode = useMemo(() => {
    try {
      const stored = localStorage.getItem('cb_ref_code')
      if (stored) return stored
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      localStorage.setItem('cb_ref_code', code)
      return code
    } catch { return 'CBREF01' }
  }, [])

  const refUrl = `https://cloudbasket.in?ref=${refCode}`

  const handleCopy = async () => {
    const ok = await copyToClipboard(refUrl)
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  const FAQS = [
    { q: 'How do I refer a friend?', a: 'Share your unique referral link. When they sign up and use CloudBasket, your referral is credited.' },
    { q: 'When do I earn credits?', a: 'Credits will be awarded when your referred friend makes their first affiliate click. Credits system launching soon.' },
    { q: 'Is there a limit on referrals?', a: 'No limit. Refer as many friends as you like.' },
  ]

  return (
    <div className="space-y-6">
      <div className="cb-card p-8 text-center bg-gradient-to-br from-skyline-primary/5 to-skyline-primary/10">
        <Gift size={48} className="mx-auto mb-4 text-skyline-primary" />
        <h2 className="text-2xl font-black">Refer & Earn</h2>
        <p className="text-[var(--cb-text-muted)] mt-2 mb-6">Share CloudBasket with friends and earn shopping credits when they join.</p>
        <div className="flex items-center gap-2 max-w-sm mx-auto mb-4">
          <input className="cb-input flex-1 font-mono text-sm" value={refUrl} readOnly aria-label="Referral URL" />
          <button type="button" onClick={handleCopy} className="cb-btn cb-btn-primary gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600" aria-label="Copy referral link">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button type="button" onClick={() => shareToWhatsApp(`Join CloudBasket — India's smartest price comparison platform! Use my referral link:`, refUrl)} className="cb-btn cb-btn-ghost gap-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
          <MessageCircle size={16} className="text-green-500" /> Share on WhatsApp
        </button>
        <p className="text-xs text-[var(--cb-text-muted)] mt-4">Your code: <strong className="font-mono">{refCode}</strong></p>
      </div>

      <div className="cb-card p-6">
        <h3 className="font-black mb-4">How It Works</h3>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Share your link', desc: 'Send your unique referral link to friends, family or followers.' },
            { step: '2', label: 'They sign up', desc: 'Your friend visits CloudBasket and creates an account using your link.' },
            { step: '3', label: 'You both earn', desc: 'Shopping credits awarded to both of you. Credits system launching soon.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-skyline-primary/10 flex items-center justify-center font-black text-skyline-primary flex-shrink-0 mt-0.5">{item.step}</div>
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs text-[var(--cb-text-muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cb-card p-6">
        <h3 className="font-black mb-4">FAQ</h3>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-[var(--cb-border)] last:border-0">
              <button type="button" className="flex w-full items-center justify-between py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                <span className="text-sm font-bold">{faq.q}</span>
                <ChevronDown size={16} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="pb-3 text-sm text-[var(--cb-text-muted)]">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}