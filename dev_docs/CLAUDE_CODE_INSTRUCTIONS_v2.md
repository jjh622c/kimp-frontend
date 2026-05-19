# Claude Code 작업 지시서 v2 — Gate Popup / Onboarding 재설계 / Dashboard 개선
**작성일:** 2026-05-19
**우선순위:** HIGH
**이전 작업:** VAULT-01~06 완료 기준

---

## 세션 시작 시 필독 순서

1. `WORKLOG.md`
2. `dev_docs/PROJECT_SPEC.html`
3. 이 문서

---

## 작업 목록 개요

| ID | 작업 | 파일 |
|---|---|---|
| GATE-10 | 랜딩 Invite Popup | `app/(public)/page.tsx` + 신규 컴포넌트 |
| OB-10 | Onboarding Step 재설계 (4→4, 내용 전면 교체) | `app/(onboarding)/onboarding/` |
| DASH-10 | Dashboard 가운데 정렬 수정 | `app/(protected)/dashboard/page.tsx` |
| DASH-11 | Investment Progress 컴포넌트 (백엔드 연동 대기) | `components/dashboard/InvestmentProgress.tsx` |
| DASH-12 | Withdraw 컴포넌트 — 원화 입력 + 입금계좌 반환 | `components/dashboard/WithdrawForm.tsx` |

---

## GATE-10 — 랜딩 페이지 Invite Popup

### 배경
기존 `/gate` 페이지의 invite code 입력창을 제거하고
랜딩 페이지에서 **스크롤 또는 버튼 클릭 시 팝업으로 대체**한다.

### 트리거 조건 (둘 중 하나)
- 랜딩 페이지에서 CTA 버튼("Start investing →", "View strategy") 클릭 시
- 랜딩 페이지 **첫 화면(hero) 아래로 스크롤** 시 (IntersectionObserver 사용)

### Popup UI 명세

```
┌─────────────────────────────────┐
│                             [×] │
│                                 │
│   🔒                            │
│   This platform is              │
│   invite-only.                  │
│                                 │
│   Enter your invite code to     │
│   access the vault.             │
│                                 │
│   [________________________]    │
│        Invite code              │
│                                 │
│   [  Access Vault →  ]          │
│                                 │
│   Don't have a code?            │
│   contact@[domain].com          │
│                                 │
└─────────────────────────────────┘
```

### 구현 명세

```typescript
// components/landing/InvitePopup.tsx (신규)

// 동작:
// 1. 팝업 열림 → invite code 입력
// 2. [Access Vault →] 클릭 → POST /api/onboarding/verify-invite { code }
// 3. 성공(200) → 세션/쿠키에 저장 → /pool/detail 또는 /onboarding/step1 로 이동
// 4. 실패(401) → 인라인 에러: "Invalid invite code. Please check and try again."
// 5. [×] 또는 backdrop 클릭 → 팝업 닫기

// 스크롤 트리거:
// useEffect에서 IntersectionObserver로 hero section 하단 감지
// hero가 viewport에서 벗어나기 시작하면 팝업 open
// 단, 이미 인증된 세션이 있으면 팝업 표시 안 함

// 스타일:
// backdrop: rgba(0,0,0,0.7) + backdrop-blur
// 모달: max-width 400px, border-radius 14px
// 배경: #0e1425, border: 0.5px solid rgba(255,255,255,0.08)
// 기존 gate.html 디자인 언어 그대로 사용
```

### 관련 파일
- `components/landing/InvitePopup.tsx` 신규
- `app/(public)/page.tsx` — InvitePopup import + 트리거 로직 추가
- `app/api/onboarding/verify-invite/route.ts` — 기존 API 그대로 활용

---

## OB-10 — Onboarding Step 전면 재설계

### 현재 Step 구조 vs 새 구조

| 현재 | 새 구조 |
|---|---|
| Step 1: 계약서 서명 | Step 1: 메타마스크에 토큰 추가 |
| Step 2: 입금 방법 선택 | Step 2: 입금 방법 선택 + 전자서명 |
| Step 3: 지갑 연결 | Step 3: 계좌 입금 (타이머 포함) |
| Step 4: 완료 | Step 4: 완료 (트랜잭션 확인) |

---

### Step 1 — Add Token to MetaMask

**Step progress 표시:** `STEP 01 / 04` / 제목: `Add Token to MetaMask`

