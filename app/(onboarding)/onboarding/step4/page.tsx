import Link from 'next/link'
import { StepHeader } from '@/components/onboarding/StepHeader'

export default function Step4Page() {
  return (
    <div className="w-full max-w-lg">
      <StepHeader current={4} total={4} />

      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#22c55e] text-xl">✓</span>
        </div>
        <h2 className="text-lg font-medium text-white mb-2">You're in</h2>
        <p className="text-sm text-white/[0.45] mb-6 leading-[1.7]">
          Tokens have been issued to your wallet. You can now track your balance, token price, and
          returns on the dashboard.
        </p>

        <Link
          href="/dashboard"
          className="block w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white rounded-xl py-3 text-sm font-medium transition-colors no-underline"
        >
          Go to dashboard →
        </Link>
      </div>
    </div>
  )
}
