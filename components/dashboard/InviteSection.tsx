'use client'

import { useState } from 'react'

interface ReferredUser {
  name: string | null
  email: string | null
  joinedAt: string
}

interface InviteSectionProps {
  canInvite: boolean
  referredUsers: ReferredUser[]
}

export function InviteSection({ canInvite, referredUsers }: InviteSectionProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!canInvite) return null

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const data = await res.json()
      if (res.ok) {
        setInviteUrl(data.url)
      } else {
        setError(data.error ?? 'Failed to generate link')
      }
    } catch {
      setError('Network error')
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
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-medium text-white">Your invite link</h2>
        <span className="text-[10px] font-mono text-[#22c55e]/80 bg-[#22c55e]/[0.08] border border-[#22c55e]/20 rounded px-1.5 py-0.5 uppercase tracking-[0.4px]">
          Active
        </span>
      </div>
      <p className="text-[11px] text-white/[0.28] mb-4 leading-[1.6]">
        Share your personal invite link with trusted contacts. Up to 2 levels deep — you can invite, and they can invite once.
      </p>

      {inviteUrl ? (
        <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 flex items-center gap-2 mb-3">
          <span className="text-xs text-white/60 font-mono truncate flex-1 min-w-0">{inviteUrl}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 text-xs text-[#3d8ef8] hover:text-[#5aa3ff] transition-colors whitespace-nowrap"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
      ) : error ? (
        <div className="bg-[#ef4444]/[0.05] border border-[#ef4444]/20 rounded-lg px-3 py-2.5 mb-3">
          <p className="text-[11px] text-[#ef4444]/80">{error}</p>
        </div>
      ) : null}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-[#3d8ef8]/[0.12] hover:bg-[#3d8ef8]/20 text-[#3d8ef8] border border-[#3d8ef8]/25 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Generating…' : inviteUrl ? 'Regenerate link' : 'Generate link'}
      </button>

      {referredUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <h3 className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">
            Invited ({referredUsers.length})
          </h3>
          <div className="space-y-2.5">
            {referredUsers.map((u, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs text-white/70 truncate">
                    {u.name ?? u.email ?? '—'}
                  </span>
                  {u.name && u.email && (
                    <span className="text-[11px] text-white/30 ml-1.5">{u.email}</span>
                  )}
                </div>
                <span className="text-[11px] text-white/30 shrink-0">
                  {new Date(u.joinedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
