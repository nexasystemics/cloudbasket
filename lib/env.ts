// Purpose: Validates required environment variables on module load and exports a typed env object.
// Import this module in app/layout.tsx to ensure env validation runs at startup.

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const

type RequiredVar = (typeof REQUIRED_VARS)[number]

for (const key of REQUIRED_VARS) {
  if (!process.env[key]) {
    console.warn(`[env] Missing environment variable: ${key}`)
  }
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cloudbasket.in',
} satisfies Record<RequiredVar, string>
