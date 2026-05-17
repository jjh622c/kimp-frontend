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

      <h1 className="text-lg font-medium text-white mb-2">Page not found</h1>
      <p className="text-sm text-white/[0.4] mb-8 max-w-xs leading-[1.7]">
        The page you requested does not exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          Go home →
        </Link>
        <Link
          href="/dashboard"
          className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/70 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors no-underline"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
