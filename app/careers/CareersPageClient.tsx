'use client'
import { useState } from 'react'
import { MapPin, Clock, Briefcase, ArrowRight, Code, PenTool, TrendingUp, Search, Users, Zap, X, Check, Upload } from 'lucide-react'

const BENEFITS = [
  { title: 'Remote First', desc: 'Work from anywhere in India. We care about output, not location.', icon: '🌏' },
  { title: 'Mission Driven', desc: 'Every line of code helps real people save real money.', icon: '🎯' },
  { title: 'Competitive Salary', desc: 'Market-rate INR salary + ESOP for all full-time roles.', icon: '💰' },
  { title: 'Health Insurance', desc: 'Full family health coverage from day one.', icon: '🏥' },
  { title: 'Learning Budget', desc: '₹20,000/year for courses, books and conferences.', icon: '📚' },
  { title: '25 Days Leave', desc: '25 days + all Indian public holidays. No questions asked.', icon: '🌴' },
]

const JOBS = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote India', type: 'Full-time', icon: Code, color: '#039BE5', desc: 'Build global-grade Next.js + Supabase applications at scale. Own features end-to-end.' },
  { title: 'SEO & Content Marketing Manager', dept: 'Marketing', location: 'Remote India', type: 'Full-time', icon: Search, color: '#10B981', desc: 'Drive organic traffic to 1,200+ pages. Own our content strategy and SEO roadmap.' },
  { title: 'Affiliate Partnerships Manager', dept: 'Business Development', location: 'Remote India', type: 'Full-time', icon: Users, color: '#8B5CF6', desc: 'Grow the CloudBasket Associates network. Manage affiliate relationships with major brands.' },
  { title: 'UI/UX Designer', dept: 'Design', location: 'Remote India', type: 'Full-time', icon: PenTool, color: '#EF4444', desc: 'Design world-class interfaces for India\'s smartest price comparison platform.' },
  { title: 'Data Analyst', dept: 'Analytics', location: 'Remote India', type: 'Full-time', icon: TrendingUp, color: '#F97316', desc: 'Turn price data and user behaviour into actionable insights. Own our analytics dashboard.' },
]

export default function CareersPageClient() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', linkedin: '', portfolio: '', role: '', note: '', consent: false })
  const [submitted, setSubmitted] = useState(false)

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle)
    setForm((f) => ({ ...f, role: jobTitle }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.consent) return
    try { localStorage.setItem('cb_job_applications', JSON.stringify({ ...form, submittedAt: new Date().toISOString() })) } catch { /* no-op */ }
    setSubmitted(true)
  }

  return (
    <main className="bg-[var(--cb-bg)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0F2D4A] to-[#1F4E79] py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
            <Briefcase size={14} /> We're Hiring
          </span>
          <h1 className="text-5xl font-black tracking-tighter">Build the Future of Smart Shopping in India</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">We're a remote-first team on a mission to make price comparison the default way Indians shop. Join us.</p>
          <a href="#positions" className="cb-btn bg-white text-[#1F4E79] font-black px-8 py-3 mt-8 inline-flex items-center gap-2">
            View Open Positions <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Culture */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-black tracking-tighter text-center mb-10">Why Join CloudBasket?</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="cb-card p-6">
              <span className="text-3xl mb-3 block">{b.icon}</span>
              <h3 className="font-black">{b.title}</h3>
              <p className="text-sm text-[var(--cb-text-muted)] mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Positions */}
      <section id="positions" className="bg-[var(--cb-surface-2)] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-black tracking-tighter mb-8">Open Positions</h2>
          <div className="space-y-4">
            {JOBS.map((job) => (
              <article key={job.title} className="cb-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: `${job.color}1A` }}>
                    <job.icon size={22} style={{ color: job.color }} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="cb-badge text-[10px]">{job.dept}</span>
                      <span className="cb-badge text-[10px]"><MapPin size={10} /> {job.location}</span>
                      <span className="cb-badge cb-badge-green text-[10px]"><Clock size={10} /> {job.type}</span>
                    </div>
                    <p className="text-sm text-[var(--cb-text-muted)] mt-2">{job.desc}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleApply(job.title)} className="cb-btn cb-btn-primary gap-2 whitespace-nowrap flex-shrink-0">
                  Apply Now <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* General CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="cb-card p-10">
          <h2 className="text-2xl font-black">Don't see your role?</h2>
          <p className="mt-2 text-[var(--cb-text-muted)]">We hire for talent, not just open positions. Send us your CV and tell us how you can help.</p>
          <button type="button" onClick={() => handleApply('General Application')} className="cb-btn cb-btn-primary mt-6 gap-2">
            Send Your CV <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black">Apply for Position</h2>
                <p className="text-sm text-skyline-primary mt-1">{selectedJob}</p>
              </div>
              <button type="button" onClick={() => { setSelectedJob(null); setSubmitted(false) }} aria-label="Close"><X size={20} /></button>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <Check size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-black">Application Received!</h3>
                <p className="mt-2 text-[var(--cb-text-muted)]">We'll review your application and respond within 7 days.</p>
                <button type="button" onClick={() => { setSelectedJob(null); setSubmitted(false) }} className="cb-btn cb-btn-primary mt-4">Done</button>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text' },
                  { label: 'Email *', key: 'email', type: 'email' },
                  { label: 'LinkedIn URL', key: 'linkedin', type: 'url' },
                  { label: 'Portfolio / GitHub URL', key: 'portfolio', type: 'url' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-black uppercase tracking-widest mb-1">{f.label}</label>
                    <input type={f.type} className="cb-input w-full" value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Resume (PDF)</label>
                  <div className="cb-input flex items-center gap-2 cursor-pointer">
                    <Upload size={16} className="text-[var(--cb-text-muted)]" />
                    <input type="file" accept=".pdf" className="text-sm flex-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1">Cover Note (max 300 chars)</label>
                  <textarea className="cb-input w-full h-20 resize-none" maxLength={300} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Why do you want to join CloudBasket?" />
                  <p className="text-xs text-[var(--cb-text-muted)] mt-1">{form.note.length}/300</p>
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5" />
                  <span className="text-sm">I consent to CloudBasket storing my application data for recruitment purposes.</span>
                </label>
                <button type="button" onClick={handleSubmit} disabled={!form.name || !form.email || !form.consent} className="cb-btn cb-btn-primary w-full">Submit Application</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
