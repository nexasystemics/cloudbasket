import type { ProductSpecification } from './ProductSpecifications'

export default function ProductSpecSummary({ specifications, maxItems = 6 }: { specifications: ProductSpecification; maxItems?: number }) {
  const highlights = specifications.sections.flatMap((s) => s.specs.filter((spec) => spec.highlight)).slice(0, maxItems)
  if (highlights.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {highlights.map((spec, i) => (
        <span key={i} className="cb-badge text-[10px]">
          {spec.label}: {spec.value}{spec.unit ? ` ${spec.unit}` : ''}
        </span>
      ))}
      <a href="#specifications" className="cb-badge cb-badge-blue text-[10px]">More specs ↓</a>
    </div>
  )
}
