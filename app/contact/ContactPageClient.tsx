'use client'

import { type FormEvent, useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Send, CheckCircle, Clock, Phone } from 'lucide-react'

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<keyof ContactFormData, string>>

type ContactApiResponse =
  | { success: true }
  | { success: false; error: string; fieldErrors?: FieldErrors }

const CONTACT_INFO = {
  email: 'hello@cloudbasket.in',
  whatsapp: '+91 98765 43210',
  address: 'NEXQON Holdings, Koramangala, Bengaluru, Karnataka 560034',
  responseTime: 'Within 8 business hours',
} as const

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Deal Not Working',
  'Associates Program',
  'Print on Demand',
  'Report a Bug',
  'Other',
] as const

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateFormData(formData: ContactFormData): FieldErrors {
  const errors: FieldErrors = {}

  if (formData.name.trim().length < 2 || formData.name.trim().length > 80) {
    errors.name = 'Name must be between 2 and 80 characters.'
  }

  if (
    formData.email.trim().length === 0 ||
    formData.email.trim().length > 254 ||
    !EMAIL_PATTERN.test(formData.email.trim())
  ) {
    errors.email = 'Enter a valid email address.'
  }

  if (formData.subject.trim().length < 3 || formData.subject.trim().length > 120) {
    errors.subject = 'Select or enter a valid subject.'
  }

  if (formData.message.trim().length < 10 || formData.message.trim().length > 5000) {
    errors.message = 'Message must be between 10 and 5000 characters.'
  }

  return errors
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const updateField = (key: keyof ContactFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (!current[key]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[key]
      return nextErrors
    })
    setFormError('')
  }

  const resetFormState = () => {
    setSubmitted(false)
    setFormData(INITIAL_FORM)
    setFieldErrors({})
    setFormError('')
    setIsSubmitting(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateFormData(formData)
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setFormError('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      })

      const payload = (await response.json()) as ContactApiResponse

      if (!response.ok || payload.success === false) {
        const nextFormError = payload.success === false ? payload.error : 'Unable to send your message right now.'
        const nextFieldErrors = payload.success === false ? payload.fieldErrors ?? {} : {}

        setFormError(nextFormError)
        setFieldErrors(nextFieldErrors)
        setIsSubmitting(false)
        return
      }

      setSubmitted(true)
      setFormData(INITIAL_FORM)
      setFieldErrors({})
      setIsSubmitting(false)
    } catch {
      setFormError('Unable to send your message right now. Please try again shortly.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-black tracking-tighter">Get in Touch</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">We respond within 8 business hours. No bots - real humans.</p>
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
                <p className="mt-2 text-[var(--cb-text-muted)]">Thanks! We will reply within 8 business hours.</p>
                <button type="button" className="cb-btn cb-btn-primary mt-6" onClick={resetFormState}>
                  Send Another Message
                </button>
              </article>
            ) : (
              <article className="cb-card p-8">
                <h2 className="mb-6 text-xl font-black">Send a Message</h2>

                <form onSubmit={handleSubmit} noValidate>
                  <input
                    className="cb-input mb-2 w-full"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                  />
                  {fieldErrors.name ? (
                    <p id="contact-name-error" className="mb-4 text-sm text-rose-500">
                      {fieldErrors.name}
                    </p>
                  ) : (
                    <div className="mb-4" />
                  )}

                  <input
                    className="cb-input mb-2 w-full"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                  />
                  {fieldErrors.email ? (
                    <p id="contact-email-error" className="mb-4 text-sm text-rose-500">
                      {fieldErrors.email}
                    </p>
                  ) : (
                    <div className="mb-4" />
                  )}

                  <select
                    className="cb-input mb-2 w-full"
                    value={formData.subject}
                    onChange={(event) => updateField('subject', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.subject)}
                    aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
                  >
                    <option value="">Select a topic...</option>
                    {SUBJECT_OPTIONS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.subject ? (
                    <p id="contact-subject-error" className="mb-4 text-sm text-rose-500">
                      {fieldErrors.subject}
                    </p>
                  ) : (
                    <div className="mb-4" />
                  )}

                  <textarea
                    className="cb-input mb-2 min-h-[140px] w-full resize-none"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                  />
                  {fieldErrors.message ? (
                    <p id="contact-message-error" className="mb-4 text-sm text-rose-500">
                      {fieldErrors.message}
                    </p>
                  ) : (
                    <div className="mb-4" />
                  )}

                  {formError ? (
                    <p className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400" role="alert">
                      {formError}
                    </p>
                  ) : null}

                  <button type="submit" className="cb-btn cb-btn-primary w-full gap-2" disabled={isSubmitting}>
                    <Send size={16} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="mt-3 text-center text-[11px] text-[var(--cb-text-muted)]">
                    By submitting this form, you consent to the processing of your personal data as described in our{' '}
                    <Link href="/legal/privacy" className="text-skyline-primary underline">Privacy Policy</Link>.
                  </p>
                </form>
              </article>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
