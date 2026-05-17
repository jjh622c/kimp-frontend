'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'

interface InvestorRow {
  id: string
  name: string | null
  email: string | null
  createdAt: string
  investment: {
    id: string
    amountKrw: number
    tokenAmount: number
    status: string
    contractSigned: boolean
    depositConfirmed: boolean
    tokenMinted: boolean
  } | null
}

interface WithdrawRow {
  id: string
  tokenAmount: number
  krwAmount: number
  txHash: string | null
  status: string
  createdAt: string
  user: { name: string | null; email: string | null }
}

interface AdminInvestorTableProps {
  investors: InvestorRow[]
  withdrawRequests: WithdrawRow[]
}

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'bg-white/[0.06] text-white/50',
  DEPOSITED: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  ACTIVE:    'bg-[#22c55e]/10 text-[#22c55e]',
  WITHDRAWN: 'bg-white/[0.06] text-white/30',
  APPROVED:  'bg-[#3d8ef8]/10 text-[#3d8ef8]',
  COMPLETED: 'bg-[#22c55e]/10 text-[#22c55e]',
  REJECTED:  'bg-[#ef4444]/10 text-[#ef4444]',
}

function ApproveDepositButton({ investor }: { investor: InvestorRow }) {
  const router = useRouter()
  const toast = useToast()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState(investor.investment?.amountKrw?.toString() ?? '')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return <span className="text-xs text-[#22c55e]">승인 완료</span>

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} className="text-xs text-[#3d8ef8] hover:underline mr-3">
        입금 승인
      </button>
    )
  }

  async function confirm() {
    const amountNum = parseInt(amount, 10)
    if (!amountNum || amountNum <= 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/approve-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: investor.id, amountKrw: amountNum }),
      })
      if (res.ok) {
        toast.success(`${investor.name ?? investor.email ?? '투자자'} 입금 승인 완료`)
        setDone(true)
        router.refresh()
      } else {
        toast.error('입금 승인 실패')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="KRW 금액"
        className="w-28 bg-[#0a0e1a] border border-white/[0.1] rounded px-2 py-1 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#3d8ef8]/50"
      />
      <button
        onClick={confirm}
        disabled={loading}
        className="text-xs bg-[#3d8ef8]/20 hover:bg-[#3d8ef8]/30 text-[#3d8ef8] rounded px-2 py-1 transition-colors disabled:opacity-50"
      >
        {loading ? '…' : '확인'}
      </button>
      <button onClick={() => setShowForm(false)} className="text-xs text-white/30 hover:text-white/60">
        취소
      </button>
    </div>
  )
}

function MintTokensButton({ investor }: { investor: InvestorRow }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return <span className="text-xs text-[#22c55e]">발행 완료</span>

  async function handleMint() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/confirm-mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: investor.id }),
      })
      if (res.ok) {
        toast.success(`${investor.name ?? investor.email ?? '투자자'} 토큰 발행 확인 완료`)
        setDone(true)
        router.refresh()
      } else {
        toast.error('토큰 발행 확인 실패')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleMint} disabled={loading} className="text-xs text-[#22c55e] hover:underline disabled:opacity-50">
      {loading ? '처리 중…' : '토큰 발행 확인'}
    </button>
  )
}

function ApproveWithdrawButton({ requestId, userName }: { requestId: string; userName: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done) return <span className="text-xs text-[#22c55e]">승인됨</span>

  async function handleApprove() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/approve-withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      })
      if (res.ok) {
        toast.success(`${userName} 출금 승인 완료`)
        setDone(true)
        router.refresh()
      } else {
        toast.error('출금 승인 실패')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleApprove} disabled={loading} className="text-xs text-[#f59e0b] hover:underline disabled:opacity-50">
      {loading ? '…' : '출금 승인'}
    </button>
  )
}

function InvestorAction({ inv }: { inv: InvestorRow }) {
  if (!inv.investment) return <span className="text-xs text-white/20">—</span>
  if (!inv.investment.depositConfirmed) return <ApproveDepositButton investor={inv} />
  if (!inv.investment.tokenMinted) return <MintTokensButton investor={inv} />
  return <span className="text-xs text-white/30">활성</span>
}

