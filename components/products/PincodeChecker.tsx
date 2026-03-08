'use client'

import { useState } from 'react'
import { Check, MapPin, X } from 'lucide-react'

export function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')

  const check = () => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) return
    setStatus('checking')

    setTimeout(() => {
      const tier1 = ['110', '400', '600', '700', '500', '560', '411']
      const isAvailable = tier1.some((prefix) => pincode.startsWith(prefix)) || Math.random() > 0.15
      setStatus(isAvailable ? 'available' : 'unavailable')
    }, 800)
  }

  return (
    <div className="cb-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MapPin size={14} className="text-[#039BE5]" />
        Check Delivery to Your Pincode
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(event) => {
            setPincode(event.target.value)
            setStatus('idle')
          }}
          placeholder="Enter 6-digit pincode"
          className="cb-input flex-1 text-sm"
          onKeyDown={(event) => event.key === 'Enter' && check()}
        />
        <button
          onClick={check}
          disabled={pincode.length !== 6 || status === 'checking'}
          className="cb-btn cb-btn-primary text-sm px-4"
        >
          {status === 'checking' ? '…' : 'Check'}
        </button>
      </div>
      {status === 'available' ? (
        <div className="flex items-center gap-2 text-[#10B981] text-sm">
          <Check size={14} /> Delivery available. Usually 2-5 days.
        </div>
      ) : null}
      {status === 'unavailable' ? (
        <div className="flex items-center gap-2 text-[#EF4444] text-sm">
          <X size={14} /> Not serviceable at this pincode yet.
        </div>
      ) : null}
      <p className="text-[10px] text-muted">Powered by affiliate partner logistics networks</p>
    </div>
  )
}
