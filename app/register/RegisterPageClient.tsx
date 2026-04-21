'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Building, ArrowRight, ShoppingBag, Users, Printer } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type AccountType = 'shopper' | 'associate' | 'pod'

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  city: string
  referralCode: string
}

const INITIAL_FORM: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  city: '',
  referralCode: '',
}

const INDIAN_PHONE_RE = /^(\+91)?[6-9]\d{9}$/

export default function RegisterPageClient() {
  const [step, setStep] = useState<1 | 2>(1)
  const [accountType, setAccountType] = useState<AccountType>('shopper')
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const updateField = (key: keyof RegisterFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  const handleCreateAccount = async () => {
    setError(null)

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy to continue.')
      return
    }
    if (!formData.name.trim()) {
      setError('Full name is required.')
      return
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address.')
      return
    }
    if (formData.phone && !INDIAN_PHONE_RE.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Indian phone number.')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Auth service is not configured. Please try again later.')
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            phone: formData.phone.trim() || null,
            city: formData.city.trim() || null,
            account_type: accountType,
            referral_code: formData.referralCode.trim() || null,
          },
        },
      })

      if (signUpError) throw signUpError

      setSuccess('Account created! Check your email to confirm before signing in.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--cb-bg)] px-4 py-16">
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <section className="cb-card w-full max-w-lg p-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5] text-sm font-black text-white">
              CB
            </div>
            <div>
              <p className="text-lg font-black">CloudBasket</p>
              <p className="text-xs text-[var(--cb-text-muted)]">Create your account</p>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                step >= 1 ? 'bg-emerald-600 dark:bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              1
            </div>
            <div className="h-px flex-1 bg-neutral-300 dark:bg-neutral-600" />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                step === 2 ? 'bg-sky-600 dark:bg-sky-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              2
            </div>
          </div>

          {step === 1 ? (
            <div>
              <h2 className="mb-2 text-xl font-black">Choose Account Type</h2>
              <p className="mb-6 text-sm text-[var(--cb-text-muted)]">What brings you to CloudBasket?</p>

              <div className="flex flex-col gap-3">
                {[
                  {
                    type: 'shopper' as const,
                    icon: ShoppingBag,
                    name: 'Shopper',
                    desc: 'Find the best deals across 50+ stores',
                    color: '#039BE5',
                  },
                  {
                    type: 'associate' as const,
                    icon: Users,
                    name: 'Associate',
                    desc: 'Earn commissions by sharing deals',
                    color: '#10B981',
                  },
                  {
                    type: 'pod' as const,
                    icon: Printer,
                    name: 'POD Creator',
                    desc: 'Sell custom merchandise',
                    color: '#F97316',
                  },
                ].map((item) => {
                  const ItemIcon = item.icon
                  const selected = accountType === item.type

                  return (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setAccountType(item.type)}
                      className={`cb-card flex items-center gap-4 border-2 p-5 text-left ${
                        selected ? 'border-[#039BE5] bg-[#039BE5]/5' : 'border-transparent'
                      }`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${item.color}1A` }}>
                        <ItemIcon size={20} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.name}</p>
                        <p className="text-xs text-[var(--cb-text-muted)]">{item.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button type="button" className="cb-btn cb-btn-primary mt-6 w-full gap-2" onClick={() => setStep(2)}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div>
              <h2 className="mb-6 text-xl font-black">Create Your Account</h2>

              <div>
                <div className="relative mb-4">
                  <label htmlFor="register-name" className="sr-only">Full name</label>
                  <User size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    id="register-name"
                    className="cb-input w-full pl-9"
                    placeholder="Full name"
                    aria-label="Full name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </div>

                <div className="relative mb-4">
                  <label htmlFor="register-email" className="sr-only">Email address</label>
                  <Mail size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    id="register-email"
                    className="cb-input w-full pl-9"
                    type="email"
                    placeholder="you@email.com"
                    aria-label="Email address"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="register-phone" className="sr-only">Phone number</label>
                  <input
                    id="register-phone"
                    className="cb-input mb-4 w-full"
                    type="tel"
                    placeholder="+91 98765 43210"
                    aria-label="Phone number"
                    value={formData.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                  />
                </div>

                <div className="relative mb-4">
                  <label htmlFor="register-city" className="sr-only">City</label>
                  <Building size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    id="register-city"
                    className="cb-input w-full pl-9"
                    placeholder="Your city"
                    aria-label="City"
                    value={formData.city}
                    onChange={(event) => updateField('city', event.target.value)}
                  />
                </div>

                <div className="relative mb-4">
                  <label htmlFor="register-password" className="sr-only">Password</label>
                  <Lock size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    id="register-password"
                    className="cb-input w-full pl-9 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min 8 characters)"
                    aria-label="Password"
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="mb-4">
                  <label htmlFor="register-confirm" className="sr-only">Confirm password</label>
                  <input
                    id="register-confirm"
                    className="cb-input mb-4 w-full"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    aria-label="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                  />
                </div>

                {accountType === 'associate' || accountType === 'pod' ? (
                  <div className="mb-4">
                    <label htmlFor="register-referral" className="sr-only">Referral code (optional)</label>
                    <input
                      id="register-referral"
                      className="cb-input mb-4 w-full"
                      placeholder="Referral code (optional)"
                      aria-label="Referral code"
                      value={formData.referralCode}
                      onChange={(event) => updateField('referralCode', event.target.value)}
                    />
                  </div>
                ) : null}

                <div className="mb-6 flex items-start gap-3">
                  <input
                    id="register-terms"
                    type="checkbox"
                    className="mt-1 rounded"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                  />
                  <label htmlFor="register-terms" className="text-xs text-[var(--cb-text-muted)]">
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-[#039BE5]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="text-[#039BE5]">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {error ? (
                  <p role="alert" aria-live="assertive" className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                    {error}
                  </p>
                ) : null}

                {success ? (
                  <p role="status" aria-live="polite" className="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {success}
                  </p>
                ) : null}

                <button
                  type="button"
                  className="cb-btn cb-btn-primary w-full gap-2"
                  onClick={handleCreateAccount}
                  disabled={isLoading || Boolean(success)}
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Create Account
                    </>
                  )}
                </button>
              </div>

              <button type="button" className="cb-btn cb-btn-ghost mt-3 w-full" onClick={() => setStep(1)}>
                ← Back
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-[var(--cb-text-muted)]">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#039BE5]">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
