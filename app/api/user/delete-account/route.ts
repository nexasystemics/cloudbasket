import { NextRequest, NextResponse } from 'next/server'
import { deleteUserData } from '@/lib/data-export/portability'
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const ok = await deleteUserData(userId)
    return NextResponse.json({ ok, message: ok ? 'Account data deleted' : 'Partial deletion — check Supabase' })
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }) }
}