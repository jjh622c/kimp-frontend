# KiMP 플랫폼 — 콘텐츠 최종 확정 사양서 v2
**작성일:** 2026-05-19
**변경사항:** 수익률 수치 전면 업데이트, 2025 데이터 제외, 연단위 통계로 간소화

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

## 1. 수익률 데이터 확정

### 사용 데이터 범위
```
2021 (4~12월, 9개월)  +44.8%   Modified Dietz · 봇 운용 첫 해
2022 (1~9월,  9개월)  +42.5%   Modified Dietz · 루나 크래시 포함
2022 (10~12월)        -4.97%   공식 정산 · FTX 붕괴 하락장
2023 (전체)           +22.70%  공식 정산
2024 (전체)           +28.90%  공식 정산
2025                  제외      버그로 인한 비정상 운용
2026 (V3)             진행 중   데이터 누적 중
```

### 핵심 통계
```
Historical APY   +42.3%   복리 연평균 · 2021.04~2024.12
총 누적 수익률   +210%    3.75년 합산
Current APY      —        Accumulating · Since Mar 2026
Win Rate         60.0%    15 / 25 periods (2025 제외)
최대 수익        +44.8%   2021년 (9개월)
최대 손실        -5.19%   2026-01
```

### 연도별 표시 (Monthly Returns → Annual Returns로 간소화)
```
2021   +44.8%   Apr–Dec · Bot launch year
2022   +32.8%   Jan–Sep combined, -4.97% Q4
2023   +22.7%   Full year
2024   +28.9%   Full year
2025   —        Excluded · operational issues
2026   —        V3 · Accumulating
```

---

## 2. 투자 조건

| 항목 | 확정값 |
|---|---|
| 최소 투자금액 | ₩10,000,000 |
| 최소 출금금액 | ₩5,000 |
| 락업 기간 | Short / Standard / Extended (단위 미정) |
| 락업 수수료 | 환경변수 관리 — 미정 기간 `—%` 표시 |
| 바이백 방식 | Bot profits → periodic buyback (비율 미정) |
| 체인 | Base Mainnet (Chain ID: 8453) |
| 토큰 규격 | ERC-20 |
| 지갑 | MetaMask |
| 입금 처리 시간 | 24h on business days |
| 입금 타이머 | 10분 (600초) |

---

## 3. 입금 계좌

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

## 4. 환경변수 전체 목록

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
NEXT_PUBLIC_HISTORICAL_APY=42.3
NEXT_PUBLIC_CURRENT_APY=            # V3 데이터 누적 후
NEXT_PUBLIC_TOKEN_PRICE=            # 배포 후 오라클 연동
```

---

## 5. Landing 페이지

### Hero

```
badge:    "Private arbitrage protocol · Invite only"
타이틀:   "Algorithmic yield, precisely automated."
서브:     "Korea premium arbitrage bot.
           Auditable on-chain. Private access only."
버튼1:    "Start investing →"   (→ Invite Popup)
버튼2:    "View strategy"       (→ Invite Popup)
```

### Hero Stat Bar

```
5yr+              —                   1,800d+
Since Apr 2021    Current APY         Days operated
Track record      Accumulating        Consecutive
```

### How It Works

```
01 · Deposit
"Send Korean Won via wire transfer to our
 KBank account. Minimum ₩10,000,000.
 Confirmed within 24 hours on business days."

02 · Token issuance
"Admin mints proportional tokens to your
 wallet after deposit is confirmed.
 Token price rises as bot profits are used
 for periodic buybacks and burns."

03 · Profit distribution
"Arbitrage bot profits are periodically used
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

## 6. Vault Detail 페이지

### Stat 카드 4개

| 카드 | 값 | 서브텍스트 |
|---|---|---|
| 30D Return | — | Accumulating · V3 |
| Historical APY | +42.3% | Compound annual · 2021–2024 |
| Win Rate | 60.0% | 15 / 25 periods |
| Token Price | TBD | Oracle · live |

### Performance 섹션 — Annual Returns (간소화)

기존 정산 단위 30개 행 → 연도별 5행으로 교체:

```
Year    Return    Note
2021    +44.8%    Apr–Dec · Bot launch year
2022    +32.8%    Jan–Dec · Luna crash + FTX included
2023    +22.7%    Full year
2024    +28.9%    Full year
2025    —         Excluded · operational issues
2026    —         V3 · Accumulating since Mar 2026
```

### Performance 하단 통계

```
Cumulative (2021–2024)   +210%
Historical APY           +42.3% compound annual
Win Rate                 60.0% · 15/25 periods
Best year                2021 +44.8%
Worst period             2022 Q4 -4.97%
```

### Dual APY 표시

```
Historical APY          Current APY (V3)
+42.3%                  —
Compound annual         Accumulating
2021–2024               Since Mar 2026
```

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

## 7. Onboarding

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
```

### Step 2 — Deposit Method + Lockup

```
sublabel: "STEP 02 / 04"
제목:     "Choose Deposit Method & Lockup"

