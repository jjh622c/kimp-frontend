import { getLatestOraclePrice, getOraclePriceHistory } from '@/lib/data/oracle'
import { VAULT_STATS } from '@/lib/data/vault-stats'
import { InvestPanel } from '@/components/pool/InvestPanel'
import { PriceChartCard } from '@/components/pool/PriceChartCard'
import { MonthlyReturns } from '@/components/pool/MonthlyReturns'

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME ?? 'TOKEN'

export default async function PoolDetailPage() {
  const [tokenPrice, priceHistory] = await Promise.all([
    getLatestOraclePrice(),
    getOraclePriceHistory(),
  ])

  const statCards = [
    {
      label: '30D Return',
      value: VAULT_STATS.return30d,
      color: 'text-white/50',
      note: VAULT_STATS.returnNote,
      badge: false,
    },
    {
      label: 'Historical APY',
      value: VAULT_STATS.currentApy,
      color: 'text-[#22c55e]',
      note: VAULT_STATS.currentApyNote,
      badge: false,
    },
    {
      label: 'Win Rate',
      value: VAULT_STATS.winRate,
      color: 'text-white',
      note: VAULT_STATS.winRateNote,
      badge: false,
    },
    {
      label: 'Token Price',
      value: tokenPrice > 0 ? `${tokenPrice.toLocaleString('ko-KR')} KRW` : 'TBD',
      color: 'text-white',
      note: null,
      badge: true,
    },
  ]

  return (
    <main className="px-6 max-sm:px-4 py-10">

      {/* ── Vault Header ─────────────────────────── */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 shrink-0 rounded-full bg-[#3d8ef8]/20 border border-[#3d8ef8]/30 flex items-center justify-center text-base font-semibold text-[#3d8ef8]">
          {TOKEN_NAME[0]}
        </div>
        <div>
          <div className="flex items-center flex-wrap gap-3 mb-1">
            <h1 className="text-xl font-semibold text-white">{TOKEN_NAME} · KRW Arb Vault</h1>
            <span className="flex items-center gap-1.5 bg-[#22c55e]/10 border border-[#22c55e]/25 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#22c55e]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-badge-pulse" />
              Active
            </span>
          </div>
          <p className="text-sm text-white/40 mb-2.5">
            Automated KRW / Global spread arbitrage · Oracle price settlement model
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
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] tracking-[0.4px] uppercase mb-2">
              {stat.label}
            </div>
            <div className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</div>
            {stat.badge ? (
              <div className="mt-1 relative group">
                <span className="inline-flex items-center gap-1 bg-[#22c55e]/[0.08] border border-[#22c55e]/20 rounded-full px-2 py-0.5 text-[10px] text-[#22c55e] cursor-default">
                  <span className="w-1 h-1 rounded-full bg-[#22c55e] animate-badge-pulse" />
                  Oracle · live
                  <span className="ml-0.5 text-[#22c55e]/60">ⓘ</span>
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0b0f1f] border border-white/[0.1] rounded-lg p-3 text-[11px] text-white/60 leading-[1.65] hidden group-hover:block z-10 shadow-xl">
                  <p className="font-medium text-white/80 mb-1.5">Token Price Formula</p>
                  <p className="mb-1">Token Price (USD) = Total AUM ÷ Total Tokens Issued</p>
                  <p className="mb-1">KRW conversion: Upbit USDT/KRW market rate</p>
                  <p className="text-white/35">Source: Operator-run closed-source off-chain oracle node</p>
                </div>
              </div>
            ) : stat.note ? (
              <div className="text-[10px] text-white/[0.2] mt-1">{stat.note}</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* ── 2-column main layout ─────────────────── */}
      <div className="grid grid-cols-[1fr_340px] max-lg:grid-cols-1 gap-5 items-start">

        {/* Left column — pushed below InvestPanel on mobile */}
        <div className="space-y-4 min-w-0 max-lg:order-2">

          {/* Price chart */}
          <PriceChartCard data={priceHistory} />

          {/* Monthly Returns — full table with real data */}
          <MonthlyReturns />

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
                { label: 'Strategy type', value: 'Market neutral arbitrage' },
                { label: 'Execution', value: 'Automated · 24/7' },
                { label: 'Settlement', value: 'Oracle price appreciation' },
                { label: 'Operational since', value: 'April 2021' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{item.label}</span>
                  <span className="text-xs text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Structure (CTRCT-VAULT-02) */}
          <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
            <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-4">
              Fee Structure
            </div>
            <div className="space-y-2 mb-4">
              {[
                { step: '①', label: 'Tax Reserve',     formula: 'Gross profit × 11%',   dest: 'Held separately' },
                { step: '②', label: 'Performance Fee', formula: 'Remaining × 30%',       dest: 'Operators' },
                { step: '③', label: 'Investor Share',  formula: 'Remaining × 70%',       dest: 'Reflected in token price ↑' },
              ].map(({ step, label, formula, dest }) => (
                <div key={step} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-[11px] text-white/25 w-5 shrink-0">{step}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <span className="text-xs text-white/70 font-medium">{label}</span>
                      <span className="text-[11px] text-white/40 font-mono">{formula}</span>
                    </div>
                    <span className="text-[11px] text-white/30">{dest}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0a0e1a] border border-white/[0.05] rounded-lg px-3 py-2.5 mb-3">
              <p className="text-[11px] text-white/40 leading-[1.65]">
                <span className="text-white/60 font-medium">Example (profit 100):</span>{' '}
                Tax 11 → Remaining 89 → Fee 26.7 → Investor 62.3
              </p>
            </div>
            <p className="text-[11px] text-white/30 leading-[1.6]">
              High-watermark: No fee applies when AUM is below the prior peak.
            </p>
            {/* Withdrawal fees */}
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-2">
                Withdrawal Fee
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Instant',   fee: '5.0%', note: 'Immediate' },
                  { label: 'Standard',  fee: '1.0%', note: '24 hrs' },
                  { label: 'Scheduled', fee: '0.1%', note: '7 days ✓' },
                ].map(({ label, fee, note }) => (
                  <div key={label} className="bg-[#0a0e1a] border border-white/[0.05] rounded-lg p-2.5 text-center">
                    <div className="text-xs font-semibold text-white mb-0.5">{fee}</div>
                    <div className="text-[10px] text-white/50">{label}</div>
                    <div className="text-[10px] text-white/25">{note}</div>
                  </div>
                ))}
              </div>
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

        </div>

        {/* Right column — appears first on mobile */}
        <div className="max-lg:order-1">
          <InvestPanel tokenPrice={tokenPrice} />
        </div>

      </div>
    </main>
  )
}
