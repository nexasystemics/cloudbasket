export default function ProductCardSkeleton() {
  return (
    <div className="cb-card overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 h-9 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  )
}