'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { ROUTES } from '@/lib/constants'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useGlobal()

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const validate = useCallback((): string | null => {
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters.'
    }
    if (!email.includes('@')) {
      return 'Please enter a valid email address.'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }
    return null
  }, [email, name, password])

  const handleRegister = useCallback(async (): Promise<void> => {
    const validationError = validate()
    if (validationError !== null) {
      setError(validationError)
      return
    }

    setError(null)
    setIsLoading(true)

    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 1000)
    })

    setSuccess(true)
    setIsLoading(false)
  }, [validate])

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--cb-surface-2)] px-6">
        <div className="cb-card w-full max-w-md p-8 text-center">
          <Shield size={48} className="mx-auto text-status-success" />
          <h1 className="mt-4 font-display text-2xl font-black text-[var(--cb-text-primary)]">Account Created!</h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">You can now sign in to CloudBasket</p>
          <button
            type="button"
            onClick={() => {
              setUser(null)
              router.push(ROUTES.LOGIN)
            }}
            className="cb-btn-primary mt-6 w-full justify-center"
          >
            Sign In Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--cb-surface-2)] px-6">
      <div className="cb-card mx-auto w-full max-w-md p-8">
        <h1 className="text-center font-display text-2xl font-black text-[var(--cb-text-primary)]">Create Account</h1>

        {error && (
          <div role="alert" className="mt-4 rounded-button border border-status-error/30 bg-status-error/10 p-3 text-sm text-status-error">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--cb-text-muted)]">Name</span>
            <div className="glass-panel relative mt-1 rounded-button border cb-border">
              <User size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]" />
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent py-3 pe-3 ps-10 text-sm text-[var(--cb-text-primary)] outline-none"
              />
            </div>
          </label>

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
            onClick={handleRegister}
            disabled={isLoading}
            className="cb-btn-primary mt-2 w-full justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Shield size={16} />
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--cb-text-muted)]">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-skyline-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
