import { NextRequest, NextResponse } from 'next/server'

// TODO: When schema adds DEPOSIT_PENDING status, update investment record here:
//   await prisma.investment.update({
//     where: { user: { inviteToken: token } },
//     data: { status: 'DEPOSIT_PENDING' },
//   })
// TODO: Send admin notification (email / Slack / 카카오알림톡)
export async function POST(_req: NextRequest) {
  // For now: acknowledge receipt and let admin verify manually
  return NextResponse.json({ success: true, notifiedAt: new Date().toISOString() })
}
