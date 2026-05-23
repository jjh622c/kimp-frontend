'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'

const BANK_NAME    = process.env.NEXT_PUBLIC_BANK_NAME    || '—'
const BANK_ACCOUNT = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '—'
const BANK_HOLDER  = process.env.NEXT_PUBLIC_BANK_HOLDER  || '—'
const TRANSFER_TIMEOUT_SECS = 600 // 10 minutes

export default function Step3Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-lg">
          <StepHeader current={3} total={4} />
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 flex items-center justify-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
            <span className="text-sm text-white/40">Loading…</span>
          </div>
        </div>
      }
    >
      <Step3Content />
    </Suspense>
  )
}

function Step3Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [secondsLeft, setSecondsLeft] = useState(TRANSFER_TIMEOUT_SECS)
  const [expired, setExpired] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState(false)

  // Read invest amount from sessionStorage (set by InvestPanel on pool/detail)
  const [investAmount, setInvestAmount] = useState<string | null>(null)
  useEffect(() => {
    setInvestAmount(sessionStorage.getItem('invest_amount'))
  }, [])

  // Initialize countdown from sessionStorage so refresh preserves timer
  useEffect(() => {
    const stored = sessionStorage.getItem('step3_start_time')
    const startTime = stored ? parseInt(stored, 10) : Date.now()
    if (!stored) {
      sessionStorage.setItem('step3_start_time', String(startTime))
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const left = TRANSFER_TIMEOUT_SECS - elapsed
      if (left <= 0) {
        setSecondsLeft(0)
        setExpired(true)
      } else {
        setSecondsLeft(left)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  function formatAccount(raw: string) {
    if (/^\d{12}$/.test(raw)) {
      return `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`
    }
    return raw
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  async function handleCopyAccount() {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT)
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  async function handleTransferMade() {
    setLoading(true)
    try {
      await fetch('/api/onboarding/notify-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch {
      // fail silently — admin verifies manually
    } finally {
      setLoading(false)
      setSubmitted(true)
      sessionStorage.setItem('step3_submitted', '1')
    }
  }

  function handleRestart() {
    sessionStorage.removeItem('step3_start_time')
    sessionStorage.removeItem('step3_submitted')
    router.push(`/onboarding/step2${token ? `?token=${token}` : ''}`)
  }

  if (submitted) {
    return (
      <div className="w-full max-w-lg">
        <StepHeader current={3} total={4} />
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-base font-medium text-white">Confirming your deposit...</h2>
          </div>
          <p className="text-sm text-white/45 leading-[1.7] mb-1">
            Admin will verify your transfer within{' '}
            <strong className="text-white/70">24 hours</strong> on business days.
          </p>
          <p className="text-sm text-white/45 leading-[1.7]">
            You&apos;ll receive a notification once confirmed. You can close this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={3} total={4} />

      {/* Deposit details card */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-1">
          DEPOSIT DETAILS
        </div>
        <h2 className="text-base font-medium text-white mb-4">Transfer Funds</h2>

        <div className="space-y-2.5">
          {[
            { label: 'Bank',   value: BANK_NAME   },
            { label: 'Holder', value: BANK_HOLDER  },
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-white/40">{row.label}</span>
              <span className="text-white/80 font-medium">{row.value}</span>
            </div>
          ))}

          {/* Account no. with copy */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">Account No.</span>
            <div className="flex items-center gap-2">
              <span className="text-white/80 font-medium font-mono">{formatAccount(BANK_ACCOUNT)}</span>
              <button
                onClick={handleCopyAccount}
                className="text-[10px] text-[#3d8ef8] hover:text-[#6aabff] transition-colors"
              >
                {copiedAccount ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {investAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Amount</span>
              <span className="text-white font-medium">
                ₩{Number(investAmount).toLocaleString('ko-KR')}
              </span>
            </div>
          )}

          {token && (
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Reference</span>
              <span className="text-white/60 font-mono text-xs">{token.slice(0, 12)}…</span>
            </div>
          )}
        </div>

        <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-3 py-2.5 mt-3.5">
          <p className="text-xs text-[#f59e0b]/80 leading-[1.6]">
            Include the Reference code in the transfer memo.
          </p>
          <p className="text-[11px] text-[#f59e0b]/55 leading-[1.6] mt-0.5">
            이체 메모란에 Reference 코드를 입력해 주세요.
          </p>
        </div>
      </div>

      {/* Timer card */}
      <div
        className={`bg-[#0e1425] border rounded-xl p-5 mt-3 ${
          expired ? 'border-[#ef4444]/30' : 'border-white/[0.07]'
        }`}
      >
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-3">
          ⏱ TRANSFER DEADLINE
        </div>

        {expired ? (
          <div>
            <p className="text-sm text-[#ef4444]/80 mb-3 leading-[1.6]">
              Transfer window expired. Please restart the process.
            </p>
            <button
              onClick={handleRestart}
              className="w-full border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white/90 rounded-xl py-2.5 text-sm font-medium transition-colors"
            >
              Restart →
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl font-mono font-semibold text-white tracking-wide mb-1.5">
              {formatTime(secondsLeft)}
            </div>
            <p className="text-xs text-white/25">
              Transfer must be completed within 10 minutes of this screen loading.
            </p>
          </div>
        )}
      </div>

      {/* Transfer button */}
      {!expired && (
        <div className="mt-4">
          <button
            onClick={handleTransferMade}
            disabled={loading}
            className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-60 text-white rounded-xl py-3 text-sm font-medium transition-colors"
          >
            {loading ? 'Processing…' : "I've made the transfer →"}
          </button>
          <p className="text-center text-[11px] text-white/[0.25] mt-2.5">
            Deposit confirmation required before Step 4
          </p>

          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => router.push('/onboarding/step4')}
              className="w-full mt-2 border border-[#f59e0b]/30 text-[#f59e0b]/60 hover:text-[#f59e0b] text-[11px] py-1.5 rounded-lg transition-colors"
            >
              DEV: Skip this step →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
