'use client'

import { useState } from 'react'
import { useToast } from '@/lib/toast-context'

type WithdrawType = 'instant' | 'standard' | 'scheduled'

const WITHDRAW_TYPES: { key: WithdrawType; label: string; timing: string; fee: number; note?: string; recommended?: boolean }[] = [
  { key: 'instant',   label: 'Instant',   timing: 'Immediate',     fee: 0.05, note: 'May be unavailable for large amounts' },
  { key: 'standard',  label: 'Standard',  timing: 'Within 24 hrs', fee: 0.01 },
  { key: 'scheduled', label: 'Scheduled', timing: 'Within 7 days', fee: 0.001, recommended: true },
]

interface WithdrawFormProps {
  tokenBalance: number
  currentPrice: number
  investmentStatus: string
  /** Masked bank account on file, e.g. "신한 ***-****-1234". Null if not yet on record. */
  accountOnFile?: string | null
}

export function WithdrawForm({
  tokenBalance,
  currentPrice,
  investmentStatus,
  accountOnFile,
}: WithdrawFormProps) {
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('scheduled')
  const [krwAmount, setKrwAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const MIN_WITHDRAWAL = 5000
  const LARGE_WITHDRAWAL_THRESHOLD = 100_000_000

  const selectedType = WITHDRAW_TYPES.find((t) => t.key === withdrawType)!
  const feeRate = selectedType.fee

  const numKrw = parseFloat(krwAmount) || 0
  const feeAmount = numKrw * feeRate
  const netAmount = numKrw - feeAmount
  const tokensToReturn = numKrw > 0 && currentPrice > 0 ? numKrw / currentPrice : null

  const isLargeWithdrawal = numKrw >= LARGE_WITHDRAWAL_THRESHOLD

  async function handleSubmit() {
    if (numKrw < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ₩${MIN_WITHDRAWAL.toLocaleString('ko-KR')}`)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ krwAmount: numKrw, withdrawType }),
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

  if (investmentStatus !== 'ACTIVE') {
    return (
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-white leading-tight">Withdrawal Request</h2>
          <p className="text-[11px] text-white/[0.28] mt-0.5">출금 신청</p>
        </div>
        <p className="text-xs text-white/[0.35] mb-4">
          Withdrawal available once investment is active.
        </p>
        <button
          disabled
          className="w-full bg-white/[0.05] text-white/30 rounded-xl py-3 text-sm font-medium cursor-not-allowed"
        >
          Not available
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-white leading-tight">Withdrawal Request</h2>
        <p className="text-[11px] text-white/[0.28] mt-0.5">출금 신청</p>
      </div>

      {/* Return account info */}
      <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-4 py-3.5 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <span className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px]">Return Account</span>
            <span className="text-[11px] text-white/[0.18] ml-1.5">· 반환 계좌</span>
          </div>
        </div>
        <div className="flex items-start gap-2 mb-2.5">
          <span className="text-[#f59e0b] text-xs mt-0.5">⚠️</span>
          <div>
            <p className="text-xs text-white/50 leading-[1.6]">
              Withdrawals are processed to your original deposit account only.
            </p>
            <p className="text-[11px] text-white/[0.28] leading-[1.6] mt-0.5">
              출금은 최초 입금하신 계좌로만 처리됩니다.
            </p>
          </div>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white/40">Account on file</span>
          <span className="text-white/65 font-mono text-xs">
            {accountOnFile ?? '—'}
          </span>
        </div>
        <p className="text-[11px] text-white/[0.22] mt-2">
          To update your account, contact the operator.
        </p>
      </div>

      {/* WITHDRAWAL TYPE selector (CTRCT-WD-03) */}
      <div className="mb-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px] mb-2">
          WITHDRAWAL TYPE
        </div>
        <div className="space-y-2">
          {WITHDRAW_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setWithdrawType(t.key)}
              className={`w-full text-left flex items-center justify-between rounded-lg px-3.5 py-3 border transition-colors ${
                withdrawType === t.key
                  ? 'border-[#3d8ef8]/50 bg-[#3d8ef8]/[0.04]'
                  : 'border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                  withdrawType === t.key ? 'border-[#3d8ef8]' : 'border-white/20'
                }`}>
                  {withdrawType === t.key && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3d8ef8]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{t.label}</span>
                    {t.recommended && (
                      <span className="text-[9px] font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-full px-1.5 py-0.5">
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-white/30">{t.timing}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-white">{(t.fee * 100).toFixed(1)}%</span>
                <span className="block text-[10px] text-white/30">fee</span>
              </div>
            </button>
          ))}
        </div>
        {selectedType.note && (
          <p className="text-[11px] text-white/25 mt-2 pl-1">{selectedType.note}</p>
        )}
      </div>

      {/* KRW amount input */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <label className="text-[11px] text-white/40 uppercase tracking-[0.4px]">
            Amount (KRW)
          </label>
          <span className="text-[11px] text-white/[0.22]">· 출금 금액</span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={krwAmount}
            onChange={(e) => setKrwAmount(e.target.value)}
            placeholder="0"
            min={MIN_WITHDRAWAL}
            className="w-full bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#3d8ef8]/40 pr-14"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">KRW</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-[11px] text-white/30">Minimum ₩{MIN_WITHDRAWAL.toLocaleString('ko-KR')}</p>
          <span className="text-[11px] text-white/[0.18]">· 최소 출금금액</span>
        </div>
      </div>

      {/* Large withdrawal warning (CTRCT-WD-05) */}
      {isLargeWithdrawal && (
        <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-4 py-3 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#f59e0b] text-xs">⚠️</span>
            <span className="text-xs font-medium text-[#f59e0b]">Large withdrawal detected</span>
          </div>
          <p className="text-[11px] text-white/45 leading-[1.6]">
            Processing may be extended or split into multiple payments. Please contact the operator in advance.
          </p>
          {/* TODO: ₩100,000,000 또는 전체 운용자산 10% 초과 조건 — 백엔드에서 운용자산 기준값 제공 필요 */}
        </div>
      )}

      {/* Real-time withdrawal calculation (CTRCT-WD-04) */}
      {numKrw > 0 && tokensToReturn !== null && (
        <div className="bg-[#0b0f1f] border border-white/[0.05] rounded-lg px-4 py-3.5 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/[0.28]">Tokens to return</span>
              <span className="text-xs text-white/70 font-medium">
                {tokensToReturn.toFixed(4)} TOKEN
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/[0.28]">
                Fee ({(feeRate * 100).toFixed(1)}%)
              </span>
              <span className="text-xs text-[#ef4444]/70">
                −₩{Math.round(feeAmount).toLocaleString('ko-KR')}
              </span>
            </div>
            <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-[11px] text-white/50 font-medium">You receive</span>
              <span className="text-sm text-white font-semibold">
                ₩{Math.round(netAmount).toLocaleString('ko-KR')}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-white/[0.2] mt-2.5 leading-[1.5]">
            Based on: tokens × token price (KRW) × (1 − fee rate) · 제8조 기준
          </p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || numKrw < MIN_WITHDRAWAL}
        className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        {loading ? 'Processing…' : `Request ${selectedType.label} Withdrawal`}
      </button>

      <p className="text-center text-[11px] text-white/[0.22] mt-3">
        {selectedType.key === 'instant' ? '즉시 처리 (유동성 조건부)' :
         selectedType.key === 'standard' ? '영업일 기준 24시간 이내 처리' :
         '7일 이내 처리 · 권장'}
      </p>
    </div>
  )
}
