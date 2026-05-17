import { NextResponse } from 'next/server'
import { getLatestOraclePrice, getOraclePriceHistory } from '@/lib/data/oracle'

export async function GET() {
  const [currentPrice, history] = await Promise.all([
    getLatestOraclePrice(),
    getOraclePriceHistory(),
  ])

  return NextResponse.json({ currentPrice, history })
}
