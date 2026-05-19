'use client'

import { useState } from 'react'
import { useToast } from '@/lib/toast-context'

interface WithdrawFormProps {
  tokenBalance: number
  currentPrice: number
  lockupEndsAt?: string | null
  investmentStatus: string
  investedAt?: string | null
  /** Masked bank account on file, e.g. "신한 ***-****-1234". Null if not yet on record. */
  accountOnFile?: string | null
}

export function WithdrawForm({
  tokenBalance,
  currentPrice,
  lockupEndsAt,
  investmentStatus,
  investedAt,
  accountOnFile,
}: WithdrawFormProps) {
  const [krwAmount, setKrwAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const lockupDate  = lockupEndsAt  ? new Date(lockupEndsAt)  : null
  const investedDate = investedAt   ? new Date(investedAt)    : null

  const isLocked =
    investmentStatus !== 'ACTIVE' ||
    (lockupDate ? lockupDate > new Date() : true)

  const daysUntilUnlock = lockupDate
    ? Math.max(0, Math.ceil((lockupDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const numKrw = parseFloat(krwAmount) || 0
  const tokenBurnEstimate = numKrw > 0 && currentPrice > 0
    ? (numKrw / currentPrice).toFixed(2)
    : null

  async function handleSubmit() {
    if (numKrw < 100000) {
      toast.error('Minimum withdrawal is ₩100,000')
      return
    }
    setLoading(true)
    try {
      // TODO: update /api/withdraw/request to accept krwAmount instead of tokenAmount
      const res = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ krwAmount: numKrw }),
      })
      const json = await res.json()
      if (res.ok) {
        toast.success(`Withdrawal requested — ₩${numKrw.toLocaleString('ko-KR')}`)
        setKrwAmount('')
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
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
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
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              )}
              <p>
                Unlock date:{' '}
                {lockupDate.toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
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
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
      <h2 className="text-sm font-medium text-white mb-4">Withdraw</h2>

      {/* KRW amount input */}
      <div className="mb-3">
        <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
          Withdrawal Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={krwAmount}
            onChange={(e) => setKrwAmount(e.target.value)}
            placeholder="0"
            min={100000}
            className="w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#3d8ef8]/40 pr-14"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">KRW</span>
        </div>
        <p className="text-[11px] text-white/30 mt-1">Minimum ₩100,000</p>
      </div>

      {/* Token burn estimate */}
      {tokenBurnEstimate && (
        <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-lg px-3 py-2.5 mb-4">
          <p className="text-[11px] text-white/40">
            <span className="text-white/60 font-medium">{tokenBurnEstimate} TOKEN</span>{' '}
            will be burned at current price ({currentPrice.toLocaleString('ko-KR')} KRW/TOKEN)
          </p>
          <p className="text-[11px] text-white/25 mt-0.5">
            Balance after: {Math.max(0, tokenBalance - parseFloat(tokenBurnEstimate)).toLocaleString('ko-KR')} TOKEN
          </p>
        </div>
      )}

      {/* Return account info */}
      <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-4 py-3.5 mb-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px] mb-2.5">
          RETURN ACCOUNT
        </div>
        <div className="flex items-start gap-2 mb-2.5">
          <span className="text-[#f59e0b] text-xs mt-0.5">⚠️</span>
          <p className="text-xs text-white/50 leading-[1.6]">
            Withdrawals are processed to your original deposit account only.
          </p>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white/40">Account on file</span>
          <span className="text-white/65 font-mono text-xs">
            {accountOnFile ?? '—'}
          </span>
        </div>
        <p className="text-[11px] text-white/25 mt-2">
          To update your account information, contact the operator directly.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || numKrw < 100000}
        className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        {loading ? 'Processing…' : 'Request Withdrawal in KRW'}
      </button>
    </div>
  )
}
