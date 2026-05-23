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
- [x] **REF-01** `prisma/schema.prisma` — InviteLink, User 모델 수정
  - InviteLink: depth, usedById, createdById, maxUses, useCount 필드 추가
  - User: referredById, referralDepth, canInvite 필드 추가
- [ ] **REF-02** `npx prisma db push` + `npx prisma generate` ⚠️ **수동 실행 필요** (DB 연결 후)
- [x] **REF-03** `app/api/invite/generate/route.ts` 신규 (POST)
  - canInvite=true + depth < 2 투자자 or Admin만 생성 가능
  - 반환: `{ url: "https://domain.com/?invite=TOKEN" }`
  - `app/api/invite/revoke/route.ts` 신규 (POST, Admin 전용)
- [x] **REF-04** `app/api/invite/tree/route.ts` 신규 (GET, Admin 전용)
  - 전체 레퍼럴 트리 + 링크 목록 반환
  - `app/api/admin/toggle-invite/route.ts` 신규 (POST, Admin 전용)
- [x] **REF-05** `components/dashboard/InviteSection.tsx` 신규
  - canInvite=true인 투자자에게만 표시 (false면 null 반환)
  - 개인 invite 링크 생성 + Copy 버튼 + 초대한 투자자 목록
- [x] **REF-06** `components/admin/AdminInviteSection.tsx` 신규
  - 새 링크 생성(만료일+최대횟수) / links 탭 + referral tree 탭
  - 링크별 상태 배지(Active/Used/Expired/Revoked) + Revoke 버튼 + Copy 버튼
  - canInvite 토글: AdminInvestorTable의 Active 투자자 Action 셀에 ToggleInviteButton 추가
  - admin/page.tsx: InviteLinkGenerator → AdminInviteSection 교체
- [x] **REF-07** `app/(protected)/dashboard/page.tsx` — canInvite + referredUsers 조회 + InviteSection 조건부 렌더링

### Phase 5 — 데이터 업데이트 (파일 수령 후 🟢)
- [x] **DATA-01** V1 실제 정산 데이터 수령 완료 → Vault Stats 실데이터 반영 (v1.3)
  - 정산 데이터: 2022.10 ~ 2026.05, 30개 정산 기간
  - HeroSection stat은 별도 확인 필요 (파일: KiMP_정산데이터_v1.0.xlsx)

---

## v1.7 — 버그픽스 (2026.05.24)

> 참조: `dev_docs/BUGFIX_v1.md` — CONTENT_SPEC_FINAL_v2 적용 완료 기준

- [x] **FIX-01** `components/pool/MonthlyReturns.tsx` — 2025 연도 문구 수정
  - ANNUAL_RETURNS: `'Excluded · operational issues'` → `'V3 development & migration period'`
  - 각주: `"2025 excluded due to operational issues"` → `"2025 excluded (V3 development & migration period)"`
- [x] **FIX-02** `middleware.ts` — `/pool/detail` 초대 게이팅 명시적 적용
  - `INVITE_GATE_PREFIXES` 배열 추가 (`/pool/detail`, `/onboarding`, `/dashboard`, `/admin`)
  - gate 체크 로직: 프로덕션 전체 적용 + 개발환경에서도 `INVITE_GATE_PREFIXES` 경로는 강제 적용
  - 개발환경에서 `/pool/detail` 없이 접근 시 → `/gate` 리다이렉트

---

## v1.5 — 콘텐츠 최종 확정 사양 v1 반영 (2026.05.23)

> 참조: `dev_docs/CONTENT_SPEC_FINAL.md` (v1) — CONTENT-01 ~ CONTENT-13 완료 (v2로 대체됨)

---

## v1.6 — 콘텐츠 최종 확정 사양 v2 전면 반영 (2026.05.23)

> 참조: `dev_docs/CONTENT_SPEC_FINAL_v2.md` — CONTENT-01 ~ CONTENT-16 전항목 완료
> 변경사항: 수익률 수치 전면 업데이트 (2025 제외, 연단위 통계로 간소화)

