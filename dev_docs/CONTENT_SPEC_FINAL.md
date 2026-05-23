# KiMP 플랫폼 — 콘텐츠 최종 확정 사양서
**작성일:** 2026-05-19
**상태:** 카테고리 A (프로젝트명/토큰명/컨트랙트/도메인) 보류 외 전항목 확정

---

## 언어 원칙

| 페이지 | 언어 |
|---|---|
| Gate, Landing, Vault | 영문만 |
| Onboarding Step 1~2 | 영문만 |
| Onboarding Step 3 | 영문 + 입금 관련 한국어 병기 |
| Dashboard 전체 | 영문 타이틀 + 돈 관련 한국어 병기 |
| Admin | 영문만 |

---

## 1. 투자 조건

| 항목 | 확정값 |
|---|---|
| 최소 투자금액 | ₩10,000,000 |
| 최소 출금금액 | ₩5,000 |
| 락업 기간 | Short / Standard / Extended (기간 단위 미정) |
| 락업 수수료 | 환경변수 관리 — 미정 기간 `—%` 표시 |
| 바이백 방식 | Bot profits → periodic buyback (비율 미정) |
| 토큰 초기 발행가 | TBD |
| 체인 | Base Mainnet (확정) |
| 토큰 규격 | ERC-20 (Base 기준) |
| 지갑 | MetaMask |
| 입금 처리 시간 | 24h on business days |
| 입금 타이머 | 10분 (600초) |

---

## 2. 입금 계좌

```
BANK_NAME=케이뱅크
BANK_ACCOUNT=100117130167
BANK_HOLDER=이정민
```

표시 형식:
```
Bank      KBank (케이뱅크)
Account   100-117-130167   [Copy]
Holder    이정민 (Lee Jeong-min)
```

---

## 3. 환경변수 전체 목록

```bash
# ── 프로젝트 (보류) ──
NEXT_PUBLIC_APP_NAME=KiMP
NEXT_PUBLIC_TOKEN_SYMBOL=           # 미정
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS= # 배포 후
NEXT_PUBLIC_CHAIN=base

# ── 연락처 ──
CONTACT_EMAIL=                      # 도메인 확정 후

# ── 입금 계좌 ──
BANK_NAME=케이뱅크
BANK_ACCOUNT=100117130167
BANK_HOLDER=이정민

# ── 투자 조건 ──
MIN_INVESTMENT=10000000
MIN_WITHDRAWAL=5000

# ── 락업 (미정) ──
LOCK_SHORT_LABEL=Short
LOCK_MID_LABEL=Standard
LOCK_LONG_LABEL=Extended
FEE_SHORT=                          # 미정
FEE_MID=                            # 미정
FEE_LONG=                           # 미정

# ── 외부 서비스 ──
MODU_SIGN_URL=                      # 모두싸인

# ── 통계 ──
NEXT_PUBLIC_CURRENT_APY=28.96
NEXT_PUBLIC_TOKEN_PRICE=            # 배포 후 오라클 연동
```

---

## 4. Landing 페이지

### Hero

```
badge:    "Private arbitrage protocol · Invite only"

타이틀:   "Algorithmic yield,
           precisely automated."

서브:     "Korea premium arbitrage bot.
           Auditable on-chain. Private access only."

버튼1:    "Start investing →"   (→ Invite Popup)
버튼2:    "View strategy"       (→ Invite Popup)
```

### Hero Stat Bar

```
5yr+              28.96%          1,800일+
Since Apr 2021    Current APY     Days operated
Track record      Annualized      Consecutive
```

근거:
- `5yr+` : 2021.04 봇 운용 시작
- `28.96%` : V3 2026-04-10~04-24 연환산수익률
- `1,800일+` : 2021.04~2026.05 약 1,857일

### How It Works

```
01 · Deposit
제목: "KRW bank transfer"
내용: "Send Korean Won via wire transfer to our
      KBank account. Minimum ₩10,000,000.
      Confirmed within 24 hours on business days."

02 · Token issuance
제목: "Receive tokens on-chain"
내용: "Admin mints proportional tokens to your
      wallet after deposit is confirmed.
      Token price rises as bot profits are used
      for periodic buybacks and burns."

03 · Profit distribution
제목: "Bot buybacks & burns"
내용: "Arbitrage bot profits are periodically used
      to buy back and burn tokens, increasing the
      price for all holders transparently on-chain."
```

