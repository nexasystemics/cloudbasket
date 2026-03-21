'use client'
import { useState } from 'react'
import { Zap, Download, Palette } from 'lucide-react'
import type { DesignStyle, GeneratedDesign } from '@/services/pod/ai-design-generator'

const STYLES: DesignStyle[] = ['minimalist','vintage','geometric','watercolor','line-art','bold-graphic','typography','illustrative']
const GENERATORS = [{id:'dalle',label:'DALL-E 3',desc:'Better concepts + text'},{id:'stability',label:'Stability AI',desc:'Better artistic styles'}]

export default function AIDesignStudioPage() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<DesignStyle>('minimalist')
  const [generator, setGenerator] = useState('dalle')
  const [designs, setDesigns] = useState<GeneratedDesign[]>([])
  const [generating, setGenerating] = useState(false)

  const generate = async () => {
    if (!prompt) return
    setGenerating(true)
    try {
      const r = await fetch('/api/pod/ai-generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,style,generator})})
      const data = await r.json()
      if (data.designs) setDesigns(data.designs)
    } catch { /* no-op */ }
    setGenerating(false)
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">AI Design Studio</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Generate print-ready POD designs using DALL-E 3 and Stability AI</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-4">
          <div><label className="block text-xs font-black uppercase tracking-widest mb-2">Design Description</label>
            <textarea className="cb-input w-full h-24 resize-none" placeholder="Describe your design... e.g. 'A majestic mountain range with sunset colors, pine trees silhouette'" value={prompt} onChange={e=>setPrompt(e.target.value)} />
          </div>
          <div><label className="block text-xs font-black uppercase tracking-widest mb-2">Style</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map(s=><button key={s} type="button" onClick={()=>setStyle(s)} className={`cb-btn text-xs ${style===s?'cb-btn-primary':'cb-btn-ghost'}`}>{s}</button>)}
            </div>
          </div>
          <div><label className="block text-xs font-black uppercase tracking-widest mb-2">Generator</label>
            <div className="grid grid-cols-2 gap-2">
              {GENERATORS.map(g=><button key={g.id} type="button" onClick={()=>setGenerator(g.id)} className={`cb-btn text-sm ${generator===g.id?'cb-btn-primary':'cb-btn-ghost'}`}><span className="font-black">{g.label}</span><span className="text-xs ml-2 opacity-70">{g.desc}</span></button>)}
            </div>
          </div>
          <button type="button" onClick={generate} disabled={!prompt||generating} className="cb-btn cb-btn-primary w-full gap-2 py-3 text-base">
            <Zap size={18} />{generating?'Generating (30-60 seconds)...':'Generate Designs'}
          </button>
        </div>

        <div className="cb-card p-4">
          <h3 className="font-black mb-3 flex items-center gap-2"><Palette size={16}/> Tips</h3>
          <ul className="text-xs text-[var(--cb-text-muted)] space-y-2">
            <li>• Be specific: colors, mood, subject</li>
            <li>• DALL-E 3 better for text in designs</li>
            <li>• Stability AI gives 4 variations</li>
            <li>• Use "Remove Background" for transparent PNGs</li>
            <li>• Upscale before sending to Printify</li>
          </ul>
        </div>
      </div>

      {designs.length>0 && (
        <div>
          <h2 className="font-black text-xl mb-4">Generated Designs ({designs.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {designs.map(d=>(
              <div key={d.id} className="cb-card p-3">
                <div className="aspect-square bg-[var(--cb-surface-2)] rounded-xl mb-3 overflow-hidden flex items-center justify-center">
                  <img src={d.originalUrl} alt={d.prompt} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-[var(--cb-text-muted)] truncate">{d.style}</p>
                <div className="flex gap-1 mt-2">
                  <a href={d.originalUrl} download className="cb-btn cb-btn-ghost text-[10px] flex-1 gap-1 py-1"><Download size={10}/>Save</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}