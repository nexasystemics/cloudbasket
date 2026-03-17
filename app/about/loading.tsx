// app/about/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 animate-pulse">
      <div className="text-center mb-16">
        <div className="h-12 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-6 w-96 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
      </div>
      <div className="space-y-12">
        <div className="h-64 w-full bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
        </div>
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
        <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
        <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  )
}
