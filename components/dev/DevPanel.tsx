'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NAV = [
  { label: '랜딩',      href: '/' },
  { label: 'Pool',      href: '/pool/detail' },
  { label: 'Step 1',    href: '/onboarding/step1' },
  { label: 'Step 2',    href: '/onboarding/step2' },
  { label: 'Step 3',    href: '/onboarding/step3' },
  { label: 'Step 4',    href: '/onboarding/step4' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Admin',     href: '/admin' },
] as const

export default function DevPanel() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Tree-shaken in production builds
  if (process.env.NODE_ENV !== 'development') return null

  function setGateCookie() {
    // GET /api/dev/bypass: sets kimp_access cookie + redirects to /
    window.location.href = '/api/dev/bypass'
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-[#1a1200] border border-[#f59e0b]/40 rounded-xl shadow-2xl p-3 w-52">
          <div className="text-[#f59e0b] text-[12px] font-semibold mb-2.5 flex items-center gap-1.5">
            <span>⚠</span> Dev Tools
          </div>

          {/* Gate bypass */}
          <button
            onClick={setGateCookie}
            className="w-full text-left px-3 py-2 rounded-lg bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] text-[12px] font-medium mb-3 transition-colors"
          >
            🔓 Gate 쿠키 설정
          </button>

          {/* Quick nav */}
          <div className="text-white/30 text-[10px] uppercase tracking-[0.8px] mb-1.5">
            빠른 이동
          </div>
          <div className="grid grid-cols-2 gap-1">
            {NAV.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] text-white/55 hover:text-white/80 text-[11px] transition-colors text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-[#f59e0b] hover:bg-[#d97706] text-black text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg transition-colors"
      >
        {open ? '✕ DEV' : 'DEV'}
      </button>
    </div>
  )
}
