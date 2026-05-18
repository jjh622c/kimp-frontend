# kimp-frontend 작업 로그

> 세션이 초기화되면 이 파일을 먼저 읽고 `[ ]` 상태인 작업부터 이어서 진행할 것.
> 작업 완료 시 `[ ]` → `[x]`로 변경.
> **형상관리 기준 파일: `dev_docs/PROJECT_SPEC.html`** — 모든 기능 변경 시 여기에도 반영.

## 작업 규칙
- 백엔드 연동 부분은 구조/UI만 만들고 TODO 주석으로 표시
- 작업 완료 후 반드시 PROJECT_SPEC.html changelog + 다음 작업 순서 업데이트
- 모든 작업 완료 후 모바일(390px) 포함 브라우저 테스트
- 최종 git commit & push

---

## v1.0 — UI/UX 1차 개선 (2026.05.18 완료)

### 완료된 작업 [x]
- [x] **UX-01** `components/landing/HeroSection.tsx` — 단일 CTA "→ View vault" → 이중 CTA
  - Primary: "Start investing →" → /onboarding/step1 (초대 투자자 직행)
  - Secondary ghost: "View strategy" → /pool/detail (먼저 확인하는 사람용)
  - 화살표 위치 텍스트 뒤로 통일
- [x] **UX-02** `components/landing/MarketsSection.tsx` — 용어 통일
  - 섹션 헤더: "Markets" → "Active Vault"
  - 카운트: "1 pool" → "1 vault"
  - 테이블 헤더: "Pool" → "Vault"
  - 행 버튼: "View →" → "Details →"
  - APY 아래 "30D est." 맥락 레이블 추가
- [x] **UX-03** `app/(public)/page.tsx` — MarketsSkeleton 용어 동일하게 업데이트
- [x] **UX-04** `components/pool/InvestPanel.tsx` — "Connect Wallet to Invest" → "Connect wallet"
- [x] **UX-05** `app/(protected)/dashboard/page.tsx` — 한국어 에러 메시지 → 영문
- [x] **UX-06** `app/(public)/pool/detail/page.tsx` — 4개 stat 카드 note 레이블 추가
  - 30D Return: "Last 30 days"
  - All-time Return: "Since Jan 2025"
  - Win Rate: "Trades settled"
  - Token Price: "Oracle · live"
- [x] **UX-07** `dev_docs/PROJECT_SPEC.html` — v1.0 업데이트 (페이지 사양, 다음 작업, changelog)
- [x] **UX-08** `memory/ux-plan.md` (신규) — Phase A/B/C 진행 추적 문서

---

## v0.9 — 대시보드/관리자/토스트/보안헤더 (2026.05.18 완료)

- [x] **TASK-01** HeroSection — "Get started" href → /pool/detail 변경
- [x] **TASK-02** Step2 — 계좌번호 env 변수화 (BANK_NAME, BANK_ACCOUNT, BANK_HOLDER)
- [x] **TASK-03** InvestmentTimeline 컴포넌트 신규
- [x] **TASK-04** Dashboard — InvestmentTimeline 추가
- [x] **TASK-05** /api/dashboard/withdrawals GET 신규
- [x] **TASK-06** WithdrawHistory 컴포넌트 신규
- [x] **TASK-07** Dashboard — WithdrawHistory 추가
- [x] **TASK-08** toast-context.tsx 신규
- [x] **TASK-09** Toaster.tsx 신규
- [x] **TASK-10** providers.tsx — ToastProvider + Toaster 추가
- [x] **TASK-11** WithdrawForm — 토스트 적용
- [x] **TASK-12** AdminInvestorTable — 토스트 적용
- [x] **TASK-13** AdminStatsCards 컴포넌트 신규
- [x] **TASK-14** Admin page — AdminStatsCards 추가
- [x] **TASK-15** AdminInvestorTable — 모바일 카드 뷰 추가
- [x] **TASK-16** next.config.mjs — 보안 헤더 추가
- [x] **TASK-17** .env.example + 앱 이름 환경변수화 (NEXT_PUBLIC_APP_NAME)
- [x] **TASK-18** app/layout.tsx — OG 메타태그 완성

