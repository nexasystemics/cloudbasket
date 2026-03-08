'use client'

import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle, Clock, Phone } from 'lucide-react'

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

const CONTACT_INFO = {
  email: 'hello@cloudbasket.in',
  whatsapp: '+91 98765 43210',
  address: 'NEXQON Holdings, Koramangala, Bengaluru, Karnataka 560034',
  responseTime: 'Within 24 hours on business days',
} as const

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM)

  const updateField = (key: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-black tracking-tighter">Get in Touch</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">We respond within 24 hours. No bots — real humans.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <aside className="flex flex-col gap-4 md:col-span-1">
            <article className="cb-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
                <Mail size={18} className="text-[#039BE5]" />
              </div>
              <p className="text-sm font-black">Email Us</p>
              <p className="mt-1 text-sm text-[#039BE5]">{CONTACT_INFO.email}</p>
            </article>

            <article className="cb-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
                <Phone size={18} className="text-[#039BE5]" />
              </div>
              <p className="text-sm font-black">WhatsApp</p>
              <p className="mt-1 text-sm">{CONTACT_INFO.whatsapp}</p>
            </article>

            <article className="cb-card p-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5]/10">
                <MapPin size={18} className="text-[#039BE5]" />
              </div>
              <p className="text-sm font-black">Office</p>
              <p className="mt-1 text-sm text-[var(--cb-text-muted)]">NEXQON Holdings</p>
              <p className="text-sm text-[var(--cb-text-muted)]">Koramangala, Bengaluru</p>
            </article>

            <article className="cb-card border-[#039BE5]/20 bg-[#039BE5]/5 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold">
                <Clock size={14} className="text-[#039BE5]" /> Average response time: 4 hours
              </p>
              <p className="mt-1 text-xs text-[var(--cb-text-muted)]">{CONTACT_INFO.responseTime}</p>
            </article>
          </aside>

          <div className="md:col-span-2">
            {submitted ? (
              <article className="cb-card p-12 text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-[#10B981]" />
                <h2 className="text-2xl font-black">Message Sent!</h2>
                <p className="mt-2 text-[var(--cb-text-muted)]">We'll get back to you within 24 hours.</p>
                <button type="button" className="cb-btn cb-btn-primary mt-6" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </article>
            ) : (
              <article className="cb-card p-8">
                <h2 className="mb-6 text-xl font-black">Send a Message</h2>

                <div>
                  <input
                    className="cb-input mb-4 w-full"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />

                  <input
                    className="cb-input mb-4 w-full"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />

                  <select
                    className="cb-input mb-4 w-full"
                    value={formData.subject}
                    onChange={(event) => updateField('subject', event.target.value)}
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Enquiry</option>
                    <option value="deals">Deal Not Working</option>
                    <option value="associates">Associates Program</option>
                    <option value="pod">Print on Demand</option>
                    <option value="bug">Report a Bug</option>
                    <option value="other">Other</option>
                  </select>

                  <textarea
                    className="cb-input mb-6 min-h-[140px] w-full resize-none"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(event) => updateField('message', event.target.value)}
                  />

                  <button type="button" className="cb-btn cb-btn-primary w-full gap-2" onClick={() => setSubmitted(true)}>
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}


