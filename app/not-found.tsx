import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10 text-[18px] font-medium text-white tracking-[0.4px] no-underline">
        [<span className="text-[#3d8ef8]">P</span>ROJECT]
      </Link>

      <div className="mb-3 text-[72px] font-semibold text-white/[0.06] leading-none select-none">
        404
      </div>

      <h1 className="text-lg font-medium text-white mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-white/[0.4] mb-8 max-w-xs leading-[1.7]">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          홈으로 →
        </Link>
        <Link
          href="/dashboard"
          className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          대시보드
        </Link>
      </div>
    </div>
  )
}
