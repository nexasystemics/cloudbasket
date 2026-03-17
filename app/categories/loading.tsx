// app/categories/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 animate-pulse">
      <div className="mb-12">
        <div className="h-10 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
        <div className="h-5 w-96 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  )
}
