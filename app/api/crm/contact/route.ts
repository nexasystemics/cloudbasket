// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hubspotCRM } from '@/services/crm/hubspot'
import { zohoCRM } from '@/services/crm/zoho'
import { rateLimit } from '@/lib/redis'
import { crmContactSchema, zodError } from '@/lib/validation'

function getRequestIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

export async function POST(request: NextRequest) {
  const ip = getRequestIp(request)
  const limit = await rateLimit(ip, 10, 60)
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = crmContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: zodError(parsed.error) }, { status: 400 })
  }
  const { email, name, phone, source } = parsed.data

  try {
    const [first, ...rest] = (name || '').split(' ')
    const [hs, zoho] = await Promise.allSettled([
      hubspotCRM.upsertContact(email, {
        email, firstname: first, lastname: rest.join(' '), phone, source: source || 'cloudbasket',
      }),
      zohoCRM.createLead({
        Last_Name: name || email, Email: email, Phone: phone, Lead_Source: source || 'CloudBasket',
      }),
    ])
    return NextResponse.json({
      ok: true,
      hubspot: hs.status === 'fulfilled',
      zoho: zoho.status === 'fulfilled',
    })
  } catch (err) {
    console.error('[crm/contact] Error:', err)
    return NextResponse.json({ error: 'CRM sync failed' }, { status: 500 })
  }
}
