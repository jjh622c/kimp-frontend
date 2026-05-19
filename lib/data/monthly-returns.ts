export type MonthlyReturn = {
  period: string
  year: number
  returnPct: number
  tokenPrice: number
  netProfit: number
  date: string
}

// Newest first
export const MONTHLY_RETURNS: MonthlyReturn[] = [
  { period: 'May V3',     year: 2026, returnPct:  +2.10, tokenPrice: 1511, netProfit:   1_418_532, date: '2026-05-04' },
  { period: 'Apr V3',     year: 2026, returnPct:  +2.14, tokenPrice: 1455, netProfit:   3_498_141, date: '2026-04-10' },
  { period: 'Mar-Apr V3', year: 2026, returnPct:  +9.20, tokenPrice: 1424, netProfit:  15_582_637, date: '2026-03-20' },
  { period: 'Mar 2026',   year: 2026, returnPct:  -0.35, tokenPrice: 1304, netProfit:    -600_000, date: '2026-03-01' },
  { period: 'Jan 2026',   year: 2026, returnPct:  -5.19, tokenPrice: 1308, netProfit:  -9_670_278, date: '2026-01-01' },
  { period: 'Oct 2025',   year: 2025, returnPct:  +8.13, tokenPrice: 1380, netProfit:  21_503_264, date: '2025-10-01' },
  { period: 'Jul 2025',   year: 2025, returnPct: -11.83, tokenPrice: 1276, netProfit: -36_854_264, date: '2025-07-01' },
  { period: 'Apr 2025',   year: 2025, returnPct:  +1.06, tokenPrice: 1447, netProfit:   3_317_600, date: '2025-04-01' },
  { period: 'Dec 2024',   year: 2024, returnPct:  +8.37, tokenPrice: 1432, netProfit:  22_625_662, date: '2024-12-01' },
  { period: 'Oct 2024',   year: 2024, returnPct:  -1.80, tokenPrice: 1321, netProfit:  -5_059_283, date: '2024-10-01' },
  { period: 'Jul 2024',   year: 2024, returnPct:  -0.21, tokenPrice: 1345, netProfit:  -1_000_000, date: '2024-07-01' },
  { period: 'Jun 2024',   year: 2024, returnPct:  +1.07, tokenPrice: 1348, netProfit:   5_200_000, date: '2024-06-01' },
  { period: 'May 2024',   year: 2024, returnPct:  -0.73, tokenPrice: 1334, netProfit:  -3_695_599, date: '2024-05-01' },
  { period: 'Apr 2024',   year: 2024, returnPct:  +6.04, tokenPrice: 1344, netProfit:  25_623_890, date: '2024-04-01' },
  { period: 'Mar 2024',   year: 2024, returnPct:  +5.28, tokenPrice: 1268, netProfit:  21_700_000, date: '2024-03-01' },
  { period: 'Feb 2024',   year: 2024, returnPct:  +1.86, tokenPrice: 1204, netProfit:   7_231_359, date: '2024-02-01' },
  { period: 'Jan 2024',   year: 2024, returnPct:  +3.07, tokenPrice: 1182, netProfit:  11_597_071, date: '2024-01-01' },
  { period: 'Nov 2023',   year: 2023, returnPct:  +0.96, tokenPrice: 1147, netProfit:   3_864_791, date: '2023-11-01' },
  { period: 'Sep 2023',   year: 2023, returnPct:  -0.45, tokenPrice: 1136, netProfit:  -1_900_000, date: '2023-09-01' },
  { period: 'Aug 2023',   year: 2023, returnPct:  +6.63, tokenPrice: 1141, netProfit:  30_999_999, date: '2023-08-01' },
  { period: 'Jul 2023',   year: 2023, returnPct:  -3.01, tokenPrice: 1070, netProfit: -16_000_000, date: '2023-07-01' },
  { period: 'Jun 2023',   year: 2023, returnPct:  +3.06, tokenPrice: 1103, netProfit:  14_500_000, date: '2023-06-01' },
  { period: 'May 2023',   year: 2023, returnPct:  +3.86, tokenPrice: 1070, netProfit:  17_016_000, date: '2023-05-01' },
  { period: 'Apr 2023',   year: 2023, returnPct:  +1.29, tokenPrice: 1030, netProfit:   5_290_124, date: '2023-04-01' },
  { period: 'Mar 2023',   year: 2023, returnPct:  +1.12, tokenPrice: 1017, netProfit:   4_556_439, date: '2023-03-01' },
  { period: 'Feb 2023',   year: 2023, returnPct:  +4.99, tokenPrice: 1006, netProfit:  20_000_000, date: '2023-02-01' },
  { period: 'Jan 2023',   year: 2023, returnPct:  +0.79, tokenPrice:  958, netProfit:   3_151_261, date: '2023-01-01' },
  { period: 'Dec 2022',   year: 2022, returnPct:  -3.39, tokenPrice:  950, netProfit: -14_900_000, date: '2022-12-01' },
  { period: 'Nov 2022',   year: 2022, returnPct:  -1.16, tokenPrice:  984, netProfit:  -5_249_627, date: '2022-11-01' },
  { period: 'Oct 2022',   year: 2022, returnPct:  -0.47, tokenPrice:  995, netProfit:  -2_150_373, date: '2022-10-01' },
]

// For chart (lightweight-charts): oldest first with ISO date strings
export const PRICE_CHART_DATA = [...MONTHLY_RETURNS]
  .reverse()
  .map(d => ({ time: d.date, value: d.tokenPrice }))

export const MAX_ABS_RETURN = Math.max(...MONTHLY_RETURNS.map(d => Math.abs(d.returnPct)))
