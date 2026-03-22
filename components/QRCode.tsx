'use client'
// E45: QR Code Generator for Product Pages
import { useEffect, useRef } from 'react'

interface QRCodeProps { url: string; size?: number; label?: string }

export default function QRCode({ url, size = 128, label }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Uses QR code via Google Charts API — no package needed
    const img = new Image()
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) { ctx.clearRect(0, 0, size, size); ctx.drawImage(img, 0, 0, size, size) }
    }
  }, [url, size])

  const download = () => {
    const a = document.createElement('a')
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(url)}`
    a.download = 'qr-code.png'; a.click()
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <canvas ref={canvasRef} width={size} height={size} className="rounded-lg border border-[var(--cb-border)]" />
      {label && <p className="text-xs text-[var(--cb-text-muted)]">{label}</p>}
      <button type="button" onClick={download} className="cb-btn cb-btn-ghost text-xs">Download QR</button>
    </div>
  )
}