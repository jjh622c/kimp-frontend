'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'

type DepositMethod = 'none' | 'bank'
type SignatureState = 'idle' | 'waiting' | 'signed'

export default function Step2Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-lg">
          <StepHeader current={2} total={4} />
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 flex items-center justify-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
            <span className="text-sm text-white/40">Loading…</span>
          </div>
        </div>
      }
    >
      <Step2Content />
    </Suspense>
  )
}

function Step2Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [method, setMethod] = useState<DepositMethod>('none')
  const [sigState, setSigState] = useState<SignatureState>('idle')

  // NEXT_PUBLIC_ prefix required for client component
  // TODO: set NEXT_PUBLIC_MODU_SIGN_URL in environment
  const moduSignUrl = process.env.NEXT_PUBLIC_MODU_SIGN_URL || null

  function handleSignAgreement() {
    if (moduSignUrl) {
      window.open(moduSignUrl, '_blank', 'noopener,noreferrer')
    }
    setSigState('waiting')
  }

  async function handleSignConfirmed() {
    setSigState('signed')
    // TODO: call /api/onboarding/contract-signed to record signature
    try {
      if (token) {
        await fetch('/api/onboarding/contract-signed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
      }
    } catch {
      // admin verifies manually
    }
    router.push(`/onboarding/step3${token ? `?token=${token}` : ''}`)
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={2} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-1">
          DEPOSIT METHOD
        </div>
        <h2 className="text-lg font-medium text-white mb-5">
          Choose Deposit Method
        </h2>

        {/* Method selection cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Crypto — disabled */}
          <div className="relative bg-[#0a0e1a] border border-white/[0.07] rounded-xl p-4 opacity-40 cursor-not-allowed select-none">
            <div className="absolute top-2.5 right-2.5 text-[9px] bg-white/[0.08] text-white/35 px-1.5 py-0.5 rounded-full tracking-[0.3px]">
              Coming soon
            </div>
            <div className="text-xl mb-2.5">💎</div>
            <div className="text-sm font-medium text-white/60 mb-1">Crypto Deposit</div>
            <div className="text-[11px] text-white/30 mb-0.5">USDT / ETH</div>
            <div className="text-[11px] text-white/30">Direct on-chain</div>
          </div>

          {/* Bank Transfer — active */}
          <button
            onClick={() => {
              setMethod('bank')
              setSigState('idle')
            }}
            className={`text-left bg-[#0a0e1a] border rounded-xl p-4 transition-colors ${
              method === 'bank'
                ? 'border-[#3d8ef8]/50 bg-[#3d8ef8]/[0.04]'
                : 'border-white/[0.07] hover:border-white/20'
            }`}
          >
            <div className="text-xl mb-2.5">🏦</div>
            <div className="text-sm font-medium text-white mb-1">Bank Transfer</div>
            <div className="text-[11px] text-white/40 mb-0.5">Korean Won (KRW)</div>
            <div className="text-[11px] text-white/40">Wire transfer</div>
            <div
              className={`mt-2.5 text-[11px] font-medium transition-colors ${
                method === 'bank' ? 'text-[#3d8ef8]' : 'text-white/25'
              }`}
            >
              {method === 'bank' ? '✓ Selected' : 'Select →'}
            </div>
          </button>
        </div>

        {/* Agreement section — visible when bank selected */}
        {method === 'bank' && (
          <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-xl p-4">
            {sigState === 'idle' && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">📝</span>
                  <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px] font-medium">
                    INVESTMENT AGREEMENT
                  </div>
                </div>
                <p className="text-sm text-white/45 leading-[1.65] mb-4">
                  Bank transfer requires signing an investment agreement first.
                </p>
                {!moduSignUrl && (
                  <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-[#f59e0b]/70">Signature service not configured</p>
                  </div>
                )}
                <button
                  onClick={handleSignAgreement}
                  disabled={!moduSignUrl}
                  className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  Sign Agreement →
                </button>
              </>
            )}

            {sigState === 'waiting' && (
              <>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-4 h-4 rounded-full border-2 border-[#f59e0b] border-t-transparent animate-spin shrink-0" />
                  <span className="text-sm text-white/70 font-medium">Waiting for signature...</span>
                </div>
                <p className="text-sm text-white/40 leading-[1.65] mb-4">
                  Please complete the signature in the window that just opened.
                </p>
                <button
                  onClick={handleSignConfirmed}
                  className="w-full border border-[#22c55e]/30 hover:bg-[#22c55e]/[0.05] text-[#22c55e]/80 hover:text-[#22c55e] rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  ✓ I&apos;ve completed the signature
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
