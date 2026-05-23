const ANNUAL_RETURNS = [
  { year: '2021', ret: '+44.8%', note: 'Apr–Dec · Bot launch year',              positive: true  },
  { year: '2022', ret: '+32.8%', note: 'Jan–Dec · Luna crash + FTX included',    positive: true  },
  { year: '2023', ret: '+22.7%', note: 'Full year',                              positive: true  },
  { year: '2024', ret: '+28.9%', note: 'Full year',                              positive: true  },
  { year: '2025', ret: '—',      note: 'V3 development & migration period',      positive: null  },
  { year: '2026', ret: '—',      note: 'V3 · Accumulating since Mar 2026',       positive: null  },
]

const PERF_STATS = [
  { label: 'Cumulative (2021–2024)', value: '+210%',                    highlight: true  },
  { label: 'Historical APY',         value: '+42.3% compound annual',   highlight: false },
  { label: 'Win Rate',               value: '60.0% · 15/25 periods',    highlight: false },
  { label: 'Best year',              value: '2021 +44.8%',              highlight: false },
  { label: 'Worst period',           value: '2022 Q4 -4.97%',           highlight: false },
]

export function MonthlyReturns() {
  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px]">
          Annual Returns
        </div>
        <div className="text-[11px] text-white/[0.28]">
          2021 – present
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[52px_72px_1fr] py-2 border-b border-white/[0.05] text-[11px] text-white/[0.28] uppercase tracking-[0.4px]">
        <span>Year</span>
        <span className="text-right">Return</span>
        <span className="pl-4">Note</span>
      </div>

      {/* Rows */}
      {ANNUAL_RETURNS.map((row) => {
        const color =
          row.positive === true  ? '#22c55e' :
          row.positive === false ? '#ef4444' :
          'rgba(255,255,255,0.28)'
        return (
          <div
            key={row.year}
            className="grid grid-cols-[52px_72px_1fr] py-2.5 border-b border-white/[0.04] last:border-0 items-center hover:bg-white/[0.015] rounded"
          >
            <span className="text-xs font-medium text-white/70">{row.year}</span>
            <span className="text-xs font-medium text-right" style={{ color }}>
              {row.ret}
            </span>
            <span className="text-[11px] text-white/30 pl-4 leading-[1.5]">{row.note}</span>
          </div>
        )
      })}

      {/* Performance stats */}
      <div className="mt-4 pt-4 border-t border-white/[0.05] space-y-2.5">
        {PERF_STATS.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <span className="text-[11px] text-white/30">{s.label}</span>
            <span className={`text-[11px] font-medium ${s.highlight ? 'text-[#3d8ef8]' : 'text-white/60'}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Dual APY display */}
      <div className="mt-4 pt-4 border-t border-white/[0.05]">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg p-3">
            <div className="text-[10px] text-white/[0.28] uppercase tracking-[0.4px] mb-1.5">
              Historical APY
            </div>
            <div className="text-xl font-semibold text-[#22c55e]">+42.3%</div>
            <div className="text-[10px] text-white/[0.22] mt-1">Compound annual</div>
            <div className="text-[10px] text-white/[0.18]">2021–2024</div>
          </div>
          <div className="bg-[#0a0e1a] border border-white/[0.07] rounded-lg p-3">
            <div className="text-[10px] text-white/[0.28] uppercase tracking-[0.4px] mb-1.5">
              Current APY (V3)
            </div>
            <div className="text-xl font-semibold text-white/30">—</div>
            <div className="text-[10px] text-white/[0.22] mt-1">Accumulating</div>
            <div className="text-[10px] text-white/[0.18]">Since Mar 2026</div>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-[10px] text-white/[0.28] mt-3 pt-3 border-t border-white/[0.04] leading-[1.6]">
        ※ 2021–2022 returns use Modified Dietz method. 2022 Q4 – 2024 returns are official settlement data.
        2025 excluded (V3 development &amp; migration period). Past performance does not guarantee future results.
      </p>
    </div>
  )
}
