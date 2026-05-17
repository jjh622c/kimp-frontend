import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { recordMonthlyReportHash } from '@/lib/onchain'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { month, reportHash } = await req.json()
  if (!month || !reportHash) {
    return NextResponse.json({ error: 'Missing month or reportHash' }, { status: 400 })
  }

  const hashBytes = reportHash.startsWith('0x') ? reportHash.slice(2) : reportHash
  if (hashBytes.length !== 64) {
    return NextResponse.json({ error: 'reportHash must be a 32-byte hex string' }, { status: 400 })
  }

  const result = await recordMonthlyReportHash({
    month,
    reportHash: `0x${hashBytes}` as `0x${string}`,
    note: `Admin recorded via panel`,
  })

  if (!result) {
    return NextResponse.json(
      { ok: true, txHash: null, note: 'Oracle contract not configured — hash not recorded on-chain' },
      { status: 200 },
    )
  }

  return NextResponse.json({ ok: true, txHash: result.txHash })
}
