'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount, useConnect } from 'wagmi'

interface InvestPanelProps {
  tokenPrice: number
}

export function InvestPanel({ tokenPrice }: InvestPanelProps) {
  const [amount, setAmount] = useState('')
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()

  const numAmount = Number(amount.replace(/,/g, ''))
  const tokenEstimate = numAmount > 0 ? (numAmount / tokenPrice).toFixed(4) : null

  return (
    <div className="sticky top-20 max-lg:static space-y-3">

      {/* ── Invest form ─────────────────── */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
        <div className="text-sm font-medium text-white mb-4">Invest</div>

        {/* Current price */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.07]">
          <span className="text-xs text-white/40">Current token price</span>
          <span className="text-sm text-white font-medium">
            {tokenPrice.toLocaleString('ko-KR')} KRW
          </span>
        </div>

        {/* Amount input */}
        <div className="mb-3">
          <label className="block text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-1.5">
            Amount (KRW)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0a0e1a] border border-white/[0.07] focus:border-[#3d8ef8]/40 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">
              KRW
            </span>
          </div>
        </div>

        {/* Token estimate */}
        <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">You'll receive ~</span>
            <span className="text-sm text-white font-medium">
              {tokenEstimate ? `${tokenEstimate} TOKEN` : '—'}
            </span>
          </div>
          <div className="text-[10px] text-white/[0.2] mt-1">
            Lock-up: 6 months after investment date
          </div>
        </div>

        {/* CTA */}
        {isConnected ? (
          <>
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <span className="w-[6px] h-[6px] rounded-full bg-[#22c55e] shrink-0" />
              <span className="text-[11px] text-white/40 font-mono truncate">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
            </div>
            <Link
              href="/onboarding/step1"
              className="block w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white text-center rounded-xl py-[11px] text-sm font-medium transition-colors no-underline"
            >
              Invest now →
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              disabled={isConnecting || !connectors[0]}
              className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 text-white rounded-xl py-[11px] text-sm font-medium transition-colors"
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet to Invest'}
            </button>
            <p className="text-center text-[10px] text-white/[0.2] mt-2">
              MetaMask required · Invite-only
            </p>
          </>
        )}
      </div>

      {/* ── Token details ───────────────── */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">
          Token details
        </div>
        <div className="space-y-3">
          {[
            { label: 'Standard', value: 'ERC-20 (Base)' },
            { label: 'Initial price', value: '1,000 KRW' },
            { label: 'Issuance', value: 'On deposit confirmation' },
            { label: 'Lock-up', value: '6 months' },
            { label: 'Buyback', value: '50% of bot profits' },
            { label: 'Exit', value: 'Operator buyback / P2P' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-white/40">{item.label}</span>
              <span className="text-xs text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Risk notice ─────────────────── */}
      <div className="bg-[#f59e0b]/[0.07] border border-[#f59e0b]/20 rounded-xl p-4">
        <div className="text-[10px] font-medium text-[#f59e0b] mb-1.5 uppercase tracking-[0.3px]">
          Risk notice
        </div>
        <p className="text-[10px] text-white/[0.35] leading-[1.7]">
          Token value may decrease. Principal loss is possible. Past returns do not guarantee
          future performance. Lock-up of 6 months applies from investment date.
        </p>
      </div>
    </div>
  )
}
