import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import PODUploadClient from './PODUploadClient'

export const metadata: Metadata = {
  title: 'Bulk Image Upload | Print on Demand | CloudBasket',
  description: 'Upload your designs in bulk to create custom products across multiple platforms including Printify, Printful, Amazon, and more.',
  robots: { index: false, follow: false },
}

export default async function BulkUploadPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/login?next=/pod/upload')
  }
  return <PODUploadClient />
}
