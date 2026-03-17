// app/search/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse">
      <div className="h-10 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
      <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-[440px] rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  )
}
