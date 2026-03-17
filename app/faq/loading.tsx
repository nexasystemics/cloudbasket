export default function FAQLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <div className="bg-zinc-200 dark:bg-zinc-800 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-3">
          <div className="h-10 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto" />
          <div className="h-9 w-72 rounded-xl bg-zinc-300 dark:bg-zinc-700 mx-auto" />
          <div className="h-4 w-64 rounded bg-zinc-300 dark:bg-zinc-700 mx-auto" />
        </div>
      </div>

      {/* FAQ accordion groups */}
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 h-16" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
