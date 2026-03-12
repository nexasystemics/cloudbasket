import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Shirt } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/mock-data'

export default function TshirtsPage() {
  const tshirtProducts = PRODUCTS.filter(
    (product) => product.mainCategory === 'Fashion' && product.subCategory === 'Activewear',
  ).slice(0, 12)

  return (
    <div className="min-h-screen bg-[var(--cb-surface)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <nav className="text-sm text-[var(--cb-text-muted)]">
          <span>POD</span>
          <span className="px-2">/</span>
          <span>T-Shirts</span>
        </nav>

        <Link
          href={ROUTES.POD}
          className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--cb-text-muted)] hover:text-[var(--cb-text-primary)]"
        >
          <ArrowLeft size={14} />
          Back to POD
        </Link>

        <header className="mt-6">
          <h1 className="flex items-center gap-2 font-display text-3xl font-black uppercase text-[var(--cb-text-primary)]">
            <Shirt size={28} className="text-skyline-primary" />
            Graphic T-Shirts
          </h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            200+ unique designs. Premium cotton. Ships worldwide.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tshirtProducts.map((product) => (
            <article key={product.id} className="cb-card cursor-pointer overflow-hidden">
              <div className="relative aspect-square">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h2 className="line-clamp-2 text-[13px] font-bold text-[var(--cb-text-primary)]">{product.name}</h2>
                <p className="mt-1 font-mono text-sm text-skyline-primary">
                  ₹{new Intl.NumberFormat('en-IN').format(product.price)}
                </p>
                <a
                  href={`/go/cj-${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cb-btn-primary mt-3 w-full justify-center text-xs"
                >
                  View on CJ
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}




