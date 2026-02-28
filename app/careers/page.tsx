import Link from 'next/link'

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Careers</h1>
          <p className="text-white/80 text-sm">
            Join us in building India&apos;s smartest shopping platform.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <section
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#f0f9ff', border: '2px dashed #039BE5' }}
        >
          <div
            className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-4"
            style={{ backgroundColor: '#039BE5' }}
          >
            <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=56&h=56&fit=crop" alt="Careers" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">We&apos;re Hiring Soon</h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            CloudBasket is growing fast. We&apos;ll be posting open roles across engineering,
            design, content and affiliate management. Check back soon.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#36454F' }}>
            Roles We&apos;ll Be Hiring For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { role: 'Full-Stack Engineer', tag: 'Engineering' },
              { role: 'UI/UX Designer', tag: 'Design' },
              { role: 'Content Writer', tag: 'Content' },
              { role: 'Affiliate Manager', tag: 'Growth' },
            ].map((item) => (
              <div
                key={item.role}
                className="rounded-xl border border-gray-200 p-5 flex items-center justify-between"
              >
                <span className="font-semibold text-gray-800 text-sm">{item.role}</span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#F5C518', color: '#36454F' }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-gray-500">
          Interested in working with us? Send your CV to{' '}
          <span style={{ color: '#039BE5' }}>careers@cloudbasket.in</span>
        </p>

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
