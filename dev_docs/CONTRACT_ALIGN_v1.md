# 계약서 v3 기반 프론트엔드 정합 작업 지침서

> 세션 시작 시: `CLAUDE.md` → `dev_docs/PROJECT_SPEC.html` → **이 파일** 순으로 읽고 작업을 이어간다.
> 작업 완료 시 `[ ]` → `[x]` 로 변경.
> 작업 완료 후 `dev_docs/WORKLOG.md` 및 `dev_docs/PROJECT_SPEC.html` changelog 반드시 업데이트.
> 계약서 원본 참조: `익명조합_투자계약서_v3` (프로젝트 파일 / 최종 확정본)

## 작업 규칙

- 백엔드 연동 부분은 구조/UI만 만들고 `// TODO:` 주석으로 표시
- 모든 수치(수수료율, 공식 등)는 반드시 계약서 원본과 일치시킬 것
- `preview/*.html` 파일도 Next.js 코드와 동기화 업데이트
- 완료 후 모바일(390px) 포함 브라우저 테스트
- 최종 git commit & push

---

## v1.9 — 계약서 v3 기반 UI 정합 (2026.06.08)

> 참조: `익명조합_투자계약서_v3` — 우선순위: 🔴 필수 → 🟡 중요 → 🟢 마무리

### Phase 1 — 온보딩 리스크 고지 추가 🔴 최우선

- [x] **CTRCT-OB-01** `app/(onboarding)/onboarding/step2/page.tsx` — 리스크 고지 체크리스트 섹션 추가
  - 계약서 서명 버튼 위에 📋 RISK DISCLOSURE 섹션 삽입
  - 아래 7개 항목을 각각 개별 체크박스로 구현 (계약서 제10조 기반)
    1. I understand that I may lose all or part of my invested principal.
    2. I understand that past performance does not guarantee future returns.
    3. I understand that token value may fall and that this token is not listed on any exchange.
    4. I understand that instant withdrawal may be restricted and large withdrawals may be delayed.
    5. I understand that technical risks (hacking, smart contract bugs, oracle errors) may result in asset loss.
    6. I understand that regulatory changes may alter or terminate operations.
    7. I understand that performance fees apply to unrealized gains and are not refunded on subsequent losses.
  - 7개 항목 전부 체크 전까지 "Sign Agreement →" 버튼 `disabled` 유지
  - 체크박스 스타일: 기존 `globals.css` 디자인 토큰 사용 (`--border`, `--blue`)

- [x] **CTRCT-OB-02** `app/(onboarding)/onboarding/step2/page.tsx` — 계약 구조 요약 카드 추가
  - 리스크 고지 섹션 위에 CONTRACT INFO 카드 삽입
  - 표시할 정보:
    - Contract Type: Anonymous Partnership (Korean Commercial Act §78–86)
    - Operators: 이정민 (Dev & Operations) · 장재혁 (Business)
    - Min. Investment: ₩10,000,000
    - Performance Fee: 30% of net profit (after 11% tax reserve)
  - 스타일: 기존 `.info` 박스 클래스 또는 `bg-[#0e1425] border border-white/[0.07]` 카드

---

### Phase 2 — 락업 개념 제거 · 출금 유형 선택으로 교체 🔴

> **계약서 v3 확정: 락업 기간 없음.** 출금은 유형 선택에 따른 수수료만 존재.
> 기존 코드에 `lockedUntil`, `investedAt` 기반 락업 UI가 있다면 전부 교체한다.

- [x] **CTRCT-WD-01** `app/(onboarding)/onboarding/step2/page.tsx` — 기존 Lockup Period 섹션 제거
  - "Short Duration / Standard Duration / Extended Duration" 선택 UI 삭제
  - 아래 Withdrawal Fee 안내 카드로 교체 (선택 UI 아님, 정보 표시만):
    ```
    Withdrawal Fee Structure
    ┌────────────┬──────────────┬──────────┬─────────────────────────────┐
    │ Instant    │ Immediate    │   5.0%   │ Subject to liquidity        │
    │ Standard   │ Within 24hr  │   1.0%   │                             │
    │ Scheduled  │ Within 7 days│   0.1%   │ Recommended ✓              │
    └────────────┴──────────────┴──────────┴─────────────────────────────┘
    ```
  - amber 안내 문구 추가: "Withdrawal type is selected at the time of each withdrawal request."

