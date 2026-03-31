// © 2026 NEXQON HOLDINGS — CloudBasket | lib/auth.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { User } from '@supabase/supabase-js'

export type Role = 'user' | 'admin' | 'superadmin'

const ADMIN_ROLES: Role[] = ['admin', 'superadmin']

/** Cached Supabase server client — one instance per request */
export const createSupabaseServerClient = cache(async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
})

/** Returns authenticated user or null */
export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

/** Returns role from user_metadata — defaults to 'user' */
export async function getUserRole(): Promise<Role> {
  const user = await getUser()
  if (!user) return 'user'
  return (user.user_metadata?.role ?? 'user') as Role
}

/** Use in Server Actions / Route Handlers — throws if not authenticated */
export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) throw new Error('unauthenticated')
  return user
}

/** Use in admin Server Actions — throws if not admin/superadmin */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  const role = (user.user_metadata?.role ?? 'user') as Role
  if (!ADMIN_ROLES.includes(role)) throw new Error('unauthorized')
  return user
}

/** Boolean guard — safe to use in Server Components */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return ADMIN_ROLES.includes(role)
}