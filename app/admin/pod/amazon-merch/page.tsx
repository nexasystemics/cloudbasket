'use client'
import { useState } from 'react'
import { FileText, Download, Zap } from 'lucide-react'
import { amazonMerchService, type AmazonMerchSubmission } from '@/services/pod/amazon-merch'

export default function AmazonMerchPage() {
  const [description, setDescription] = useState('')
  const [productType, setProductType] = useState<any>('standard-t-shirt')
  const [submission, setSubmission] = useState<AmazonMerchSubmission|null>(null)
  const [generating, setGenerating] = useState(false)
  const [submissions, setSubmissions] = useState<AmazonMerchSubmission[]>([])

  const generate = async () => {
    if (!description) return
    setGenerating(true)
    const s = await amazonMerchService.generateSubmission(description, productType)
    setSubmission(s); setGenerating(false)
  }

  const addToBulk = () => { if (submission) { setSubmissions(prev=>[...prev,submission]); setSubmission(null); setDescription('') } }

  const downloadCSV = () => {
    if (!submissions.length) return
    const csv = amazonMerchService.generateCSVBulkUpload(submissions)
    const blob = new Blob([csv],{type:'text/csv'})
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'amazon-merch-bulk.csv'; a.click()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Amazon Merch on Demand</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cb-card p-6">
          <h2 className="font-black mb-4">Generate Listing Content</h2>
          <textarea className="cb-input w-full h-24 resize-none mb-3" placeholder="Describe your design (e.g. 'Mountain sunset watercolor minimalist nature')" value={description} onChange={e=>setDescription(e.target.value)} />
          <select className="cb-input w-full mb-3" value={productType} onChange={e=>setProductType(e.target.value)}>
            {['standard-t-shirt','premium-t-shirt','pullover-hoodie','phone-case','tote-bag'].map(t=><option key={t}>{t}</option>)}
          </select>
          <button type="button" onClick={generate} disabled={!description||generating} className="cb-btn cb-btn-primary w-full gap-2">
            <Zap size={16} />{generating?'Generating...':'Generate with AI'}
          </button>
          {submission && (
            <div className="mt-4 space-y-2">
              <div className="cb-card p-4 bg-[var(--cb-surface-2)]">
                <p className="text-xs font-black text-skyline-primary uppercase tracking-widest mb-2">Generated Content</p>
                <p className="font-black text-sm">{submission.title}</p>
                <p className="text-xs text-[var(--cb-text-muted)] mt-1">{submission.description.slice(0,100)}...</p>
                <p className="text-xs mt-2">Keywords: {submission.keywords.join(', ')}</p>
              </div>
              <button type="button" onClick={addToBulk} className="cb-btn cb-btn-primary w-full text-sm">Add to Bulk Export</button>
            </div>
          )}
        </div>
        <div className="cb-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black">Bulk Export Queue ({submissions.length})</h2>
            {submissions.length>0 && <button type="button" onClick={downloadCSV} className="cb-btn cb-btn-ghost text-sm gap-1"><Download size={14}/> CSV</button>}
          </div>
          {submissions.length===0?<p className="text-sm text-[var(--cb-text-muted)]">Add designs above to build bulk export</p>:submissions.map((s,i)=>(
            <div key={i} className="text-sm border-b border-[var(--cb-border)] pb-2 mb-2">
              <p className="font-bold truncate">{s.title}</p>
              <p className="text-xs text-[var(--cb-text-muted)]">Score: {amazonMerchService.validateForAmazon(s).score}/100</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}