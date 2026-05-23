const steps = [
  {
    num: '01 · Deposit',
    title: 'KRW bank transfer',
    desc: 'Send Korean Won via wire transfer to our KBank account. Minimum ₩10,000,000. Confirmed within 24 hours on business days.',
  },
  {
    num: '02 · Token issuance',
    title: 'Receive tokens on-chain',
    desc: 'Admin mints proportional tokens to your wallet after deposit is confirmed. Token price rises as bot profits are used for periodic buybacks and burns.',
  },
  {
    num: '03 · Profit distribution',
    title: 'Bot buybacks & burns',
    desc: 'Arbitrage bot profits are periodically used to buy back and burn tokens, increasing the price for all holders transparently on-chain.',
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
