export default function ContactLoading() {
  return (
    <div className="animate-pulse bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-zinc-200 dark:bg-zinc-800 py-16">
        <div className="mx-auto max-w-2xl px-6 space-y-3 text-center">
          <div className="h-10 w-40 rounded-xl bg-zinc-300 dark:bg-zinc-700 mx-auto" />
          <div className="h-4 w-72 rounded bg-zinc-300 dark:bg-zinc-700 mx-auto" />
        </div>
      </div>

      {/* Contact form */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-36 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-12 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
