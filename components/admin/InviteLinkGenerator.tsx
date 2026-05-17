'use client'

import { useState } from 'react'

export function InviteLinkGenerator() {
  const [loading, setLoading] = useState(false)
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [expiresInDays, setExpiresInDays] = useState(7)

  async function handleGenerate() {
    setLoading(true)
    setInviteUrl(null)
    try {
      const res = await fetch('/api/admin/create-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInDays }),
      })
      if (res.ok) {
        const data = await res.json()
        const url = `${window.location.origin}/onboarding/step1?token=${data.token}`
        setInviteUrl(url)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white">Generate invite link</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">Expires in</span>
          <select
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value))}
            className="bg-[#0a0e1a] border border-white/[0.1] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#3d8ef8]/50"
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#3d8ef8]/20 hover:bg-[#3d8ef8]/30 text-[#3d8ef8] border border-[#3d8ef8]/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate link'}
        </button>
      </div>

      {inviteUrl && (
        <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 flex items-center gap-2">
          <span className="text-xs text-white/60 font-mono truncate flex-1 min-w-0">{inviteUrl}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 text-xs text-[#3d8ef8] hover:text-[#5aa3ff] transition-colors"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
