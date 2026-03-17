// app/contact/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
          <div className="h-5 w-72 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
          <div className="space-y-6">
            <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
            <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          </div>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
          </div>
          <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6" />
          <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8" />
          <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
