import { NextRequest, NextResponse } from 'next/server'
import { exportUserData } from '@/lib/data-export/portability'
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await exportUserData(userId)
  if (!data) return NextResponse.json({ error: 'Export failed or no data' }, { status: 500 })
  return new NextResponse(JSON.stringify(data, null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="cloudbasket-data-${userId}.json"` } })
}
