import { getLatestOraclePrice, getOraclePriceHistory } from '@/lib/data/oracle'
import { InvestPanel } from '@/components/pool/InvestPanel'
import { PriceChartCard } from '@/components/pool/PriceChartCard'

export default async function PoolDetailPage() {
  const [tokenPrice, priceHistory] = await Promise.all([
    getLatestOraclePrice(),
    getOraclePriceHistory(),
  ])

  return (
    <main className="px-6 max-sm:px-4 py-10">

      {/* ── Vault Header ─────────────────────────── */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 shrink-0 rounded-full bg-[#3d8ef8]/20 border border-[#3d8ef8]/30 flex items-center justify-center text-base font-semibold text-[#3d8ef8]">
          K
        </div>
        <div>
          <div className="flex items-center flex-wrap gap-3 mb-1">
            <h1 className="text-xl font-semibold text-white">[TOKEN] · KRW Arb Vault</h1>
            <span className="flex items-center gap-1.5 bg-[#22c55e]/10 border border-[#22c55e]/25 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#22c55e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-badge-pulse" />
              Active
            </span>
          </div>
          <p className="text-sm text-white/40 mb-2.5">
            Automated KRW / Global spread arbitrage · Buyback &amp; burn model
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Private', 'Base chain', 'ERC-20', 'Invite only'].map((tag) => (
              <span
                key={tag}
                className="bg-white/[0.05] border border-white/[0.08] rounded-full px-2.5 py-0.5 text-[11px] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────── */}
      <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-3 mb-8">
        {[
          { label: '30D Return', value: '+2.0%', color: 'text-[#22c55e]' },
          { label: 'All-time Return', value: '+12.2%', color: 'text-[#22c55e]' },
          { label: 'Win Rate', value: '71%', color: 'text-white' },
          {
            label: 'Token Price',
            value: `${tokenPrice.toLocaleString('ko-KR')} KRW`,
            color: 'text-white',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] tracking-[0.4px] uppercase mb-2">
              {stat.label}
            </div>
            <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── 2-column main layout ─────────────────── */}
      <div className="grid grid-cols-[1fr_340px] max-lg:grid-cols-1 gap-5 items-start">

        {/* Left column — pushed below InvestPanel on mobile */}
        <div className="space-y-4 min-w-0 max-lg:order-2">

          {/* Price chart */}
          <PriceChartCard data={priceHistory} />

          {/* Strategy */}
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">
              Strategy
            </div>
            <p className="text-sm text-white/[0.55] leading-[1.75] mb-4">
              Automated Korea premium (kimchi premium) arbitrage. The bot exploits persistent price
              differences between Korean and global crypto exchanges via on-chain settlement.
              Returns are driven by structural market inefficiencies, not directional price exposure.
            </p>
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              {[
                { label: 'Bot version', value: 'KiMP Arb v3' },
                { label: 'Rebalance frequency', value: '~4× / day' },
                { label: 'Settlement', value: 'On-chain (Base)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{item.label}</span>
                  <span className="text-xs text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency & Verification */}
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-4">
              Transparency &amp; Verification
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: '🔗',
                  label: 'Smart contract',
                  desc: 'ERC-20 on Base — publicly auditable on Basescan',
                },
                {
                  icon: '📊',
                  label: 'Oracle price feed',
                  desc: 'Updated daily by operator with on-chain timestamp record',
                },
                {
                  icon: '📋',
                  label: 'Monthly reports',
                  desc: 'PDF settlement reports issued per investment period',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-white/70 mb-0.5">{item.label}</div>
                    <div className="text-[11px] text-white/30 leading-[1.6]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Returns */}
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-3">
              Monthly Returns
            </div>
            <div>
              <div className="grid grid-cols-[1fr_80px_100px] py-2 border-b border-white/[0.05] text-[11px] text-white/[0.28] uppercase tracking-[0.4px]">
                <span>Month</span>
                <span className="text-right">Return</span>
                <span className="text-right">Token price</span>
              </div>
              {[
                { month: 'Feb 2025', ret: '+2.0%', price: '1,000 KRW', green: true },
                { month: 'Jan 2025', ret: '+10.0%', price: '980 KRW', green: true },
              ].map((row) => (
                <div
                  key={row.month}
                  className="grid grid-cols-[1fr_80px_100px] py-3 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-xs text-white/70">{row.month}</span>
                  <span
                    className={`text-xs font-medium text-right ${row.green ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}
                  >
                    {row.ret}
                  </span>
                  <span className="text-xs text-white/50 text-right">{row.price}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column — appears first on mobile */}
        <div className="max-lg:order-1">
          <InvestPanel tokenPrice={tokenPrice} />
        </div>

      </div>
    </main>
  )
}
