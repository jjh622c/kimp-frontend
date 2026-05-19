# kimp-frontend 개선 사양서 v1.1
**작성일:** 2026-05-18  
**전달 대상:** Claude Code  
**기준 파일:** `dev_docs/PROJECT_SPEC.html`, `WORKLOG.md`  
**현재 완료 버전:** v1.0

---

## 이 문서 사용법

새 세션 시작 시 이 순서로 읽을 것:
1. `WORKLOG.md`
2. `dev_docs/PROJECT_SPEC.html`
3. 이 문서 (개선 사항 및 신규 스펙)

---

## 배경 및 컨텍스트

이 플랫폼은 김치 프리미엄 차익거래 자동화 봇(V3)의 수익을 토큰화하여, 사전 합의된 소수 지인에게 투자 참여 기회를 제공하는 **프라이빗 투자 플랫폼**이다. DeFi 프로토콜 UI/UX를 차용하되 실제로는 프라이빗 투자 구조.

- 투자자: 사전 합의된 소수 지인 (초대 링크 방식, 15~20명 이하 목표)
- 언어: 영문 베이스
- 스택: Next.js + TypeScript + Tailwind CSS + shadcn/ui + Prisma

---

## 1. UX 흐름 재설계 (구조 변경)

### 1-1. Invite Code 입력창 제거

**현재 문제:**
- `onboarding/step1` 화면 안에 invite code 입력 필드가 있음
- 초대 링크 없는 사람도 step1 URL에 직접 접근 가능 → 게이팅 실패

**변경 사항:**
- Step 1에서 invite code 입력 UI 완전 제거
- 초대 링크 자체에 토큰 포함: `https://domain.com/?invite=TOKEN`
- 서버에서 토큰 유효성 검증 후 세션/쿠키에 저장
- 유효한 토큰 없이 접근 시 `/gate` 페이지로 리다이렉트

**Gate 페이지 신규 제작 (`app/(public)/gate/page.tsx`):**
```
검은 배경 / 중앙 정렬
로고
"This platform is available by invitation only."
"If you received an invitation link, please use that link to access."
이메일 문의 링크 하나만 표시
```

**접근 제어 매트릭스:**

| 페이지 | 조건 | 미충족 시 |
|---|---|---|
| `/` Landing | 유효한 invite 토큰 (세션) | `/gate` 리다이렉트 |
| `/onboarding/step1` | invite 토큰 보유 | `/gate` 리다이렉트 |
| `/onboarding/step2` | DB 상태: CONTRACT_SIGNED | step1 강제 이동 |
| `/onboarding/step3` | DB 상태: DEPOSIT_CONFIRMED (관리자 승인) | step2 대기 화면 유지 |
| `/onboarding/step4` | DB 상태: WALLET_CONNECTED | step3 강제 이동 |
| `/dashboard` | DB 상태: ACTIVE | 해당 onboarding 단계로 |
| `/admin` | 관리자 세션 | 401 |

**관련 파일:**
- `app/(public)/gate/page.tsx` 신규 생성
- `app/(public)/page.tsx` — invite 토큰 검증 미들웨어 추가
- `middleware.ts` — 전체 라우트 보호 로직 추가
- `app/api/onboarding/verify-invite/route.ts` — 기존 로직을 URL 파라미터 기반으로 수정

---

### 1-2. Onboarding Step 2 대기 상태 UI 추가

**현재 문제:**
- "I've completed the transfer →" 버튼 클릭 시 즉시 step3 이동
- 실제로는 관리자 승인 후에만 step3가 열려야 함

**변경 사항:**

버튼 클릭 후 상태 전환:
```
[입금 완료 알림 →] 클릭
→ DB: InvestmentStatus = DEPOSIT_PENDING
→ 버튼 비활성화
→ 대기 화면 표시:
   "Deposit confirmation in progress."
   "Admin will verify your transfer within 24 hours on business days."
   "You'll receive a notification once confirmed."
   [마지막 제출 시간 표시]
```

관리자가 승인하면 → DB: DEPOSIT_CONFIRMED → 투자자 step3 접근 가능 (폴링 or 이메일 알림)

**관련 파일:**
- `app/(onboarding)/onboarding/step2/page.tsx`
- `app/api/onboarding/notify-deposit/route.ts` 신규 (입금 알림 트리거)

---

## 2. Landing 페이지 개선

**파일:** `components/landing/HeroSection.tsx`

### 2-1. Hero 섹션 실적 stat 3개 추가

현재 Hero는 카피 + CTA만 있음. 아래 stat 3개를 Hero 하단에 추가:

```
운용 기간     누적 수익률    현재 시드
 5년+          +275%         ₩3B+
Since 2021   V1 Cumulative  Active capital
```

수치 하드코딩으로 먼저 구현. 나중에 env 변수화.

**⚠️ 데이터 주의사항 (나중에 반영 필요):**
실제 V1 월별 수익률 raw 데이터가 현재 세션에 없음. 운영자가 다음 작업 시 아래 파일을 제공해야 함:
- V1 실제 정산 내역 엑셀/CSV (2021~2024 월별)
- 제공 시 누적 수익률, CAGR, Win Rate 재계산하여 수치 업데이트

