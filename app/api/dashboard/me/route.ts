import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLatestOraclePrice, getOraclePriceHistory } from '@/lib/data/oracle'
import type { ApiDashboardResponse } from '@/types'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { investment: true },
  })

  if (!user?.investment) {
    return NextResponse.json({ error: 'No investment found' }, { status: 404 })
  }

  const [currentPrice, priceHistory] = await Promise.all([
    getLatestOraclePrice(),
    getOraclePriceHistory(),
  ])

  const tokenBalance = Number(user.investment.tokenAmount)
  const entryPrice = Number(user.investment.entryPrice)

  const response: ApiDashboardResponse = {
    user: { id: user.id, name: user.name, email: user.email, walletAddress: user.walletAddress },
    tokenBalance,
    currentPrice,
    valuationKrw: tokenBalance * currentPrice,
    roi: ((currentPrice - entryPrice) / entryPrice) * 100,
    entryPrice,
    priceHistory,
    lockupEndsAt: user.investment.lockupEndsAt,
    investment: {
      id: user.investment.id,
      userId: user.investment.userId,
      amountKrw: user.investment.amountKrw,
      tokenAmount: tokenBalance,
      entryPrice,
      status: user.investment.status as import('@/types').InvestmentStatus,
      contractSigned: user.investment.contractSigned,
      depositConfirmed: user.investment.depositConfirmed,
      tokenMinted: user.investment.tokenMinted,
      createdAt: user.investment.createdAt,
      updatedAt: user.investment.updatedAt,
    },
  }

  return NextResponse.json(response)
}
