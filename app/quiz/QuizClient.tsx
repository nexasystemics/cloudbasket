'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

type Question = {
  title: string
  options: Array<{ emoji: string; label: string }>
}

const QUESTIONS: Question[] = [
  {
    title: 'What are you shopping for?',
    options: [
      { emoji: '📱', label: 'Smartphones' },
      { emoji: '💻', label: 'Laptops' },
      { emoji: '👗', label: 'Fashion' },
      { emoji: '🏠', label: 'Home & Kitchen' },
      { emoji: '🎧', label: 'Audio & Electronics' },
      { emoji: '🎁', label: 'Gifts & POD' },
    ],
  },
  {
    title: "What's your budget?",
    options: [
      { emoji: '💸', label: 'Under ₹5,000' },
      { emoji: '💰', label: '₹5,000–₹15,000' },
      { emoji: '💳', label: '₹15,000–₹50,000' },
      { emoji: '🏦', label: '₹50,000+' },
    ],
  },
  {
    title: 'Where do you prefer to shop?',
    options: [
      { emoji: '🛒', label: 'Amazon India' },
      { emoji: '🧺', label: 'Flipkart' },
      { emoji: '⚖️', label: "Best price — I don't care" },
      { emoji: '🌍', label: 'International (CJ Global)' },
    ],
  },
  {
    title: 'What matters most?',
    options: [
      { emoji: '📉', label: 'Lowest price' },
      { emoji: '🚚', label: 'Fastest delivery' },
      { emoji: '🏷️', label: 'Best brand' },
      { emoji: '⭐', label: 'Most reviews' },
    ],
  },
]

function mapCategory(answer?: string): string | null {
  if (!answer) {
    return null
  }

  if (answer.includes('Smartphones')) return 'Mobiles'
  if (answer.includes('Laptops')) return 'Laptops'
  if (answer.includes('Fashion')) return 'Fashion'
  if (answer.includes('Home')) return 'Home'
  if (answer.includes('Audio')) return 'Mobiles'
  if (answer.includes('POD')) return 'Fashion'

  return null
}

export default function QuizClient() {
  const [step, setStep] = useState<number>(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState<boolean>(false)

  const currentQuestion = QUESTIONS[step]

  const recommendations = useMemo(() => {
    const category = mapCategory(answers[0])
    const seed = category
      ? MOCK_PRODUCTS.filter((product) => product.mainCategory === category)
      : MOCK_PRODUCTS
    return seed.slice(0, 4)
  }, [answers])

  const handleOptionClick = (option: string) => {
    const nextAnswers = [...answers, option]
    setAnswers(nextAnswers)

    if (step < QUESTIONS.length - 1) {
      setStep((current) => current + 1)
      return
    }

    setShowResult(true)
  }

  const resetQuiz = () => {
    setStep(0)
    setAnswers([])
    setShowResult(false)
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-12 text-center">
        <h1 className="text-4xl font-black">Find Your Perfect Deal</h1>
        <p className="text-muted mt-2">4 questions. Personalised picks.</p>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-12">
        {!showResult ? (
          <>
            <div className="mb-8 flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-[#039BE5]' : 'bg-[var(--cb-surface-2)]'}`}
                />
              ))}
            </div>

            <div className="cb-card p-8">
              <p className="text-muted mb-2 text-xs uppercase tracking-widest">Question {step + 1} of 4</p>
              <h2 className="mb-8 text-2xl font-black">{currentQuestion.title}</h2>

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.label}
                    className="cb-card cursor-pointer p-5 text-center hover:border-[#039BE5]/50"
                    onClick={() => handleOptionClick(option.label)}
                  >
                    <p className="mb-2 text-2xl">{option.emoji}</p>
                    <p className="text-sm font-bold">{option.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-6 text-2xl font-black">Your Personalised Picks</h2>
            <div className="grid grid-cols-2 gap-4">
              {recommendations.map((product) => (
                <article key={product.id} className="cb-card overflow-hidden">
                  <div className="relative h-32">
                    <Image
                      fill
                      className="object-cover"
                      src={product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'}
                      alt={product.name}
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-xs font-bold">{product.name}</p>
                    <p className="price-current mt-1 text-xs">₹{product.price.toLocaleString('en-IN')}</p>
                    <Link href={`/go/amazon-${product.id}`} className="cb-btn cb-btn-primary mt-2 w-full text-xs">
                      View Deal
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="cb-btn cb-btn-ghost mt-6" onClick={resetQuiz}>
              Take Quiz Again
            </button>
            <div>
              <Link href="/products" className="cb-btn cb-btn-primary mt-3">
                Browse All Products
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
