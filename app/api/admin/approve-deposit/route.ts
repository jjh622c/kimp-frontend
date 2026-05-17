import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLatestOraclePrice } from '@/lib/data/oracle'
import { notifyDepositConfirmed } from '@/lib/kakao'

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

  // 카카오 알림톡 발송 (phone 필드 있을 때만, 실패해도 응답에 영향 없음)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }).catch(() => null)
  if (user) {
    // TODO: User 모델에 phone 필드 추가 후 실제 번호로 교체
    // notifyDepositConfirmed(user.phone, { ... })
    void notifyDepositConfirmed('', {
      investorName: user.name ?? user.email ?? '투자자',
      amountKrw: amountKrw.toLocaleString('ko-KR') + '원',
      tokenAmount: tokenAmount.toFixed(2) + ' 토큰',
    })
  }

  return NextResponse.json({ ok: true, tokenAmount, entryPrice })
}
