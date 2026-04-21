// components/brand/Logo.tsx
// CloudBasket Logo System — inline SVG, no external dependencies

type LogoVariant = 'full' | 'icon' | 'wordmark'
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type LogoTheme = 'light' | 'dark' | 'auto'

interface LogoProps {
  variant?: LogoVariant
  size?: LogoSize
  theme?: LogoTheme
  className?: string
}

const SIZE_MAP: Record<LogoSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 48, xl: 64,
}

export default function Logo({
  variant = 'full',
  size = 'md',
  theme = 'auto',
  className = '',
}: LogoProps) {
  const height = SIZE_MAP[size]
  const isDark = theme === 'dark'

  const iconColor = isDark ? '#FFFFFF' : '#1F4E79'
  const cloudColor = isDark ? '#93C5FD' : '#1F4E79'
  const basketColor = isDark ? '#FCD34D' : '#F59E0B'

  const IconMark = () => (
    <svg height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cloud */}
      <path
        d="M28 16a6 6 0 00-11.8-1.6A5 5 0 1016 24h12a4 4 0 000-8z"
        fill={iconColor}
        opacity="0.9"
      />
      {/* Basket body */}
      <rect x="8" y="22" width="24" height="14" rx="3" fill={basketColor} />
      {/* Basket lines */}
      <line x1="16" y1="22" x2="16" y2="36" stroke={isDark ? '#1F4E79' : '#fff'} strokeWidth="1.5" />
      <line x1="24" y1="22" x2="24" y2="36" stroke={isDark ? '#1F4E79' : '#fff'} strokeWidth="1.5" />
      <line x1="8" y1="28" x2="32" y2="28" stroke={isDark ? '#1F4E79' : '#fff'} strokeWidth="1.5" />
      {/* Basket handle */}
      <path d="M14 22 Q20 14 26 22" stroke={iconColor} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )

  const WordMark = () => (
    <svg height={height} viewBox="0 0 160 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="30" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22" fill={cloudColor}>Cloud</text>
      <text x="62" y="30" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="22" fill={basketColor}>Basket</text>
    </svg>
  )

  if (variant === 'icon') return <IconMark />
  if (variant === 'wordmark') return <WordMark />

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconMark />
      <WordMark />
    </div>
  )
}
