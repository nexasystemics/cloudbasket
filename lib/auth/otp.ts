// © 2026 NEXQON HOLDINGS — CloudBasket otp.ts
// lib/auth/otp.ts — F18: OTP System
import { Resend } from 'resend'
import { env, isConfigured } from '@/lib/env'
import crypto from 'crypto'

export function generateOTP(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('base64').replace(/[^A-Z2-7]/g, '').slice(0, 32)
}

export async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  if (!isConfigured('RESEND_API_KEY')) return false
  try {
    const resend = new Resend(env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'CloudBasket <noreply@cloudbasket.co>',
      to: [email],
      subject: 'Your CloudBasket OTP',
      html: `<p>Your verification code: <strong style="font-size:24px">${otp}</strong></p><p>Valid for 10 minutes.</p>`,
    })
    return !error
  } catch { return false }
}

export async function sendSMSOTP(phone: string, otp: string): Promise<boolean> {
  if (!isConfigured('MSG91_AUTH_KEY')) return false
  try {
    const r = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: { authkey: env.MSG91_AUTH_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: process.env.MSG91_OTP_TEMPLATE_ID, mobile: `91${phone}`, otp })
    })
    return r.ok
  } catch { return false }
}
