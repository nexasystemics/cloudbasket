'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Zap, Phone } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-[var(--cb-bg)] px-4 py-16">
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <section className="cb-card w-full max-w-md p-10">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#039BE5] text-sm font-black text-white">
              CB
            </div>
            <div>
              <p className="text-lg font-black">CloudBasket</p>
              <p className="text-xs text-[var(--cb-text-muted)]">Sign in to your account</p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <button type="button" className="cb-btn cb-btn-ghost w-full gap-3">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[#EA4335]">
                G
              </span>
              Continue with Google
            </button>
            <button type="button" className="cb-btn cb-btn-ghost w-full gap-3">
              <Phone size={14} /> Continue with Phone
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--cb-border)]" />
            <p className="text-xs text-[var(--cb-text-muted)]">or sign in with email</p>
            <div className="h-px flex-1 bg-[var(--cb-border)]" />
          </div>

          <div>
            <label className="mb-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest">
              <Mail size={12} /> Email
            </label>
            <input
              className="cb-input w-full"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="mt-4">
              <label className="mb-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                <Lock size={12} /> Password
              </label>
              <div className="relative">
                <input
                  className="cb-input w-full pr-10"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p className="mt-2 text-right text-xs">
              <Link href="/forgot-password" className="text-[#039BE5]">
                Forgot password?
              </Link>
            </p>

            <button type="button" className="cb-btn cb-btn-primary mt-6 w-full gap-2" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" /> Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Sign In
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-[var(--cb-text-muted)]">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-[#039BE5]">
              Create one free
            </Link>
          </p>

          <div className="mt-6 flex justify-center gap-4 text-xs text-[var(--cb-text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Shield size={12} /> DPDPA 2023 Compliant
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap size={12} /> Zero Checkout
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}
