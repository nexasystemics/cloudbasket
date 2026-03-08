import type { Metadata } from 'next'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'Find Your Perfect Deal - CloudBasket Quiz',
}

export default function QuizPage() {
  return <QuizClient />
}
