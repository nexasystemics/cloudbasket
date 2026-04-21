export default function HeroSkeleton() {
  return (
    <div className="animate-pulse mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <div className="h-4 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-3/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-3">
          <div className="h-11 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-11 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map((i) => <div key={i} className="h-40 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />)}
      </div>
    </div>
  )
}
