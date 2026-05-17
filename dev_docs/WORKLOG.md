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

## 다음 작업 (v1.1 이후 — 우선순위 순)

### Phase 1 — 환경 설정 & 실연동
- [x] **NEXT-01** 토큰명 env 변수화 (`NEXT_PUBLIC_TOKEN_NAME`)
  - `MarketsSection.tsx`, `pool/detail/page.tsx` — [TOKEN] → env 변수
  - `.env.example` 업데이트
- [ ] **NEXT-02** `npm install` → `.env` 파일 작성 → DATABASE_URL(Supabase) 설정
  - **사용자 직접 실행:** `.env.example` 복사 후 값 입력
- [ ] **NEXT-03** `npx prisma db push` → `npx prisma generate`
  - **사용자 직접 실행:** NEXT-02 완료 후 실행
- [x] **NEXT-04** 관리자 패널 — 초대 링크 생성 UI
  - `InviteLinkGenerator.tsx` ✅, `/api/admin/create-invite` ✅ (기존 완료)

### Phase 1 후반 — 외부 서비스 연동
- [x] **NEXT-05** 모두싸인 API 연동 구조 완성
  - `lib/modusign.ts` — API wrapper (createSigningSession, verifyWebhookSignature)
  - `/api/onboarding/modusign-session` — iframe URL 발급 엔드포인트
  - `/api/webhooks/modusign` — 서명 완료 웹훅
  - `step1/page.tsx` — API 키 있으면 실제 iframe, 없으면 플레이스홀더
  - **활성화:** `MODUSIGN_API_KEY` + `MODUSIGN_TEMPLATE_ID` env 설정
- [x] **NEXT-06** ERC-20 스마트 컨트랙트 파일 작성
  - `contracts/Token.sol` — KimpToken ERC-20 (mint, burnFrom)
  - `contracts/Oracle.sol` — KimpOracle (updatePrice, recordMonthlyReport)
  - **배포:** Hardhat 설정 + `npx hardhat deploy --network base` (별도 백엔드 작업)

### Phase 2 — 고도화
- [x] **NEXT-07** APY 오라클 실시간 연동
  - `lib/data/oracle.ts` — `getLatestApy()` 추가 (30D 기준 연환산, fallback 68%)
  - `MarketsSection.tsx` — ~68% 하드코딩 → `getLatestApy()` 동적 연동
- [x] **NEXT-08** 카카오 알림톡 구조 완성
  - `lib/kakao.ts` — sendAlimtalk, notifyDepositConfirmed, notifyWithdrawApproved
  - `approve-deposit/route.ts`, `approve-withdraw/route.ts` — 알림 호출 연결
  - **활성화:** `KAKAO_API_KEY` + `KAKAO_CHANNEL_ID` env 설정
  - **TODO:** User 모델에 `phone` 필드 추가 후 실제 번호 전달
- [x] **NEXT-09** 월간 수익 리포트 온체인 해시 구조 완성
  - `lib/onchain.ts` — recordMonthlyReportHash, computeSha256
  - `contracts/Oracle.sol` — recordMonthlyReport 함수 포함
  - **활성화:** 컨트랙트 배포 후 `ORACLE_ADMIN_PRIVATE_KEY` + `NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS` 설정

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
