'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StepHeader } from '@/components/onboarding/StepHeader'

export default function Step4Page() {
  const [investAmount, setInvestAmount] = useState<string | null>(null)
  const [referenceCode, setReferenceCode] = useState<string | null>(null)

  useEffect(() => {
    setInvestAmount(sessionStorage.getItem('invest_amount'))
    setReferenceCode(sessionStorage.getItem('invite_token'))
  }, [])

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={4} total={4} />

      {/* Success header */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#22c55e] text-xl">✓</span>
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Transfer Submitted</h2>
        <p className="text-sm text-white/[0.45] leading-[1.7]">
          Admin will verify your transfer within{' '}
          <strong className="text-white/70">24 hours</strong> on business days.
          Check your dashboard for status updates.
        </p>
      </div>

      {/* Status card */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mt-3">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-3">
          STATUS
        </div>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Status</span>
            <span className="flex items-center gap-1.5 text-[#f59e0b]/80 font-medium">
              <span className="text-base leading-none">⏳</span>
              Pending confirmation
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Reference</span>
            <span className="text-white/65 font-mono text-xs">
              {referenceCode ? `${referenceCode.slice(0, 12)}…` : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Amount</span>
            <span className="text-white/80 font-medium">
              {investAmount ? `₩${Number(investAmount).toLocaleString('ko-KR')}` : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Submitted</span>
            <span className="text-white/70">{today}</span>
          </div>
        </div>
      </div>

      {/* Go to Dashboard */}
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="block w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white text-center rounded-xl py-3 text-sm font-medium transition-colors no-underline"
        >
          Go to Dashboard →
        </Link>
        <p className="text-center text-[11px] text-white/[0.25] mt-3">
          You can close this page and check your dashboard later.
        </p>
      </div>
    </div>
  )
}
