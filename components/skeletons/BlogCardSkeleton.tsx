export default function BlogCardSkeleton() {
  return (
    <div className="cb-card overflow-hidden animate-pulse">
      <div className="h-44 bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  )
}