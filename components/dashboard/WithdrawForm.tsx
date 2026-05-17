'use client'

import { useState } from 'react'

interface WithdrawFormProps {
  tokenBalance: number
  currentPrice: number
  lockupEndsAt?: string | null
  investmentStatus: string
}

export function WithdrawForm({
  tokenBalance,
  currentPrice,
  lockupEndsAt,
  investmentStatus,
}: WithdrawFormProps) {
  const [tokenAmount, setTokenAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const isLocked =
    investmentStatus !== 'ACTIVE' ||
    (lockupEndsAt ? new Date(lockupEndsAt) > new Date() : true)

  const lockupDate = lockupEndsAt ? new Date(lockupEndsAt) : null

  const estimatedKrw = tokenAmount
    ? Math.floor(parseFloat(tokenAmount) * currentPrice)
    : 0

  async function handleSubmit() {
    const amount = parseFloat(tokenAmount)
    if (!amount || amount <= 0 || amount > tokenBalance) return

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/withdraw/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAmount: amount, txHash: txHash || undefined }),
      })
      const json = await res.json()
      if (res.ok) {
        setResult({
          success: true,
          message: `출금 신청 완료 — 예상 수령액: ${json.krwAmount?.toLocaleString('ko-KR')} KRW`,
        })
        setTokenAmount('')
        setTxHash('')
      } else {
        setResult({ success: false, message: json.error ?? '오류가 발생했습니다' })
      }
    } catch {
      setResult({ success: false, message: '네트워크 오류' })
    } finally {
      setLoading(false)
    }
  }

  if (isLocked) {
    return (
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
        <h2 className="text-sm font-medium text-white mb-1">Withdraw</h2>
        <p className="text-xs text-white/[0.35] mb-4">
          {investmentStatus !== 'ACTIVE'
            ? '투자가 활성화된 후 출금이 가능합니다.'
            : lockupDate
            ? `락업 기간: ${lockupDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}까지`
            : '락업 기간이 진행 중입니다.'}
        </p>
        <button
          disabled
          className="w-full bg-white/[0.05] text-white/30 rounded-xl py-3 text-sm font-medium cursor-not-allowed"
        >
          {lockupDate
            ? `잠금 해제: ${lockupDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`
            : '출금 잠금 중'}
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
      <h2 className="text-sm font-medium text-white mb-1">Withdraw</h2>
      <p className="text-xs text-white/[0.35] mb-4">
        토큰을 운영팀 지갑으로 전송한 뒤 트랜잭션 해시를 입력하세요. 관리자 확인 후 KRW를 송금합니다.
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            출금 토큰 수 (보유: {tokenBalance.toLocaleString('ko-KR')} TOKEN)
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
              예상 수령액: {estimatedKrw.toLocaleString('ko-KR')} KRW
            </p>
          )}
        </div>

        <div>
          <label className="block text-[11px] text-white/40 mb-1.5 uppercase tracking-[0.4px]">
            트랜잭션 해시 (선택)
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

      {result && (
        <div
          className={`mb-3 px-3 py-2.5 rounded-lg text-xs ${
            result.success
              ? 'bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e]'
              : 'bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444]'
          }`}
        >
          {result.message}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !tokenAmount || parseFloat(tokenAmount) <= 0}
        className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
      >
        {loading ? '처리 중…' : '출금 신청'}
      </button>
    </div>
  )
}
