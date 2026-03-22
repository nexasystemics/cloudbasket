import { NextRequest, NextResponse } from 'next/server'
import { hubspotCRM } from '@/services/crm/hubspot'
import { zohoCRM } from '@/services/crm/zoho'
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, source } = body
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
    const [first, ...rest] = (name || '').split(' ')
    const [hs, zoho] = await Promise.allSettled([
      hubspotCRM.upsertContact(email, { email, firstname: first, lastname: rest.join(' '), phone, source: source || 'cloudbasket' }),
      zohoCRM.createLead({ Last_Name: name || email, Email: email, Phone: phone, Lead_Source: source || 'CloudBasket' })
    ])
    return NextResponse.json({ ok: true, hubspot: hs.status === 'fulfilled', zoho: zoho.status === 'fulfilled' })
  } catch { return NextResponse.json({ error: 'CRM sync failed' }, { status: 500 }) }
}