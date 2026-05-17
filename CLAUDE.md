# kimp-frontend — Claude Code 프로젝트 가이드

## 문서 관리 원칙

> **모든 기능 정의·변경 사항은 `dev_docs/PROJECT_SPEC.html`에 반드시 기록한다.**

협업자와의 작업 편의 및 가독성 향상을 위해 아래 규칙을 따른다:

- 새 기능을 구현하면 → PROJECT_SPEC.html의 **변경 이력(changelog)** 섹션에 버전을 올려 기록
- 페이지 사양이 바뀌면 → **페이지별 상세 사양** 섹션 업데이트
- 다음 작업 우선순위가 바뀌면 → **다음 작업 순서** 테이블 업데이트
- 기술 스택 변경 시 → **기술 스택** 섹션 업데이트
- 문서 언어: **한국어** (주석·커밋 메시지도 한국어 권장)

---

## 프로젝트 개요

김치 프리미엄(Korea Premium) 차익거래 자동화 봇의 수익을 토큰화하여, 사전 합의된 소수 투자자에게 투명하고 검증 가능한 방식으로 투자 참여 기회를 제공하는 **프라이빗 투자 플랫폼**이다.

- 초대 링크 방식, 10~20명 이하 소수 참여
- DeFi UI/UX를 차용한 프라이빗 투자 구조
- 투자자 → KRW 계좌 입금 → ERC-20 토큰 발행 → 봇 수익 바이백/소각 → 토큰 가격 상승

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS v3 — 다크 테마 전용, `globals.css`에 디자인 토큰 정의 |
| 블록체인 | wagmi v2 + viem — Base 메인넷, MetaMask(`injected()`) 전용 |
| 인증 | NextAuth v4 (이메일/Google, 세션 기반) |
| ORM | Prisma + PostgreSQL (스키마: `prisma/schema.prisma`) |
| UI 컴포넌트 | Radix UI (slot), Lucide React 아이콘, shadcn 스타일 (`components/ui/`) |
| 차트 | TradingView Lightweight Charts (Phase 2) |

---

## 디렉토리 구조

```
app/
  (public)/             — 비인증 공개 라우트
    layout.tsx          — Navbar + max-w-[1280px] 래퍼
    page.tsx            — 랜딩 (HeroSection + MarketsSection + HowItWorks + RiskFooter)
    pool/detail/        — 볼트 상세 페이지 (통계, 차트, InvestPanel)
  (onboarding)/         — 4단계 온보딩 (계약서 → 입금 → 지갑 → 완료)
    layout.tsx          — 로고바 + ConnectButton
    onboarding/step1/   — 계약서 서명 (모두싸인 embed)
    onboarding/step2/   — 입금 계좌 안내
    onboarding/step3/   — MetaMask 지갑 연결 (wagmi 실제 연동)
    onboarding/step4/   — 완료 + 대시보드 이동
  (protected)/          — NextAuth 세션 필요
    layout.tsx          — 세션 가드 (미인증 시 /api/auth/signin 리다이렉트)
    dashboard/          — 투자자 대시보드 (토큰 잔고, ROI, 출금)
    admin/              — 관리자 패널 (투자자 목록, 오라클 업데이트, 승인)
  api/
    auth/[...nextauth]/ — NextAuth 핸들러
    oracle/price/       — GET 현재 토큰 가격
    dashboard/me/       — GET 투자자 데이터
    onboarding/         — verify-invite, contract-signed, wallet
    admin/              — approve-deposit, approve-withdraw, update-oracle
    withdraw/request/   — POST 출금 신청

components/
  layout/Navbar.tsx       — 고정 내비, max-w-[1280px] 내부 컨테이너, ConnectButton
  landing/                — HeroSection, MarketsSection, HowItWorksSection, RiskFooter
  pool/InvestPanel.tsx    — 지갑 연결 상태 인식 투자 폼 (데스크톱 sticky, 모바일 static)
  pool/PriceChartCard.tsx — 가격 차트 카드 (Phase 2: TradingView)
  wallet/ConnectButton.tsx — wagmi MetaMask 연결 버튼 (3가지 상태)
  onboarding/StepHeader.tsx
  ui/                     — button.tsx (shadcn 스타일)

lib/
  wagmi.ts      — wagmiConfig: Base 체인, injected() 커넥터, ssr: true
  auth.ts       — NextAuth authOptions
  prisma.ts     — Prisma 클라이언트 싱글톤
  data/oracle.ts — getLatestOraclePrice(), getOraclePriceHistory()
  utils.ts      — cn() 헬퍼
```

---

## 디자인 시스템

