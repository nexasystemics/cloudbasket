import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Contact Us</h1>
          <p className="text-white/80 text-sm">
            Questions, feedback, or affiliate enquiries — we&apos;re here to help.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 p-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
              style={{ backgroundColor: '#039BE5' }}
            >
              @
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-500">hello@cloudbasket.in</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
              style={{ backgroundColor: '#1B5E20' }}
            >
              ✉
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Affiliate</h3>
            <p className="text-sm text-gray-500">affiliate@cloudbasket.in</p>
          </div>
          <div className="rounded-2xl border border-gray-200 p-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg"
              style={{ backgroundColor: '#E65100' }}
            >
              ⚑
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Support</h3>
            <p className="text-sm text-gray-500">support@cloudbasket.in</p>
          </div>
        </div>

        <section className="rounded-2xl border border-gray-200 p-8">
          <h2 className="text-lg font-bold mb-5" style={{ color: '#36454F' }}>Send a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none"
                style={{ borderColor: '#e5e7eb' }}
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none"
            />
            <textarea
              rows={4}
              placeholder="Your message…"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full font-semibold text-white text-sm transition-colors hover:opacity-90"
              style={{ backgroundColor: '#E65100' }}
            >
              Send Message
            </button>
          </form>
        </section>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#E65100' }}
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
