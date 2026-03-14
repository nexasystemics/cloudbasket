'use client'

import dynamic from 'next/dynamic'

const IndiaTrustBar = dynamic(() => import('@/components/IndiaTrustBar').then((module) => module.IndiaTrustBar), {
  ssr: false,
  loading: () => <div className="min-h-10 w-full" aria-hidden="true" />,
})

const PWAInstallPrompt = dynamic(() => import('@/components/PWAInstallPrompt'), {
  ssr: false,
})

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
})

export default function LayoutBottomEnhancements() {
  return (
    <>
      <IndiaTrustBar />
      <PWAInstallPrompt />
      <CookieConsent />
    </>
  )
}
