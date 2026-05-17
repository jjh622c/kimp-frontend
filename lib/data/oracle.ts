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
