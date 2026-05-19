# Claude Code 작업 지시서 — Vault Stats 페이지 구현
**작성일:** 2026-05-19
**우선순위:** HIGH
**작업 유형:** 기존 페이지 수정 + 신규 데이터 연동

---

## 세션 시작 시 필독 순서

1. `WORKLOG.md` — 완료된 작업 및 현재 상태 확인
2. `dev_docs/PROJECT_SPEC.html` — 전체 사양 확인
3. 이 문서 — 이번 작업 지시 (vault/detail 페이지 전면 개편)

---

## 작업 배경

이 플랫폼은 김치 프리미엄 차익거래 자동화 봇(V3)의 수익을 토큰화하여
사전 합의된 소수 지인에게 투자 참여 기회를 제공하는 **프라이빗 투자 플랫폼**이다.

**이번 작업의 목적:**
`/pool/detail` (vault detail) 페이지의 통계 섹션을 실제 운용 데이터 기반으로 전면 교체한다.
기존에는 Jan/Feb 2025 두 달치 더미 데이터만 있었으나,
공식 정산 데이터 2022.10 ~ 2026.05 (30개 정산 기간) 전체로 교체한다.

---

## 참고 파일

작업 전 반드시 확인할 파일:

```
kimp_vault_stats.html     ← 완성된 디자인 레퍼런스 (이 파일 그대로 구현)
kimp_spec_v1.1.md         ← UX/UI 개선 사양서
KiMP_정산데이터_v1.0.xlsx  ← 실제 정산 데이터 원본
```

`kimp_vault_stats.html` 이 파일이 **정답**이다.
이 HTML을 Next.js 컴포넌트로 변환하는 것이 이번 작업의 핵심이다.

---

## 작업 항목 (우선순위 순)

### VAULT-01 — Monthly Returns 데이터 교체

**파일:** `app/(public)/pool/detail/page.tsx`
및 관련 컴포넌트

**현재 상태:**
```tsx
// 현재: Jan/Feb 2025 더미 2개만 존재
const monthlyReturns = [
  { month: 'Feb 2025', return: '+2.0%', price: '1,000 KRW' },
  { month: 'Jan 2025', return: '+10.2%', price: '980 KRW' },
]
```

**변경 내용:**
아래 데이터 배열로 완전 교체한다.
수익률 양수 = green(`#22c55e`), 음수 = red(`#ef4444`) 처리.