- [x] **CTRCT-WD-02** `components/dashboard/WithdrawForm.tsx` — 락업 상태 UI 완전 제거
  - `lockedUntil` prop 및 관련 locked 상태 UI (`amber notice: "Locked · Unlocks in X days"`) 삭제
  - `investedAt` 기반 잠금 해제 날짜 계산 로직 삭제
  - "Withdrawal available after lockup period ends" 비활성화 버튼 로직 삭제

- [x] **CTRCT-WD-03** `components/dashboard/WithdrawForm.tsx` — 출금 유형 선택 라디오 추가
  - Amount 입력 위에 WITHDRAWAL TYPE 선택 섹션 추가
  - 3가지 라디오 카드:
    - **Instant** — Immediate · **5.0%** fee · "May be unavailable for large amounts"
    - **Standard** — Within 24 hrs · **1.0%** fee
    - **Scheduled** — Within 7 days · **0.1%** fee · "Recommended" 배지 (green)
  - 기본 선택: Scheduled
  - 선택에 따라 아래 출금 계산 영역 실시간 업데이트

- [x] **CTRCT-WD-04** `components/dashboard/WithdrawForm.tsx` — 실시간 출금 계산 표시
  - KRW 입력 금액 기반으로 아래 계산식 실시간 표시:
    ```
    Tokens to return: {amount_krw / token_price_krw} TOKEN
    Fee ({fee_rate}%): −₩{fee_amount}
    You receive: ₩{net_amount}
    ```
  - 계약서 제8조 공식 기반: `출금액 = 반납 토큰 수 × 토큰 가격(USD) × USD/KRW × (1 − 수수료율)`
  - 계산 표시 스타일: `bg-[#0b0f1f]` 박스, 레이블 `white/28`, 금액 `#e2e8f0`

- [x] **CTRCT-WD-05** `components/dashboard/WithdrawForm.tsx` — 대형 출금 경고
  - 입력 금액 ≥ ₩100,000,000 이면 amber warning box 표시:
    - "Large withdrawal detected. Processing may be extended or split into multiple payments. Please contact the operator in advance."
  - `// TODO: ₩100,000,000 또는 전체 운용자산 10% 초과 조건 — 백엔드에서 운용자산 기준값 제공 필요`

- [x] **CTRCT-WD-06** `app/(protected)/dashboard/page.tsx` — WithdrawForm props 정리
  - `lockedUntil` prop 제거
  - `withdrawType` state를 WithdrawForm 내부 state로 이관 (외부 prop 불필요)
  - `accountOnFile` prop 유지

---

### Phase 3 — 볼트 상세 페이지 및 투자 패널 정합 🟡

- [x] **CTRCT-VAULT-01** `components/pool/InvestPanel.tsx` — Lock-up 항목 교체
  - "Lock-up: Short / Standard / Extended" 행 → "Withdrawal: 0.1%–5% · type at exit" 으로 교체
  - 아래 작은 텍스트 추가: `Scheduled 0.1% · Standard 1% · Instant 5%`
  - Token Details 섹션의 "Lock-up: Short / Standard / Extended" 도 동일하게 교체

- [x] **CTRCT-VAULT-02** `app/(public)/pool/detail/page.tsx` — 성과보수 구조 섹션 추가
  - Token Details 카드 하단 또는 별도 FEE STRUCTURE 섹션으로 추가
  - 표시 내용 (계약서 제6조·제7조):
    ```
    Performance Fee Structure
    ① Tax Reserve     Gross profit × 11%     Held separately
    ② Performance Fee Remaining × 30%        Operators
    ③ Investor Share  Remaining × 70%        Reflected in token price ↑
    
    Example (profit 100): Tax 11 → Remaining 89 → Fee 26.7 → Investor 62.3
    High-watermark: No fee applies when AUM is below the prior peak.
    ```
  - 스타일: 기존 카드 스타일 통일, 예시는 `<pre>` 또는 테이블

- [x] **CTRCT-VAULT-03** `app/(public)/pool/detail/page.tsx` — Token Price stat 오라클 공식 표시
  - "Oracle · live" 텍스트 옆에 `ⓘ` 아이콘 추가 (hover tooltip 또는 클릭 팝오버)
  - tooltip 내용:
    - Token Price (USD) = Total AUM ÷ Total Tokens Issued
    - KRW conversion: Upbit USDT/KRW market rate
    - Source: Operator-run closed-source off-chain oracle node

