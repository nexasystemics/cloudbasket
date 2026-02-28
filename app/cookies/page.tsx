import Link from 'next/link'

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Cookie Policy</h1>
          <p className="text-white/80 text-sm">Last updated: February 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: 'Essential', color: '#1B5E20', desc: 'Session management and security. Always active.' },
            { type: 'Analytics', color: '#039BE5', desc: 'Anonymous usage stats via privacy-first tools.' },
            { type: 'Affiliate', color: '#E65100', desc: 'Tracks referral clicks for commission attribution.' },
          ].map((c) => (
            <div key={c.type} className="rounded-2xl border border-gray-200 p-5">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white inline-block mb-3"
                style={{ backgroundColor: c.color }}
              >
                {c.type}
              </span>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>

        {[
          {
            title: 'What Are Cookies?',
            body: 'Cookies are small text files stored on your device by your browser. They help us remember preferences and understand how visitors use the site.',
          },
          {
            title: 'How to Control Cookies',
            body: 'You can disable cookies in your browser settings at any time. Note that disabling essential cookies may affect site functionality.',
          },
          {
            title: 'Third-Party Cookies',
            body: 'Affiliate network partners (Amazon Associates, CJ Affiliate) may set their own cookies for commission tracking. These are governed by their respective privacy policies.',
          },
        ].map((s) => (
          <section key={s.title}>
            <h2 className="font-bold text-gray-900 mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
          </section>
        ))}

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
