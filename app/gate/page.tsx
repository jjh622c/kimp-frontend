const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'KiMP'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contact@example.com'

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'This invite link is not valid. Please contact the team for a new link.',
  used: 'This invite link has already been used. Please contact us if you think this is an error.',
  expired: 'This invite link has expired. Please request a new one from the team.',
  missing: 'No invite token provided. Please use the invitation link you received.',
  server: 'A server error occurred. Please try again or contact us.',
}

interface GatePageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function GatePage({ searchParams }: GatePageProps) {
  const params = await searchParams
  const error = params.error
  const errorMessage = error ? ERROR_MESSAGES[error] : null

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm w-full">
        <div className="mb-8">
          <span className="text-[17px] font-medium text-white tracking-[0.4px]">
            [<span className="text-[#3d8ef8]">{APP_NAME[0]}</span>{APP_NAME.slice(1)}]
          </span>
        </div>

        <div className="mb-6">
          <div className="w-14 h-14 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {errorMessage ? (
          <>
            <h1 className="text-base font-medium text-white mb-3">Access Denied</h1>
            <div className="bg-[#ef4444]/[0.06] border border-[#ef4444]/20 rounded-xl px-4 py-3 mb-6 text-sm text-[#ef4444]/80 leading-[1.7]">
              {errorMessage}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-base font-medium text-white mb-3">Invitation Only</h1>
            <p className="text-sm text-white/[0.45] leading-[1.7] mb-2">
              This platform is available by invitation only.
            </p>
            <p className="text-sm text-white/[0.45] leading-[1.7] mb-8">
              If you received an invitation link, please use that link to access.
            </p>
          </>
        )}

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-sm text-[#3d8ef8] hover:text-[#2d7ee8] transition-colors"
        >
          Contact us →
        </a>
      </div>
    </div>
  )
}
