'use client'

import { useState, useEffect } from 'react'
import { StepHeader } from '@/components/onboarding/StepHeader'

export default function Step2Page() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // 새로고침 시 sessionStorage에서 상태 복원 (hydration 이후)
  useEffect(() => {
    if (sessionStorage.getItem('step2_submitted') === '1') {
      setSubmitted(true)
    }
  }, [])

  async function handleTransferComplete() {
    setLoading(true)
    // 입금 완료 알림 — 현재 별도 API 없음. 관리자가 은행 확인 후 수동 승인함.
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    sessionStorage.setItem('step2_submitted', '1')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="w-full max-w-lg">
        <StepHeader current={2} total={4} />

        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-[#f59e0b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-base font-medium text-white">입금 확인 대기 중</h2>
          </div>
          <p className="text-sm text-white/[0.45] leading-[1.7] mb-5">
            입금 기록을 받았습니다. 관리자가 확인 후{' '}
            <strong className="text-white/70">24시간 이내</strong>에 Step 3를 활성화해드립니다.
          </p>
          <div className="bg-[#0a0e1a] border border-white/[0.05] rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-badge-pulse shrink-0" />
              <span className="text-xs text-white/40">
                관리자 승인 대기 중 — 이 페이지를 닫아도 됩니다
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={2} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <h2 className="text-lg font-medium text-white mb-2">Deposit funds</h2>
        <p className="text-sm text-white/[0.45] mb-6 leading-[1.7]">
          아래 계좌로 투자금을 이체해주세요. 관리자가 24시간 이내에 확인 후 Step 3를 활성화합니다.
        </p>

        <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg p-4 mb-5 space-y-3">
          {[
            { label: '은행', value: process.env.NEXT_PUBLIC_BANK_NAME || '—' },
            { label: '계좌번호', value: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '—' },
            { label: '예금주', value: process.env.NEXT_PUBLIC_BANK_HOLDER || '—' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-white/40">{row.label}</span>
              <span className="text-white font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-4 py-3 mb-5">
          <p className="text-xs text-[#f59e0b]/80 leading-[1.6]">
            이체 시 메모란에 <strong>이름 또는 이메일</strong>을 기재해주세요.
          </p>
        </div>

        <button
          onClick={handleTransferComplete}
          disabled={loading}
          className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-60 text-white rounded-xl py-3 text-sm font-medium transition-colors"
        >
          {loading ? '처리 중…' : '이체 완료했습니다 →'}
        </button>
        <p className="text-center text-[11px] text-white/[0.28] mt-3">
          관리자 승인 후 Step 3가 활성화됩니다
        </p>
      </div>
    </div>
  )
}
