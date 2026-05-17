'use client'

import { useState } from 'react'

export function AdminReportSection() {
  const [month, setMonth] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [manualHash, setManualHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; txHash?: string } | null>(null)

  async function handleSubmit() {
    if (!month) return
    setLoading(true)
    setResult(null)

    try {
      let reportHash = manualHash.trim()

      if (!reportHash && pdfFile) {
        const buf = await pdfFile.arrayBuffer()
        const hashBuf = await crypto.subtle.digest('SHA-256', buf)
        reportHash = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
      }

      if (!reportHash) {
        setResult({ success: false, message: 'Please upload a PDF or enter a hash manually.' })
        return
      }

      const res = await fetch('/api/admin/record-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, reportHash }),
      })
      const json = await res.json()

      if (res.ok) {
        setResult({
          success: true,
          message: `Report recorded — ${month}`,
          txHash: json.txHash,
        })
        setMonth('')
        setPdfFile(null)
        setManualHash('')
      } else {
        setResult({ success: false, message: json.error ?? 'Failed to record report' })
      }
    } catch {
      setResult({ success: false, message: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-white">Monthly report hash</h2>
        <span className="text-[11px] text-white/30">On-chain audit trail</span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#3d8ef8]/40"
          />
        </div>

        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            Upload PDF (auto-hash)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs text-white/50 file:mr-3 file:text-[#3d8ef8] file:bg-[#3d8ef8]/10 file:border file:border-[#3d8ef8]/20 file:rounded file:px-2 file:py-1 file:text-xs file:cursor-pointer"
          />
          {pdfFile && (
            <p className="text-[11px] text-white/30 mt-1 truncate">{pdfFile.name}</p>
          )}
        </div>

        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            Or enter SHA-256 hash manually
          </label>
          <input
            type="text"
            value={manualHash}
            onChange={(e) => setManualHash(e.target.value)}
            placeholder="0x... or hex string"
            className="w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-white/20 outline-none focus:border-[#3d8ef8]/40"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !month}
        className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
      >
        {loading ? 'Recording…' : 'Record on-chain →'}
      </button>

      {result && (
        <div
          className={`mt-2 px-3 py-2 rounded-lg text-xs ${
            result.success
              ? 'bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]'
              : 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]'
          }`}
        >
          <div>{result.message}</div>
          {result.txHash && (
            <div className="font-mono text-[10px] mt-0.5 text-[#22c55e]/70 truncate">
              tx: {result.txHash}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
