const steps = [
  {
    num: '01 · Deposit',
    title: 'KRW bank transfer',
    desc: 'Send Korean Won via wire transfer to our KBank account. Minimum ₩10,000,000. Confirmed within 24 hours on business days.',
  },
  {
    num: '02 · Token issuance',
    title: 'Receive tokens on-chain',
    desc: 'Admin issues proportional tokens to your MetaMask wallet after deposit is confirmed. Token price is calculated as Total AUM ÷ Total Tokens Issued, and rises as the bot generates profit.',
  },
  {
    num: '03 · Token price growth',
    title: 'Oracle price appreciation',
    desc: 'As the arbitrage bot generates profits, total AUM grows. The oracle updates the token price upward, distributing gains to all holders proportionally — no buybacks or burns.',
  },
]

export function HowItWorksSection() {
  return (
    <div className="px-8 max-sm:px-4 py-10 max-sm:py-8">
      <div className="text-[11px] text-white/[0.28] tracking-[1.2px] uppercase mb-3.5">
        How it works
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-[#0e1425] border border-white/[0.07] rounded-[10px] p-[18px]"
          >
            <div className="text-[11px] text-[#3d8ef8] font-medium mb-2.5 tracking-[0.5px]">
              {step.num}
            </div>
            <div className="text-[13px] font-medium text-white mb-[5px]">{step.title}</div>
            <div className="text-[11px] text-white/30 leading-[1.6]">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
