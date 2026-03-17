export default function BlogLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <div className="bg-zinc-200 dark:bg-zinc-800 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-4">
          <div className="h-12 w-64 rounded-xl bg-zinc-300 dark:bg-zinc-700 mx-auto" />
          <div className="h-4 w-96 rounded-lg bg-zinc-300 dark:bg-zinc-700 mx-auto" />
        </div>
      </div>

      {/* Post grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden border border-zinc-100 dark:border-zinc-800">
              <div className="h-52 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
