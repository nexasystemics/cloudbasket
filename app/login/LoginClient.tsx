'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'forgot'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const resetFeedback = () => {
    setError(null)
    setSuccess(null)
  }

  const handleLogin = async () => {
    resetFeedback()
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Auth service is not configured.')
        return
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw loginError
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    resetFeedback()
    setLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Auth service is not configured.')
        return
      }
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (resetError) throw resetError
      setSuccess('Password reset email sent. Check your inbox.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (mode === 'forgot') {
      void handleForgotPassword()
    } else {
      void handleLogin()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="cb-card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#039BE5] flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
            C
          </div>
          <h1 className="font-black text-2xl tracking-tighter">
            {mode === 'login' ? 'Sign In' : 'Reset Password'}
          </h1>
          <p className="text-sm text-muted mt-1">
            {mode === 'login'
              ? 'Access your wishlist and alerts'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="sr-only">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="cb-input w-full"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          {mode === 'login' && (
            <div className="relative">
              <label htmlFor="login-password" className="sr-only">Password</label>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="cb-input w-full pr-10"
                autoComplete="current-password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cb-text-muted)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {error ? (
            <p id="login-feedback" role="alert" aria-live="assertive" className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          ) : null}

          {success ? (
            <p id="login-feedback" role="status" aria-live="polite" className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !email || (mode === 'login' && !password)}
            className="cb-btn cb-btn-primary w-full py-3 font-bold"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Send Reset Link'}
          </button>
        </form>

        {mode === 'login' && (
          <p className="text-right mt-2">
            <button
              type="button"
              onClick={() => { resetFeedback(); setMode('forgot') }}
              className="text-xs text-[var(--cb-text-muted)] hover:text-[#039BE5] transition-colors"
            >
              Forgot password?
            </button>
          </p>
        )}

        {mode === 'forgot' && (
          <p className="text-center mt-4">
            <button
              type="button"
              onClick={() => { resetFeedback(); setMode('login') }}
              className="text-xs text-[var(--cb-text-muted)] hover:text-[#039BE5] transition-colors"
            >
              ← Back to sign in
            </button>
          </p>
        )}

        {mode === 'login' && (
          <p className="text-center text-sm text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#039BE5] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
