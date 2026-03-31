// © 2026 NEXQON HOLDINGS — CloudBasket service-worker-utils.ts
// F83: Offline-First PWA Capabilities
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing
        if (worker) worker.addEventListener('statechange', () => { /* update available when installed + controller exists */ })
      })
    }).catch(() => { /* registration failed — silent in production */ })
  })
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage?.persist) return await navigator.storage.persist()
  return false
}

export async function checkStorageQuota(): Promise<{ used: number; quota: number; percent: number } | null> {
  if (!navigator.storage?.estimate) return null
  const { usage = 0, quota = 0 } = await navigator.storage.estimate()
  return { used: usage, quota, percent: quota ? Math.round((usage / quota) * 100) : 0 }
}