---

### Phase 4 — 프리뷰 HTML 및 문서 업데이트 🟢

- [x] **CTRCT-DOC-01** `preview/onboarding.html` — Step 2 전면 업데이트
  - Lockup Period 선택 섹션(Short/Standard/Extended TBD) → 출금 수수료 안내 테이블로 교체
  - 계약 구조 요약 카드 (CTRCT-OB-02 내용) 추가
  - 리스크 고지 체크리스트 (CTRCT-OB-01 내용) 추가
  - "Sign Agreement →" 버튼 체크 완료 전 비활성 상태 시뮬레이션

- [x] **CTRCT-DOC-02** `preview/vault.html` — InvestPanel 및 Token Details 업데이트
  - InvestPanel "Lock-up: Short / Standard / Extended" → "Withdrawal: 0.1%–5% · type at exit"
  - Token Details "Lock-up" 항목 동일하게 교체

- [x] **CTRCT-DOC-03** `preview/dashboard.html` — WithdrawForm 업데이트
  - 락업 경고 UI (`⏳ Lockup period active`, `Lockup ends Jul 4, 2026`) 제거
  - 출금 유형 라디오 (Instant/Standard/Scheduled) UI 추가
  - 실시간 출금 계산 표시 영역 추가

- [x] **CTRCT-DOC-04** `dev_docs/PROJECT_SPEC.html` — changelog 및 서비스 구조 섹션 업데이트
  - 변경 이력 v1.9 항목 추가
  - 수익 배분 구조 섹션: 락업 언급 제거, 출금 수수료 표 실제값 반영
  - 계약서 필수 항목 섹션: 현재 계약서 v3 기준으로 업데이트
  - 다음 작업 순서 테이블: 이 파일의 완료된 항목 반영

---

## 계약서 v3 핵심 수치 (변경 시 반드시 이 값 사용)

| 항목 | 값 | 출처 |
|------|-----|------|
| 최소 투자금 | ₩10,000,000 | 제4조 |
| 즉시출금 수수료 | 5% · 즉시 처리 | 제8조 |
| 일반출금 수수료 | 1% · 24시간 이내 | 제8조 |
| 예약출금 수수료 | 0.1% · 7일 이내 (권장) | 제8조 |
| 대형 출금 기준 | 전체 운용자산 10% 이상 또는 ₩100,000,000 이상 | 제8조⑤ |
| 세금 유보금 | 전체 운용수익 × 11% | 제7조 |
| 성과보수 | 잔여 수익 × 30% → 영업자 | 제6조 |
| 투자자 귀속 | 잔여 수익 × 70% → 토큰 가격 상승 | 제6조 |
| 토큰 가격 공식 | 전체 운용자산(USD) ÷ 총 발행 토큰 수 | 제5조 |
| KRW 환산 기준 | 업비트 USDT/KRW 마켓 환율 | 제5조② |
| 락업 기간 | **없음** | 제4조/지침서 TODO-04 |
| 계약 형태 | 익명조합 (상법 제78~86조) | 전문 |

## 리스크 고지 7개 항목 (CTRCT-OB-01 체크박스 원문 — 계약서 제10조)

```
1. 원금 손실 : 봇 운용 결과에 따라 투자 원금의 전부 또는 일부를 손실할 수 있습니다.
2. 수익 미보장: 과거 수익률은 미래 수익을 보장하지 않으며, 영업자는 수익을 약속하지 않습니다.
3. 토큰 가치 변동: 운용 손실 시 토큰 가격이 하락합니다. 본 토큰은 거래소에 상장되지 않습니다.
4. 유동성 리스크: 즉시출금이 제한될 수 있으며, 대형 출금은 처리가 지연될 수 있습니다.
5. 기술 리스크: 거래소 해킹, 스마트컨트랙트 버그, 오라클 오류로 자산이 손실될 수 있습니다.
6. 규제 리스크: 가상자산 법령·규제 변경으로 운용 방식 변경 또는 계약이 종료될 수 있습니다.
7. 미실현 수익 성과보수: 미실현 평가수익에도 성과보수가 부과되며, 이후 자산 하락 시에도 환수되지 않습니다.
```

> UI 언어가 영문이므로 위 항목은 영문 번역 사용 (CTRCT-OB-01 참조).
> 계약서 서명(모두싸인) 내에도 동일 내용이 포함됨 — UI 체크박스는 사용자 인지 확인용.
