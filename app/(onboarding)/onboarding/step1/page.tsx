'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'

type TokenStatus = 'checking' | 'valid' | 'invalid' | 'used' | 'expired'
type ModusignState = 'idle' | 'loading' | 'ready' | 'unavailable'

export default function Step1Page() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-lg">
        <StepHeader current={1} total={4} />
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 flex items-center justify-center gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
          <span className="text-sm text-white/40">Loading…</span>
        </div>
      </div>
    }>
      <Step1Content />
    </Suspense>
  )
}

function Step1Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>('checking')
  const [contractSigned, setContractSigned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modusign, setModusign] = useState<ModusignState>('idle')
  const [signingUrl, setSigningUrl] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('step1_signed') === '1') {
      setContractSigned(true)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid')
      return
    }

    async function verify() {
      try {
        const res = await fetch('/api/onboarding/verify-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (res.ok && data.valid) {
          setTokenStatus('valid')
          setModusign('loading')
          const msRes = await fetch('/api/onboarding/modusign-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          const msData = await msRes.json()
          if (msData.ready && msData.signingUrl) {
            setSigningUrl(msData.signingUrl)
            setModusign('ready')
          } else {
            setModusign('unavailable')
          }
        } else if (res.status === 409) {
          setTokenStatus('used')
        } else if (res.status === 410) {
          setTokenStatus('expired')
        } else {
          setTokenStatus('invalid')
        }
      } catch {
        setTokenStatus('invalid')
      }
    }

    verify()
  }, [token])

  async function handleContractSigned() {
    setLoading(true)
    try {
      await fetch('/api/onboarding/contract-signed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch {
      // silently ignored — admin verifies manually
    } finally {
      setLoading(false)
      sessionStorage.setItem('step1_signed', '1')
      setContractSigned(true)
    }
  }

  function handleContinue() {
    router.push(`/onboarding/step2${token ? `?token=${token}` : ''}`)
  }

  if (tokenStatus === 'invalid' || tokenStatus === 'used' || tokenStatus === 'expired') {
    const messages: Record<string, { title: string; desc: string }> = {
      invalid: { title: 'Invalid invite link', desc: 'Please access with a valid invite link.' },
      used: { title: 'Invite link already used', desc: 'This invite link has already been used. Please contact us.' },
      expired: { title: 'Invite link expired', desc: 'Your invite link has expired. Please request a new one from the team.' },
    }
    const msg = messages[tokenStatus]
    return (
      <div className="w-full max-w-lg">
        <StepHeader current={1} total={4} />
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#ef4444] text-lg">✕</span>
          </div>
          <h2 className="text-base font-medium text-white mb-2">{msg.title}</h2>
          <p className="text-sm text-white/[0.45] leading-[1.7]">{msg.desc}</p>
        </div>
      </div>
    )
  }

  if (tokenStatus === 'checking') {
    return (
      <div className="w-full max-w-lg">
        <StepHeader current={1} total={4} />
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 flex items-center justify-center gap-3">
          <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
          <span className="text-sm text-white/40">Verifying invite link…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={1} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <h2 className="text-lg font-medium text-white mb-2">Sign investment agreement</h2>
        <p className="text-sm text-white/[0.45] mb-6 leading-[1.7]">
          Please review and sign the investment agreement below. It specifies investment terms,
          risks, and buyback conditions.
        </p>

        {modusign === 'ready' && signingUrl ? (
          <iframe
            src={signingUrl}
            className="w-full rounded-lg mb-6 border border-white/[0.07]"
            style={{ height: '480px' }}
            allow="camera; microphone"
          />
        ) : modusign === 'loading' ? (
          <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg h-64 flex items-center justify-center mb-6 gap-3">
            <span className="w-4 h-4 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin shrink-0" />
            <span className="text-white/[0.28] text-sm">Loading contract…</span>
          </div>
        ) : (
          <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg h-64 flex flex-col items-center justify-center mb-6 gap-3">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white/[0.28] text-sm">Contract signing area</span>
            <span className="text-white/[0.18] text-xs">Activates when MODUSIGN_API_KEY is configured</span>
          </div>
        )}

        {contractSigned ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 bg-[#22c55e]/[0.08] border border-[#22c55e]/20 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" />
              <span className="text-sm text-[#22c55e]">Signature confirmed</span>
            </div>
            <button
              onClick={handleContinue}
              className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-xl py-3 text-sm font-medium transition-colors"
            >
              Continue →
            </button>
          </div>
        ) : (
          <button
            onClick={handleContractSigned}
            disabled={loading}
            className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-60 text-white rounded-xl py-3 text-sm font-medium transition-colors"
          >
            {loading ? 'Processing…' : 'I have signed →'}
          </button>
        )}
      </div>
    </div>
  )
}
