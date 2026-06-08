# 계약서 v3 용어 정합 수정 지침서

> 세션 시작 시: `CLAUDE.md` → `dev_docs/PROJECT_SPEC.html` → **이 파일** 순으로 읽고 작업을 이어간다.
> 작업 완료 시 `[ ]` → `[x]` 로 변경.
> 작업 완료 후 `dev_docs/WORKLOG.md` 및 `dev_docs/PROJECT_SPEC.html` changelog 반드시 업데이트.

## 작업 배경

계약서 v3 기반 UI 정합 작업(CONTRACT_ALIGN_v1) 완료 후 preview 파일 검토 결과,
**바이백/소각(buyback & burn) 관련 잘못된 용어가 3개 파일에 잔존**함.

계약서 v3 수익 구조: 봇 수익 → 전체 운용자산(AUM) 증가 → 오라클이 토큰 가격 상향 반영
→ **바이백(buyback) 없음, 소각(burn) 없음**. 토큰 가격이 오르는 것이 수익 배분 방식.

## 작업 규칙

- 수정은 Next.js 컴포넌트 파일 기준으로 진행, preview HTML은 최후에 동기화
- 텍스트 교체 시 반드시 아래 표의 `Before / After` 그대로 사용
- 완료 후 모바일(390px) 포함 브라우저 테스트

---

## v2.0 — 바이백/소각 용어 제거 및 계약서 정합 (2026.06.08)

> 참조: `익명조합_투자계약서_v3` 제3조·제5조·제6조·제8조 — 우선순위: 🔴 필수 → 🟡 중요

### Phase 1 — 랜딩 페이지 How It Works 전면 수정 🔴 최우선

> 현재 Section 02, 03 모두 계약에 없는 바이백/소각 구조를 설명하고 있음.
> 투자자가 가장 먼저 보는 텍스트이므로 최우선 수정 필요.

- [x] **TERM-01** `components/landing/HowItWorksSection.tsx` — Section 02 설명 교체

  | | 내용 |
  |---|---|
  | **Before (제목)** | Receive ERC-20 tokens |
  | **After (제목)** | Receive ERC-20 tokens |
  | **Before (설명)** | Admin mints proportional tokens to your wallet after deposit is confirmed. Token price rises as bot profits are used for periodic buybacks and burns. |
  | **After (설명)** | Admin issues proportional tokens to your MetaMask wallet after deposit is confirmed. Token price is calculated as Total AUM ÷ Total Tokens Issued, and rises as the bot generates profit. |

- [x] **TERM-02** `components/landing/HowItWorksSection.tsx` — Section 03 전면 교체

  | | 내용 |
  |---|---|
  | **Before (번호·섹션명)** | 03 · Profit distribution |
  | **After (번호·섹션명)** | 03 · Token price growth |
  | **Before (제목)** | Bot buybacks & burns |
  | **After (제목)** | Oracle price appreciation |
  | **Before (설명)** | Arbitrage bot profits are periodically used to buy back and burn tokens, increasing the price for all holders transparently on-chain. |
  | **After (설명)** | As the arbitrage bot generates profits, total AUM grows. The oracle updates the token price upward, distributing gains to all holders proportionally — no buybacks or burns. |

  > preview/index.html 도 동일하게 수정 필요 (Phase 4 참조)

---

### Phase 2 — 볼트 상세 페이지 Token Details 수정 🔴

> InvestPanel과 Token Details 카드 모두 "Buyback"과 "Exit: Operator buyback" 용어 잔존.
> "Operator buyback"은 특히 오해 소지 큼 — 출금은 토큰 반납 후 오라클 가격 정산임.

- [x] **TERM-03** `components/pool/InvestPanel.tsx` — InvestPanel "Buyback" 행 교체

  | | 내용 |
  |---|---|
  | **Before** | `Buyback \| Bot profits → periodic` |
  | **After** | `Returns \| AUM growth → oracle price ↑` |

- [x] **TERM-04** `components/pool/InvestPanel.tsx` — Token Details 카드 "Buyback" 행 교체

  | | 내용 |
  |---|---|
  | **Before** | `Buyback \| Bot profits → periodic buyback` |
  | **After** | `Returns \| AUM growth → oracle price ↑` |

- [x] **TERM-05** `components/pool/InvestPanel.tsx` — Token Details 카드 "Exit" 행 수정

  | | 내용 |
  |---|---|
  | **Before** | `Exit \| Operator buyback` |
  | **After** | `Exit \| Token redemption · oracle price settlement` |

  > 계약서 제8조 기반: 출금 = 토큰 반납 → 현재 토큰 가격(USD) × USDT/KRW × (1−수수료율) → KRW 지급
  > "Operator buyback"은 오퍼레이터가 자발적으로 사는 개념이라 계약 구조와 다름

---

### Phase 3 — 대시보드 타임라인 용어 수정 🟡

- [x] **TERM-06** `components/dashboard/InvestmentProgress.tsx` — "Token Minted" → "Token Issued"

  | | 내용 |
  |---|---|
  | **Before** | `Token Minted` |
  | **After** | `Token Issued` |

  > 계약서 제4조②: "영업자는 납입 확인 후 … 토큰을 산정하여 투자자 지갑 주소로 **발행·지급**한다"
  > ERC-20 내부 동작은 mint이나 투자자 노출 텍스트는 "Issued(발행)" 가 계약서와 일치
  > `STEPS_COMPLETE` 배열 내 label 값 수정

---

### Phase 4 — Preview HTML 동기화 🟡

> Next.js 컴포넌트 수정 후 preview HTML도 동일하게 반영

- [x] **TERM-07** `preview/index.html` — TERM-01, TERM-02 내용 동기화
  - Section 02 설명: buybacks and burns 제거 → AUM/oracle 설명으로 교체
  - Section 03 제목: "Bot buybacks & burns" → "Oracle price appreciation"
  - Section 03 설명: buyback/burn 전면 교체

- [x] **TERM-08** `preview/vault.html` — TERM-03, TERM-04, TERM-05 내용 동기화
  - InvestPanel Buyback 행 교체
  - Token Details Buyback 행 교체
  - Token Details Exit 행 수정

- [x] **TERM-09** `preview/dashboard.html` — TERM-06 내용 동기화
  - 타임라인 "Token Minted" → "Token Issued"

---

### Phase 5 — 문서 업데이트 🟡

- [x] **TERM-10** `dev_docs/PROJECT_SPEC.html` — changelog v2.0 추가 및 서비스 구조 섹션 반영
  - "수익 배분 구조" 또는 "How It Works" 관련 설명에서 buyback/burn 언급 제거
  - 수익 구조: "봇 수익 → AUM 증가 → 오라클 가격 상승 → 토큰 가격 반영"으로 통일

---

## 참고: 계약서 v3 수익 구조 (수정 텍스트 작성 시 기준)

```
봇 운용 수익 발생
  → 전체 운용자산(AUM) 증가
  → 오라클이 토큰 가격 업데이트 (토큰 가격 = AUM ÷ 총 발행 토큰 수)
  → 모든 토큰 보유자의 평가액 상승

바이백(buyback) 없음
소각(burn) 없음
오라클 가격 업데이트가 곧 수익 배분 메커니즘
```

## 참고: 잔존 "mint" 용어 처리 방침 (이번 수정 범위 외)

| 위치 | 현재 | 처리 |
|------|------|------|
| `preview/admin.html` — "Mint tokens" 버튼 | Admin 전용 액션 | **유지** — 관리자 내부 용어, 투자자 비노출 |
| `app/api/admin/...` 내부 로직 | ERC-20 mint 함수 | **유지** — 기술 용어로 정확함 |
