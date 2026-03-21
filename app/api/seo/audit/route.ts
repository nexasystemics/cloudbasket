import { NextResponse } from 'next/server'
import { seoUpdater } from '@/services/content/seo-updater'
export async function GET() { return NextResponse.json(await seoUpdater.auditSEOHealth()) }