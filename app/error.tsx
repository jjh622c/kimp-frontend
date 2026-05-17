'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 에러 로깅 — production에서 Sentry 등으로 교체
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10 text-[18px] font-medium text-white tracking-[0.4px] no-underline">
        [<span className="text-[#3d8ef8]">P</span>ROJECT]
      </Link>

      <div className="w-12 h-12 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center mb-5">
        <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>

      <h1 className="text-lg font-medium text-white mb-2">문제가 발생했습니다</h1>
      <p className="text-sm text-white/[0.4] mb-2 max-w-xs leading-[1.7]">
        페이지를 불러오는 중 오류가 발생했습니다.
      </p>

      {error.digest && (
        <p className="text-[11px] text-white/[0.2] font-mono mb-6">
          오류 코드: {error.digest}
        </p>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={reset}
          className="bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          홈으로
        </Link>
      </div>
    </div>
  )
}