---

## v1.2 — Gate 시스템 + 레퍼럴 + UI 개선 (2026.05.18)

> 참조: `dev_docs/kimp_spec_v1.1.md` — 우선순위: 🔴 즉시 → 🟡 다음 → 🟢 대기

### Phase 1 — Gate 시스템 🔴 최우선
- [x] **GATE-01** `app/gate/page.tsx` 신규 생성 (public 그룹 밖 — navbar 없는 단독 페이지)
  - 검은 배경 / 중앙 정렬 / 로고 / "Invitation Only" / 이메일 문의 링크 / 에러 메시지 표시
- [x] **GATE-02** `middleware.ts` — invite 토큰 기반 전체 라우트 보호
  - withAuth → getToken 방식으로 전환 (gate 로직과 auth 로직 분리)
  - `?invite=TOKEN` 파라미터 감지 → verify-invite API로 리다이렉트
  - `kimp_access` 쿠키 없으면 `/gate`로 리다이렉트
- [x] **GATE-03** `onboarding/step1/page.tsx` — invite 토큰 검증 UI 완전 제거
  - 게이트가 이미 검증 완료 → step1은 계약 서명 폼만 표시
  - token은 URL `?token=TOKEN` 으로 전달 (verify-invite GET이 step1으로 리다이렉트)
- [x] **GATE-04** `app/api/onboarding/verify-invite/route.ts` — GET 핸들러 추가
  - GET: 토큰 검증 → `kimp_access=1` 쿠키 설정 → `/onboarding/step1?token=TOKEN` 리다이렉트
  - POST: 기존 로직 유지 (하위 호환)

### Phase 2 — Onboarding 로직 수정 🔴
- [x] **OB-01** `onboarding/step2/page.tsx` — 대기 상태 UI + notify-deposit API 연동
  - "Transfer complete →" 클릭 → notify-deposit POST → 제출 시간 sessionStorage 저장
  - 대기 UI: "Deposit confirmation in progress." + 제출 시간 표시
  - Suspense 래퍼 추가 (useSearchParams 사용)
- [x] **OB-02** `app/api/onboarding/notify-deposit/route.ts` 신규
  - TODO 주석: DEPOSIT_PENDING 상태 / 카카오알림톡 연동 (스키마 확장 후)

### Phase 3 — UI 개선 🟡
- [x] **UI-01** `components/landing/HeroSection.tsx` — 실적 stat 3개 추가
  - 5yr+ / +275% / ₩3B+ (하드코딩, DATA-01 수령 후 업데이트)
- [x] **UI-02** `components/dashboard/WithdrawForm.tsx` — Locked 상태 UI 개선
  - amber notice: "Locked · Unlocks in X days"
  - Investment date / Unlock date 표시
  - `investedAt` prop 추가, dashboard page에서 `investment.createdAt` 전달
- [x] **UI-03** SVG 차트 엔드포인트 수정 — 실제 앱 코드에 inline SVG 없음
  - PriceChartCard는 lightweight-charts 라이브러리 사용 → 해당 없음 (preview/vault.html 전용)
- [x] **UI-04** `components/onboarding/StepHeader.tsx` — 모바일 step indicator 레이블 처리
  - 스텝 도트 + `hidden sm:block text-[10px]` 라벨 (Contract/Deposit/Wallet/Done)
  - 390px 겹침 방지, 진행률 바 + "Step X of Y" 텍스트 유지

### Phase 4 — 레퍼럴 시스템 🟡
- [ ] **REF-01** `prisma/schema.prisma` — InviteLink, User 모델 수정
  - InviteLink: depth, usedById, maxUses, useCount 필드 추가
  - User: referredById, referralDepth, canInvite, createdInvites, usedInvite 필드 추가
