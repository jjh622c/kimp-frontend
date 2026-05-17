import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getLatestOraclePrice, getOraclePriceHistory } from '@/lib/data/oracle'
import { prisma } from '@/lib/prisma'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { DashboardChart } from '@/components/dashboard/DashboardChart'
import { WithdrawForm } from '@/components/dashboard/WithdrawForm'

export default async function DashboardPage() {
  const [session, tokenPrice, priceHistory] = await Promise.all([
    getServerSession(authOptions),
    getLatestOraclePrice(),
    getOraclePriceHistory(),
  ])

  // 실제 투자 데이터 조회 (DB 미연결 시 fallback)
  let investmentData: {
    tokenBalance: number
    entryPrice: number
    valuationKrw: number
    roi: number
    lockupEndsAt: string | null
    investmentStatus: string
  } | null = null

  try {
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { investment: true },
      })
      if (user?.investment) {
        const tokenBalance = Number(user.investment.tokenAmount)
        const entryPrice = Number(user.investment.entryPrice)
        investmentData = {
          tokenBalance,
          entryPrice,
          valuationKrw: tokenBalance * tokenPrice,
          roi: ((tokenPrice - entryPrice) / entryPrice) * 100,
          lockupEndsAt: user.investment.lockupEndsAt?.toISOString() ?? null,
          investmentStatus: user.investment.status,
        }
      }
    }
  } catch {
    // DB 미연결 시 fallback 사용
  }

  // DB 없거나 투자 기록 없으면 목 데이터
  const data = investmentData ?? {
    tokenBalance: 1500,
    entryPrice: 1000,
    valuationKrw: tokenPrice * 1500,
    roi: ((tokenPrice - 1000) / 1000) * 100,
    lockupEndsAt: new Date(Date.now() + 90 * 86400000).toISOString(),
    investmentStatus: 'ACTIVE',
  }

  const statCards = [
    {
      label: 'Token balance',
      value: `${data.tokenBalance.toLocaleString('ko-KR')} TOKEN`,
    },
    {
      label: 'Current price',
      value: `${tokenPrice.toLocaleString('ko-KR')} KRW`,
    },
    {
      label: 'Valuation',
      value: `${Math.floor(data.valuationKrw).toLocaleString('ko-KR')} KRW`,
    },
    {
      label: 'ROI',
      value: `${data.roi >= 0 ? '+' : ''}${data.roi.toFixed(2)}%`,
      green: data.roi >= 0,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <nav className="border-b border-white/[0.07]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-8 max-sm:px-4 py-4">
          <Link
            href="/"
            className="text-[17px] font-medium text-white tracking-[0.4px] no-underline"
          >
            [<span className="text-[#3d8ef8]">P</span>ROJECT]
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm text-white/40 max-sm:hidden truncate max-w-[160px]">
              {session?.user?.email}
            </span>
            <ConnectButton />
          </div>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-8 max-sm:px-4 py-8">
        <div className="max-w-3xl">
          <h1 className="text-xl font-medium text-white mb-6">Dashboard</h1>

          {/* 투자 없는 상태 */}
          {!investmentData && (
            <div className="bg-[#f59e0b]/[0.06] border border-[#f59e0b]/20 rounded-lg px-4 py-3 mb-5">
              <p className="text-xs text-[#f59e0b]/80 leading-[1.6]">
                투자 데이터를 불러올 수 없습니다. 관리자가 계정을 활성화한 후 다시 확인해주세요.
              </p>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 mb-5">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5"
              >
                <div className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase mb-2">
                  {card.label}
                </div>
                <div
                  className={`text-2xl font-medium ${card.green ? 'text-[#22c55e]' : 'text-white'}`}
                >
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Price chart */}
          <div className="mb-5">
            <DashboardChart data={priceHistory} />
          </div>

          {/* Withdraw form */}
          <WithdrawForm
            tokenBalance={data.tokenBalance}
            currentPrice={tokenPrice}
            lockupEndsAt={data.lockupEndsAt}
            investmentStatus={data.investmentStatus}
          />
        </div>
      </div>
    </div>
  )
}
