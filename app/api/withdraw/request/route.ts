import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLatestOraclePrice } from '@/lib/data/oracle'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tokenAmount, txHash } = await req.json()
  if (!tokenAmount || tokenAmount <= 0) {
    return NextResponse.json({ error: 'Invalid token amount' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { investment: true },
  })

  if (!user?.investment || user.investment.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'No active investment' }, { status: 403 })
  }

  // Lock-up check
  if (user.investment.lockupEndsAt && user.investment.lockupEndsAt > new Date()) {
    return NextResponse.json({ error: 'Lock-up period active' }, { status: 403 })
  }

  const currentPrice = await getLatestOraclePrice()
  const krwAmount = Math.floor(tokenAmount * currentPrice)

  const request = await prisma.withdrawRequest.create({
    data: {
      userId: user.id,
      tokenAmount,
      krwAmount,
      txHash: txHash ?? null,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ ok: true, requestId: request.id, krwAmount })
}
