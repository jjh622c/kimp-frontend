'use client'

import { useToasts } from '@/lib/toast-context'

const TYPE_STYLES = {
  success: {
    bar: 'bg-[#22c55e]',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bar: 'bg-[#ef4444]',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  info: {
    bar: 'bg-[#3d8ef8]',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
}

export function Toaster() {
  const toasts = useToasts()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
      {toasts.map((t) => {
        const style = TYPE_STYLES[t.type]
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 bg-[#0e1425] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden animate-slide-in-right"
            style={{ minWidth: 260, maxWidth: 360 }}
          >
            <div className={`w-1 self-stretch shrink-0 ${style.bar}`} />
            <div
              className={`py-3 pr-1 ${
                t.type === 'success'
                  ? 'text-[#22c55e]'
                  : t.type === 'error'
                  ? 'text-[#ef4444]'
                  : 'text-[#3d8ef8]'
              }`}
            >
              {style.icon}
            </div>
            <p className="text-sm text-white/80 py-3 pr-4 leading-[1.5]">{t.message}</p>
          </div>
        )
      })}
    </div>
  )
}
