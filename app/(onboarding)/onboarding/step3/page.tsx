'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepHeader } from '@/components/onboarding/StepHeader'
import { useAccount, useConnect, useChainId, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'

export default function Step3Page() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onCorrectChain = chainId === base.id

  async function handleSaveWallet() {
    if (!address) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })
      if (res.ok) {
        router.push('/onboarding/step4')
      } else {
        const json = await res.json()
        if (res.status === 401) {
          router.push('/onboarding/step4')
        } else {
          setError(json.error ?? 'Failed to save wallet')
        }
      }
    } catch {
      setError('Network error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={3} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6">
        <h2 className="text-lg font-medium text-white mb-2">Connect wallet</h2>
        <p className="text-sm text-white/[0.45] mb-6 leading-[1.7]">
          Connect your MetaMask wallet to the Base network. Your wallet address will be used for
          token issuance.
        </p>

        {isConnected && address ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 bg-[#22c55e]/[0.08] border border-[#22c55e]/20 rounded-xl px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0" />
              <span className="text-sm text-[#22c55e] font-mono">
                {address.slice(0, 8)}…{address.slice(-6)}
              </span>
            </div>

            {!onCorrectChain ? (
              <button
                onClick={() => switchChain({ chainId: base.id })}
                disabled={isSwitching}
                className="w-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] rounded-xl py-3 text-sm font-medium transition-colors hover:bg-[#f59e0b]/20 disabled:opacity-50"
              >
                {isSwitching ? 'Switching…' : 'Switch to Base network'}
              </button>
            ) : (
              <>
                {error && (
                  <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2.5 text-xs text-[#ef4444]">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSaveWallet}
                  disabled={saving}
                  className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-60 text-white rounded-xl py-3 text-sm font-medium transition-colors"
                >
                  {saving ? 'Saving…' : 'Save wallet and continue →'}
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            disabled={isConnecting || !connectors[0]}
            className="w-full flex items-center justify-center gap-3 bg-[#0a0e1a] border border-white/[0.07] hover:border-[#3d8ef8]/40 disabled:opacity-50 text-white rounded-xl py-3.5 text-sm font-medium transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-[#f6851b] shrink-0" />
            {isConnecting ? 'Connecting…' : 'Connect MetaMask'}
          </button>
        )}

        <p className="text-center text-[11px] text-white/[0.28] mt-4">
          Base network required · Chain ID 8453
        </p>
      </div>
    </div>
  )
}
