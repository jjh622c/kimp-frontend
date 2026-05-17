'use client'

import { useState, useEffect } from 'react'
import { StepHeader } from '@/components/onboarding/StepHeader'

export default function Step2Page() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('step2_submitted') === '1') {
      setSubmitted(true)
    }
  }, [])

  async function handleTransferComplete() {
    setLoading(true)
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
            <h2 className="text-base font-medium text-white">Awaiting deposit confirmation</h2>
          </div>
          <p className="text-sm text-white/[0.45] leading-[1.7] mb-5">
            Deposit record received. An admin will verify and activate Step 3 within{' '}
            <strong className="text-white/70">24 hours</strong>.
          </p>
          <div className="bg-[#0a0e1a] border border-white/[0.05] rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-badge-pulse shrink-0" />
              <span className="text-xs text-white/40">
                Awaiting admin approval — you can close this page
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
          Please transfer your investment to the account below. An admin will verify within 24 hours
          and activate Step 3.
        </p>

        <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg p-4 mb-5 space-y-3">
          {[
            { label: 'Bank', value: process.env.NEXT_PUBLIC_BANK_NAME || '—' },
            { label: 'Account no.', value: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '—' },
            { label: 'Account holder', value: process.env.NEXT_PUBLIC_BANK_HOLDER || '—' },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-white/40">{row.label}</span>
              <span className="text-white font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-4 py-3 mb-5">
          <p className="text-xs text-[#f59e0b]/80 leading-[1.6]">
            Please include your <strong>name or email</strong> in the transfer memo.
          </p>
        </div>

        <button
          onClick={handleTransferComplete}
          disabled={loading}
          className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-60 text-white rounded-xl py-3 text-sm font-medium transition-colors"
        >
          {loading ? 'Processing…' : 'Transfer complete →'}
        </button>
        <p className="text-center text-[11px] text-white/[0.28] mt-3">
          Step 3 will be activated after admin approval
        </p>
      </div>
    </div>
  )
}