현재 확인된 수치:
- 2023년: +22.70%
- 2024년: +28.90%
- V3 1월차: +10%, 2월차: +2%

---

## 3. Vault Detail 페이지 개선

**파일:** `app/(public)/pool/detail/page.tsx`

### 3-1. Monthly Returns 데이터 보강

현재 Jan/Feb 2025 두 달만 표시됨. 신뢰도가 오히려 낮아 보임.

**변경 방향:**
- 최소 12개월 이상 표시 (V3 운용 시작 이후 + V1 대표 실적 일부)
- 수익이 낮거나 마이너스인 달도 포함 (완벽한 그린만 있으면 의심받음)
- 컬럼 추가: Month / Return / Token Price / Note

**⚠️ 데이터 주의사항:**
위와 동일. V1 정산 파일 제공 후 데이터 채울 것. 그 전까지는 placeholder 처리.

### 3-2. SVG 차트 엔드포인트 수정

```svg
<!-- 현재 (잘림) -->
<circle cx="600" cy="0" r="4" fill="#3d8ef8"/>
<circle cx="600" cy="0" r="8" fill="rgba(61,142,248,0.2)"/>

<!-- 수정 -->
<circle cx="596" cy="6" r="4" fill="#3d8ef8"/>
<circle cx="596" cy="6" r="8" fill="rgba(61,142,248,0.2)"/>
```

차트 라인 엔드포인트도 동일하게 cy 값 조정하여 뷰박스 안에 들어오도록.

---

## 4. Dashboard 개선

**파일:** `app/(protected)/dashboard/page.tsx`

### 4-1. Withdraw 락업 상태 UI 추가

현재 "Unlocked" 상태만 구현됨. Locked 상태 UI 추가 필요.

**Locked 상태 (180일 미만):**
```
[출금 신청] 버튼 → disabled 처리
버튼 위에:
"Locked · Unlocks in X days"
"Investment date: [날짜] · Unlock date: [날짜]"
배경: amber 계열 notice box
```

**Unlocked 상태 (현재 구현):**
```
녹색 notice + 버튼 활성화 (현재 그대로 유지)
```

**계산 로직:**
```typescript
const investmentDate = new Date(user.investmentDate);
const unlockDate = new Date(investmentDate.getTime() + 180 * 24 * 60 * 60 * 1000);
const isLocked = new Date() < unlockDate;
const daysRemaining = Math.ceil((unlockDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
```

### 4-2. Invite 섹션 추가 (레퍼럴 시스템)

아래 5번 레퍼럴 시스템 스펙 참조. Withdraw 카드 하단에 별도 카드로 추가.

---

## 5. 레퍼럴 시스템 신규 구현

### 5-1. 구조 개요

```
Admin (운영자)
  ↓ 직접 발급 (depth: 0)
1단계 투자자 (최측근)
  ↓ 대시보드에서 본인 링크 생성 가능 (depth: 1)
2단계 투자자 (지인의 지인)
  → 초대 기능 없음 (체인 종료)
```

- 인센티브 없음 (수익 배분 X, 토큰 보너스 X)
- 접근권(invite link) 공유만
- depth 2단계 고정 (Admin 수동 승인으로 예외 부여 가능)
- 총 인원 캡: 추후 결정 (DB에 maxCapacity 필드로 관리)

### 5-2. DB 스키마 변경

기존 `InviteLink` 모델에 필드 추가:

```prisma
model InviteLink {
  id          String    @id @default(cuid())
  token       String    @unique @default(cuid())
  createdById String
  createdBy   User      @relation("CreatedInvites", fields: [createdById], references: [id])
  depth       Int       @default(0)           // 0 = Admin 발급, 1 = 1단계 발급
  usedById    String?
  usedBy      User?     @relation("UsedInvite", fields: [usedById], references: [id])
  usedAt      DateTime?
  expiresAt   DateTime?
  maxUses     Int       @default(1)
  useCount    Int       @default(0)
  createdAt   DateTime  @default(now())
}

model User {
  // 기존 필드 유지하고 아래 추가
  referredById    String?
  referredBy      User?   @relation("Referrals", fields: [referredById], references: [id])
  referrals       User[]  @relation("Referrals")
  referralDepth   Int     @default(0)          // 0=Admin, 1=1단계, 2=2단계
  canInvite       Boolean @default(false)      // Admin이 수동 설정
  createdInvites  InviteLink[] @relation("CreatedInvites")
  usedInvite      InviteLink?  @relation("UsedInvite")
}
```

### 5-3. API 추가

```
POST /api/invite/generate
  - 요청자: canInvite=true 이고 depth < 2인 투자자 or Admin
  - 본인 depth+1 짜리 invite link 생성
  - 반환: { url: "https://domain.com/?invite=TOKEN" }

GET /api/invite/tree
  - Admin 전용
  - 전체 레퍼럴 트리 반환 (시각화용)
```

### 5-4. Dashboard Invite 섹션 UI

`canInvite === true` 인 투자자에게만 표시. `canInvite === false`면 섹션 자체 숨김.

