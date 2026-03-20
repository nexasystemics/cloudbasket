'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type SpecItem = { label: string; value: string; highlight?: boolean; unit?: string }
export type SpecSection = { title: string; specs: SpecItem[] }
export type ProductSpecification = { sections: SpecSection[] }

export default function ProductSpecifications({ specifications, productName }: { specifications: ProductSpecification; productName: string }) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [showAll, setShowAll] = useState(false)
  const sections = showAll ? specifications.sections : specifications.sections.slice(0, 3)

  return (
    <div className="cb-card p-6" id="specifications">
      <h2 className="text-xl font-black tracking-tight mb-6">Specifications — {productName}</h2>
      <div className="space-y-4">
        {sections.map((section, si) => (
          <div key={si}>
            <button
              type="button"
              className="flex w-full items-center justify-between py-2 text-left border-b border-[var(--cb-border)]"
              onClick={() => setExpanded({ ...expanded, [si]: expanded[si] === false ? true : false })}
            >
              <span className="text-sm font-black uppercase tracking-widest text-[var(--cb-text-muted)]">
                {section.title} <span className="font-normal normal-case">({section.specs.length})</span>
              </span>
              <ChevronDown size={16} className={`transition-transform ${expanded[si] === false ? '-rotate-90' : ''}`} />
            </button>
            {expanded[si] !== false && (
              <table className="w-full mt-2">
                <tbody>
                  {section.specs.map((spec, spi) => (
                    <tr key={spi} className={`${spi % 2 === 0 ? 'bg-[var(--cb-surface-2)]/50' : ''} ${spec.highlight ? 'border-l-2 border-skyline-primary pl-2' : ''}`}>
                      <td className="py-2 px-3 text-xs font-bold text-[var(--cb-text-muted)] w-40 align-top">{spec.label}</td>
                      <td className="py-2 px-3 text-sm">{spec.value}{spec.unit ? ` ${spec.unit}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
      {specifications.sections.length > 3 && (
        <button type="button" onClick={() => setShowAll(!showAll)} className="mt-4 text-sm text-skyline-primary underline">
          {showAll ? 'Show less' : `Show all ${specifications.sections.length} sections`}
        </button>
      )}
    </div>
  )
}