// app/pod/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 animate-pulse">
      <div className="mb-12">
        <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-800 rounded mb-2" />
        <div className="h-5 w-72 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 rounded-3xl bg-zinc-100 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  )
}