- [ ] **REF-02** `npx prisma db push` + `npx prisma generate`
- [ ] **REF-03** `app/api/invite/generate/route.ts` 신규 (POST)
  - canInvite=true + depth < 2 투자자 or Admin만 생성 가능
  - 반환: `{ url: "https://domain.com/?invite=TOKEN" }`
- [ ] **REF-04** `app/api/invite/tree/route.ts` 신규 (GET, Admin 전용)
  - 전체 레퍼럴 트리 반환 (시각화용)
- [ ] **REF-05** `components/dashboard/InviteSection.tsx` 신규
  - canInvite=true인 투자자에게만 표시 (false면 섹션 숨김)
  - 개인 invite 링크 + Copy 버튼 + 초대한 투자자 목록
- [ ] **REF-06** `components/admin/AdminInviteSection.tsx` 신규
  - 새 링크 생성(만료일+최대횟수) / 레퍼럴 트리 시각화 / canInvite 토글 / 링크 무효화
- [ ] **REF-07** `app/(protected)/dashboard/page.tsx` — InviteSection 조건부 렌더링 추가

### Phase 5 — 데이터 업데이트 (파일 수령 후 🟢)
- [ ] **DATA-01** V1 실제 정산 엑셀/CSV 수령 대기 중
  - **요청 파일:** 2021~2024 월별 수익률 + 시드 규모 (엑셀 or CSV)
  - 수령 시: HeroSection stat 수치 확정 (5년+, +275%, ₩3B+)
  - 수령 시: Vault Detail Monthly Returns 12개월+ 데이터 채우기 (Month/Return/Token Price/Note)
  - 수령 시: 누적 수익률, CAGR, Win Rate 재계산
  - **현재 확인 수치:** 2023년 +22.70% / 2024년 +28.90% / V3 1월 +10% / V3 2월 +2%

---

## v1.1 — 언어 통일 & 관리자 기능 완성 (2026.05.18)

- [x] **V11-01** `prisma/schema.prisma` — User 모델 `phone` 필드 추가 (카카오 알림톡 활성화)
- [x] **V11-02** `components/admin/AdminReportSection.tsx` — 월간 리포트 해시 등록 UI 신규
- [x] **V11-03** `app/(protected)/admin/page.tsx` — AdminReportSection 추가
  - `/api/admin/record-report/route.ts` 신규 (AdminReportSection 호출용)
- [x] **V11-04** UI 언어 통일 — 투자자 노출 화면 전체 한국어 → 영문
  - `step1`, `step2`, `step3` 온보딩 페이지
  - `error`, `not-found`, `global-error`, `loading`, `auth/login`
  - `AdminInvestorTable`, `AdminStatsCards`, `InviteLinkGenerator`, `OracleUpdateForm`
  - `InvestmentTimeline`, `WithdrawForm`, `WithdrawHistory`
- [x] **V11-05** `dev_docs/PROJECT_SPEC.html` — v1.1 changelog 업데이트
- [x] **V11-06** `memory/project_kimp.md` — v1.1 상태 반영

---

## 완료된 주요 파일 목록
- `components/landing/HeroSection.tsx` ✅ v1.0
- `components/landing/MarketsSection.tsx` ✅ v1.0
- `app/(public)/page.tsx` ✅ v1.0
- `components/pool/InvestPanel.tsx` ✅ v1.0
- `app/(protected)/dashboard/page.tsx` ✅ v1.0
- `app/(public)/pool/detail/page.tsx` ✅ v1.0
- `components/dashboard/InvestmentTimeline.tsx` ✅ v0.9
- `components/dashboard/WithdrawHistory.tsx` ✅ v0.9
- `lib/toast-context.tsx` ✅ v0.9
- `components/ui/Toaster.tsx` ✅ v0.9
- `components/admin/AdminStatsCards.tsx` ✅ v0.9
- `components/admin/AdminInvestorTable.tsx` ✅ v0.9
- `next.config.mjs` ✅ v0.9
- `app/layout.tsx` ✅ v0.9
- `dev_docs/PROJECT_SPEC.html` ✅ v1.0
- `memory/ux-plan.md` ✅ v1.0 (신규)
