'use client'

import { useCallback, useState } from 'react'
import { CheckCircle, Mail, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      subject.trim().length === 0 ||
      message.trim().length === 0
    ) {
      return
    }

    setIsLoading(true)
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 800)
    })
    setSubmitted(true)
    setIsLoading(false)
  }, [email, message, name, subject])

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--cb-surface)]">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-16 text-center">
          <CheckCircle size={48} className="text-status-success" />
          <h1 className="mt-4 font-display text-3xl font-black text-[var(--cb-text-primary)]">Message Sent!</h1>
          <p className="mt-2 text-[var(--cb-text-muted)]">We&apos;ll reply within 24 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="flex items-center gap-2 font-display text-3xl font-black text-[var(--cb-text-primary)]">
          <Mail size={30} className="text-skyline-primary" />
          Contact Us
        </h1>
        <p className="mt-2 text-[var(--cb-text-muted)]">Questions, partnerships, press enquiries</p>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="glass-panel rounded-button border cb-border px-4 py-3 text-sm text-[var(--cb-text-primary)] outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="glass-panel rounded-button border cb-border px-4 py-3 text-sm text-[var(--cb-text-primary)] outline-none"
            />
          </div>

          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Subject"
            className="glass-panel w-full rounded-button border cb-border px-4 py-3 text-sm text-[var(--cb-text-primary)] outline-none"
          />

          <textarea
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your message"
            className="glass-panel w-full rounded-button border cb-border px-4 py-3 text-sm text-[var(--cb-text-primary)] outline-none"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="cb-btn-primary w-full justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </div>

        <div className="mt-8 space-y-2 border-t cb-border pt-6">
          <p className="flex items-center gap-2 text-sm text-[var(--cb-text-muted)]">
            <MessageSquare size={14} />
            privacy@cloudbasket.in
          </p>
          <p className="font-mono text-sm text-skyline-primary">privacy@cloudbasket.in</p>
          <p className="font-mono text-sm text-skyline-primary">partners@cloudbasket.in</p>
        </div>
      </div>
    </div>
  )
}
