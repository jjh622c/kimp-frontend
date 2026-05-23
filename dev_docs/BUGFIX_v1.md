# KiMP 버그픽스 및 문구 수정 지시서 v1
**작성일:** 2026-05-19
**전달 대상:** Claude Code
**선행 작업:** CONTENT_SPEC_FINAL_v2 적용 완료 기준

---

## 세션 시작 시 필독 순서

1. `WORKLOG.md`
2. `PROJECT_SPEC.html`
3. 이 문서

---

## FIX-01 — 2025 연도 표시 문구 수정

**파일:** `lib/data/monthly-returns.ts` 또는 Annual Returns 데이터 파일

**변경 내용:**
```typescript
// 변경 전
{ year: 2025, return: null, note: 'Excluded · operational issues' }

// 변경 후
{ year: 2025, return: null, note: 'V3 development & migration period' }
```

**Vault Detail 테이블 표시:**
```
2025   —   V3 development & migration period
```

---

## FIX-02 — Pool/Details 페이지 invite 게이팅 적용

**현재 문제:**
Landing에서 Vault 행 또는 Details 버튼 클릭 시
invite 토큰 검증 없이 `/pool/detail` 페이지로 바로 이동.

**원인:**
`middleware.ts` 의 보호 경로에 `/pool/detail` 이 누락됨.

**수정 내용:**

```typescript
// middleware.ts
// 보호 대상 경로에 추가
const PROTECTED_ROUTES = [
  '/pool/detail',      // ← 추가
  '/onboarding',
  '/dashboard',
]

// invite 토큰 없으면 /gate 로 리다이렉트
if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
  const inviteToken = request.cookies.get('invite_token')
  if (!inviteToken) {
    return NextResponse.redirect(new URL('/gate', request.url))
  }
}
```

**예외 처리:**
개발 환경(`NODE_ENV === 'development'`)에서는 bypass 유지해도 됨.
프로덕션에서만 강제 적용.

```typescript
if (process.env.NODE_ENV === 'production') {
  // invite 토큰 체크
}
```

**관련 파일:**
- `middleware.ts`
- `app/(public)/pool/detail/page.tsx` — 서버사이드에서도 이중 체크 추가 권장

---

## WORKLOG 업데이트 지시

```markdown
## v1.4 — 버그픽스 (진행 중)

- [ ] FIX-01  2025 연도 문구 수정 (operational issues → V3 development & migration period)
- [ ] FIX-02  /pool/detail 미들웨어 invite 게이팅 적용
```

---

*지시서 끝. FIX-01 → FIX-02 순서로 작업.*
