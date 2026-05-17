'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function copyAddress() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Wrong chain
  if (isConnected && chainId !== base.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        disabled={isSwitching}
        className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] rounded-lg px-4 py-[7px] text-[13px] font-medium transition-colors hover:bg-[#f59e0b]/20 disabled:opacity-50"
      >
        {isSwitching ? 'Switching…' : 'Switch to Base'}
      </button>
    )
  }

  // Connected
  if (isConnected && address) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-[#0e1425] border border-white/[0.1] hover:border-white/[0.2] rounded-lg px-3 py-[7px] text-[13px] font-medium text-white transition-colors"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-[#22c55e] shrink-0" />
          {truncateAddress(address)}
          <svg
            width="10" height="6" viewBox="0 0 10 6" fill="none"
            className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#0e1425] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl z-50">
            <button
              onClick={copyAddress}
              className="w-full px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors text-left"
            >
              {copied ? '✓ Copied' : 'Copy address'}
            </button>
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors no-underline"
            >
              View on Basescan ↗
            </a>
            <div className="h-px bg-white/[0.06]" />
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full px-4 py-2.5 text-[13px] text-[#ef4444]/70 hover:text-[#ef4444] hover:bg-[#ef4444]/[0.06] transition-colors text-left"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  // Not connected
  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isConnecting || !connectors[0]}
      className="bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 text-white rounded-lg px-4 py-[7px] text-[13px] font-medium transition-colors"
    >
      {isConnecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  )
}
