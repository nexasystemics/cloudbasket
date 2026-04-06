import { test, expect } from '@playwright/test'

/**
 * CRITICAL TEST SUITE: Affiliate Redirect Verification
 * 
 * CloudBasket is a zero-checkout discovery engine. This suite verifies that:
 * 1. All purchase-intent CTAs route through /go/[id] Income Shield Node
 * 2. Redirects are HTTP 302 (temporary) only
 * 3. Affiliate tags are injected correctly
 * 4. No payment/checkout pages are accessible
 * 5. All URLs are properly sanitized
 */

const BASE = 'http://localhost:3000'

test.describe('Income Shield Node (/go/[id]) - Critical Redirect Tests', () => {
  test('amazon redirect injects affiliate tag', async ({ request }) => {
    const response = await request.get(`${BASE}/go/amazon-B08N6LNQK5`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('amazon.in')
    expect(location).toContain('tag=cloudbasket-21')
  })

  test('flipkart redirect uses affiliate ID', async ({ request }) => {
    const response = await request.get(`${BASE}/go/flipkart-MOBTEST123`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('flipkart.com')
    expect(location).toContain('affid=')
  })

  test('CJ redirect includes publisher ID', async ({ request }) => {
    const response = await request.get(`${BASE}/go/cj-PRODUCT123`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('tkqlhce.com')
    expect(location).toContain('publisher=')
  })

  test('invalid ID returns 302 to /not-found', async ({ request }) => {
    const response = await request.get(`${BASE}/go/`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('/not-found')
  })

  test('VCommission redirect includes tracking ID', async ({ request }) => {
    const response = await request.get(`${BASE}/go/vcm-TRACK123`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('vcommission.com')
  })

  test('POD redirects to /pod page', async ({ request }) => {
    const response = await request.get(`${BASE}/go/pod-design123`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('/pod')
  })

  test('URL encoding is handled correctly', async ({ request }) => {
    const encoded = encodeURIComponent('amazon-B08N6LNQK5')
    const response = await request.get(`${BASE}/go/${encoded}`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('amazon.in')
  })

  test('fallback search for unknown prefix', async ({ request }) => {
    const response = await request.get(`${BASE}/go/smartphone`)
    
    expect(response.status()).toBe(302)
    const location = response.headers()['location'] || ''
    expect(location).toContain('amazon.in/s')
    expect(location).toContain('smartphone')
  })
})

test.describe('Product Pages Route Through Income Shield', () => {
  test('product detail page has "View Deal" button linking to /go', async ({ page }) => {
    await page.goto(`${BASE}/product/mob-001`)
    
    const viewDealLink = await page.locator('a:has-text("View Deal")').first()
    expect(viewDealLink).toBeDefined()
    
    const href = await viewDealLink.getAttribute('href')
    expect(href).toMatch(/^\/go\//)
    expect(href).not.toContain('javascript:')
    expect(href).not.toContain('onclick')
  })

  test('product comparison page routes deals through /go', async ({ page }) => {
    await page.goto(`${BASE}/compare`)
    
    // At least one deal link should route via /go
    const dealLinks = await page.locator('a[href*="/go/"]')
    expect(await dealLinks.count()).toBeGreaterThan(0)
  })

  test('deals hub links route through /go', async ({ page }) => {
    await page.goto(`${BASE}/deals`)
    
    const dealLinks = page.locator('a[href*="/go/"]')
    expect(await dealLinks.count()).toBeGreaterThan(0)
    
    // Verify external URLs open in new tab
    const firstLink = await dealLinks.first()
    const target = await firstLink.getAttribute('target')
    const rel = await firstLink.getAttribute('rel')
    
    // Should have target="_blank" and proper rel attributes for security
    if (target === '_blank') {
      expect(rel).toContain('noopener')
    }
  })

  test('flash deals route through /go', async ({ page }) => {
    await page.goto(`${BASE}/deals/flash`)
    
    const dealLinks = page.locator('a[href*="/go/"]')
    expect(await dealLinks.count()).toBeGreaterThan(0)
  })
})

test.describe('Compliance: No Payment Routes Accessible', () => {
  test('checkout page returns 404', async ({ request }) => {
    const response = await request.get(`${BASE}/checkout`)
    expect(response.status()).toBe(404)
  })

  test('dashboard routes return 404', async ({ request }) => {
    const dashboardRoutes = [
      '/dashboard',
      '/dashboard/rewards',
      '/dashboard/settings',
      '/account/orders'
    ]
    
    for (const route of dashboardRoutes) {
      const response = await request.get(`${BASE}${route}`)
      expect(response.status()).toBe(404)
    }
  })

  test('admin routes return 404', async ({ request }) => {
    const adminRoutes = [
      '/admin',
      '/admin/catalog',
      '/admin/orders',
      '/admin/analytics'
    ]
    
    for (const route of adminRoutes) {
      const response = await request.get(`${BASE}${route}`)
      expect(response.status()).toBe(404)
    }
  })

  test('vendor dashboard returns 404', async ({ request }) => {
    const response = await request.get(`${BASE}/vendor/dashboard`)
    expect(response.status()).toBe(404)
  })

  test('checkout API endpoints return 404', async ({ request }) => {
    const response = await request.post(`${BASE}/api/checkout/init`)
    expect(response.status()).toBe(404)
  })
})

test.describe('XSS & Security Validation', () => {
  test('redirect URLs cannot contain javascript:', async ({ request }) => {
    const malicious = encodeURIComponent('javascript:alert(1)')
    const response = await request.get(`${BASE}/go/${malicious}`)
    
    // Should either 404 or redirect safely
    const location = response.headers()['location'] || ''
    expect(location).not.toContain('javascript:')
  })

  test('product pages do not expose API keys', async ({ page }) => {
    await page.goto(`${BASE}/product/mob-001`)
    
    const pageContent = await page.content()
    expect(pageContent).not.toMatch(/SUPABASE_(KEY|URL)/)
    expect(pageContent).not.toMatch(/API[_-]?KEY/)
    expect(pageContent).not.toMatch(/secret/)
  })

  test('affiliate disclosure banner is present on product pages', async ({ page }) => {
    await page.goto(`${BASE}/product/mob-001`)
    
    const disclosure = page.locator('[role="banner"], .affiliate-disclosure, [aria-label*="affiliate"]')
    expect(await disclosure.count()).toBeGreaterThan(0)
  })
})

test.describe('Email & Newsletter - No Payment Data', () => {
  test('newsletter signup endpoint does not collect payment info', async ({ request }) => {
    const response = await request.post(`${BASE}/api/newsletter/subscribe`, {
      data: {
        email: 'test@example.com'
      }
    })
    
    const body = await response.json()
    expect(body).not.toHaveProperty('paymentMethod')
    expect(body).not.toHaveProperty('wallet')
    expect(body).not.toHaveProperty('orderId')
  })
})

test.describe('Price Tracking - Discovery Only', () => {
  test('price alert endpoint is for discovery, not checkout', async ({ request }) => {
    const response = await request.post(`${BASE}/api/alerts/trigger`, {
      data: {
        productId: 'mob-001',
        targetPrice: 10000,
        email: 'test@example.com'
      }
    })
    
    // Should succeed or fail gracefully, never redirect to payment
    expect([200, 201, 400, 401, 404]).toContain(response.status())
    
    const body = await response.json()
    expect(body).not.toHaveProperty('paymentId')
    expect(body).not.toHaveProperty('orderId')
  })
})