### Risk Notice

```
"This platform is available to invited investors only.
 Investing involves risk of capital loss.
 This is not a public offering or financial advice."
```

### Invite Popup

```
제목:        "Welcome"
placeholder: "Enter your invite code"
힌트:        "You received this code from your contact.
              This platform is available to invited
              investors only."
버튼:        "Access Vault →"
에러:        "Invalid invite code. Please check and try again."
```

---

## 5. Vault Detail 페이지

### Stat 카드 4개

| 카드 | 값 | 서브텍스트 |
|---|---|---|
| 30D Return | +2.10% | Last 30 days · V3 |
| Current APY | 28.96% | Annualized · V3 |
| Win Rate | 60.7% | 17 / 28 periods |
| Token Price | TBD | Oracle · live |

### Token Details 카드

```
Standard      ERC-20 (Base Mainnet)
Initial price TBD upon launch
Current price TBD — Oracle live
Issuance      On deposit confirmation
Lock-up       Short / Standard / Extended
Buyback       Bot profits → periodic buyback
Exit          Operator buyback
Chain         Base Mainnet (Chain ID: 8453)
```

---

## 6. Onboarding

### Step 1 — Add Token to MetaMask

```
sublabel: "STEP 01 / 04"
제목:     "Add Token to MetaMask"
설명:     "Follow the steps below to add the token
           to MetaMask on Base Mainnet."

가이드:
① Open MetaMask → select "Base Mainnet" network
  (Add Base network if not listed)
② Tap the [Tokens] tab → [Import tokens]
③ Select [Custom token] and enter:

  Network         Base Mainnet (Chain ID: 8453)
  Token Contract  [TBD — provided at launch]   [Copy]
  Token Symbol    [TBD]
  Decimals        18

④ Tap [Add custom token] → [Import tokens] to confirm

amber note:
"Contract address will be provided upon deployment.
 You can skip this step and complete it later
 from your dashboard."

체크박스: "I've added the token to MetaMask"
버튼:     "Continue →"  (체크 전 disabled)
DEV skip: 유지
```

### Step 2 — Deposit Method + Lockup

```
sublabel:  "STEP 02 / 04"
제목:      "Choose Deposit Method & Lockup"

방법 선택:
  💎 Crypto Deposit  — USDT / ETH  [Coming soon · 비활성]
  🏦 Bank Transfer   — Korean Won (KRW)  [활성]

락업 선택 (Bank Transfer 선택 시 표시):
  Short      —%
  Standard   —%
  Extended   —%
  하단 안내: "Fee structure will be announced at launch."

전자서명:
  제목:   "Investment Agreement"
  설명:   "Bank transfer requires signing an
           investment agreement first."
  미연동: "Please contact the operator directly to proceed."
  연동후: "Sign Agreement →" 버튼 활성화
  대기:   "Please complete the signature in the
           window that just opened."
  완료:   "✓ I've completed the signature"
```

### Step 3 — Transfer Funds

```
sublabel: "STEP 03 / 04"
제목:     "Transfer Funds"

계좌 정보 (한국어 병기):
  Bank      KBank (케이뱅크)
  Account   100-117-130167   [Copy]
  Holder    이정민 (Lee Jeong-min)
  Amount    ₩[투자자 입력 금액]
  Reference [invite code 기반 자동 생성]

레퍼런스 안내 (한국어 병기):
  "Include the Reference code in the transfer memo.
   (이체 메모란에 Reference 코드를 입력해 주세요.)"

타이머:
  label:   "⏱ Transfer Deadline"
  display: MM:SS 카운트다운 (10:00 → 00:00)
  안내:    "Transfer must be completed within
            10 minutes of this screen loading."
  만료:    "Transfer window expired.
            Please restart the onboarding process."
            + [Restart →] 버튼

완료 버튼: "I've made the transfer →"
           클릭 시 DB: DEPOSIT_PENDING
           이후 대기: "Confirming your deposit..."
```

### Step 4 — Transfer Submitted

