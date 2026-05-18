import Link from 'next/link'

const STATS = [
  { value: '5yr+', label: 'Since 2021', sub: 'Track record' },
  { value: '+275%', label: 'V1 Cumulative', sub: 'Total return' },
  { value: '₩3B+', label: 'Active capital', sub: 'Under mgmt.' },
]

export function HeroSection() {
  return (
    <div className="px-8 max-sm:px-4 pt-14 max-sm:pt-10 pb-10 max-sm:pb-8 text-center">
      <div className="inline-flex items-center gap-1.5 bg-[#3d8ef8]/10 border border-[#3d8ef8]/25 rounded-full px-[13px] py-1 text-[11px] text-[#3d8ef8] mb-5 tracking-[0.3px]">
        <span className="w-[5px] h-[5px] rounded-full bg-[#3d8ef8] animate-badge-pulse" />
        Private arbitrage protocol · Invite only
      </div>

      <h1 className="text-[34px] max-sm:text-[26px] font-medium text-white leading-[1.2] mb-2.5">
        Algorithmic yield,<br />
        <span className="text-[#3d8ef8]">precisely automated.</span>
      </h1>

      <p className="text-sm text-white/[0.38] max-w-[380px] mx-auto mb-8 leading-[1.65]">
        Korea premium arbitrage bot. Auditable on-chain. Private access only.
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/onboarding/step1"
          className="inline-flex items-center gap-[7px] bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-[9px] px-6 py-[11px] text-sm font-medium transition-colors no-underline"
        >
          Start investing →
        </Link>
        <Link
          href="/pool/detail"
          className="inline-flex items-center gap-[7px] border border-white/[0.12] hover:border-white/25 text-white/60 hover:text-white/90 rounded-[9px] px-5 py-[11px] text-sm font-medium transition-colors no-underline"
        >
          View strategy
        </Link>
      </div>

      {/* Performance stats */}
      <div className="mt-10 pt-8 border-t border-white/[0.06] grid grid-cols-3 gap-4 max-w-[360px] mx-auto">
        {STATS.map((stat) => (
          <div key={stat.value} className="text-center">
            <div className="text-xl max-sm:text-lg font-semibold text-white">{stat.value}</div>
            <div className="text-[10px] text-white/[0.28] mt-1 leading-[1.4]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