| 항목 | 값 |
|------|----|
| 배경 (body) | `#0a0e1a` |
| 카드 배경 | `#0e1425` |
| 테이블 헤더 | `#0b0f1f` |
| 주요 컬러 (파란색) | `#3d8ef8` |
| 성공 (초록) | `#22c55e` |
| 경고 (주황) | `#f59e0b` |
| 위험 (빨간) | `#ef4444` |
| 기본 텍스트 | `#e2e8f0` |
| 보조 텍스트 | `white/40` |
| 레이블 텍스트 | `white/28` |
| 카드 테두리 | `white/[0.07]` |
| **최대 콘텐츠 폭** | `max-w-[1280px] mx-auto` (모든 레이아웃에 일관 적용) |

---

## 핵심 컨벤션

- 모든 페이지는 `max-w-[1280px] mx-auto` 폭 제한 적용 (public/onboarding은 레이아웃 레벨, dashboard/admin은 인라인)
- 다크 테마 전용 — 라이트 모드 없음
- 반응형 브레이크포인트: `max-sm`(< 640px) 모바일, `max-lg`(< 1024px) 태블릿/2컬럼→1컬럼
- ConnectButton은 모든 nav에 포함 (Navbar, onboarding 레이아웃, dashboard, admin)
- InvestPanel: `sticky top-20 max-lg:static` — 데스크톱만 sticky
- 풀 상세 모바일: InvestPanel 먼저 (`max-lg:order-1`), 내용 카드 뒤 (`max-lg:order-2`)
- 패딩 패턴: `px-8 max-sm:px-4`

---

## 개발 명령어

```bash
npm run dev          # 개발 서버 시작 (포트 3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run db:generate  # Prisma generate
npm run db:push      # 스키마 → DB 반영
npm run db:studio    # Prisma Studio GUI
```

---

## 환경 변수

```
DATABASE_URL                  # PostgreSQL 연결 문자열 (Supabase)
NEXTAUTH_SECRET               # NextAuth 시크릿
NEXTAUTH_URL                  # 앱 URL (예: http://localhost:3000)
NEXT_PUBLIC_ALCHEMY_RPC_URL   # Alchemy RPC (Base, 없으면 mainnet.base.org 폴백)
```

---

## 현재 구현 상태

| 항목 | 상태 |
|------|------|
| 전체 레이아웃 구조 | ✅ 완료 |
| 랜딩 페이지 | ✅ 완료 |
| 풀 상세 페이지 | ✅ 완료 |
| 온보딩 4단계 페이지 | ✅ 구조 완료 |
| 대시보드 페이지 | ✅ 구조 완료 (목 데이터) |
| 관리자 패널 | ✅ 구조 완료 |
| ConnectButton (MetaMask) | ✅ 완료 — wagmi v2 연동 |
| 온보딩 Step3 지갑 연결 | ✅ wagmi 실제 연동 완료 |
| 전체 폭 제한 (1280px) | ✅ 완료 |
| 모바일 반응형 | ✅ 완료 (iPhone 17 기준) |
| MCP 환경 | ✅ 정리 완료 (Serena·Tavily 제거) |
| 모두싸인 Step1 연동 | ⏳ Phase 1 예정 |
| ERC-20 컨트랙트 배포 | ⏳ Phase 1 예정 |
| 관리자 승인 버튼 실제 연결 | ✅ 완료 (AdminInvestorTable 클라이언트 컴포넌트) |
| TradingView 차트 위젯 | ✅ 완료 (lightweight-charts v4, PriceChartCard·DashboardChart) |
| 출금 잠금 해제 | ✅ 완료 (WithdrawForm — lockup 날짜 체크 + /api/withdraw/request) |
| 대시보드 실 DB 데이터 연동 | ✅ 완료 (Prisma 조회 + 목 데이터 fallback) |
| 온보딩 초대 토큰 검증 | ✅ 완료 (Step1 서버 컴포넌트에서 searchParams.token 검증) |
| 커스텀 로그인 페이지 | ✅ 완료 (app/auth/login/page.tsx) |
| 404 / 에러 / 로딩 페이지 | ✅ 완료 (not-found, error, global-error, loading) |
| 모두싸인 Step1 연동 | ⏳ Phase 1 예정 (API 키 필요) |
| ERC-20 컨트랙트 배포 | ⏳ Phase 1 예정 (백엔드 작업) |

---

## 기존 TypeScript 에러 (무시)

아래 두 항목은 기존 코드의 pre-existing 에러로 기능에 영향 없음:
- `app/api/admin/update-oracle/route.ts:20` — session possibly null
- `lib/auth.ts:23` — credentials possibly undefined
