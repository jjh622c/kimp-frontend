import { MONTHLY_RETURNS, MAX_ABS_RETURN } from '@/lib/data/monthly-returns'

function fmtProfit(n: number): string {
  const abs = Math.abs(n)
  const sign = n >= 0 ? '+' : '-'
  if (abs >= 1e7) return `${sign}${(abs / 1e7).toFixed(1)}천만`
  if (abs >= 1e4) return `${sign}${Math.round(abs / 1e4)}만`
  return `${sign}${abs.toLocaleString()}`
}

export function MonthlyReturns() {
  let lastYear: number | null = null

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px]">
          Monthly Returns
        </div>
        <div className="text-[11px] text-white/[0.28]">
          28 periods · Oct 2022 – present
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_90px_110px_80px] max-sm:grid-cols-[1fr_88px_100px] py-2 border-b border-white/[0.05] text-[11px] text-white/[0.28] uppercase tracking-[0.4px]">
        <span>Period</span>
        <span className="text-right">Return</span>
        <span className="text-right">Token price</span>
        <span className="text-right max-sm:hidden">Net profit</span>
      </div>

      {/* Rows with year dividers */}
      {MONTHLY_RETURNS.map((d) => {
        const showYearDivider = d.year !== lastYear
        if (showYearDivider) lastYear = d.year
        const isPositive = d.returnPct >= 0
        const color = isPositive ? '#22c55e' : '#ef4444'
        const sign = isPositive ? '+' : ''
        const barWidth = Math.max(2, Math.round(Math.abs(d.returnPct) / MAX_ABS_RETURN * 56))

        return (
          <div key={d.period}>
            {showYearDivider && (
              <div className="pt-2.5 pb-1 text-[10px] text-white/[0.2] tracking-[1px] uppercase border-b border-white/[0.04] mt-0.5">
                {d.year}
              </div>
            )}
            <div className="grid grid-cols-[1fr_90px_110px_80px] max-sm:grid-cols-[1fr_88px_100px] py-2.5 border-b border-white/[0.04] last:border-0 items-center hover:bg-white/[0.015] rounded">
              <span className="text-xs text-white/70">{d.period}</span>
              <div className="flex items-center justify-end gap-1.5">
                <div
                  className="h-[4px] rounded-[2px] shrink-0"
                  style={{ width: `${barWidth}px`, background: color, opacity: 0.75 }}
                />
                <span className="text-xs font-medium min-w-[46px] text-right" style={{ color }}>
                  {sign}{d.returnPct.toFixed(2)}%
                </span>
              </div>
              <span className="text-xs text-white/50 text-right">
                {d.tokenPrice.toLocaleString()} KRW
              </span>
              <span className="text-[11px] text-right max-sm:hidden" style={{ color }}>
                {fmtProfit(d.netProfit)}
              </span>
            </div>
          </div>
        )
      })}

      {/* Cumulative return banner */}
      <div
        className="flex items-center justify-between mt-3.5 rounded-[10px] px-4 py-3.5"
        style={{
          background: 'rgba(61,142,248,0.06)',
          border: '0.5px solid rgba(61,142,248,0.18)',
        }}
      >
        <div>
          <p className="text-[13px] text-white/45">Cumulative return since inception</p>
          <p className="text-[11px] text-white/[0.28] mt-0.5">Oct 2022 → May 2026 · compound</p>
        </div>
        <span className="text-[22px] font-semibold text-[#3d8ef8]">+32.6%</span>
      </div>

      {/* Win/Loss pips */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-xs text-white/40">Win / loss · 28 periods</p>
          <p className="text-[10px] text-white/[0.25] mt-1">17 win &nbsp;·&nbsp; 11 loss &nbsp;·&nbsp; 60.7%</p>
        </div>
        <div className="flex flex-wrap gap-[2px] justify-end max-w-[240px]">
          {MONTHLY_RETURNS.map((d) => (
            <div
              key={d.period}
              className="w-[9px] h-[9px] rounded-[2px]"
              style={{
                background: d.returnPct >= 0 ? '#22c55e' : 'rgba(239,68,68,0.5)',
              }}
              title={`${d.period}: ${d.returnPct >= 0 ? '+' : ''}${d.returnPct}%`}
            />
          ))}
        </div>
      </div>

      {/* Alpha note */}
      <p className="text-[10px] text-white/[0.28] mt-3 pt-3 border-t border-white/[0.04] leading-[1.6]">
        ※ Returns are calculated per settlement period, not calendar month.
        Some months contain multiple settlements.
        Token price reflects cumulative net profit compounded from initial price of 1,000 KRW.
        Past performance does not guarantee future results.
      </p>
    </div>
  )
}
