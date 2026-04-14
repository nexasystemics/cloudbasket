'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const router = useRouter()

  const supabase = createClient()
  const authEnabled = Boolean(supabase)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      if (!authEnabled || !supabase) {
        setError('Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
        return
      }

      if (mode === 'login') {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        router.push('/dashboard')
        router.refresh()
      } else {
        const { error: signupError } = await supabase.auth.signUp({ email, password })
        if (signupError) throw signupError
        setError('Check your email to confirm your account.')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="cb-card p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#039BE5] flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
            C
          </div>
          <h1 className="font-black text-2xl tracking-tighter">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
          <p className="text-sm text-muted mt-1">
            {mode === 'login' ? 'Access your wishlist and alerts' : 'Join 50,000+ deal hunters'}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="sr-only">Email address</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="cb-input w-full"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="sr-only">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="cb-input w-full"
              onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
            />
          </div>
          {error ? <p id="login-error" role="alert" aria-live="assertive" className="text-sm text-[#EF4444] bg-[#EF4444]/10 rounded-lg px-3 py-2">{error}</p> : null}
          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="cb-btn cb-btn-primary w-full py-3 font-bold"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
        <p className="text-center text-sm text-muted mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-[#039BE5] font-semibold hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
        <p className="text-center text-xs text-muted mt-4">Protected by Supabase Auth 🔒</p>
      </div>
    </div>
  )
}