### 즉시 적용 항목
- [x] **CONTENT-01** `components/landing/HeroSection.tsx` — Hero stat bar 수치 교체
  - 가운데 stat: 28.96% → `—` (Current APY / Accumulating)
  - 오른쪽 stat: `1,800日+` → `1,800d+`
- [x] **CONTENT-02** `lib/data/vault-stats.ts` + `app/(public)/pool/detail/page.tsx`
  - return30d: '+2.10%' → '—', returnNote → 'Accumulating · V3'
  - currentApy: '28.96%' → '+42.3%', note → 'Compound annual · 2021–2024'
  - winRate: '60.7%' → '60.0%', winRateNote: '17/28' → '15/25 periods'
  - page.tsx: 카드 레이블 'Current APY' → 'Historical APY'
  - Token Price fallback: tokenPrice=0 → 'TBD' 표시
- [x] **CONTENT-03** `components/pool/MonthlyReturns.tsx` — Monthly → Annual Returns 5행으로 교체
  - 2021 +44.8% / 2022 +32.8% / 2023 +22.7% / 2024 +28.9% / 2025 — / 2026 —
- [x] **CONTENT-04** `components/pool/MonthlyReturns.tsx` — Performance 하단 통계 업데이트
  - Cumulative +210% / Historical APY +42.3% / Win Rate 60.0% / Best 2021 / Worst 2022 Q4
- [x] **CONTENT-05** `components/pool/MonthlyReturns.tsx` — Dual APY 섹션 추가
  - Historical APY +42.3% (2021–2024) | Current APY (V3) — (Accumulating, Since Mar 2026)
- [x] **CONTENT-06** `components/landing/HowItWorksSection.tsx` — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-07** `components/landing/InvitePopup.tsx` — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-08** `components/landing/RiskFooter.tsx` — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-09** 온보딩 Step 1~4 — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-10** `components/dashboard/WithdrawForm.tsx` — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-11** `components/dashboard/InviteSection.tsx` — v2 스펙과 일치 확인 (변경 없음)
- [x] **CONTENT-12** `components/pool/InvestPanel.tsx` — 최소 투자 ₩10,000,000 확인 (변경 없음)
- [x] **CONTENT-13** `components/dashboard/WithdrawForm.tsx` — MIN_WITHDRAWAL 5000 확인 (변경 없음)
- [x] **CONTENT-14** `.env.example` — 입금 계좌 env 확인 (변경 없음)

### 구조 추가 항목
- [x] **CONTENT-15** `app/(onboarding)/onboarding/step2/page.tsx` — 락업 선택 UI 확인 (이미 완료)
- [x] **CONTENT-16** `.env.example` — 전체 업데이트
  - NEXT_PUBLIC_CURRENT_APY 비워 둠 (Accumulating)
  - NEXT_PUBLIC_HISTORICAL_APY=42.3 추가
  - NEXT_PUBLIC_CONTACT_EMAIL 추가

---

## v1.4 — Gate Popup / Onboarding 재설계 / Dashboard 개선 (2026.05.19)

### Gate & Landing
- [x] **GATE-10** `components/landing/InvitePopup.tsx` 신규 — 스크롤/버튼 트리거 팝업
  - backdrop-blur 모달, invite code 입력 + POST verify-invite → /pool/detail 이동
  - `app/(public)/page.tsx` — InvitePopup + `#hero-sentinel` 추가
  - `components/landing/HeroSection.tsx` — client 컴포넌트로 전환, CTA → custom event dispatch
  - `app/api/onboarding/verify-invite/route.ts` — POST에도 kimp_access 쿠키 설정

### Onboarding 전면 재설계
- [x] **OB-10a** `onboarding/step1/page.tsx` — MetaMask 토큰 추가 가이드
  - 4단계 안내 + 컨트랙트 주소 Copy 버튼 + 체크박스 확인 전 Continue disabled
