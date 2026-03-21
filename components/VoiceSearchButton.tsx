'use client'
import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
export default function VoiceSearchButton({ onResult }: { onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(() => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window))
  const start = () => {
    if (!supported) return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; const r = new SR()
    r.lang = 'en-IN'; r.onstart = () => setListening(true); r.onend = () => setListening(false)
    r.onresult = (e: any) => onResult(e.results[0][0].transcript); r.onerror = () => setListening(false); r.start()
  }
  if (!supported) return null
  return <button type="button" onClick={start} disabled={listening} className={`cb-btn cb-btn-ghost p-2 ${listening ? 'text-red-500 animate-pulse' : ''}`} aria-label="Voice search">{listening ? <MicOff size={18} /> : <Mic size={18} />}</button>
}