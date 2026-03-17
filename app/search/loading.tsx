export default function SearchLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Search bar section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 py-12">
        <div className="mx-auto max-w-3xl px-6 space-y-6">
          <div className="h-12 w-48 rounded-xl bg-zinc-200 dark:bg-zinc-800 mx-auto" />
          <div className="h-14 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-6 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 h-[440px]" />
          ))}
        </div>
      </div>
    </div>
  )
}
