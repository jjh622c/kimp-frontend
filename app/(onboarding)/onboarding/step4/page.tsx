import Link from 'next/link'
import { StepHeader } from '@/components/onboarding/StepHeader'

export default function Step4Page() {
  // TODO: Fetch real investment data from DB after admin confirms deposit.
  // Amount, token count, and tx hash are available only after admin processes the request.
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="w-full max-w-lg">
      <StepHeader current={4} total={4} />

      {/* Success header */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-6 mt-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#22c55e] text-xl">✓</span>
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Investment Confirmed</h2>
        <p className="text-sm text-white/[0.45] leading-[1.7]">
          Your deposit has been received. Tokens will be issued after admin verification.
        </p>
      </div>

      {/* Investment summary */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mt-3">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-3">
          INVESTMENT SUMMARY
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'Amount deposited', value: '—' },
            { label: 'Token received',   value: '— TOKEN' },
            { label: 'Token price',      value: '—' },
            { label: 'Date',             value: today },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-white/40">{label}</span>
              <span className="text-white/80 font-medium">{value}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-white/[0.22] mt-3 pt-3 border-t border-white/[0.05]">
          Final amounts confirmed after admin verification.
        </p>
      </div>

      {/* Token issuance transaction */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mt-3">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[1px] mb-3">
          TOKEN ISSUANCE TRANSACTION
        </div>
        <div className="flex items-start gap-2.5 bg-[#0a0e1a] border border-white/[0.05] rounded-lg px-4 py-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-badge-pulse shrink-0 mt-1.5" />
          <div>
            <p className="text-xs text-white/50 font-medium">
              Token issuance pending · Admin will mint within 24h
            </p>
            <p className="text-[11px] text-white/[0.28] mt-1 leading-[1.5]">
              Transaction hash will appear on your dashboard once minted.
            </p>
          </div>
        </div>
        {/*
          TODO: Once admin mints tokens (DB field txHash populated), replace above with:
          - Tx Hash: truncated + [Copy] + [↗ BaseScan] link
          - Network: Base Mainnet
          - Status: ✅ Confirmed
          - Block: #...
        */}
      </div>

      {/* Go to Dashboard */}
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="block w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] text-white text-center rounded-xl py-3 text-sm font-medium transition-colors no-underline"
        >
          Go to Dashboard →
        </Link>
      </div>
    </div>
  )
}
