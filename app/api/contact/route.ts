import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit } from '@/lib/redis'

export const runtime = 'nodejs'

type ContactField = 'name' | 'email' | 'subject' | 'message'

type ContactPayload = Record<ContactField, string>

type FieldErrors = Partial<Record<ContactField, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function validatePayload(payload: unknown): { data: ContactPayload | null; fieldErrors: FieldErrors } {
  if (!isRecord(payload)) {
    return {
      data: null,
      fieldErrors: {
        name: 'Enter your name.',
        email: 'Enter your email address.',
        subject: 'Enter a subject.',
        message: 'Enter your message.',
      },
    }
  }

  const data: ContactPayload = {
    name: getString(payload.name),
    email: getString(payload.email),
    subject: getString(payload.subject),
    message: getString(payload.message),
  }

  const fieldErrors: FieldErrors = {}

  if (data.name.length < 2 || data.name.length > 80) {
    fieldErrors.name = 'Name must be between 2 and 80 characters.'
  }

  if (data.email.length === 0 || data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) {
    fieldErrors.email = 'Enter a valid email address.'
  }

  if (data.subject.length < 3 || data.subject.length > 120) {
    fieldErrors.subject = 'Subject must be between 3 and 120 characters.'
  }

  if (data.message.length < 10 || data.message.length > 5000) {
    fieldErrors.message = 'Message must be between 10 and 5000 characters.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { data: null, fieldErrors }
  }

  return { data, fieldErrors: {} }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
  const rl = await rateLimit(ip, 10, 60)
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 },
    )
  }

  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  const { data, fieldErrors } = validatePayload(payload)

  if (data === null) {
    return NextResponse.json(
      { success: false, error: 'Please correct the highlighted fields.', fieldErrors },
      { status: 400 },
    )
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL

  if (!resendApiKey || !contactEmail) {
    return NextResponse.json(
      { success: false, error: 'Contact service is not configured.' },
      { status: 500 },
    )
  }

  const resend = new Resend(resendApiKey)
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'CloudBasket Contact <onboarding@resend.dev>'
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br />')

  const text = [
    'New contact form submission',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    '',
    data.message,
  ].join('\n')

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: [contactEmail],
      reply_to: data.email,
      subject: `Contact form: ${data.subject}`,
      text,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
          <h1 style="margin:0 0 16px;font-size:24px">New Contact Form Submission</h1>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
          <div style="padding:16px;border:1px solid #E5E7EB;border-radius:12px;background:#F9FAFB;line-height:1.6">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    if (result.error) {
      console.error('Contact email send failed', result.error)
      return NextResponse.json(
        { success: false, error: 'Unable to send your message right now.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact route error', error)
    return NextResponse.json(
      { success: false, error: 'Unable to send your message right now.' },
      { status: 500 },
    )
  }
}

