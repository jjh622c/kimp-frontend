import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLatestOraclePrice } from '@/lib/data/oracle'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, amountKrw } = await req.json()
  if (!userId || !amountKrw) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const entryPrice = await getLatestOraclePrice()
  const tokenAmount = amountKrw / entryPrice

  const lockupEndsAt = new Date()
  lockupEndsAt.setMonth(lockupEndsAt.getMonth() + 6)

  await prisma.investment.upsert({
    where: { userId },
    update: {
      amountKrw,
      tokenAmount,
      entryPrice,
      depositConfirmed: true,
      status: 'DEPOSITED',
      lockupEndsAt,
    },
    create: {
      userId,
      amountKrw,
      tokenAmount,
      entryPrice,
      depositConfirmed: true,
      status: 'DEPOSITED',
      lockupEndsAt,
    },
  })

  return NextResponse.json({ ok: true, tokenAmount, entryPrice })
}
