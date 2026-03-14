import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Login to CloudBasket',
  description: 'Sign in to your CloudBasket account to manage alerts, saved products, and affiliate discovery activity.',
}

export default function LoginPage() {
  return <LoginClient />
}
