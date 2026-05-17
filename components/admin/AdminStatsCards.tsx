interface InvestorRow {
  investment: {
    amountKrw: number
    tokenAmount: number
    status: string
  } | null
}

interface WithdrawRow {
  status: string
}

interface AdminStatsCardsProps {
  investors: InvestorRow[]
  withdrawRequests: WithdrawRow[]
  tokenPrice: number
}

export function AdminStatsCards({ investors, withdrawRequests, tokenPrice }: AdminStatsCardsProps) {
  const activeInvestors = investors.filter((i) => i.investment?.status === 'ACTIVE').length
  const totalKrw = investors.reduce((sum, i) => sum + (i.investment?.amountKrw ?? 0), 0)
  const totalTokens = investors.reduce((sum, i) => sum + Number(i.investment?.tokenAmount ?? 0), 0)
  const pendingWithdrawals = withdrawRequests.filter((w) => w.status === 'PENDING').length
  const tvl = Math.floor(totalTokens * tokenPrice)

  const cards = [
    {
      label: '전체 투자자',
      value: investors.length.toString(),
      sub: `활성 ${activeInvestors}명`,
      color: 'text-white',
    },
    {
      label: '총 투자금',
      value: `${(totalKrw / 10000).toFixed(0)}만 KRW`,
      sub: `${totalKrw.toLocaleString('ko-KR')} KRW`,
      color: 'text-white',
    },
    {
      label: '현재 TVL',
      value: `${(tvl / 10000).toFixed(0)}만 KRW`,
      sub: `${totalTokens.toLocaleString('ko-KR', { maximumFractionDigits: 0 })} TOKEN × ${tokenPrice.toLocaleString('ko-KR')}`,
      color: 'text-[#22c55e]',
    },
    {
      label: '대기 출금',
      value: pendingWithdrawals.toString(),
      sub: pendingWithdrawals > 0 ? '승인 필요' : '없음',
      color: pendingWithdrawals > 0 ? 'text-[#f59e0b]' : 'text-white/40',
    },
  ]

  return (
    <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-3 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-4">
          <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.4px] mb-1.5">
            {card.label}
          </div>
          <div className={`text-xl font-semibold mb-0.5 ${card.color}`}>{card.value}</div>
          <div className="text-[11px] text-white/[0.25]">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
