export default function DealsBarSkeleton() {
  return (
    <div className="animate-pulse flex gap-4 overflow-hidden px-6 py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-32 space-y-2">
          <div className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  )
}
