import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ withdrawals: [] })
    }

    const withdrawals = await prisma.withdrawRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        tokenAmount: true,
        krwAmount: true,
        txHash: true,
        status: true,
        createdAt: true,
        processedAt: true,
      },
    })

    return NextResponse.json({
      withdrawals: withdrawals.map((w) => ({
        ...w,
        tokenAmount: Number(w.tokenAmount),
        createdAt: w.createdAt.toISOString(),
        processedAt: w.processedAt?.toISOString() ?? null,
      })),
    })
  } catch {
    return NextResponse.json({ withdrawals: [] })
  }
}
