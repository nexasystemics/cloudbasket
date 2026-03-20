'use client'
import { useState } from 'react'
import { Share2, MessageCircle, Twitter, Copy, Check } from 'lucide-react'
import { shareToWhatsApp, shareToTwitter, copyToClipboard } from '@/lib/share'

type ShareButtonProps = {
  text: string
  url: string
  variant?: 'icon' | 'full'
}

export default function ShareButton({ text, url, variant = 'icon' }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(url)
    if (success) { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button type="button" onClick={() => setOpen(!open)} className="cb-btn cb-btn-ghost p-2" aria-label="Share product">
          <Share2 size={16} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-zinc-900 rounded-xl border border-[var(--cb-border)] shadow-xl p-2 flex gap-1">
            <button type="button" onClick={() => { shareToWhatsApp(text, url); setOpen(false) }} className="cb-btn cb-btn-ghost p-2" aria-label="Share on WhatsApp"><MessageCircle size={16} className="text-green-500" /></button>
            <button type="button" onClick={() => { shareToTwitter(text, url); setOpen(false) }} className="cb-btn cb-btn-ghost p-2" aria-label="Share on Twitter"><Twitter size={16} className="text-sky-500" /></button>
            <button type="button" onClick={handleCopy} className="cb-btn cb-btn-ghost p-2" aria-label="Copy link">{copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => shareToWhatsApp(text, url)} className="cb-btn cb-btn-ghost gap-2 text-sm">
        <MessageCircle size={16} className="text-green-500" /> WhatsApp
      </button>
      <button type="button" onClick={() => shareToTwitter(text, url)} className="cb-btn cb-btn-ghost gap-2 text-sm">
        <Twitter size={16} className="text-sky-500" /> Twitter/X
      </button>
      <button type="button" onClick={handleCopy} className="cb-btn cb-btn-ghost gap-2 text-sm">
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}