'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Plus, Save, X } from 'lucide-react'
import { useGlobal } from '@/context/GlobalContext'
import { MAIN_CATEGORIES, ROUTES } from '@/lib/constants'
import { SUB_CATEGORIES } from '@/lib/mock-data'
import type { AffiliateSource, Product } from '@/lib/types'

interface ProductFormData {
  name: string
  price: string
  originalPrice: string
  description: string
  mainCategory: string
  subCategory: string
  brand: string
  affiliateUrl: string
  source: AffiliateSource
  warranty: string
}

const DEFAULT_FORM: ProductFormData = {
  name: '',
  price: '',
  originalPrice: '',
  description: '',
  mainCategory: '',
  subCategory: '',
  brand: '',
  affiliateUrl: '',
  source: 'Amazon',
  warranty: '',
}

export default function ListerPage() {
  const { user } = useGlobal()
  const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})

  const validate = useCallback((value: ProductFormData): Partial<Record<keyof ProductFormData, string>> => {
    const nextErrors: Partial<Record<keyof ProductFormData, string>> = {}

    if (value.name.trim().length < 3) {
      nextErrors.name = 'Name must be at least 3 characters.'
    }
    if (value.price.trim().length === 0 || Number.isNaN(Number(value.price)) || Number(value.price) <= 0) {
      nextErrors.price = 'Enter a valid price greater than 0.'
    }
    if (value.description.trim().length < 20) {
      nextErrors.description = 'Description must be at least 20 characters.'
    }
    if (value.mainCategory.trim().length === 0) {
      nextErrors.mainCategory = 'Select a main category.'
    }
    if (value.affiliateUrl.trim().length === 0 || !value.affiliateUrl.startsWith('https://')) {
      nextErrors.affiliateUrl = 'Affiliate URL must start with https://'
    }

    return nextErrors
  }, [])

  const handleSubmit = useCallback((): void => {
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const draftProduct: Partial<Product> = {
      name: form.name,
      brand: form.brand,
      mainCategory: form.mainCategory,
      subCategory: form.subCategory,
      affiliateUrl: form.affiliateUrl,
      source: form.source,
    }
    void draftProduct

    setSubmitted(true)
  }, [form, validate])

  const setField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  if (!user || user.role !== 'Admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cb-surface)] px-6 text-center">
        <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Admin Access Required</h1>
        <Link href={ROUTES.LOGIN} className="cb-btn-primary mt-4">
          Sign In
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--cb-surface-2)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center">
          <div className="rounded-full bg-status-success/10 p-4">
            <Save size={28} className="text-status-success" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-[var(--cb-text-primary)]">
            Product submitted for review
          </h1>
          <p className="mt-2 text-sm text-[var(--cb-text-muted)]">
            Moderation will validate data before this listing goes live.
          </p>
          <button
            type="button"
            onClick={() => {
              setForm(DEFAULT_FORM)
              setErrors({})
              setSubmitted(false)
            }}
            className="cb-btn-primary mt-6 gap-2"
          >
            <Plus size={14} />
            Add Another
          </button>
        </div>
      </div>
    )
  }

  const subCategoryOptions =
    form.mainCategory.length > 0 && form.mainCategory in SUB_CATEGORIES
      ? SUB_CATEGORIES[form.mainCategory as keyof typeof SUB_CATEGORIES]
      : []

  return (
    <div className="min-h-screen bg-[var(--cb-surface-2)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-12">
        <h1 className="font-display text-2xl font-black text-[var(--cb-text-primary)]">Add New Product</h1>
        <p className="mt-1 text-sm text-[var(--cb-text-muted)]">
          Products are submitted for moderation before going live
        </p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-[var(--cb-text-muted)]">Product Name</span>
            <input
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
            />
            {errors.name && <p className="mt-1 text-xs text-status-error">{errors.name}</p>}
          </label>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Main Category</span>
              <select
                value={form.mainCategory}
                onChange={(event) => {
                  setField('mainCategory', event.target.value)
                  setField('subCategory', '')
                }}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              >
                <option value="">Select category</option>
                {MAIN_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.mainCategory && <p className="mt-1 text-xs text-status-error">{errors.mainCategory}</p>}
            </label>

            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Sub Category</span>
              <select
                value={form.subCategory}
                onChange={(event) => setField('subCategory', event.target.value)}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              >
                <option value="">Select sub category</option>
                {subCategoryOptions.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Brand</span>
              <input
                value={form.brand}
                onChange={(event) => setField('brand', event.target.value)}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Price INR</span>
              <input
                type="number"
                value={form.price}
                onChange={(event) => setField('price', event.target.value)}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              />
              {errors.price && <p className="mt-1 text-xs text-status-error">{errors.price}</p>}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Original Price INR</span>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(event) => setField('originalPrice', event.target.value)}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-[var(--cb-text-muted)]">Source</span>
              <select
                value={form.source}
                onChange={(event) => setField('source', event.target.value as AffiliateSource)}
                className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
              >
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="CJ">CJ</option>
                <option value="Direct">Direct</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold text-[var(--cb-text-muted)]">Affiliate URL</span>
            <input
              type="url"
              value={form.affiliateUrl}
              onChange={(event) => setField('affiliateUrl', event.target.value)}
              className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
            />
            {errors.affiliateUrl && <p className="mt-1 text-xs text-status-error">{errors.affiliateUrl}</p>}
          </label>

          <label className="block">
            <span className="text-xs font-bold text-[var(--cb-text-muted)]">Warranty</span>
            <input
              value={form.warranty}
              onChange={(event) => setField('warranty', event.target.value)}
              className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-[var(--cb-text-muted)]">Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              className="glass-panel mt-1 w-full rounded-button border cb-border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-skyline-primary"
            />
            {errors.description && <p className="mt-1 text-xs text-status-error">{errors.description}</p>}
          </label>

          <button type="button" onClick={handleSubmit} className="cb-btn-primary w-full justify-center gap-2 py-4">
            <Save size={16} />
            Submit for Review
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(DEFAULT_FORM)
              setErrors({})
            }}
            className="cb-btn-ghost w-full justify-center gap-2"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
