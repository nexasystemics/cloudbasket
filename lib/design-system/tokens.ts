// lib/design-system/tokens.ts
// Design system token architecture — re-exports from main design-system.ts
// with additional tokens required for Set C prompt compliance.

export * from '@/lib/design-system'

export const COLOUR_TOKENS = {
  primary: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
    400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
    800: '#1E40AF', 900: '#1E3A8F', 950: '#172554',
  },
  brand: {
    blue: '#1F4E79',
    navy: '#0F2D4A',
    accent: '#F59E0B',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  },
} as const

export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
    display: 'Inter, sans-serif',
  },
  fontSize: {
    xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
    xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem',
    '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem',
  },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
  lineHeight: { tight: '1.25', snug: '1.375', normal: '1.5', relaxed: '1.625', loose: '2' },
} as const

export const SHADOW_TOKENS = {
  card: '0 1px 3px rgba(0,0,0,0.08)',
  elevated: '0 4px 16px rgba(0,0,0,0.12)',
  modal: '0 20px 60px rgba(0,0,0,0.2)',
  sticky: '0 2px 8px rgba(0,0,0,0.1)',
} as const

export const BORDER_RADIUS_TOKENS = {
  none: '0', sm: '4px', base: '8px', md: '12px',
  lg: '16px', xl: '24px', full: '9999px',
} as const

export const ANIMATION_TOKENS = {
  fast: '150ms', base: '200ms', slow: '300ms', slower: '500ms',
} as const

export const EASING_TOKENS = {
  ease: 'cubic-bezier(0.4,0,0.2,1)',
  easeIn: 'cubic-bezier(0.4,0,1,1)',
  easeOut: 'cubic-bezier(0,0,0.2,1)',
  spring: 'cubic-bezier(0.19,1,0.22,1)',
} as const

export const DARK_MODE_TOKENS = {
  background: { primary: '#0F172A', secondary: '#1E293B', tertiary: '#334155' },
  text: { primary: '#F1F5F9', secondary: '#CBD5E1', muted: '#94A3B8' },
  border: '#334155',
  card: '#1E293B',
} as const
