import { NextResponse } from 'next/server'
import { seoUpdater } from '@/services/content/seo-updater'

export async function GET() {
  const report = await seoUpdater.auditSEOHealth()
  return NextResponse.json(report)
}