```typescript
// lib/data/monthly-returns.ts 신규 파일로 분리할 것
export const MONTHLY_RETURNS = [
  { period: 'May V3',     year: 2026, returnPct: +2.10,  tokenPrice: 1511, netProfit:  1_418_532 },
  { period: 'Apr V3',     year: 2026, returnPct: +2.14,  tokenPrice: 1455, netProfit:  3_498_141 },
  { period: 'Mar–Apr V3', year: 2026, returnPct: +9.20,  tokenPrice: 1424, netProfit: 15_582_637 },
  { period: 'Mar 2026',   year: 2026, returnPct: -0.35,  tokenPrice: 1304, netProfit:   -600_000 },
  { period: 'Jan 2026',   year: 2026, returnPct: -5.19,  tokenPrice: 1308, netProfit: -9_670_278 },
  { period: 'Oct 2025',   year: 2025, returnPct: +8.13,  tokenPrice: 1380, netProfit: 21_503_264 },
  { period: 'Jul 2025',   year: 2025, returnPct: -11.83, tokenPrice: 1276, netProfit:-36_854_264 },
  { period: 'Apr 2025',   year: 2025, returnPct: +1.06,  tokenPrice: 1447, netProfit:  3_317_600 },
  { period: 'Dec 2024',   year: 2024, returnPct: +8.37,  tokenPrice: 1432, netProfit: 22_625_662 },
  { period: 'Oct 2024',   year: 2024, returnPct: -1.80,  tokenPrice: 1321, netProfit: -5_059_283 },
  { period: 'Jul 2024',   year: 2024, returnPct: -0.21,  tokenPrice: 1345, netProfit: -1_000_000 },
  { period: 'Jun 2024',   year: 2024, returnPct: +1.07,  tokenPrice: 1348, netProfit:  5_200_000 },
  { period: 'May 2024',   year: 2024, returnPct: -0.73,  tokenPrice: 1334, netProfit: -3_695_599 },
  { period: 'Apr 2024',   year: 2024, returnPct: +6.04,  tokenPrice: 1344, netProfit: 25_623_890 },
  { period: 'Mar 2024',   year: 2024, returnPct: +5.28,  tokenPrice: 1268, netProfit: 21_700_000 },
  { period: 'Feb 2024',   year: 2024, returnPct: +1.86,  tokenPrice: 1204, netProfit:  7_231_359 },
  { period: 'Jan 2024',   year: 2024, returnPct: +3.07,  tokenPrice: 1182, netProfit: 11_597_071 },
  { period: 'Nov 2023',   year: 2023, returnPct: +0.96,  tokenPrice: 1147, netProfit:  3_864_791 },
  { period: 'Sep 2023',   year: 2023, returnPct: -0.45,  tokenPrice: 1136, netProfit: -1_900_000 },
  { period: 'Aug 2023',   year: 2023, returnPct: +6.63,  tokenPrice: 1141, netProfit: 30_999_999 },
  { period: 'Jul 2023',   year: 2023, returnPct: -3.01,  tokenPrice: 1070, netProfit:-16_000_000 },
  { period: 'Jun 2023',   year: 2023, returnPct: +3.06,  tokenPrice: 1103, netProfit: 14_500_000 },
  { period: 'May 2023',   year: 2023, returnPct: +3.86,  tokenPrice: 1070, netProfit: 17_016_000 },
  { period: 'Apr 2023',   year: 2023, returnPct: +1.29,  tokenPrice: 1030, netProfit:  5_290_124 },
  { period: 'Mar 2023',   year: 2023, returnPct: +1.12,  tokenPrice: 1017, netProfit:  4_556_439 },
  { period: 'Feb 2023',   year: 2023, returnPct: +4.99,  tokenPrice: 1006, netProfit: 20_000_000 },
  { period: 'Jan 2023',   year: 2023, returnPct: +0.79,  tokenPrice:  958, netProfit:  3_151_261 },
  { period: 'Dec 2022',   year: 2022, returnPct: -3.39,  tokenPrice:  950, netProfit:-14_900_000 },
  { period: 'Nov 2022',   year: 2022, returnPct: -1.16,  tokenPrice:  984, netProfit: -5_249_627 },
  { period: 'Oct 2022',   year: 2022, returnPct: -0.47,  tokenPrice:  995, netProfit: -2_150_373 },
] as const
```

**테이블 컬럼 구조 (현재 3열 → 4열로 변경):**

| 컬럼 | 내용 | 정렬 |
|---|---|---|
| Period | 정산 기간명 | left |
| Return | 수익률 (±X.XX%) + 수평 바 시각화 | right |
| Token price | X,XXX KRW | right |
| Net profit | ±XX만 (단위 축약) | right |

**연도별 구분선 추가:**
년도가 바뀌는 지점마다 `2026 / 2025 / 2024 / 2023 / 2022` 회색 구분 헤더 삽입.

**수익률 바 시각화:**
각 행의 Return 컬럼에 수평 바를 숫자 왼쪽에 표시.
바 너비 = `Math.abs(returnPct) / 11.83 * 56px` (최대값 -11.83% 기준 정규화).
양수 = `#22c55e` / 음수 = `#ef4444` / opacity 0.75.

---

### VAULT-02 — Stat 카드 수치 교체

**파일:** `app/(public)/pool/detail/page.tsx`

현재 하드코딩된 수치를 아래 값으로 교체:

