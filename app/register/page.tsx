import type { Metadata } from 'next'
import RegisterPageClient from './RegisterPageClient'

export const metadata: Metadata = {
  title: 'Create Your CloudBasket Account',
  description: 'Register for CloudBasket to save products, manage deal alerts, and access shopper, associate, or POD creator flows.',
}

export default function RegisterPage() {
  return <RegisterPageClient />
}
