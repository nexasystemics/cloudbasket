import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full py-12 px-6" style={{ backgroundColor: '#039BE5' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-2">cloudbasket · legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/80 text-sm">
            Last updated: February 2026 · DPDP Act 2023 compliant
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {[
          {
            title: '1. Data We Collect',
            body: 'We collect only the minimum data necessary to operate the platform: email addresses for newsletter subscribers, usage analytics (anonymised), and affiliate click data (no personal identifiers stored).',
          },
          {
            title: '2. How We Use Your Data',
            body: 'Data is used solely to improve CloudBasket services, send opted-in newsletters, and process affiliate commissions. We do not build advertising profiles or sell data to any third party.',
          },
          {
            title: '3. Cookies',
            body: 'CloudBasket uses essential cookies for session management and analytics cookies (with consent). See our Cookie Policy for full details.',
          },
          {
            title: '4. Your Rights (DPDP Act 2023)',
            body: 'You have the right to access, correct, or erase your personal data at any time. Submit a request to privacy@cloudbasket.in and we will respond within 72 hours.',
          },
          {
            title: '5. Data Retention',
            body: 'Personal data is retained for no longer than 12 months after last activity, unless required by law.',
          },
          {
            title: '6. Contact',
            body: 'Privacy Officer: privacy@cloudbasket.in · CloudBasket, India',
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
