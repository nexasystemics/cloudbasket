export default function AboutLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero */}
      <div className="bg-zinc-200 dark:bg-zinc-800 py-24">
        <div className="mx-auto max-w-4xl px-6 space-y-4">
          <div className="h-12 w-80 rounded-xl bg-zinc-300 dark:bg-zinc-700 mx-auto" />
          <div className="h-5 w-96 rounded-lg bg-zinc-300 dark:bg-zinc-700 mx-auto" />
        </div>
      </div>

      {/* Content blocks */}
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-7 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${85 + Math.random() * 15}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
