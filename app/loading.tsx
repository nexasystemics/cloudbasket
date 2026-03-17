export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[480px] bg-zinc-200 dark:bg-zinc-800" />

      {/* Platform trust bar */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </div>

      {/* Trending searches */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </div>

      {/* Deals bar */}
      <div className="h-16 bg-zinc-100 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800" />

      {/* Top deals grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-8 w-48 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-8" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 h-72" />
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="bg-zinc-50 dark:bg-zinc-900 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-8 w-56 rounded-xl bg-zinc-200 dark:bg-zinc-800 mb-12" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 h-44" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
