// app/faq/loading.tsx
export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 animate-pulse">
      <div className="text-center mb-16">
        <div className="h-12 w-48 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto mb-4" />
        <div className="h-6 w-80 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
