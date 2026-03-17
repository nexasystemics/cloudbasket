export default function DealsLoading() {
  return (
    <div className="animate-pulse min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero */}
      <div className="h-48 bg-zinc-300 dark:bg-zinc-800" />

      {/* Category pills + grid */}
      <div className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex gap-3 mb-6 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 w-24 flex-shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 h-80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
