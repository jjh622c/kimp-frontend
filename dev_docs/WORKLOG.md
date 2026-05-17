# kimp-frontend 작업 로그

> 세션이 초기화되면 이 파일을 먼저 읽고 `[ ]` 상태인 작업부터 이어서 진행할 것.
> 작업 완료 시 `[ ]` → `[x]`로 변경.

## 작업 규칙
- 백엔드 연동 부분은 구조/UI만 만들고 TODO 주석으로 표시
- 작업 완료 후 반드시 PROJECT_SPEC.html 업데이트
- 모든 작업 완료 후 모바일(390px) 포함 브라우저 테스트
- 최종 git commit & push

---

## 작업 목록

### 버그 수정
- [x] **TASK-01** `components/landing/HeroSection.tsx` — "Get started" 버튼 href `/onboarding/step1` → `/pool/detail`로 변경 (토큰 없이 접근 시 invalid 오류 방지)
- [x] **TASK-02** `app/(onboarding)/onboarding/step2/page.tsx` — 계좌번호/은행/예금주를 env 변수(`BANK_NAME`, `BANK_ACCOUNT`, `BANK_HOLDER`)로 변경. 미설정 시 빈 플레이스홀더 표시

### 대시보드 완성
- [x] **TASK-03** `components/dashboard/InvestmentTimeline.tsx` (NEW) — 투자 단계 타임라인 컴포넌트
  - 4단계: 계약서 서명 → 입금 확인 → 토큰 발행 → 운용 중
  - props: `contractSigned`, `depositConfirmed`, `tokenMinted`, `status: InvestmentStatus`
  - 완료 단계 = 초록, 현재 단계 = 파란 pulse, 대기 단계 = 회색
- [x] **TASK-04** `app/(protected)/dashboard/page.tsx` — InvestmentTimeline 컴포넌트 추가 (stat cards 아래)
- [x] **TASK-05** `app/api/dashboard/withdrawals/route.ts` (NEW) — 내 출금 신청 내역 GET API
  - 인증 필요, prisma.withdrawRequest.findMany({ where: { userId } })
  - DB 없으면 빈 배열 반환
- [x] **TASK-06** `components/dashboard/WithdrawHistory.tsx` (NEW) — 출금 신청 내역 컴포넌트
  - 신청일, 토큰 수, 예상 KRW, 상태 배지(PENDING/APPROVED/COMPLETED/REJECTED)
  - 내역 없으면 "출금 신청 내역이 없습니다" 빈 상태
- [x] **TASK-07** `app/(protected)/dashboard/page.tsx` — WithdrawHistory 컴포넌트 추가 (WithdrawForm 아래)

### 토스트 알림
- [x] **TASK-08** `lib/toast-context.tsx` (NEW) — ToastContext + useToast hook
  - `{ id, message, type: 'success'|'error'|'info' }` 상태 관리
  - `toast.success()`, `toast.error()`, `toast.info()` 함수 제공
  - 3초 후 자동 사라짐
- [x] **TASK-09** `components/ui/Toaster.tsx` (NEW) — 토스트 UI 컴포넌트
  - 화면 우하단 fixed 포지션
  - 타입별 색상: success=#22c55e, error=#ef4444, info=#3d8ef8
  - 슬라이드인 애니메이션
- [x] **TASK-10** `app/providers.tsx` — ToastProvider + Toaster 추가
- [x] **TASK-11** `components/dashboard/WithdrawForm.tsx` — 출금 신청 성공/실패 시 toast 사용
- [x] **TASK-12** `components/admin/AdminInvestorTable.tsx` — 승인 액션 성공/실패 시 toast 사용

### 관리자 패널 완성
- [x] **TASK-13** `components/admin/AdminStatsCards.tsx` (NEW) — 요약 통계 카드
  - 총 투자자 수, 총 투자금(KRW), 발행 토큰 합계, 대기 출금 수
  - props: `investors[]`, `withdrawRequests[]`, `tokenPrice`
- [x] **TASK-14** `app/(protected)/admin/page.tsx` — AdminStatsCards 추가 (InviteLinkGenerator 위)
- [x] **TASK-15** `components/admin/AdminInvestorTable.tsx` — 모바일 카드 뷰 추가
  - `md:hidden` 카드 목록 + `hidden md:block` 테이블 분리
  - 카드: 이름/이메일/상태/투자금/액션 버튼

### 보안 & 설정
- [x] **TASK-16** `next.config.mjs` — 보안 헤더 추가 (`headers()`)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
- [x] **TASK-17** `.env.example` + 코드 — 앱 이름 환경변수화
  - `NEXT_PUBLIC_APP_NAME` 추가
  - `BANK_NAME`, `BANK_ACCOUNT`, `BANK_HOLDER` 추가
  - Navbar/대시보드/admin 등 `[PROJECT]` → env 변수 사용
- [x] **TASK-18** `app/layout.tsx` — OG 메타태그 완성
  - og:title, og:description, og:type, og:url
  - twitter:card, twitter:title, twitter:description

### 마무리
- [x] **TASK-19** `dev_docs/PROJECT_SPEC.html` — 변경 이력 v0.9 추가, 구현 상태 테이블 업데이트
- [x] **TASK-20** 브라우저 테스트 — 데스크톱(1280px) + 모바일(390px) 전 페이지 확인
- [ ] **TASK-21** git commit & push — `feat: 대시보드/관리자/토스트/보안헤더 완성 (v0.9)`

---

## 완료된 파일 목록 (참고)
작업 완료 시 여기에 기록:
- `components/landing/HeroSection.tsx` ✅
- `app/(onboarding)/onboarding/step2/page.tsx` ✅
- `components/dashboard/InvestmentTimeline.tsx` ✅ (신규)
- `app/(protected)/dashboard/page.tsx` ✅
- `app/api/dashboard/withdrawals/route.ts` ✅ (신규)
- `components/dashboard/WithdrawHistory.tsx` ✅ (신규)
- `lib/toast-context.tsx` ✅ (신규)
- `components/ui/Toaster.tsx` ✅ (신규)
- `app/providers.tsx` ✅
- `components/dashboard/WithdrawForm.tsx` ✅
- `components/admin/AdminInvestorTable.tsx` ✅
- `components/admin/AdminStatsCards.tsx` ✅ (신규)
- `app/(protected)/admin/page.tsx` ✅
- `next.config.mjs` ✅
- `.env.example` ✅
- `app/layout.tsx` ✅
