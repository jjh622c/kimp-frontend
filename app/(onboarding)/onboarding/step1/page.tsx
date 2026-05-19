'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'
import { useToast } from '@/lib/toast-context'

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS || null
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_NAME ?? 'KMP'

export default function Step1Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-lg">
          <StepHeader current={1} total={4} />
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 flex items-center justify-center gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
            <span className="text-sm text-white/40">Loading…</span>
          </div>
        </div>
      }
    >
      <Step1Content />
    </Suspense>
  )
}

function Step1Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const toast = useToast()

  const [checked, setChecked] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!TOKEN_CONTRACT) return
    try {
      await navigator.clipboard.writeText(TOKEN_CONTRACT)
      setCopied(true)
      toast.success('Copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable — no-op
    }
  }

  function handleContinue() {
    router.push(`/onboarding/step2${token ? `?token=${token}` : ''}`)
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={1} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-1">
          ADD {TOKEN_SYMBOL} TO METAMASK
        </div>
        <h2 className="text-lg font-medium text-white mb-4">
          Add Token to MetaMask
        </h2>

        <p className="text-sm text-white/[0.45] mb-5 leading-[1.7]">
          MetaMask를 열고 아래 순서대로 진행하세요.
        </p>

        {/* Step-by-step guide */}
        <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg p-4 mb-5 space-y-4">
          {(['MetaMask 열기 → 하단 [Import Tokens] 탭 클릭', '[Custom Token] 선택'] as string[]).map(
            (text, i) => (
              <div key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-[#3d8ef8]/15 text-[#3d8ef8] text-[11px] font-medium flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-white/55 leading-[1.5]">{text}</span>
              </div>
            )
          )}

          {/* Step 3: token details */}
          <div className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-[#3d8ef8]/15 text-[#3d8ef8] text-[11px] font-medium flex items-center justify-center">
              3
            </span>
            <div className="flex-1">
              <span className="text-sm text-white/55">아래 정보를 입력:</span>
              <div className="mt-2.5 space-y-2">
                {[
                  { label: 'Network',       value: 'Base Mainnet (Chain ID: 8453)' },
                  { label: 'Token Symbol',  value: TOKEN_SYMBOL },
                  { label: 'Decimals',      value: '18' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-white/40">{row.label}</span>
                    <span className="text-white/70 font-medium">{row.value}</span>
                  </div>
                ))}

                {/* Contract address row */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Token Contract</span>
                  <div className="flex items-center gap-2">
                    {TOKEN_CONTRACT ? (
                      <>
                        <span className="font-mono text-xs text-white/70">
                          {TOKEN_CONTRACT.slice(0, 8)}…{TOKEN_CONTRACT.slice(-6)}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="text-[10px] text-[#3d8ef8] hover:text-[#6aabff] transition-colors"
                        >
                          {copied ? '✓ Copied' : 'Copy'}
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-white/25">(TBD)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-[#3d8ef8]/15 text-[#3d8ef8] text-[11px] font-medium flex items-center justify-center">
              4
            </span>
            <span className="text-sm text-white/55 leading-[1.5]">
              [Add Custom Token] → [Import Tokens] 확인
            </span>
          </div>
        </div>

        {!TOKEN_CONTRACT && (
          <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-4 py-3 mb-5">
            <p className="text-xs text-[#f59e0b]/80 leading-[1.6]">
              Contract address will be provided upon deployment.
            </p>
          </div>
        )}

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 cursor-pointer mb-5">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#3d8ef8] cursor-pointer shrink-0"
          />
          <span className="text-sm text-white/55 leading-[1.6]">
            I&apos;ve added the token to MetaMask
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!checked}
          className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-medium transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
