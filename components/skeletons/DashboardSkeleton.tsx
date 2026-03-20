export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse mx-auto max-w-6xl px-6 py-8 lg:flex lg:gap-8">
      <div className="hidden lg:block w-56 flex-shrink-0">
        <div className="cb-card p-3 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />)}
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}