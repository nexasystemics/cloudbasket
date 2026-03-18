'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

type FeedbackEntry = {
  rating: string
  comment: string
  timestamp: string
  page: string
}

const STORAGE_KEY = 'cb_feedback'
const EMOJIS: readonly { symbol: string; label: string }[] = [
  { symbol: '😞', label: 'Very unhappy' },
  { symbol: '😐', label: 'Neutral' },
  { symbol: '🙂', label: 'Okay' },
  { symbol: '😊', label: 'Happy' },
  { symbol: '🤩', label: 'Loved it' },
]
const MAX_COMMENT_LENGTH = 200
const THANK_YOU_DELAY = 2000

export default function FeedbackWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<string>('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  function openModal() {
    setOpen(true)
    setRating('')
    setComment('')
    setSubmitted(false)
  }

  function closeModal() {
    setOpen(false)
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      closeModal()
    }
  }

  function handleSubmit() {
    if (!rating) return

    const entry: FeedbackEntry = {
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      page: pathname ?? '/',
    }

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FeedbackEntry[]
      existing.push(entry)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    } catch {
      // localStorage unavailable — silently continue
    }

    setSubmitted(true)

    closeTimerRef.current = setTimeout(() => {
      closeModal()
      closeTimerRef.current = null
    }, THANK_YOU_DELAY)
  }

  return (
    <>
      {/* Fixed tab */}
      <button
        type="button"
        onClick={openModal}
        aria-label="Open feedback"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#039BE5] text-white px-2 py-4 rounded-l-xl shadow-xl hover:bg-[#0288cc] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-[11px] font-black uppercase tracking-widest">Feedback</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 ${
            prefersReducedMotion ? '' : 'animate-in fade-in duration-200'
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-heading"
        >
          <div
            className={`bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-2xl w-full max-w-md p-8 relative ${
              prefersReducedMotion ? '' : 'animate-in slide-in-from-bottom-4 duration-200'
            }`}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close feedback"
              className="absolute right-5 top-5 p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <p className="text-5xl mb-4">🙏</p>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Thank you!</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Your feedback helps us improve CloudBasket.</p>
              </div>
            ) : (
              <>
                <h2 id="feedback-heading" className="text-xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                  How are we doing?
                </h2>

                <div className="flex justify-between mb-6" role="group" aria-label="Rating">
                  {EMOJIS.map(({ symbol, label }) => (
                    <button
                      key={symbol}
                      type="button"
                      aria-label={label}
                      aria-pressed={rating === symbol}
                      onClick={() => setRating(symbol)}
                      className={`text-3xl p-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
                        rating === symbol
                          ? 'bg-[#039BE5]/10 ring-2 ring-[#039BE5] scale-110'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                    placeholder="Tell us more (optional)…"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-zinc-400">
                    {MAX_COMMENT_LENGTH - comment.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!rating}
                  className="w-full h-12 rounded-xl bg-[#039BE5] text-white text-[11px] font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0288cc] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                >
                  Submit Feedback
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
