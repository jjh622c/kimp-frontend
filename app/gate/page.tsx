import Link from 'next/link'
// DEV bypass only — exempt path set in middleware GATE_EXEMPT_PREFIXES

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'KiMP'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@example.com'

const ERROR_MESSAGES: Record<string, { title: string; body: string }> = {
  invalid: {
    title: 'Invalid invite link',
    body: 'This link does not exist or has already been revoked. Please request a new one.',
  },
  used: {
    title: 'Link already used',
    body: 'This invite link has already been claimed. Contact us if you think this is a mistake.',
  },
  expired: {
    title: 'Invite link expired',
    body: 'This link has passed its expiry date. Please request a fresh invite from the team.',
  },
  missing: {
    title: 'No invite token',
    body: 'An invite token is required to access this platform. Use the link provided to you.',
  },
  server: {
    title: 'Something went wrong',
    body: 'A server error occurred while verifying your invite. Please try again.',
  },
}

interface GatePageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function GatePage({ searchParams }: GatePageProps) {
  const params = await searchParams
  const err = params.error
  const errMsg = err ? ERROR_MESSAGES[err] : null

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 text-[18px] font-medium text-white tracking-[0.4px] select-none">
        [<span className="text-[#3d8ef8]">{APP_NAME[0]}</span>
        {APP_NAME.slice(1)}]
      </div>

      <div className="w-full max-w-sm">
        {/* Main card */}
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl overflow-hidden">
          {/* Header band */}
          <div className="px-7 pt-7 pb-5">
            <div className="flex items-center gap-3 mb-1">
              {/* Lock icon */}
              <div className="w-9 h-9 rounded-lg bg-[#3d8ef8]/10 border border-[#3d8ef8]/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-[18px] h-[18px] text-[#3d8ef8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-medium text-white leading-tight">Invitation Only</h1>
                <p className="text-[11px] text-white/[0.35] mt-0.5">Private access · Invite required</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.05]" />

          {/* Body */}
          <div className="px-7 py-5">
            {errMsg ? (
              /* Error state */
              <div className="bg-[#ef4444]/[0.05] border border-[#ef4444]/20 rounded-lg px-4 py-3.5 mb-5">
                <p className="text-[11px] font-medium text-[#ef4444]/90 mb-1">{errMsg.title}</p>
                <p className="text-[11px] text-[#ef4444]/55 leading-[1.65]">{errMsg.body}</p>
              </div>
            ) : (
              /* Default state */
              <div className="mb-5 space-y-3">
                <p className="text-sm text-white/[0.5] leading-[1.75]">
                  This platform is available by invitation only.
                </p>
                <p className="text-sm text-white/[0.5] leading-[1.75]">
                  If you received an invitation link, please open that link directly to gain access.
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center justify-center gap-2 w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.09] hover:border-white/[0.15] text-white/55 hover:text-white/80 rounded-lg py-2.5 text-sm transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Request an invitation
            </a>
          </div>
        </div>

        {/* Dev bypass — testing only */}
        <div className="mt-3 bg-[#f59e0b]/[0.04] border border-[#f59e0b]/15 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono text-[#f59e0b]/60 uppercase tracking-[0.6px] shrink-0">
              DEV
            </span>
            <span className="text-[11px] text-white/[0.28] truncate">
              Bypass gate for testing
            </span>
          </div>
          <Link
            href="/api/dev/bypass"
            className="shrink-0 text-[11px] text-[#f59e0b]/70 hover:text-[#f59e0b] transition-colors font-medium whitespace-nowrap"
          >
            Enter site →
          </Link>
        </div>

        <p className="text-center text-[11px] text-white/[0.16] mt-5">
          Access is strictly limited to invited investors
        </p>
      </div>
    </div>
  )
}