```
[Invite] 카드
─────────────────────────────
INVITE FRIENDS

Your personal invite link
[https://domain.com/?invite=XXXX]  [Copy]

Anyone with this link can join the platform
and complete onboarding to start investing.

Invited (2)
  • Hong Gildong  · Jan 15, 2025  · Active
  • Kim Cheolsu   · Feb 03, 2025  · Pending
─────────────────────────────
```

### 5-5. Admin 패널 추가

기존 AdminInvestorTable 아래에 추가:

```
[Invite Management] 섹션
- 새 invite 링크 생성 (만료일 + 최대 사용 횟수 설정 가능)
- 전체 레퍼럴 트리 시각화 (depth별 들여쓰기)
- 투자자별 canInvite 토글
- 미사용 링크 목록 + 무효화 버튼
```

**관련 파일:**
- `components/admin/AdminInviteSection.tsx` 신규
- `components/dashboard/InviteSection.tsx` 신규
- `app/api/invite/generate/route.ts` 신규
- `app/api/invite/tree/route.ts` 신규
- `prisma/schema.prisma` 수정

---

## 6. Onboarding 모바일 개선

**파일:** `app/(onboarding)/onboarding/` 전체

Step progress indicator가 390px 모바일에서 4개 노드 + 레이블이 겹칠 수 있음.

```typescript
// 모바일에서 레이블 숨김 처리
<span className="hidden sm:block text-[10px] text-white/30">
  {label}
</span>
```

또는 모바일에서 현재 단계만 레이블 표시:
```
○ ─── ● Agreement ─── ○ ─── ○
```

---

## 7. WORKLOG 업데이트 지시

작업 완료 후 `WORKLOG.md`의 다음 작업 섹션을 아래로 교체할 것:

```markdown
## v1.1 — Gate 시스템 + 레퍼럴 + UI 개선 (진행 중)

### Phase 1 — Gate 시스템 (최우선)
- [ ] GATE-01  app/(public)/gate/page.tsx 신규 생성
- [ ] GATE-02  middleware.ts — invite 토큰 기반 라우트 보호
- [ ] GATE-03  onboarding/step1 — invite code 입력 UI 제거
- [ ] GATE-04  api/onboarding/verify-invite — URL 파라미터 방식으로 수정

### Phase 2 — Onboarding 로직 수정
- [ ] OB-01   step2 — 대기 상태 UI 추가 (DEPOSIT_PENDING)
- [ ] OB-02   step2 — 관리자 승인 전 step3 접근 차단

### Phase 3 — UI 개선
- [ ] UI-01   HeroSection — 실적 stat 3개 추가 (하드코딩, 추후 교체)
- [ ] UI-02   Dashboard — Withdraw locked 상태 UI 추가
- [ ] UI-03   Vault Detail — SVG 차트 엔드포인트 cy 값 수정
- [ ] UI-04   Onboarding — 모바일 step indicator 레이블 처리

### Phase 4 — 레퍼럴 시스템
- [ ] REF-01  prisma/schema.prisma — InviteLink, User 모델 수정
- [ ] REF-02  npx prisma db push + generate
- [ ] REF-03  api/invite/generate POST 라우트
- [ ] REF-04  api/invite/tree GET 라우트 (Admin 전용)
- [ ] REF-05  components/dashboard/InviteSection.tsx 신규
- [ ] REF-06  components/admin/AdminInviteSection.tsx 신규
- [ ] REF-07  dashboard/page.tsx — InviteSection 조건부 렌더링 추가

### Phase 5 — 데이터 업데이트 (파일 수령 후)
- [ ] DATA-01  V1 실제 정산 엑셀/CSV 수령 대기 중
             → 수령 시: HeroSection stat 수치 업데이트
             → 수령 시: Vault Monthly Returns 테이블 채우기
             → 수령 시: 누적 수익률, CAGR, Win Rate 재계산
```

---

## 8. 데이터 수령 대기 항목

다음 작업 진행 전 운영자에게 요청해야 할 파일:

**파일명:** V1 실제 정산 내역 (엑셀 or CSV)  
**내용:** 2021~2024 월별 수익률, 시드 규모  
**용도:**
- HeroSection의 "누적 수익률", "운용 기간" 수치 확정
- Vault Detail Monthly Returns 테이블 채우기
- 투자 제안서 데이터와 일치시키기

**현재 확인된 수치 (검증 필요):**
- 2023년 연간: +22.70%
- 2024년 연간: +28.90%
- V3 1월차: +10% (시드 1.7억)
- V3 2월차: +2% (시드 2.5억)
- 최대 월수익: +8.37% / 최대 월손실: -11.83%
- Win Rate: 62% (29기간 중 18기간 수익)

---

## 우선순위 요약

```
🔴 즉시  GATE-01~04  Gate 시스템 (보안 직결)
🔴 즉시  OB-01~02    Step2 대기 상태 (로직 오류)
🟡 다음  UI-01~04    UI 개선 4건
🟡 다음  REF-01~07   레퍼럴 시스템 전체
🟢 대기  DATA-01     파일 수령 후 진행
```

---

*문서 끝. 위 순서대로 작업 진행.*
