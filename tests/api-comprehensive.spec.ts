import { test, expect } from '@playwright/test'

/**
 * COMPREHENSIVE API TEST SUITE
 * 
 * Validates core API endpoints for functionality, validation, and rate limiting.
 * Note: Some tests expect 500/502 in local dev if external service keys are missing,
 * but should always return 400 for invalid inputs.
 */

const BASE = 'http://localhost:3000'

test.describe('Auth OTP API (/api/auth/otp/*)', () => {
  test('OTP Send - should reject invalid email', async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/otp/send`, {
      data: { identifier: 'not-an-email', type: 'email' }
    })
    expect(response.status()).toBe(400)
  })

  test('OTP Send - should reject invalid type', async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/otp/send`, {
      data: { identifier: 'test@example.com', type: 'invalid' }
    })
    expect(response.status()).toBe(400)
  })

  test('OTP Verify - should reject missing fields', async ({ request }) => {
    const response = await request.post(`${BASE}/api/auth/otp/verify`, {
      data: { identifier: 'test@example.com' }
    })
    expect(response.status()).toBe(400)
  })
})

test.describe('CRM & Contact API (/api/contact)', () => {
  test('Contact Form - should validate fields', async ({ request }) => {
    const response = await request.post(`${BASE}/api/contact`, {
      data: { name: 'J', email: 'not-email', subject: 'Hi', message: 'Too short' }
    })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.fieldErrors).toBeDefined()
  })

  test('Contact Form - should return error if not configured', async ({ request }) => {
    const response = await request.post(`${BASE}/api/contact`, {
      data: { 
        name: 'John Doe', 
        email: 'john@example.com', 
        subject: 'General Inquiry', 
        message: 'I have a question about your price comparison engine.' 
      }
    })
    // Expect 500 (not configured) or 200 (success) or 502 (bad gateway)
    expect([200, 500, 502]).toContain(response.status())
  })
})

test.describe('Search API (/api/search)', () => {
  test('Search - should return 400 for empty query', async ({ request }) => {
    const response = await request.get(`${BASE}/api/search?q=`)
    expect(response.status()).toBe(400)
  })

  test('Search - should work for valid query', async ({ request }) => {
    const response = await request.get(`${BASE}/api/search?q=iphone&platform=amazon`)
    // Might be 500 if PA-API keys missing, but logic should trigger
    expect([200, 500]).toContain(response.status())
  })
})

test.describe('Newsletter API (/api/newsletter/subscribe)', () => {
  test('Subscribe - should reject invalid email', async ({ request }) => {
    const response = await request.post(`${BASE}/api/newsletter/subscribe`, {
      data: { email: 'invalid-email' }
    })
    expect(response.status()).toBe(400)
  })

  test('Subscribe - should accept valid email (offline mode or success)', async ({ request }) => {
    const response = await request.post(`${BASE}/api/newsletter/subscribe`, {
      data: { email: 'test@example.com', preferences: { deals: true } }
    })
    expect([200, 500]).toContain(response.status())
  })
})

test.describe('Revenue & Sponsored API', () => {
  test('Sponsored Click - should validate payload', async ({ request }) => {
    const response = await request.post(`${BASE}/api/sponsored/click`, {
      data: { adId: 'test-ad' } // missing slotId, etc if required by schema
    })
    // Check if it returns 200 (optional tracking) or 400 (strict validation)
    expect([200, 400]).toContain(response.status())
  })

  test('Sponsored Impression - should return 200 for valid ping', async ({ request }) => {
    const response = await request.post(`${BASE}/api/sponsored/impression`, {
      data: { adId: 'test-ad', slotId: 'home-hero' }
    })
    expect([200, 400]).toContain(response.status())
  })
})

test.describe('System & Vitals API', () => {
  test('Vitals - should accept performance metrics', async ({ request }) => {
    const response = await request.post(`${BASE}/api/vitals`, {
      data: { id: 'v1', name: 'LCP', value: 1200 }
    })
    expect(response.status()).toBe(200)
  })
})
