'use client'
// app/pod/upload/page.tsx
import { useState, useRef } from 'react'
import { Upload, X, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import { bulkUploadEngine, type ImageValidationResult, type UploadOptions } from '@/services/pod/bulk-upload-engine'

const PLATFORMS = ['printify','printful','etsy','shopify','amazon','website'] as const
const PRODUCT_TYPES = ['tshirt','mug','phone-case','poster','hoodie','tote-bag'] as const

export default function BulkUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [validations, setValidations] = useState<ImageValidationResult[]>([])
  const [platforms, setPlatforms] = useState<string[]>(['printify'])
  const [productTypes, setProductTypes] = useState<string[]>(['tshirt'])
  const [progress, setProgress] = useState<{total:number;completed:number;failed:number}|null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (newFiles: File[]) => {
    const valid = newFiles.filter(f=>f.size<26000000)
    setFiles(valid)
    const results = await bulkUploadEngine.validateImages(valid)
    setValidations(results)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    handleFiles(dropped)
  }

  const handleUpload = async () => {
    const opts: UploadOptions = { targetPlatforms: platforms as any, productTypes: productTypes as any, autoPublish: false, draftFirst: true }
    await bulkUploadEngine.processQueue(files, opts, r => setProgress({total:r.total,completed:r.completed,failed:r.failed}))
  }

  const validCount = validations.filter(v=>v.valid).length
  const invalidCount = validations.filter(v=>!v.valid).length

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Bulk Image Upload</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Upload up to 100 images simultaneously for POD product creation</p>

      {/* Upload Zone */}
      <div onDrop={handleDrop} onDragOver={e=>{e.preventDefault();setIsDragging(true)}} onDragLeave={()=>setIsDragging(false)}
        onClick={()=>inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors mb-8 ${isDragging?'border-skyline-primary bg-blue-500/5':'border-[var(--cb-border)] hover:border-skyline-primary'}`}>
        <Upload size={40} className="mx-auto text-[var(--cb-text-muted)] mb-4" />
        <p className="font-black text-lg">Drop images here or click to browse</p>
        <p className="text-sm text-[var(--cb-text-muted)] mt-2">PNG, JPG, WEBP • Max 25MB each • Min 3000×3000px for print quality</p>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" onChange={e=>handleFiles(Array.from(e.target.files||[]))} />
      </div>

      {files.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="cb-card p-4 text-center"><p className="text-2xl font-black">{files.length}</p><p className="text-xs text-[var(--cb-text-muted)]">Total Files</p></div>
            <div className="cb-card p-4 text-center"><p className="text-2xl font-black text-green-500">{validCount}</p><p className="text-xs text-[var(--cb-text-muted)]">Valid</p></div>
            <div className="cb-card p-4 text-center"><p className="text-2xl font-black text-red-500">{invalidCount}</p><p className="text-xs text-[var(--cb-text-muted)]">Issues</p></div>
          </div>

          {/* Platform Selection */}
          <div className="cb-card p-5 mb-4">
            <h3 className="font-black mb-3">Target Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => <button key={p} type="button" onClick={()=>setPlatforms(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p])}
                className={`cb-btn text-xs ${platforms.includes(p)?'cb-btn-primary':'cb-btn-ghost'}`}>{p}</button>)}
            </div>
          </div>

          {/* Product Types */}
          <div className="cb-card p-5 mb-6">
            <h3 className="font-black mb-3">Product Types</h3>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map(t => <button key={t} type="button" onClick={()=>setProductTypes(prev=>prev.includes(t)?prev.filter(x=>x!==t):[...prev,t])}
                className={`cb-btn text-xs ${productTypes.includes(t)?'cb-btn-primary':'cb-btn-ghost'}`}>{t}</button>)}
            </div>
          </div>

          {/* Progress */}
          {progress && (
            <div className="cb-card p-5 mb-6">
              <div className="flex justify-between text-sm mb-2"><span>Progress</span><span>{progress.completed}/{progress.total}</span></div>
              <div className="h-3 bg-[var(--cb-surface-2)] rounded-full overflow-hidden">
                <div className="h-full bg-skyline-primary rounded-full transition-all" style={{width:`${progress.total>0?(progress.completed/progress.total)*100:0}%`}} />
              </div>
            </div>
          )}

          <button type="button" onClick={handleUpload} disabled={validCount===0} className="cb-btn cb-btn-primary w-full gap-2 text-lg py-4">
            <Zap size={20} /> Upload {validCount} Valid Images to {platforms.length} Platform(s)
          </button>
        </>
      )}
    </main>
  )
}