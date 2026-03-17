export default function PODLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800" />

      {/* Category tabs */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="h-52 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
