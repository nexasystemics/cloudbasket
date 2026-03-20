// lib/share.ts
// Social sharing utility functions for CloudBasket

export function shareToWhatsApp(text: string, url: string): void {
  const encoded = encodeURIComponent(`${text} ${url}`)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener,noreferrer')
}

export function shareToTwitter(text: string, url: string): void {
  const encoded = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)
  window.open(`https://twitter.com/intent/tweet?text=${encoded}&url=${encodedUrl}`, '_blank', 'noopener,noreferrer')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return true
    } catch { return false }
  }
}

export function generateShareText(productName: string, price: number, productUrl: string): string {
  return `🔥 Found ${productName} at ₹${price.toLocaleString('en-IN')} on CloudBasket! Compare prices: ${productUrl}`
}

export function generateDealShareText(dealName: string, discount: number, originalPrice: number, dealPrice: number, url: string): string {
  return `🔥 ${discount}% OFF on ${dealName}! Was ₹${originalPrice.toLocaleString('en-IN')}, now ₹${dealPrice.toLocaleString('en-IN')}. Grab it: ${url}`
}