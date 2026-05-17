'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: '#0a0e1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 16px',
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            심각한 오류가 발생했습니다
          </div>
          {error.digest && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginBottom: 16 }}>
              {error.digest}
            </div>
          )}
          <button
            onClick={reset}
            style={{
              background: '#3d8ef8',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            페이지 새로고침
          </button>
        </div>
      </body>
    </html>
  )
}