export function AdminInvestorTable({ investors, withdrawRequests }: AdminInvestorTableProps) {
  return (
    <div className="space-y-4">
      {/* ── 투자자 목록 ── */}
      <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.07]">
          <h2 className="text-sm font-medium text-white">투자자 ({investors.length})</h2>
        </div>

        {investors.length === 0 ? (
          <div className="px-5 py-8 text-center text-white/[0.28] text-sm">아직 투자자 없음</div>
        ) : (
          <>
            {/* 데스크톱 테이블 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/[0.07]">
                    {['이름', '이메일', '투자금 (KRW)', '토큰수', '상태', '가입일', '액션'].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-left text-[11px] text-white/[0.28] uppercase tracking-[0.3px] font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-white">{inv.name ?? '—'}</td>
                      <td className="px-5 py-3 text-white/[0.55]">{inv.email ?? '—'}</td>
                      <td className="px-5 py-3 text-white">
                        {inv.investment?.amountKrw ? inv.investment.amountKrw.toLocaleString('ko-KR') : '—'}
                      </td>
                      <td className="px-5 py-3 text-white/70">
                        {inv.investment?.tokenAmount
                          ? Number(inv.investment.tokenAmount).toLocaleString('ko-KR', { maximumFractionDigits: 2 })
                          : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs rounded px-2 py-0.5 ${STATUS_STYLE[inv.investment?.status ?? ''] ?? 'bg-white/[0.06] text-white/50'}`}>
                          {inv.investment?.status ?? 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white/40 text-xs">
                        {new Date(inv.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-5 py-3">
                        <InvestorAction inv={inv} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 카드 뷰 */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {investors.map((inv) => (
                <div key={inv.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-white">{inv.name ?? '—'}</div>
                      <div className="text-xs text-white/40 mt-0.5">{inv.email ?? '—'}</div>
                    </div>
                    <span className={`text-[11px] rounded px-2 py-0.5 shrink-0 ${STATUS_STYLE[inv.investment?.status ?? ''] ?? 'bg-white/[0.06] text-white/50'}`}>
                      {inv.investment?.status ?? 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span>{inv.investment?.amountKrw ? `${inv.investment.amountKrw.toLocaleString('ko-KR')} KRW` : '—'}</span>
                    <span>{inv.investment?.tokenAmount ? `${Number(inv.investment.tokenAmount).toFixed(2)} TOKEN` : '—'}</span>
                  </div>
                  <div className="pt-1">
                    <InvestorAction inv={inv} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── 출금 신청 목록 ── */}
      {withdrawRequests.length > 0 && (
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.07]">
            <h2 className="text-sm font-medium text-white">출금 신청 ({withdrawRequests.length})</h2>
          </div>

          {/* 데스크톱 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['투자자', '토큰수', '지급 예정 (KRW)', 'Tx 해시', '상태', '신청일', '액션'].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left text-[11px] text-white/[0.28] uppercase tracking-[0.3px] font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawRequests.map((req) => (
                  <tr key={req.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white/70 text-xs">{req.user.name ?? req.user.email ?? '—'}</td>
                    <td className="px-5 py-3 text-white">{Number(req.tokenAmount).toLocaleString('ko-KR', { maximumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3 text-white">{req.krwAmount.toLocaleString('ko-KR')}</td>
                    <td className="px-5 py-3 text-white/40 font-mono text-xs">{req.txHash ? `${req.txHash.slice(0, 10)}…` : '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs rounded px-2 py-0.5 ${STATUS_STYLE[req.status] ?? 'bg-white/[0.06] text-white/50'}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">{new Date(req.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-5 py-3">
                      {req.status === 'PENDING' && (
                        <ApproveWithdrawButton requestId={req.id} userName={req.user.name ?? req.user.email ?? '투자자'} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="md:hidden divide-y divide-white/[0.04]">
            {withdrawRequests.map((req) => (
              <div key={req.id} className="px-4 py-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-white">
                      {Number(req.tokenAmount).toFixed(2)} TOKEN
                    </div>
                    <div className="text-xs text-white/40 mt-0.5">
                      {req.user.name ?? req.user.email ?? '—'} · {new Date(req.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <span className={`text-[11px] rounded px-2 py-0.5 shrink-0 ${STATUS_STYLE[req.status] ?? 'bg-white/[0.06] text-white/50'}`}>
                    {req.status}
                  </span>
                </div>
                <div className="text-xs text-white/50">{req.krwAmount.toLocaleString('ko-KR')} KRW 지급 예정</div>
                {req.status === 'PENDING' && (
                  <ApproveWithdrawButton requestId={req.id} userName={req.user.name ?? req.user.email ?? '투자자'} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
