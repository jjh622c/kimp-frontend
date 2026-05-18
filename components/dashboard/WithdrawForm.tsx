'use client'

import { useState } from 'react'
import { useToast } from '@/lib/toast-context'

interface WithdrawFormProps {
  tokenBalance: number
  currentPrice: number
  lockupEndsAt?: string | null
  investmentStatus: string
  investedAt?: string | null
}

export function WithdrawForm({
  tokenBalance,
  currentPrice,
  lockupEndsAt,
  investmentStatus,
  investedAt,
}: WithdrawFormProps) {
  const [tokenAmount, setTokenAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const lockupDate = lockupEndsAt ? new Date(lockupEndsAt) : null
  const investedDate = investedAt ? new Date(investedAt) : null
  const estimatedKrw = tokenAmount ? Math.floor(parseFloat(tokenAmount) * currentPrice) : 0

  const isLocked =
    investmentStatus !== 'ACTIVE' ||
    (lockupDate ? lockupDate > new Date() : true)

  const daysUntilUnlock = lockupDate
    ? Math.max(0, Math.ceil((lockupDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  async function handleSubmit() {
    const amount = parseFloat(tokenAmount)
    if (!amount || amount <= 0 || amount > tokenBalance) return

    setLoading(true)
    try {
      const res = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAmount: amount, txHash: txHash || undefined }),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(`Withdrawal requested — estimated payout: ${json.krwAmount?.toLocaleString()} KRW`)
        setTokenAmount('')
        setTxHash('')
      } else {
        toast.error(json.error ?? 'Error submitting withdrawal request')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (isLocked) {
    return (
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
        <h2 className="text-sm font-medium text-white mb-4">Withdraw</h2>

        {lockupDate && daysUntilUnlock !== null ? (
          <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0" />
              <span className="text-xs font-medium text-[#f59e0b]">
                Locked · Unlocks in {daysUntilUnlock} day{daysUntilUnlock !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-[11px] text-[#f59e0b]/60 pl-3.5 space-y-0.5">
              {investedDate && (
                <p>
                  Investment date:{' '}
                  {investedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <p>
                Unlock date:{' '}
                {lockupDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-white/[0.35] mb-4">
            {investmentStatus !== 'ACTIVE'
              ? 'Withdrawal available once investment is active.'
              : 'Lockup period in progress.'}
          </p>
        )}

        <button
          disabled
          className="w-full bg-white/[0.05] text-white/30 rounded-xl py-3 text-sm font-medium cursor-not-allowed"
        >
          {daysUntilUnlock !== null
            ? `Unlocks in ${daysUntilUnlock} day${daysUntilUnlock !== 1 ? 's' : ''}`
            : 'Withdrawal locked'}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Withdraw</h2>
      <p className="text-xs text-white/[0.35] mb-4">
        Transfer tokens to the operations wallet, then enter the transaction hash. KRW will be sent
        after admin verification.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            Token amount (balance: {tokenBalance.toLocaleString()} TOKEN)
          </label>
          <input
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            placeholder="0"
            max={tokenBalance}
            className="w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#3d8ef8]/40"
          />
          {tokenAmount && estimatedKrw > 0 && (
            <p className="text-[11px] text-white/40 mt-1">
              Estimated payout: {estimatedKrw.toLocaleString()} KRW
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            Transaction hash (optional)
          </label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x..."
            className="w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-white font-mono placeholder:text-white/20 outline-none focus:border-[#3d8ef8]/40"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !tokenAmount || parseFloat(tokenAmount) <= 0}
        className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        {loading ? 'Processing…' : 'Request withdrawal'}
      </button>
    </div>
  )
}
