import Script from 'next/script'
import { env } from '@/lib/env'
export default function ClarityScript() {
  if (!env.NEXT_PUBLIC_CLARITY_ID) return null
  return <Script id="clarity-script" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${env.NEXT_PUBLIC_CLARITY_ID}");`}</Script>
}
