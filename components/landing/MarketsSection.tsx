import Link from 'next/link'
import { getLatestOraclePrice } from '@/lib/data/oracle'

export async function MarketsSection() {
  const tokenPrice = await getLatestOraclePrice()

  return (
    <div className="px-8 max-sm:px-4 pb-12 max-sm:pb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-white/[0.28] tracking-[1.2px] uppercase">Markets</span>
        <span className="text-xs text-white/[0.22]">1 pool</span>
      </div>

      <div className="w-full border border-white/[0.07] rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] max-sm:grid-cols-[1fr_80px_80px] px-5 py-2.5 border-b border-white/[0.07] bg-[#0b0f1f]">
          <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase">Pool</span>
          <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase text-right">APY</span>
          <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase text-right max-sm:hidden">Token price</span>
          <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase text-right max-sm:hidden">Strategy</span>
          <span />
        </div>

        {/* Pool row — linked to detail page */}
        <Link
          href="/pool/detail"
          className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] max-sm:grid-cols-[1fr_80px_80px] px-5 py-[14px] items-center bg-[#0e1425] hover:bg-[#121930] transition-colors no-underline"
        >
          {/* Token info */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#3d8ef8]/20 border border-[#3d8ef8]/30 flex items-center justify-center text-[11px] font-medium text-[#3d8ef8] shrink-0">
              K
            </div>
            <div>
              <div className="text-[13px] font-medium text-white">[TOKEN] · KRW Arb Vault</div>
              <div className="text-[11px] text-white/30 mt-0.5">Buyback &amp; burn · Private</div>
            </div>
          </div>

          {/* APY */}
          <div className="text-right text-[#22c55e] text-[15px] font-medium">~68%</div>

          {/* Token price — hidden on mobile */}
          <div className="text-right text-sm text-white font-medium max-sm:hidden">
            {tokenPrice.toLocaleString('ko-KR')} KRW
          </div>

          {/* Strategy — hidden on mobile */}
          <div className="text-right text-xs text-white/[0.35] font-normal leading-[1.5] max-sm:hidden">
            Korea premium<br />arbitrage v3
          </div>

          {/* View button */}
          <div className="text-right">
            <span className="bg-[#3d8ef8]/10 border border-[#3d8ef8]/20 rounded-md px-2.5 py-[5px] text-xs text-[#3d8ef8] hover:bg-[#3d8ef8]/20 transition-colors">
              View →
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