```typescript
// lib/data/vault-stats.ts 신규 파일로 분리
export const VAULT_STATS = {
  return30d:    '+2.1%',   // V3 최근 수익률 (May V3 기준)
  returnNote:   'Last 30 days · V3',
  allTimeReturn: '+32.6%', // 2022.10~2026.05 복리 누적
  allTimeNote:  'Since Oct 2022',
  winRate:      '60.7%',   // 17승 / 28회
  winRateNote:  '17 / 28 periods',
  tokenPrice:   '1,511 KRW', // 현재 oracle 가격
  tokenPriceNote: 'Oracle · live',
} as const
```

**근거:**
- 30D Return: V3 2026-05 정산 월환산 2.10%
- All-time Return: 공식 정산 28회 복리 누결 +32.59% → 표시는 +32.6%
- Win Rate: 수익 17회 / 전체 28회 = 60.71%
- Token Price: 초기가 1,000 KRW × 누적 수익률 적용 = 1,511 KRW

---

### VAULT-03 — 토큰 가격 차트 데이터 교체

**파일:** SVG 차트 또는 Chart.js 컴포넌트

현재 임의의 SVG path로 그려진 차트를 실제 토큰 가격 데이터로 교체한다.

```typescript
// MONTHLY_RETURNS 배열에서 추출
export const PRICE_CHART_DATA = MONTHLY_RETURNS
  .slice()
  .reverse()  // 시간순 정렬 (오래된 것부터)
  .map(d => ({ label: d.period, price: d.tokenPrice }))

// 결과: Oct 2022(995) → ... → May V3(1,511)
// Y축 range: 900 ~ 1,600
// 차트 날짜 라벨: "Oct 2022" (start) / "May 2026" (end)
```

Chart.js 사용 권장. 기존 SVG 방식이면 polyline points 교체.
`kimp_vault_stats.html` 파일의 Chart.js 구현을 참고할 것.

---

### VAULT-04 — 누적 수익률 배너 추가

Monthly Returns 테이블 하단에 신규 배너 추가:

```tsx
// 테이블 끝 바로 아래
<div className="cum-banner">
  <div>
    <p className="cum-label">Cumulative return since inception</p>
    <p className="cum-sub">Oct 2022 → May 2026 · compound</p>
  </div>
  <span className="cum-val">+32.6%</span>
</div>
```

스타일: `background: rgba(61,142,248,0.06)`, `border: 0.5px solid rgba(61,142,248,0.18)`,
`border-radius: 10px`, `padding: 14px 16px`

---

### VAULT-05 — Win/Loss pip 시각화 추가

누적 배너 하단에 승/패 비율 시각화 추가:

```tsx
// 30개 정사각형 pip으로 승/패 시각화
<div className="winrate-row">
  <div>
    <p className="text-xs text-white/40">Win / loss · 28 periods</p>
    <p className="text-[10px] text-white/25 mt-1">17 win · 11 loss · 60.7%</p>
  </div>
  <div className="flex flex-wrap gap-[2px] justify-end max-w-[240px]">
    {MONTHLY_RETURNS.map((d, i) => (
      <div
        key={i}
        className="w-[9px] h-[9px] rounded-[2px]"
        style={{ background: d.returnPct >= 0 ? '#22c55e' : 'rgba(239,68,68,0.5)' }}
        title={`${d.period}: ${d.returnPct >= 0 ? '+' : ''}${d.returnPct}%`}
      />
    ))}
  </div>
</div>
```

---

### VAULT-06 — All-time Return stat 카드 note 수정

현재: `"Since Jan 2025"` → 변경: `"Since Oct 2022"`

**근거:** 공식 정산 템플릿 시작일이 2022년 10월이므로
"Since Jan 2025"는 틀린 정보임. 반드시 수정 필요.

---

## 신규 파일 목록

```
lib/data/monthly-returns.ts   ← MONTHLY_RETURNS 데이터 배열
lib/data/vault-stats.ts       ← VAULT_STATS 상수
```

