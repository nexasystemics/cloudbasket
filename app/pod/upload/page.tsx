import type { Metadata } from 'next'
import PODUploadClient from './PODUploadClient'

export const metadata: Metadata = {
  title: 'Bulk Image Upload | Print on Demand | CloudBasket',
  description: 'Upload your designs in bulk to create custom products across multiple platforms including Printify, Printful, Amazon, and more.',
  robots: { index: false, follow: false }, // Internal tool page
}

export default function BulkUploadPage() {
  return <PODUploadClient />
}
