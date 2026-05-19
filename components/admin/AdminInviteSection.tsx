'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'

interface InviteRow {
  id: string
  token: string
  createdById: string | null
  usedById: string | null
  depth: number
  maxUses: number
  useCount: number
  expiresAt: string | null
  usedAt: string | null
  createdAt: string
}

interface ReferralNode {
  id: string
  name: string | null
  email: string | null
  canInvite: boolean
  referralDepth: number
  referredById: string | null
  createdAt: string
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

function isRevoked(expiresAt: string | null) {
  if (!expiresAt) return false
  return new Date(expiresAt).getFullYear() === 1970
}

function LinkStatusBadge({ link }: { link: InviteRow }) {
  if (isRevoked(link.expiresAt)) {
    return (
      <span className="text-[11px] bg-[#ef4444]/[0.08] text-[#ef4444]/70 rounded px-1.5 py-0.5">
        Revoked
      </span>
    )
  }
  if (isExpired(link.expiresAt)) {
    return (
      <span className="text-[11px] bg-white/[0.05] text-white/30 rounded px-1.5 py-0.5">
        Expired
      </span>
    )
  }
  if (link.useCount >= link.maxUses) {
    return (
      <span className="text-[11px] bg-[#22c55e]/[0.08] text-[#22c55e]/70 rounded px-1.5 py-0.5">
        Used
      </span>
    )
  }
  return (
    <span className="text-[11px] bg-[#3d8ef8]/[0.08] text-[#3d8ef8]/80 rounded px-1.5 py-0.5">
      Active
    </span>
  )
}

function ReferralTree({ users }: { users: ReferralNode[] }) {
  const rootUsers = users.filter((u) => !u.referredById)
  const getChildren = (parentId: string) => users.filter((u) => u.referredById === parentId)

  function renderNode(user: ReferralNode, depth: number) {
    const children = getChildren(user.id)
    return (
      <div key={user.id}>
        <div className="flex items-center gap-2 py-1" style={{ paddingLeft: `${depth * 20}px` }}>
          {depth > 0 && (
            <span className="text-white/20 text-xs select-none shrink-0">└─</span>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
              <span className="text-[9px] text-white/40 font-mono">{depth}</span>
            </div>
            <span className="text-xs text-white/70 truncate">{user.name ?? user.email ?? '—'}</span>
            {user.name && user.email && (
              <span className="text-[11px] text-white/30 truncate hidden sm:block">{user.email}</span>
            )}
          </div>
          {user.canInvite && (
            <span className="text-[10px] text-[#22c55e]/60 bg-[#22c55e]/[0.06] border border-[#22c55e]/15 rounded px-1.5 py-0.5 shrink-0">
              Can invite
            </span>
          )}
        </div>
        {children.map((child) => renderNode(child, depth + 1))}
      </div>
    )
  }

  if (users.length === 0) {
    return <p className="text-xs text-white/[0.28] py-4 text-center">No investors yet</p>
  }

  return (
    <div className="space-y-0.5">
      {rootUsers.map((u) => renderNode(u, 0))}
      {/* Users without referredById who also aren't in rootUsers (edge case) */}
      {users
        .filter((u) => u.referredById && !users.find((p) => p.id === u.referredById))
        .map((u) => renderNode(u, 0))}
    </div>
  )
}

export function AdminInviteSection() {
  const router = useRouter()
  const toast = useToast()

  const [links, setLinks] = useState<InviteRow[]>([])
  const [users, setUsers] = useState<ReferralNode[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [expiresInDays, setExpiresInDays] = useState(7)
  const [maxUses, setMaxUses] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [newUrl, setNewUrl] = useState<string | null>(null)
  const [copiedNew, setCopiedNew] = useState(false)

  const [revoking, setRevoking] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'links' | 'tree'>('links')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/invite/tree')
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links ?? [])
        setUsers(data.users ?? [])
      }
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleGenerate() {
    setGenerating(true)
    setNewUrl(null)
    try {
      const res = await fetch('/api/invite/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInDays, maxUses }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewUrl(data.url)
        await fetchData()
        router.refresh()
      } else {
        toast.error(data.error ?? 'Failed to generate link')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setGenerating(false)
    }
  }

  async function handleRevoke(token: string) {
    setRevoking(token)
    try {
      const res = await fetch('/api/invite/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        toast.success('Link revoked')
        await fetchData()
        router.refresh()
      } else {
        toast.error('Failed to revoke link')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setRevoking(null)
    }
  }

  async function handleCopyLink(token: string) {
    const origin = window.location.origin
    await navigator.clipboard.writeText(`${origin}/?invite=${token}`)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const activeLinks = links.filter((l) => !isRevoked(l.expiresAt) && !isExpired(l.expiresAt) && l.useCount < l.maxUses)

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl overflow-hidden mb-4">
      {/* Header */}
      <div className="px-5 py-3 border-b border-white/[0.07] flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Invite &amp; Referrals</h2>
        <span className="text-[11px] text-white/30">
          {activeLinks.length} active link{activeLinks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-5">
        {/* Create link */}
        <div className="mb-5 pb-5 border-b border-white/[0.05]">
          <h3 className="text-xs font-medium text-white/70 mb-3">Generate admin link</h3>
          <div className="flex flex-wrap items-center gap-3 mb-3">
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Max uses</span>
              <select
                value={maxUses}
                onChange={(e) => setMaxUses(Number(e.target.value))}
                className="bg-[#0a0e1a] border border-white/[0.1] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#3d8ef8]/50"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-[#3d8ef8]/20 hover:bg-[#3d8ef8]/30 text-[#3d8ef8] border border-[#3d8ef8]/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating…' : 'Generate link'}
            </button>
          </div>

          {newUrl && (
            <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg px-3 py-2.5 flex items-center gap-2">
              <span className="text-xs text-white/60 font-mono truncate flex-1 min-w-0">{newUrl}</span>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(newUrl)
                  setCopiedNew(true)
                  setTimeout(() => setCopiedNew(false), 2000)
                }}
                className="shrink-0 text-xs text-[#3d8ef8] hover:text-[#5aa3ff] transition-colors"
              >
                {copiedNew ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {(['links', 'tree'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-white/[0.07] text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {tab === 'links' ? `Links (${links.length})` : `Referral tree`}
            </button>
          ))}
        </div>

        {loadingData ? (
          <p className="text-xs text-white/[0.28] py-4 text-center">Loading…</p>
        ) : activeTab === 'links' ? (
          /* Links list */
          links.length === 0 ? (
            <p className="text-xs text-white/[0.28] py-4 text-center">No links generated yet</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => {
                const revoked = isRevoked(link.expiresAt)
                const expired = isExpired(link.expiresAt)
                const inactive = revoked || expired || link.useCount >= link.maxUses
                return (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border ${
                      inactive
                        ? 'bg-white/[0.01] border-white/[0.04]'
                        : 'bg-[#0a0e1a] border-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] text-white/40 font-mono shrink-0">
                        {link.token.slice(0, 8)}…
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-white/30 shrink-0">
                        <span>{link.useCount}/{link.maxUses}</span>
                        {link.expiresAt && !revoked && (
                          <span>· {new Date(link.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <LinkStatusBadge link={link} />
                      {!inactive && (
                        <button
                          onClick={() => handleCopyLink(link.token)}
                          className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
                        >
                          {copiedToken === link.token ? 'Copied ✓' : 'Copy'}
                        </button>
                      )}
                      {!revoked && (
                        <button
                          onClick={() => handleRevoke(link.token)}
                          disabled={revoking === link.token}
                          className="text-[11px] text-[#ef4444]/50 hover:text-[#ef4444]/80 transition-colors disabled:opacity-40"
                        >
                          {revoking === link.token ? '…' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        ) : (
          /* Referral tree */
          <ReferralTree users={users} />
        )}
      </div>
    </div>
  )
}
