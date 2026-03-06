'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'
import type { CBUser } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useGlobal()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      if (email.trim().length === 0 || password.trim().length === 0) {
        throw new Error('Missing credentials')
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), 1000)
      })

      const loweredEmail = email.toLowerCase()
      const role: CBUser['role'] = loweredEmail.includes('admin')
        ? 'Admin'
        : loweredEmail.includes('associate')
          ? 'Associate'
          : 'User'

      const nextUser: CBUser = {
        id: `cb-${Date.now()}`,
        email,
        role,
        createdAt: new Date().toISOString(),
      }

      setUser(nextUser)
      router.push(ROUTES.DASHBOARD)
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [email, password, router, setUser])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cb-surface-2)] px-6">
      <div className="cb-card w-full max-w-md p-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-skyline-primary text-xl font-black text-white">
            CB
          </div>
          <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Sign In</h1>
          <p className="mt-1 text-sm text-[var(--cb-text-muted)]">Welcome back to CloudBasket</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-button border border-status-error/30 bg-status-error/10 p-3 text-sm text-status-error"
          >
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Email</span>
            <div className="glass-panel relative mt-1 rounded-button border cb-border">
              <Mail size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 pe-3 ps-10 text-sm text-[var(--cb-text-primary)] outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Password</span>
            <div className="glass-panel relative mt-1 rounded-button border cb-border">
              <Lock size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent py-3 pe-10 ps-10 text-sm text-[var(--cb-text-primary)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className="cb-btn-primary mt-2 w-full justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Shield size={16} />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--cb-text-muted)]">
          New to CloudBasket?{' '}
          <Link href={ROUTES.REGISTER} className="text-skyline-primary hover:underline">
            Create account
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-[var(--cb-text-muted)]">
          Demo: use admin@... for Admin, associate@... for Associate
        </p>
      </div>
    </div>
  )
}
