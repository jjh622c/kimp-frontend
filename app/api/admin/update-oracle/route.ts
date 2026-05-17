import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { price, note } = await req.json()
  if (!price || price <= 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }

  const record = await prisma.oraclePrice.create({
    data: {
      price,
      updatedBy: session.user?.email ?? 'admin',
      note: note ?? null,
    },
  })

  return NextResponse.json({ ok: true, id: record.id, price: Number(record.price) })
}