- [x] **OB-10b** `onboarding/step2/page.tsx` — 입금방법 선택 + 전자서명
  - Crypto(비활성/Coming soon) / Bank Transfer(활성) 선택 카드
  - Bank 선택 시 MODU_SIGN_URL 오픈 + 수동 서명 확인 버튼
- [x] **OB-10c** `onboarding/step3/page.tsx` — 계좌입금 + 10분 타이머 + 레퍼럴코드
  - sessionStorage 기반 타이머 (새로고침 유지), 만료 시 Restart → step2
  - 입금 완료 후 대기 화면 + notify-deposit API 연동
- [x] **OB-10d** `onboarding/step4/page.tsx` — 투자 요약 + 트랜잭션 카드 + What's next 제거
  - TOKEN ISSUANCE TRANSACTION 카드 (pending 상태, TODO: DB txhash 연동)
- [x] **OB-10e** `components/pool/InvestPanel.tsx` — 금액 입력 후 온보딩 이동
  - invest_amount → sessionStorage 저장 → /onboarding/step1 이동
- [x] `components/onboarding/StepHeader.tsx` — 라벨 업데이트 (Token/Method/Transfer/Done)

### Dashboard
- [x] **DASH-10** `app/(protected)/dashboard/page.tsx` — max-w-3xl `mx-auto` 추가 (가운데 정렬)
- [x] **DASH-11** `components/dashboard/InvestmentProgress.tsx` 신규
  - 5단계 수직 타임라인 (완료/진행중/대기 상태), STEPS_COMPLETE + STEPS_DEPOSIT_PENDING export
  - 대시보드에 InvestmentProgress 추가 (완료 상태 하드코딩, TODO: DB 연동)
- [x] **DASH-12** `components/dashboard/WithdrawForm.tsx` — KRW 입력 + 반환계좌 안내
  - Token 수량 → KRW 금액 입력으로 교체, 최소 ₩100,000
  - TOKEN 소각 수량 자동 계산 표시
  - RETURN ACCOUNT 카드 추가 (accountOnFile prop)
  - 버튼: "Request Withdrawal in KRW"

### 환경변수
- [x] **ENV-01** `.env.example` — NEXT_PUBLIC_MODU_SIGN_URL, NEXT_PUBLIC_CONTACT_EMAIL 추가

---

## v1.3 — Vault Stats 실데이터 반영 (2026.05.19)

> 참조: `dev_docs/20260518/CLAUDE_CODE_INSTRUCTIONS.md`

- [x] **VAULT-01** `lib/data/monthly-returns.ts` 신규 + `components/pool/MonthlyReturns.tsx` 신규
  - 30개 정산 데이터 배열 (2022.10~2026.05, 최신순)
  - 4열 테이블: Period / Return(바 시각화) / Token price / Net profit
  - 연도별 구분선, hover 효과
- [x] **VAULT-02** `lib/data/vault-stats.ts` 신규 + stat 카드 4개 수치 교체
  - 30D Return: +2.1% / All-time Return: +32.6% / Win Rate: 60.7%
  - Token Price: live oracle 유지
- [x] **VAULT-03** `components/pool/PriceChartCard.tsx` — 실 데이터로 교체
  - PRICE_CHART_DATA (30포인트, 2022-10~2026-05) 적용
  - 탭 1W·1M·ALL → 1Y·ALL 변경, 기본값 ALL
  - 날짜 범위 레이블 추가 (Oct 2022 / May 2026)
- [x] **VAULT-04** 누적 수익률 배너 (+32.6%) 추가 (MonthlyReturns 컴포넌트 내)
- [x] **VAULT-05** Win/Loss pip 시각화 추가 (MonthlyReturns 컴포넌트 내)
- [x] **VAULT-06** All-time Return note "Since Jan 2025" → "Since Oct 2022" 수정

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
