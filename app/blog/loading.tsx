// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 animate-pulse">
      <div className="mb-12 text-center">
        <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-6 w-96 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <div className="h-56 bg-zinc-100 dark:bg-zinc-800" />
            <div className="p-6">
              <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-7 w-full bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
