'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Zap, Shield, Users, Package, type LucideIcon } from 'lucide-react'

type FAQItem = {
  q: string
  a: string
}

type FAQCategory = {
  name: string
  icon: LucideIcon
  items: FAQItem[]
}

const FAQ_CATEGORIES: readonly FAQCategory[] = [
  {
    name: 'General',
    icon: HelpCircle,
    items: [
      {
        q: 'What is CloudBasket?',
        a: "CloudBasket is India's sovereign price comparison platform. We track prices across 50+ retailers including Amazon, Flipkart, and CJ Global to help you find the best deal. We never sell products directly — we only show you where to buy at the lowest price.",
      },
      {
        q: 'Is CloudBasket free to use?',
        a: '100% free for shoppers. Always. We earn through affiliate commissions when you click a deal link — at no extra cost to you.',
      },
      {
        q: 'How do you make money?',
        a: 'Five revenue streams: affiliate commissions, Print on Demand products, Associates program, Google AdSense, and CJ Network commissions.',
      },
    ],
  },
  {
    name: 'Deals',
    icon: Zap,
    items: [
      {
        q: 'How often are prices updated?',
        a: 'Prices are updated every hour from all 50+ partner stores. Flash deals are monitored in near real-time.',
      },
      {
        q: 'Are the deals verified?',
        a: 'Yes. Our system cross-checks prices across multiple sources. We also show original vs deal price so you can verify yourself.',
      },
      {
        q: 'What is CJ Global?',
        a: 'Commission Junction (CJ) is a global affiliate network connecting CloudBasket to international retailers. Products sourced via CJ often have exclusive pricing not available elsewhere.',
      },
    ],
  },
  {
    name: 'Privacy',
    icon: Shield,
    items: [
      {
        q: 'What data do you collect?',
        a: "We collect email (if you register), search queries, and click data for analytics. We comply fully with India's DPDPA 2023.",
      },
      {
        q: 'Do you sell my data?',
        a: 'Never. Your data is never sold to third parties. See our Privacy Policy.',
      },
      {
        q: 'How do I delete my account?',
        a: "Email privacy@cloudbasket.in with subject 'Delete Account'. We will process within 7 business days per DPDPA 2023.",
      },
    ],
  },
  {
    name: 'Associates',
    icon: Users,
    items: [
      {
        q: 'How do I join the Associates program?',
        a: 'Register at cloudbasket.in/register, select Associates during signup, and get your unique referral link within minutes.',
      },
      {
        q: 'What commission rates do Associates earn?',
        a: 'POD products: 10% · Fashion: 5% · Home: 4% · Laptops: 3% · Mobiles: 2.5% Commissions are paid monthly via bank transfer or UPI.',
      },
    ],
  },
  {
    name: 'POD',
    icon: Package,
    items: [
      {
        q: 'What is Print on Demand?',
        a: 'CloudBasket POD lets you buy custom-designed merchandise — t-shirts, mugs, phone cases — printed on demand with no inventory. Products ship within 5-7 business days.',
      },
    ],
  },
]

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggleItem = (id: string) => {
    setOpenItem((current) => (current === id ? null : id))
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      <section className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <HelpCircle size={40} className="mx-auto mb-4 text-[#039BE5]" />
          <h1 className="text-4xl font-black tracking-tighter">Frequently Asked Questions</h1>
          <p className="mt-3 text-[var(--cb-text-muted)]">Everything you need to know about CloudBasket</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        {FAQ_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon

          return (
            <div key={category.name} className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#039BE5]/10">
                  <CategoryIcon size={18} className="text-[#039BE5]" />
                </div>
                <h2 className="text-lg font-black">{category.name}</h2>
              </div>

              {category.items.map((item, index) => {
                const id = `${category.name}-${index}`
                const isOpen = openItem === id

                return (
                  <article key={id} className="cb-card mb-2 cursor-pointer overflow-hidden">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between p-5 text-left"
                      onClick={() => toggleItem(id)}
                    >
                      <p className="text-sm font-bold">{item.q}</p>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isOpen ? (
                      <div className="border-t border-[var(--cb-border)] p-5 pt-4">
                        <p className="text-sm leading-relaxed text-[var(--cb-text-muted)]">{item.a}</p>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )
        })}
      </section>
    </main>
  )
}