방법 선택:
  💎 Crypto Deposit  USDT / ETH       [Coming soon · 비활성]
  🏦 Bank Transfer   Korean Won (KRW) [활성]

락업 선택 (Bank Transfer 선택 시 표시):
  Short      —%
  Standard   —%
  Extended   —%
  안내: "Fee structure will be announced at launch."

전자서명:
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
  "⏱ Transfer Deadline"
  MM:SS 카운트다운 (10:00 → 00:00)
  "Transfer must be completed within 10 minutes."
  만료: "Transfer window expired.
         Please restart the onboarding process."
         + [Restart →] 버튼

완료 버튼: "I've made the transfer →"
```

### Step 4 — Transfer Submitted

```
제목:  "Transfer Submitted"
설명:  "Admin will verify your transfer within
        24 hours on business days.
        Check your dashboard for status updates."

상태:  ⏳ Pending confirmation
버튼:  "Go to Dashboard →"
하단:  "You can close this page and
        check your dashboard later."

제거:  "What happens next" 섹션 없음
```

---

## 8. Dashboard

### Investment Progress

```
1. Token added to wallet
2. Investment agreement signed
3. Deposit confirmed
4. Token issued
5. Bot profit buyback in progress
```

### Withdraw (한국어 병기)

```
제목:  "Withdrawal Request · 출금 신청"

Return Account · 반환 계좌
  Bank      KBank (케이뱅크)
  Account   ***-***-[끝 4자리]
  Holder    이정민 (Lee Jeong-min)
  안내:     "Withdrawals are processed to your
             original deposit account only."
             "출금은 최초 입금하신 계좌로만 처리됩니다."

Amount (KRW) · 출금 금액
  Minimum ₩5,000 · 최소 출금금액 ₩5,000

락업:  "Withdrawal available after lockup period ends."
       "락업 기간 종료 후 출금 가능합니다."

버튼:  "Request Withdrawal in KRW"
하단:  "출금 신청 후 영업일 기준 24시간 이내 처리됩니다."
```

### Invite

```
제목:  "Your invite link"
설명:  "Share your personal invite link with
        someone you trust. They'll get the same
        access you have."
```

---

## 9. 수정 파일 목록 (클로드 코드 작업 순서)

### 즉시 적용
- [ ] CONTENT-01  Hero stat bar: `5yr+` / `—` / `1,800d+`
- [ ] CONTENT-02  Vault stat 카드 4개 수치 교체 (Historical APY +42.3%)
- [ ] CONTENT-03  Monthly Returns → Annual Returns 5행으로 교체
- [ ] CONTENT-04  Performance 하단 통계 업데이트
- [ ] CONTENT-05  Dual APY 섹션 추가
- [ ] CONTENT-06  How it works 3개 카드 문구 교체
- [ ] CONTENT-07  Invite Popup 문구 교체
- [ ] CONTENT-08  Risk Notice 3줄로 교체
- [ ] CONTENT-09  Onboarding Step 1~4 텍스트 전체 교체
- [ ] CONTENT-10  Dashboard Withdraw 한국어 병기 추가
- [ ] CONTENT-11  Dashboard Invite 설명 문구 교체
- [ ] CONTENT-12  최소 투자 ₩10,000,000 전체 반영
- [ ] CONTENT-13  최소 출금 ₩5,000 반영
- [ ] CONTENT-14  입금 계좌 env 변수 반영

### 구조 추가
- [ ] CONTENT-15  Step 2 락업 선택 UI (Short/Standard/Extended)
- [ ] CONTENT-16  .env.example 전체 업데이트

### 보류
- [ ] CONTENT-A   프로젝트명/토큰명 확정 후 일괄 교체
- [ ] CONTENT-B   토큰 컨트랙트 주소 (배포 후)
- [ ] CONTENT-C   토큰 가격 (oracle 연동 후)
- [ ] CONTENT-D   락업 기간 단위/수수료 (확정 후)
- [ ] CONTENT-E   도메인/이메일 (확정 후)
- [ ] CONTENT-F   Current APY (V3 데이터 6개월 이상 누적 후)

---

## 10. 미확정 항목 처리 원칙

| 항목 | 미정 기간 표시 | 확정 후 |
|---|---|---|
| 토큰 심볼 | `TOKEN` | env 교체 |
| 컨트랙트 주소 | `"TBD — provided at launch"` | env 교체 |
| 토큰 초기가 | `"TBD upon launch"` | env 교체 |
| 토큰 현재가 | `"TBD"` | oracle 연동 |
| Current APY | `—` + `"Accumulating"` | V3 6개월 후 |
| 락업 기간 단위 | `Short / Standard / Extended` | env 교체 |
| 수수료 | `—%` | env 교체 |
| 연락처 | `"contact the operator directly"` | env 교체 |
| 모두싸인 URL | 버튼 비활성 | env 교체 |

---

*문서 끝. WORKLOG → PROJECT_SPEC → INSTRUCTIONS_v2 → 이 문서 순서로 읽고 CONTENT-01부터 작업.*
