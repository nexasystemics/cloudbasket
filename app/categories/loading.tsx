export default function CategoriesLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 h-10 w-64 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 h-44" />
          ))}
        </div>
      </div>
    </div>
  )
}
