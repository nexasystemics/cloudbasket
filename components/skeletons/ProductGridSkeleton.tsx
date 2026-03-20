import ProductCardSkeleton from './ProductCardSkeleton'

export default function ProductGridSkeleton({ count = 12, columns = 4 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const gridClass = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}