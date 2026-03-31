// © 2026 NEXQON HOLDINGS — CloudBasket route.ts
import { NextRequest, NextResponse } from 'next/server'
import { deleteUserData } from '@/lib/data-export/portability'
import { getUser } from '@/lib/auth'
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const ok = await deleteUserData(userId)
    return NextResponse.json({ ok, message: ok ? 'Account data deleted' : 'Partial deletion — check Supabase' })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}
