'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@kimp.fi'

export function InvitePopup() {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const shownRef = useRef(false)

  // Listen for CTA click event from HeroSection
  useEffect(() => {
    const handler = () => {
      if (!shownRef.current) {
        setOpen(true)
        shownRef.current = true
      }
    }
    window.addEventListener('open-invite-popup', handler)
    return () => window.removeEventListener('open-invite-popup', handler)
  }, [])

  // IntersectionObserver: open when hero scrolls out of viewport
  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return

    // Delay 800ms to avoid triggering on page load
    let ready = false
    const timer = setTimeout(() => { ready = true }, 800)

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting && ready && !shownRef.current) {
          setOpen(true)
          shownRef.current = true
        }
      },
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedCode = code.trim()
    if (!trimmedCode) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding/verify-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: trimmedCode }),
      })
      if (res.ok) {
        setOpen(false)
        router.push('/pool/detail')
      } else {
        setError('Invalid invite code. Please check and try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
    >
      <div
        className="w-full max-w-[400px] rounded-[14px] p-8"
        style={{ backgroundColor: '#0e1425', border: '0.5px solid rgba(255,255,255,0.08)' }}
      >
        {/* Close */}
        <div className="flex justify-end -mt-2 -mr-2 mb-3">
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#3d8ef8]/10 border border-[#3d8ef8]/20 flex items-center justify-center text-xl">
            🔒
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-[17px] font-medium text-white text-center mb-2">
          Welcome
        </h2>
        <p className="text-sm text-white/[0.38] text-center mb-6 leading-[1.65]">
          You received this code from your contact.<br />
          This platform is available to invited investors only.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setError(null)
            }}
            placeholder="Enter your invite code"
            autoFocus
            className="w-full bg-[#0a0e1a] border border-white/[0.07] focus:border-[#3d8ef8]/40 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-colors"
          />

          {error && (
            <p className="text-xs text-[#ef4444] px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-[11px] text-sm font-medium transition-colors"
          >
            {loading ? 'Verifying…' : 'Access Vault →'}
          </button>
        </form>

        {/* Contact */}
        <p className="text-center text-[11px] text-white/[0.25] mt-5">
          Don&apos;t have a code?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-white/40 hover:text-white/60 transition-colors underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  )
}
