'use client'

import { useState } from 'react'

interface OracleUpdateFormProps {
  currentPrice: number
}

export function OracleUpdateForm({ currentPrice }: OracleUpdateFormProps) {
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSubmit() {
    const priceNum = parseFloat(price)
    if (!priceNum || priceNum <= 0) return

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/admin/update-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: priceNum, note: note || undefined }),
      })
      const json = await res.json()
      if (res.ok) {
        setResult({
          success: true,
          message: `Updated — new price: ${json.price?.toLocaleString()} KRW`,
        })
        setPrice('')
        setNote('')
      } else {
        setResult({ success: false, message: json.error ?? 'An error occurred' })
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
        <h2 className="text-sm font-medium text-white">Update oracle token price</h2>
        <span className="text-xs text-white/40">
          Current: <span className="text-white">{currentPrice.toLocaleString()} KRW</span>
        </span>
      </div>
      <div className="flex gap-2 mb-2 max-sm:flex-col">
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="New price (KRW)"
          className="flex-1 min-w-0 bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3d8ef8]/40"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="w-44 max-sm:w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#3d8ef8]/40"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !price}
          className="bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap max-sm:w-full"
        >
          {loading ? 'Processing…' : 'Update'}
        </button>
      </div>
      {result && (
        <div
          className={`px-3 py-2 rounded-lg text-xs ${
            result.success
              ? 'bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]'
              : 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]'
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}
