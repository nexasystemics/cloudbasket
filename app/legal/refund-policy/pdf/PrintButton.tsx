'use client'

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-lg bg-[#12315f] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      Print / Save PDF
    </button>
  )
}