```
sublabel: "STEP 04 / 04"
아이콘:   ✅ (green)
제목:     "Transfer Submitted"
설명:     "Admin will verify your transfer within
           24 hours on business days.
           Check your dashboard for status updates."

상태 카드:
  Status     ⏳ Pending confirmation
  Reference  [코드]
  Amount     ₩[금액]
  Submitted  [날짜]

버튼:  "Go to Dashboard →"
하단:  "You can close this page and
        check your dashboard later."

제거:  "What happens next" 섹션 없음
```

---

## 7. Dashboard

### Investment Progress 단계 라벨

```
1. Token added to wallet
2. Investment agreement signed
3. Deposit confirmed
4. Token issued
5. Bot profit buyback in progress
```

완료 상태: green ✓
진행 상태: blue pulse + note
대기 상태: gray ○

### Withdraw 섹션 (한국어 병기)

```
제목:  "Withdrawal Request"
       출금 신청

Return Account · 반환 계좌
  Bank      KBank (케이뱅크)
  Account   ***-***-[끝 4자리]   (마스킹)
  Holder    이정민 (Lee Jeong-min)
  안내:     "Withdrawals are processed to your
             original deposit account only."
             "출금은 최초 입금하신 계좌로만 처리됩니다."
  변경안내:  "To update your account, contact the operator."

Amount (KRW) · 출금 금액
  Minimum ₩5,000 · 최소 출금금액 ₩5,000

락업 안내:
  "Withdrawal available after lockup period ends."
  "락업 기간 종료 후 출금 가능합니다."
  만료일: "Unlocks [날짜]"

버튼:  "Request Withdrawal in KRW"
하단:  "출금 신청 후 영업일 기준 24시간 이내 처리됩니다."
```

### Invite 섹션

```
제목:  "Your invite link"
설명:  "Share your personal invite link with
        someone you trust. They'll get the same
        access you have."
버튼:  "Regenerate link"
Copy:  "Copy"  →  "Copied ✓"
```

---

## 8. 미확정 항목 처리 원칙

| 항목 | 미정 기간 표시 | 확정 후 |
|---|---|---|
| 토큰 심볼 | `TOKEN` | env 교체 |
| 컨트랙트 주소 | `"TBD — provided at launch"` | env 교체 |
| 토큰 초기가 | `"TBD upon launch"` | env 교체 |
| 토큰 현재가 | `"TBD"` | oracle 연동 |
| 락업 기간 단위 | `Short / Standard / Extended` | env 교체 |
| 수수료 | `—%` | env 교체 |
| 연락처 이메일 | `"contact the operator directly"` | env 교체 |
| 모두싸인 URL | 버튼 비활성 | env 교체 |

---

## 9. 클로드 코드 작업 순서

### 즉시 적용
- [x] CONTENT-01  Landing Hero stat bar 수치 교체
- [x] CONTENT-02  Vault stat 카드 `Current APY 28.96%` 교체
- [x] CONTENT-03  How it works 3개 카드 문구 교체
- [x] CONTENT-04  Invite Popup 문구 교체
- [x] CONTENT-05  Risk Notice 3줄로 교체
- [x] CONTENT-06  Onboarding Step 1~4 텍스트 전체 교체
- [x] CONTENT-07  Dashboard Withdraw 한국어 병기 추가
- [x] CONTENT-08  Dashboard Invite 설명 문구 교체
- [x] CONTENT-09  최소 투자 ₩10,000,000 전체 반영
- [x] CONTENT-10  최소 출금 ₩5,000 반영
- [x] CONTENT-11  입금 계좌 env 변수 반영

### 구조 추가
- [x] CONTENT-12  Step 2 락업 선택 UI (Short/Standard/Extended)
- [x] CONTENT-13  .env.example 전체 업데이트

### 보류
- [ ] CONTENT-A   프로젝트명/토큰명 확정 후 일괄 교체
- [ ] CONTENT-B   토큰 컨트랙트 주소 (배포 후)
- [ ] CONTENT-C   토큰 가격 (oracle 연동 후)
- [ ] CONTENT-D   락업 기간 단위/수수료 (확정 후)
- [ ] CONTENT-E   도메인/이메일 (확정 후)
- [ ] CONTENT-F   모두싸인 URL (서비스 가입 후)

---

*문서 끝. WORKLOG → PROJECT_SPEC → INSTRUCTIONS_v2 → 이 문서 순서로 읽고 CONTENT-01부터 작업.*
