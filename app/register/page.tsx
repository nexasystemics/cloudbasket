'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Building, ArrowRight, ShoppingBag, Users, Printer } from 'lucide-react'

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

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [accountType, setAccountType] = useState<AccountType>('shopper')
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const updateField = (key: keyof RegisterFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }))
  }

  const handleCreateAccount = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
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
                step >= 1 ? 'bg-[#10B981] text-white' : 'bg-[var(--cb-surface-2)]'
              }`}
            >
              1
            </div>
            <div className="h-px flex-1 bg-[var(--cb-border)]" />
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                step === 2 ? 'bg-[#039BE5] text-white' : 'bg-[var(--cb-surface-2)]'
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
                  <User size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    className="cb-input w-full pl-9"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </div>

                <div className="relative mb-4">
                  <Mail size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    className="cb-input w-full pl-9"
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>

                <input
                  className="cb-input mb-4 w-full"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                />

                <div className="relative mb-4">
                  <Building size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    className="cb-input w-full pl-9"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(event) => updateField('city', event.target.value)}
                  />
                </div>

                <div className="relative mb-4">
                  <Lock size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
                  <input
                    className="cb-input w-full pl-9 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <input
                  className="cb-input mb-4 w-full"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                />

                {accountType === 'associate' || accountType === 'pod' ? (
                  <input
                    className="cb-input mb-4 w-full"
                    placeholder="Referral code (optional)"
                    value={formData.referralCode}
                    onChange={(event) => updateField('referralCode', event.target.value)}
                  />
                ) : null}

                <label className="mb-6 flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" />
                  <p className="text-xs text-[var(--cb-text-muted)]">
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-[#039BE5]">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="text-[#039BE5]">
                      Privacy Policy
                    </Link>
                  </p>
                </label>

                <button
                  type="button"
                  className="cb-btn cb-btn-primary w-full gap-2"
                  onClick={handleCreateAccount}
                  disabled={isLoading}
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
