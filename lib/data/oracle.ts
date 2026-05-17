import { prisma } from '@/lib/prisma'

export async function getLatestOraclePrice(): Promise<number> {
  try {
    const latest = await prisma.oraclePrice.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { price: true },
    })
    return latest ? Number(latest.price) : 1000
  } catch {
    // DB not set up yet — return initial token price
    return 1000
  }
}

export async function getOraclePriceHistory(): Promise<{ date: string; price: number }[]> {
  try {
    const history = await prisma.oraclePrice.findMany({
      orderBy: { createdAt: 'asc' },
      select: { price: true, createdAt: true },
    })
    return history.map((h) => ({
      date: h.createdAt.toISOString(),
      price: Number(h.price),
    }))
  } catch {
    return []
  }
}

// 30일 기준 연환산 APY 계산. 데이터 부족 시 68(%) 반환.
export async function getLatestApy(): Promise<number> {
  try {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)

    const [latest, oldest30d] = await Promise.all([
      prisma.oraclePrice.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { price: true },
      }),
      prisma.oraclePrice.findFirst({
        where: { createdAt: { lte: cutoff } },
        orderBy: { createdAt: 'desc' },
        select: { price: true },
      }),
    ])

    if (!latest || !oldest30d) return 68

    const current = Number(latest.price)
    const prev = Number(oldest30d.price)
    if (prev === 0) return 68

    const return30d = (current - prev) / prev
    const annualized = return30d * (365 / 30) * 100
    return Math.round(annualized)
  } catch {
    return 68
  }
}
