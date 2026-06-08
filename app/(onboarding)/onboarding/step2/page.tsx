'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'

type DepositMethod = 'none' | 'bank'
type SignatureState = 'idle' | 'waiting' | 'signed'

const RISK_ITEMS = [
  'I understand that I may lose all or part of my invested principal.',
  'I understand that past performance does not guarantee future returns.',
  'I understand that token value may fall and that this token is not listed on any exchange.',
  'I understand that instant withdrawal may be restricted and large withdrawals may be delayed.',
  'I understand that technical risks (hacking, smart contract bugs, oracle errors) may result in asset loss.',
  'I understand that regulatory changes may alter or terminate operations.',
  'I understand that performance fees apply to unrealized gains and are not refunded on subsequent losses.',
]

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
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(RISK_ITEMS.length).fill(false))
  const [sigState, setSigState] = useState<SignatureState>('idle')

  const allChecked = checkedItems.every(Boolean)

  // TODO: set NEXT_PUBLIC_MODU_SIGN_URL in environment
  const moduSignUrl = process.env.NEXT_PUBLIC_MODU_SIGN_URL || null

  function toggleItem(index: number) {
    setCheckedItems((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

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
      // 관리자 수동 확인
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

        {/* DEV: skip entire step */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => router.push(`/onboarding/step3${token ? `?token=${token}` : ''}`)}
            className="w-full mb-3 border border-[#f59e0b]/30 text-[#f59e0b]/60 hover:text-[#f59e0b] text-[11px] py-1.5 rounded-lg transition-colors"
          >
            DEV: Skip this step →
          </button>
        )}

        {/* Bank selected — show contract info, withdrawal fee, risk disclosure, agreement */}
        {method === 'bank' && (
          <div className="space-y-3">

            {/* CONTRACT INFO card (CTRCT-OB-02) */}
            <div className="bg-[#3d8ef8]/[0.06] border border-[#3d8ef8]/20 rounded-xl p-4">
              <div className="text-[11px] font-medium text-[#3d8ef8] mb-3 uppercase tracking-[0.8px]">
                CONTRACT INFO
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Contract Type', value: 'Anonymous Partnership (Korean Commercial Act §78–86)' },
                  { label: 'Operators', value: '이정민 (Dev & Operations) · 장재혁 (Business)' },
                  { label: 'Min. Investment', value: '₩10,000,000' },
                  { label: 'Performance Fee', value: '30% of net profit (after 11% tax reserve)' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="text-[11px] text-white/40 shrink-0">{label}</span>
                    <span className="text-[11px] text-white/70 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Withdrawal Fee Structure info (CTRCT-WD-01) */}
            <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-xl p-4">
              <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px] mb-3">
                WITHDRAWAL FEE STRUCTURE
              </div>
              <div className="space-y-1.5 mb-3">
                {[
                  { type: 'Instant',    timing: 'Immediate',     fee: '5.0%', note: 'Subject to liquidity', recommended: false },
                  { type: 'Standard',   timing: 'Within 24 hrs', fee: '1.0%', note: '',                      recommended: false },
                  { type: 'Scheduled',  timing: 'Within 7 days', fee: '0.1%', note: 'Recommended',           recommended: true  },
                ].map(({ type, timing, fee, note, recommended }) => (
                  <div
                    key={type}
                    className="flex items-center justify-between px-3 py-2 bg-[#0e1425] border border-white/[0.05] rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-white/70 w-16">{type}</span>
                      <span className="text-[11px] text-white/30">{timing}</span>
                      {recommended && (
                        <span className="text-[9px] font-medium bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-full px-1.5 py-0.5">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{fee}</span>
                      {note && !recommended && (
                        <span className="text-[10px] text-white/30">{note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#f59e0b]/70">
                Withdrawal type is selected at the time of each withdrawal request.
              </p>
            </div>

            {/* RISK DISCLOSURE checklist (CTRCT-OB-01) */}
            <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📋</span>
                <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.8px] font-medium">
                  RISK DISCLOSURE
                </div>
              </div>
              <p className="text-[11px] text-white/40 leading-[1.6] mb-4">
                Please read and acknowledge all risk items before signing. (계약서 제10조)
              </p>
              <div className="space-y-3">
                {RISK_ITEMS.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        checkedItems[i]
                          ? 'bg-[#3d8ef8] border-[#3d8ef8]'
                          : 'border-white/20 group-hover:border-[#3d8ef8]/50'
                      }`}
                      onClick={() => toggleItem(i)}
                    >
                      {checkedItems[i] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-[12px] leading-[1.65] transition-colors ${
                        checkedItems[i] ? 'text-white/60' : 'text-white/40'
                      }`}
                      onClick={() => toggleItem(i)}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              {!allChecked && (
                <p className="text-[11px] text-white/25 mt-4 text-center">
                  {checkedItems.filter(Boolean).length} / {RISK_ITEMS.length} items acknowledged
                </p>
              )}
              {allChecked && (
                <p className="text-[11px] text-[#22c55e]/70 mt-4 text-center">
                  ✓ All risk items acknowledged
                </p>
              )}
            </div>

            {/* Investment Agreement — disabled until all 7 checked */}
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
                      <p className="text-xs text-[#f59e0b]/70">Please contact the operator directly to proceed.</p>
                    </div>
                  )}
                  <button
                    onClick={handleSignAgreement}
                    disabled={!allChecked || !moduSignUrl}
                    className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    {allChecked ? 'Sign Agreement →' : `Acknowledge all ${RISK_ITEMS.length} items to continue`}
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

          </div>
        )}
      </div>
    </div>
  )
}