**내용:**
투자자가 MetaMask에 우리 토큰을 추가하는 방법을 단계별로 설명하는 가이드.

```
[ 카드 ]
──────────────────────────────────
ADD [TOKEN] TO METAMASK

MetaMask를 열고 아래 순서대로 진행하세요.

① MetaMask 열기 → 하단 [Import Tokens] 탭 클릭
② [Custom Token] 선택
③ 아래 정보를 입력:

  Network         Base (Arbitrum-compatible)
  Token Contract  [CONTRACT_ADDRESS]   [Copy]
  Token Symbol    [TOKEN]
  Decimals        18

④ [Add Custom Token] → [Import Tokens] 확인

──────────────────────────────────
  CONTRACT_ADDRESS 는 env 변수:
  NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
  배포 전까지: "0x0000...0000 (TBD)"
──────────────────────────────────

[ ✓ I've added the token to MetaMask ]  ← 체크박스 (필수)

[ Continue → ]  ← 체크박스 선택 전 disabled
```

**주의:** Contract address는 `process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS`로 읽을 것.
미설정 시 `"Contract address will be provided upon deployment"` 표시.

Copy 버튼: contract address를 클립보드에 복사 + "Copied!" 토스트.

---

### Step 2 — Deposit Method + 전자서명

**Step progress 표시:** `STEP 02 / 04` / 제목: `Choose Deposit Method`

**레이아웃: 2개 방법 선택 카드**

```
┌─────────────────────────────────────────────────────┐
│  DEPOSIT METHOD                                     │
│                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │  💎 Crypto Deposit   │  │  🏦 Bank Transfer    │ │
│  │                      │  │                      │ │
│  │  USDT / ETH          │  │  Korean Won (KRW)    │ │
│  │  Direct on-chain     │  │  Wire transfer       │ │
│  │                      │  │                      │ │
│  │  [Coming Soon]       │  │  [Select →]          │ │
│  │  비활성화             │  │  활성화               │ │
│  └──────────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Crypto Deposit 카드:**
- `opacity: 0.4`, `cursor: not-allowed`
- "Coming soon" 뱃지 표시
- 클릭 불가

**Bank Transfer 선택 시:**

```
1. 선택 카드 파란색 테두리로 활성화
2. 하단에 전자서명 안내 박스 나타남:

┌────────────────────────────────────┐
│  📝 INVESTMENT AGREEMENT           │
│                                    │
│  Bank transfer requires signing    │
│  an investment agreement first.    │
│                                    │
│  [ Sign Agreement → ]              │
│  외부 서명 서비스(모두싸인)로 이동     │
└────────────────────────────────────┘

3. [Sign Agreement →] 클릭 시:
   - 새 탭 또는 팝업으로 모두싸인 URL 오픈
   - 원래 페이지에 대기 화면 표시:

