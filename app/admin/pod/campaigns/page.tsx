'use client'
import { useState, useEffect } from 'react'
import { Calendar, Zap } from 'lucide-react'
import { getCurrentSeasonCampaigns, generateSeasonalDesignPrompt, type Season } from '@/services/pod/seasonal-campaigns'

export default function SeasonalCampaignsPage() {
  const [campaigns, setCampaigns] = useState<ReturnType<typeof getCurrentSeasonCampaigns>>([])
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => { setCampaigns(getCurrentSeasonCampaigns()) }, [])

  const generate = async (season: Season) => {
    setGenerating(true)
    const p = await generateSeasonalDesignPrompt(season)
    setPrompt(p); setGenerating(false)
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-black tracking-tighter mb-2">Seasonal Campaign Manager</h1>
      <p className="text-[var(--cb-text-muted)] mb-8">Auto-generate POD designs and campaigns for Indian festivals and seasons.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {campaigns.map(({ season, campaign }) => (
          <div key={season} className="cb-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-skyline-primary" />
              <h3 className="font-black capitalize">{season.replace('-', ' ')}</h3>
              <span className="cb-badge bg-green-500/10 text-green-500 text-[9px]">ACTIVE</span>
            </div>
            <div className="flex gap-1 mb-3">{campaign.colorPalette.map(c => <div key={c} className="w-6 h-6 rounded-full border border-zinc-200" style={{ backgroundColor: c }} />)}</div>
            <p className="text-xs text-[var(--cb-text-muted)] mb-3 line-clamp-2">{campaign.designTheme}</p>
            <p className="text-xs font-bold text-red-500 mb-3">{campaign.discountPercent}% discount • {campaign.startDate} – {campaign.endDate}</p>
            <button type="button" onClick={() => generate(season)} disabled={generating} className="cb-btn cb-btn-primary w-full text-xs gap-1">
              <Zap size={12} />{generating ? 'Generating...' : 'Generate AI Prompt'}
            </button>
          </div>
        ))}
      </div>
      {prompt && (
        <div className="cb-card p-6">
          <h2 className="font-black mb-3">Generated Design Prompt</h2>
          <p className="text-sm bg-[var(--cb-surface-2)] p-4 rounded-xl">{prompt}</p>
          <button type="button" onClick={() => navigator.clipboard.writeText(prompt)} className="cb-btn cb-btn-ghost text-sm mt-3">Copy to Clipboard</button>
        </div>
      )}
    </main>
  )
}