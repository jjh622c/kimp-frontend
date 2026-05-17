'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Incorrect email or password')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 text-[18px] font-medium text-white tracking-[0.4px] no-underline">
        [<span className="text-[#3d8ef8]">P</span>ROJECT]
      </Link>

      <div className="w-full max-w-sm">
        <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-7">
          <h1 className="text-base font-medium text-white mb-1">Sign in</h1>
          <p className="text-xs text-white/[0.35] mb-6">Access your account</p>

          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg px-3 py-2.5 mb-4 text-xs text-[#ef4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] text-white/[0.35] uppercase tracking-[0.4px] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full bg-[#0a0e1a] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#3d8ef8]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/[0.35] uppercase tracking-[0.4px] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-[#0a0e1a] border border-white/[0.1] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#3d8ef8]/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-[#3d8ef8] hover:bg-[#2d7ee8] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-medium transition-colors mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-white/[0.2] mt-4">
          Access is limited to invited investors
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <span className="w-5 h-5 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
