import type { Config } from 'tailwindcss'

const config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skyline: {
          primary: '#039BE5',
          light: '#4FC3F7',
          dark: '#0277BD',
          glow: 'rgba(3,155,229,0.15)',
        },
        titanium: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#09090B',
        },
        surface: {
          glass: 'rgba(15,23,42,0.72)',
          card: '#0F172A',
          elevated: '#1E293B',
        },
        status: {
          success: '#10B981',
          warning: '#F5C842',
          error: '#EF4444',
          info: '#039BE5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '10px',
        badge: '6px',
        pill: '999px',
      },
      boxShadow: {
        skyline: '0 0 24px rgba(3,155,229,0.18)',
        card: '0 4px 24px rgba(0,0,0,0.32)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
} satisfies Config

export default config