데이터를 컴포넌트에 직접 하드코딩하지 말고 위 파일로 분리할 것.
추후 DB/API 연동 시 이 파일만 교체하면 되도록 구조화.

---

## 수정 파일 목록

```
app/(public)/pool/detail/page.tsx     ← stat 카드 + 차트 + 테이블 전체
components/pool/MonthlyReturns.tsx    ← 신규 or 기존 컴포넌트 교체
lib/data/monthly-returns.ts           ← 신규
lib/data/vault-stats.ts               ← 신규
```

---

## 디자인 레퍼런스

`kimp_vault_stats.html` 파일을 브라우저에서 열어 확인.
이 파일이 완성된 목표 디자인이다.

주요 색상:
```
--green:  #22c55e   (양수 수익률)
--red:    #ef4444   (음수 수익률)
--blue:   #3d8ef8   (강조, 차트 라인)
--card:   #0e1425   (카드 배경)
--border: rgba(255,255,255,0.07)
--text3:  rgba(255,255,255,0.28)  (서브 텍스트)
```

---

## 완료 기준 체크리스트

- [ ] MONTHLY_RETURNS 30개 행 모두 표시
- [ ] 연도별 구분선 (2026 / 2025 / 2024 / 2023 / 2022)
- [ ] 수익률 바 시각화 (양수 green / 음수 red)
- [ ] Net profit 컬럼 추가 (단위 축약: 만, 천만)
- [ ] stat 카드 4개 수치 교체 (특히 "Since Jan 2025" → "Since Oct 2022")
- [ ] 차트 데이터 실제 토큰 가격으로 교체 (995 → 1511)
- [ ] 누적 수익률 배너 (+32.6%) 추가
- [ ] Win/Loss pip 시각화 추가
- [ ] 데이터 파일 분리 (lib/data/*.ts)
- [ ] 모바일 390px 테스트
- [ ] WORKLOG.md 업데이트 (VAULT-01 ~ VAULT-06 완료 표시)
- [ ] PROJECT_SPEC.html changelog 반영

---

## WORKLOG에 추가할 항목

작업 완료 후 WORKLOG.md의 다음 작업 섹션에 아래 항목 추가:

```markdown
## v1.2 — Vault Stats 실데이터 반영 (진행 중)

- [ ] VAULT-01  lib/data/monthly-returns.ts 신규 + MonthlyReturns 컴포넌트 교체
- [ ] VAULT-02  vault-stats.ts 신규 + stat 카드 4개 수치 교체
- [ ] VAULT-03  토큰 가격 차트 실데이터 교체 (30포인트)
- [ ] VAULT-04  누적 수익률 배너 (+32.6%) 추가
- [ ] VAULT-05  Win/Loss pip 시각화 추가
- [ ] VAULT-06  All-time Return note "Since Jan 2025" → "Since Oct 2022" 수정
```

---

## 데이터 출처 및 검증

| 수치 | 출처 | 산출 방법 |
|---|---|---|
| 정산 데이터 30개 | 정산템플릿.xlsx (31개 시트) | HTML 파싱 추출 |
| 누적 수익률 +32.6% | 위 30개 수익률 복리 연결 | (1+r1)×(1+r2)×…-1 |
| Win Rate 60.7% | 수익 17회 / 전체 28회 | 17/28 = 0.6071 |
| 최대 월수익 +8.37% | 2024-12 정산 | 정산 원본 확인 |
| 최대 월손실 -11.83% | 2025-07 정산 | 정산 원본 확인 |
| Token Price 1,511 KRW | 초기가 1,000 × 누적 복리 | 차트 마지막 포인트 |
| V3 최근 수익률 2.10% | 2026-04-24~05-04 정산 | 월환산수익률 직접 제공 |

---

*지시서 끝. WORKLOG → PROJECT_SPEC → 이 문서 순서로 읽고 작업 시작.*
