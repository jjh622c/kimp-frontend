import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getLatestOraclePrice } from '@/lib/data/oracle'
import { ConnectButton } from '@/components/wallet/ConnectButton'
import { OracleUpdateForm } from '@/components/admin/OracleUpdateForm'
import { AdminInvestorTable } from '@/components/admin/AdminInvestorTable'
import { AdminInviteSection } from '@/components/admin/AdminInviteSection'
import { AdminStatsCards } from '@/components/admin/AdminStatsCards'
import { AdminReportSection } from '@/components/admin/AdminReportSection'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'PROJECT'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    redirect('/dashboard')
  }

  let investorsSerialized: {
    id: string
    name: string | null
    email: string | null
    createdAt: string
    canInvite?: boolean
    referralDepth?: number
    investment: {
      id: string
      amountKrw: number
      tokenAmount: number
      status: string
      contractSigned: boolean
      depositConfirmed: boolean
      tokenMinted: boolean
    } | null
  }[] = []

  let withdrawSerialized: {
    id: string
    tokenAmount: number
    krwAmount: number
    txHash: string | null
    status: string
    createdAt: string
    user: { name: string | null; email: string | null }
  }[] = []

  let tokenPrice = 1000

  try {
    const [rawInvestors, rawWithdraws, price] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.user as any).findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          canInvite: true,
          referralDepth: true,
          investment: {
            select: {
              id: true,
              amountKrw: true,
              tokenAmount: true,
              status: true,
              contractSigned: true,
              depositConfirmed: true,
              tokenMinted: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.withdrawRequest.findMany({
        select: {
          id: true,
          tokenAmount: true,
          krwAmount: true,
          txHash: true,
          status: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      getLatestOraclePrice(),
    ])

    tokenPrice = price

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    investorsSerialized = rawInvestors.map((inv: any) => ({
      ...inv,
      createdAt: inv.createdAt.toISOString(),
      investment: inv.investment
        ? { ...inv.investment, tokenAmount: Number(inv.investment.tokenAmount) }
        : null,
    }))

    withdrawSerialized = rawWithdraws.map((req) => ({
      ...req,
      tokenAmount: Number(req.tokenAmount),
      createdAt: req.createdAt.toISOString(),
    }))
  } catch {
    // DB 미연결 시 빈 상태로 렌더
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <nav className="border-b border-white/[0.07]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-8 max-sm:px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-[17px] font-medium text-white tracking-[0.4px] no-underline">
              [<span className="text-[#3d8ef8]">{APP_NAME[0]}</span>{APP_NAME.slice(1)}]
            </Link>
            <span className="text-xs text-white/30 max-sm:hidden">· Admin</span>
          </div>
          <ConnectButton />
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-8 max-sm:px-4 py-8">
        <h1 className="text-xl font-medium text-white mb-6">Admin Panel</h1>

        {/* 요약 통계 */}
        <AdminStatsCards
          investors={investorsSerialized}
          withdrawRequests={withdrawSerialized}
          tokenPrice={tokenPrice}
        />

        <AdminInviteSection />
        <OracleUpdateForm currentPrice={tokenPrice} />
        <AdminReportSection />
        <AdminInvestorTable investors={investorsSerialized} withdrawRequests={withdrawSerialized} />
      </div>
    </div>
  )
}