┌────────────────────────────────────┐
│  ⏳ Waiting for signature...       │
│                                    │
│  Please complete the signature in  │
│  the window that just opened.      │
│                                    │
│  [ ✓ I've completed the signature ]│
│  ← 수동 확인 버튼 (웹훅 구현 전)    │
└────────────────────────────────────┘

4. [I've completed the signature] 클릭 → Step 3 진행
```

**구현 노트:**
- 모두싸인 URL은 `process.env.MODU_SIGN_URL` 환경변수로 관리
- 미설정 시 버튼 disabled + "Signature service not configured" 표시
- 실제 웹훅 연동은 NEXT-05 태스크 (추후 구현). 현재는 수동 확인 버튼으로 처리.

---

### Step 3 — Bank Transfer (입금 화면 + 타이머)

**Step progress 표시:** `STEP 03 / 04` / 제목: `Transfer Funds`

**기존 Deposit Funds 화면 구조 유지하되 아래 내용 추가/수정:**

```
[ 카드 1: 입금 정보 ]
──────────────────────────────────
DEPOSIT DETAILS

  Bank           [BANK_NAME env]
  Account No.    [BANK_ACCOUNT env]   [Copy]
  Holder         [BANK_HOLDER env]
  Amount         ₩[투자자 입력 금액]  ← 이전 단계에서 넘어온 금액
  Reference      [레퍼럴 코드]        ← invite code 기반 자동 채움

──────────────────────────────────

[ 카드 2: 레퍼럴 코드 정보 ]  ← 신규 추가
──────────────────────────────────
REFERRAL CODE

  Invited by     [초대자 이름 or 코드]
  Your code      [본인 invite code]

  이 코드를 입금자명 또는 메모란에 함께 기재해주세요.
──────────────────────────────────

[ 카드 3: 타이머 ] ← 신규 추가
──────────────────────────────────
⏱ TRANSFER DEADLINE

  이 화면이 생성된 후 10분 이내에 입금해야 합니다.

  [  07:43  ]   ← 카운트다운 (MM:SS)
  남은 시간: 7분 43초

  만료 시: "Transfer window expired. Please restart the process."
  + [Restart →] 버튼
──────────────────────────────────

[ I've made the transfer → ]
← 클릭 시 DB: DEPOSIT_PENDING 상태로 변경
← 버튼 클릭 후 "Confirming your deposit..." 대기 메시지
← 관리자 승인(DEPOSIT_CONFIRMED) 전까지 Step 4 진행 불가
```

**타이머 구현:**
```typescript
// 10분 = 600초
// Step 3 진입 시각을 sessionStorage에 저장
// 컴포넌트 마운트 시 경과 시간 계산
// useEffect + setInterval(1000ms)로 카운트다운
// 0이 되면 expired 상태 전환

const [secondsLeft, setSecondsLeft] = useState(600)
const [expired, setExpired] = useState(false)

// 만료 시 입금 버튼 disabled + expired UI 표시
```

**레퍼럴 코드:**
- invite link의 token을 DB에서 조회 → 초대자 정보 표시
- `useSession()` 또는 서버 컴포넌트로 invite 정보 읽어올 것
- TODO 주석으로 표시하고 UI만 구현해도 됨

---

### Step 4 — Completion

**Step progress 표시:** `STEP 04 / 04` / 제목: `Investment Confirmed`

**현재 Step 4 에서 제거할 것:**
- "What happens next" 섹션 전체 제거

**유지할 것 + 추가할 것:**

```
[ 완료 아이콘 + 제목 ]
✅ Investment Confirmed

[ 카드 1: 투자 요약 ] ← 수정
──────────────────────────────────
INVESTMENT SUMMARY

  Amount deposited   ₩1,000,000
  Token received     662 [TOKEN]    ← 입금액 ÷ 토큰가격
  Token price        1,511 KRW
  Date               2026-05-19
──────────────────────────────────

[ 카드 2: 트랜잭션 ] ← 신규 추가
──────────────────────────────────
TOKEN ISSUANCE TRANSACTION

  Tx Hash   0x1a2b3c...8f9e   [Copy] [↗ BaseScan]
  Network   Base Mainnet
  Status    ✅ Confirmed
  Block     #12,345,678

  ← TODO: 실제 tx hash는 관리자 mint 후 DB에서 읽어올 것
  ← 미발행 상태라면 "Token issuance pending · Admin will mint within 24h" 표시
──────────────────────────────────

[ Go to Dashboard → ]   ← 메인 CTA, /dashboard 이동
```

---

### Onboarding — Pool Detail 페이지 연동

**파일:** `app/(public)/pool/detail/page.tsx` 및 `components/pool/InvestPanel.tsx`

**현재 동작:** Connect Wallet 버튼 → 지갑 연결만

**변경 동작:**

```
지갑 미연결 상태:
  [Connect Wallet] 버튼 클릭 → 지갑 연결 모달

지갑 연결 완료 상태:
  금액 입력 → [Start Investing →] 버튼 활성화
  버튼 클릭 → 입력 금액을 state/session에 저장 → /onboarding/step1 이동

  금액 sessionStorage 저장 키: 'invest_amount'
  Step 3에서 이 값을 읽어 입금액 자동 채움
```

---

## DASH-10 — Dashboard 가운데 정렬 수정

**파일:** `app/(protected)/dashboard/page.tsx`

**현재 문제:**
```css
/* 현재 */
.wrap { max-width: 1280px; margin: 0 auto; padding: 32px 32px 80px; }
.inner { max-width: 768px; }  /* ← margin: 0 auto 없음 → 왼쪽 정렬 */
```

**수정:**
```css
.inner {
  max-width: 768px;
  margin: 0 auto;  /* ← 추가 */
}
```

Tailwind 기준:
```tsx
// 현재
<div className="max-w-3xl">

// 수정
<div className="max-w-3xl mx-auto">
```

**모바일(390px) 체크리스트:**
- [ ] stat 카드 2열 그리드 유지
- [ ] Investment Progress 세로 스택
- [ ] Withdraw 카드 full-width
- [ ] Invite 섹션 full-width
- [ ] Withdrawal History 테이블 → 모바일 카드 뷰 (기존 AdminInvestorTable 패턴 참고)

---

## DASH-11 — Investment Progress 컴포넌트

**파일:** `components/dashboard/InvestmentProgress.tsx` (신규)

### 목적
온보딩 4단계 진행 상황을 대시보드에서 실시간으로 보여준다.
현재는 UI만 구현. 백엔드 연동은 추후 진행.

### 두 가지 상태 컴포넌트 모두 구현할 것

**① 완료 상태 (ACTIVE 투자자용):**
```tsx
// 모든 단계 체크 완료
const STEPS_COMPLETE = [
  { label: 'Token added to wallet',        done: true  },
  { label: 'Investment agreement signed',  done: true  },
  { label: 'Deposit confirmed',            done: true  },
  { label: 'Token issued',                 done: true  },
  { label: 'Bot profit buyback in progress', done: true },
]
```

**② 진행 중 상태 (온보딩 중인 투자자용):**
```tsx
// 일부만 완료 — 현재 단계 강조
const STEPS_IN_PROGRESS = [
  { label: 'Token added to wallet',        done: true,  active: false },
  { label: 'Investment agreement signed',  done: true,  active: false },
  { label: 'Deposit confirmed',            done: false, active: true  }, // ← 현재 단계
  { label: 'Token issued',                 done: false, active: false },
  { label: 'Bot profit buyback in progress', done: false, active: false },
]
```

**UI 명세:**
```
[ Investment Progress 카드 ]

  ●  Token added to wallet          ✓ (green)
  │
  ●  Agreement signed               ✓ (green)
  │
  ◉  Deposit confirmed              ⏳ Pending admin confirmation  (blue, active)
  │
  ○  Token issued                   (gray, pending)
  │
  ○  Bot profit buyback             (gray, pending)

수직 라인으로 연결. 완료=green, 활성=blue pulse, 대기=gray
```

**컴포넌트 Props:**
```typescript
interface InvestmentProgressProps {
  steps: {
    label: string
    done: boolean
    active?: boolean
    note?: string      // "Pending admin confirmation" 같은 부연 설명
  }[]
}
```

**대시보드 페이지에서 사용:**
```tsx
// 일단 완료 상태로 하드코딩 노출
// TODO: DB에서 user.onboardingStatus 읽어서 동적으로 표시
<InvestmentProgress steps={STEPS_COMPLETE} />
```

---

## DASH-12 — Withdraw 컴포넌트 개선

**파일:** `components/dashboard/WithdrawForm.tsx`

### 변경사항

**① 출금 수량 입력 → 원화(KRW)로 변경**

```
현재: "Amount (TOKEN)" 입력
변경: "Amount (KRW)" 입력

입력 필드:
  label: "Withdrawal Amount"
  placeholder: "0"
  suffix: "KRW"
  helper: "Minimum ₩100,000"

자동 계산 표시:
  입력한 KRW ÷ 현재 토큰가격 = 소각 TOKEN 수량
  예) ₩500,000 ÷ 1,511 KRW = 330.9 TOKEN will be burned
```

**② 입금 계좌로만 반환 안내 추가**

```
[ 카드: Withdrawal Account ]
──────────────────────────────────
RETURN ACCOUNT

  ⚠️  Withdrawals are processed to your
      original deposit account only.

  Account on file   [은행명] ***-****-1234
                    (마스킹 처리, 마지막 4자리만)

  To update your account information,
  contact the operator directly.
──────────────────────────────────
```

**③ Withdraw 버튼 텍스트 변경**

```
현재: "Request Withdrawal"
변경: "Request Withdrawal in KRW"
```

**④ 잠금 상태(Locked) UI — 기존 구현 유지**

180일 미만: 버튼 disabled + "Unlocks in X days" (기존 스펙 그대로)

**컴포넌트 전체 구조:**
```tsx
<WithdrawForm>
  {/* 잠금 상태 배너 (조건부) */}
  {isLocked && <LockupBanner daysRemaining={daysRemaining} />}

  {/* 출금 금액 입력 (KRW) */}
  <AmountInput currency="KRW" />

  {/* 자동 계산: TOKEN 소각 수량 */}
  <BurnEstimate krwAmount={amount} tokenPrice={1511} />

  {/* 반환 계좌 안내 */}
  <ReturnAccountInfo />

  {/* 출금 신청 버튼 */}
  <button disabled={isLocked || !amount}>
    Request Withdrawal in KRW
  </button>
</WithdrawForm>
```

---

## 신규 파일 목록

```
components/landing/InvitePopup.tsx          신규
components/dashboard/InvestmentProgress.tsx 신규
```

---

## 수정 파일 목록

```
app/(public)/page.tsx                       InvitePopup 트리거 추가
app/(public)/pool/detail/page.tsx           InvestPanel 연동 수정
components/pool/InvestPanel.tsx             금액입력→온보딩 이동 로직
app/(onboarding)/onboarding/step1/page.tsx  토큰 추가 가이드로 교체
app/(onboarding)/onboarding/step2/page.tsx  입금방법 선택 + 전자서명으로 교체
app/(onboarding)/onboarding/step3/page.tsx  계좌입금 + 타이머 + 레퍼럴 표시
app/(onboarding)/onboarding/step4/page.tsx  트랜잭션 추가 + What's next 제거
app/(protected)/dashboard/page.tsx          mx-auto + InvestmentProgress 추가
components/dashboard/WithdrawForm.tsx       KRW 입력 + 반환계좌 안내
```

---

## 환경변수 추가 필요

```bash
# .env.example 에 추가
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=   # 토큰 컨트랙트 주소 (Base mainnet)
MODU_SIGN_URL=                        # 모두싸인 서명 URL
```

---

## WORKLOG 업데이트 지시

작업 완료 후 WORKLOG.md에 추가:

```markdown
## v1.3 — Gate Popup / Onboarding 재설계 / Dashboard 개선 (진행 중)

### Gate & Landing
- [ ] GATE-10  InvitePopup 컴포넌트 신규 (스크롤/버튼 트리거)

### Onboarding
- [ ] OB-10a   Step1 — 토큰 추가 가이드 (MetaMask)
- [ ] OB-10b   Step2 — 입금방법 선택 + 전자서명 대기화면
- [ ] OB-10c   Step3 — 계좌입금 + 10분 타이머 + 레퍼럴코드 표시
- [ ] OB-10d   Step4 — 트랜잭션 카드 추가 + What's next 제거
- [ ] OB-10e   InvestPanel — 금액입력 후 온보딩 이동 연동

### Dashboard
- [ ] DASH-10  Dashboard 가운데 정렬 (mx-auto)
- [ ] DASH-10m Dashboard 모바일 390px 테스트
- [ ] DASH-11  InvestmentProgress 컴포넌트 신규 (완료/진행중 두 상태)
- [ ] DASH-12  WithdrawForm — KRW 입력 + 반환계좌 안내

### 환경변수
- [ ] ENV-01   .env.example에 TOKEN_CONTRACT_ADDRESS, MODU_SIGN_URL 추가
```

---

## 완료 기준 체크리스트

**Gate Popup**
- [ ] 랜딩 스크롤 시 팝업 자동 등장
- [ ] CTA 버튼 클릭 시 팝업 등장
- [ ] 코드 입력 → 검증 → 성공 시 pool/detail 이동
- [ ] 실패 시 인라인 에러 메시지

**Onboarding**
- [ ] Step 1: MetaMask 토큰 추가 가이드 + 체크박스 확인 전 disabled
- [ ] Step 2: Crypto(비활성) / Bank Transfer(활성) 선택 카드
- [ ] Step 2: Bank Transfer 선택 → 전자서명 안내 → 대기화면 → 수동 확인
- [ ] Step 3: 계좌정보 + 레퍼럴 코드 + 10분 타이머
- [ ] Step 3: 만료 시 expired UI + Restart 버튼
- [ ] Step 4: 트랜잭션 카드 + "What happens next" 제거
- [ ] Step 4: Go to Dashboard 버튼

**Dashboard**
- [ ] 콘텐츠 가운데 정렬 (mx-auto)
- [ ] 390px 모바일 레이아웃 이상 없음
- [ ] InvestmentProgress — 완료 상태 표시
- [ ] InvestmentProgress — 진행 중 상태 표시 (별도 확인)
- [ ] WithdrawForm — KRW 단위 입력
- [ ] WithdrawForm — TOKEN 소각 수량 자동 계산
- [ ] WithdrawForm — 반환계좌 안내 박스

---

*지시서 끝. GATE-10 → OB-10a~e → DASH-10~12 순서로 진행.*
