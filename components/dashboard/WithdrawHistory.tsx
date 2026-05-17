'use client'

import { useEffect, useState } from 'react'

interface WithdrawRecord {
  id: string
  tokenAmount: number
  krwAmount: number
  txHash: string | null
  status: string
  createdAt: string
  processedAt: string | null
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING:   { label: '검토 중',  className: 'bg-[#f59e0b]/10 text-[#f59e0b]' },
  APPROVED:  { label: '승인됨',   className: 'bg-[#3d8ef8]/10 text-[#3d8ef8]' },
  COMPLETED: { label: '완료',     className: 'bg-[#22c55e]/10 text-[#22c55e]' },
  REJECTED:  { label: '반려됨',   className: 'bg-[#ef4444]/10 text-[#ef4444]' },
}

export function WithdrawHistory() {
  const [records, setRecords] = useState<WithdrawRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/withdrawals')
      .then((r) => r.json())
      .then((data) => setRecords(data.withdrawals ?? []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mt-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">출금 신청 내역</div>
        <div className="flex items-center gap-2 py-2">
          <span className="w-3.5 h-3.5 rounded-full border border-white/20 border-t-transparent animate-spin shrink-0" />
          <span className="text-xs text-white/30">불러오는 중…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mt-4">
      <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">
        출금 신청 내역
      </div>

      {records.length === 0 ? (
        <div className="py-4 text-center text-xs text-white/[0.25]">
          출금 신청 내역이 없습니다
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((rec) => {
            const cfg = STATUS_CONFIG[rec.status] ?? { label: rec.status, className: 'bg-white/[0.06] text-white/40' }
            return (
              <div
                key={rec.id}
                className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-white font-medium">
                      {Number(rec.tokenAmount).toLocaleString('ko-KR', { maximumFractionDigits: 2 })} TOKEN
                    </span>
                    <span className={`text-[10px] rounded px-1.5 py-0.5 ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/30">
                    <span>{rec.krwAmount.toLocaleString('ko-KR')} KRW</span>
                    <span>·</span>
                    <span>{new Date(rec.createdAt).toLocaleDateString('ko-KR')}</span>
                    {rec.txHash && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{rec.txHash.slice(0, 8)}…</span>
                      </>
                    )}
                  </div>
                </div>
                {rec.processedAt && (
                  <div className="text-[11px] text-white/[0.22] shrink-0 ml-4">
                    처리: {new Date(rec.processedAt).toLocaleDateString('ko-KR')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
