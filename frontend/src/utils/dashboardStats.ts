import type { Category, Expense, Shift } from '../types/models';

export type Period = 'week' | 'month' | 'year';

export interface PeriodRange {
  start: Date;
  end: Date;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Parses a YYYY-MM-DD string as a local date (new Date(iso) would read it as UTC). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getPeriodRange(period: Period, now = new Date()): PeriodRange {
  const end = startOfDay(now);
  let start: Date;

  if (period === 'week') {
    const daysSinceMonday = (now.getDay() + 6) % 7;
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
  } else if (period === 'year') {
    start = new Date(now.getFullYear(), 0, 1);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end };
}

/** The same number of elapsed days, one period earlier (e.g. 1–18 Sep vs 1–18 Aug). */
export function getPreviousRange(period: Period, current: PeriodRange): PeriodRange {
  const { start, end } = current;
  const elapsed = daysElapsed(start, end);
  let prevStart: Date;

  if (period === 'week') prevStart = addDays(start, -7);
  else if (period === 'year') prevStart = new Date(start.getFullYear() - 1, 0, 1);
  else prevStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);

  return { start: prevStart, end: addDays(prevStart, elapsed - 1) };
}

export function toDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysElapsed(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / msPerDay) + 1;
}

export function formatCurrency(amount: number): string {
  return '£' + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatRangeLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
}

export function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
}

export function expensesBetween(expenses: Expense[], range: PeriodRange): Expense[] {
  const from = startOfDay(range.start).getTime();
  const to = addDays(range.end, 1).getTime();
  return expenses.filter((e) => {
    const t = new Date(e.date).getTime();
    return t >= from && t < to;
  });
}

export function shiftsBetween(shifts: Shift[], range: PeriodRange): Shift[] {
  const from = startOfDay(range.start).getTime();
  const to = addDays(range.end, 1).getTime();
  return shifts.filter((s) => {
    const t = parseLocalDate(s.date).getTime();
    return t >= from && t < to;
  });
}

export function categoryColor(categories: Category[], categoryId: number): string {
  const idx = categories.findIndex((c) => c.id === categoryId);
  return `var(--cat-${(Math.max(idx, 0) % 6) + 1})`;
}

export interface CategoryBreakdownItem {
  id: number;
  name: string;
  amount: number;
  amountFormatted: string;
  pct: string;
  color: string;
}

export function computeCategoryBreakdown(
  expenses: Expense[],
  categories: Category[],
): CategoryBreakdownItem[] {
  const totals = new Map<number, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + parseFloat(e.amount));
  }

  const items = categories
    .map((c) => ({ id: c.id, name: c.name, amount: totals.get(c.id) ?? 0 }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const max = items[0]?.amount || 1;

  return items.map((c) => ({
    ...c,
    amountFormatted: formatCurrency(c.amount),
    pct: `${((c.amount / max) * 100).toFixed(1)}%`,
    color: categoryColor(categories, c.id),
  }));
}

/* ── trend chart ── */

export const CHART_WIDTH = 640;
const CHART_TOP = 16;
const CHART_BOTTOM = 216;
export const CHART_GRID_Y = [16, 66, 116, 166, 216];

interface Bucket {
  label: string;
  start: Date;
  end: Date; // exclusive
}

export interface TrendChart {
  labels: string[];
  points: { x: string; y: string }[];
  spendLine: string;
  incomeLine: string;
  area: string;
  caption: string;
}

export function trendStart(period: Period, now = new Date()): Date {
  if (period === 'week') return addDays(startOfDay(now), -6);
  const months = period === 'year' ? 12 : 6;
  return new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
}

function buildBuckets(period: Period, now: Date): { buckets: Bucket[]; caption: string } {
  const today = startOfDay(now);
  if (period === 'week') {
    const buckets = Array.from({ length: 7 }, (_, i) => {
      const start = addDays(today, i - 6);
      return {
        label: start.toLocaleDateString('en-GB', { weekday: 'short' }),
        start,
        end: addDays(start, 1),
      };
    });
    return { buckets, caption: 'Last seven days' };
  }

  const months = period === 'year' ? 12 : 6;
  const buckets = Array.from({ length: months }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return {
      label: start.toLocaleDateString('en-GB', { month: 'short' }),
      start,
      end: new Date(start.getFullYear(), start.getMonth() + 1, 1),
    };
  });
  return { buckets, caption: period === 'year' ? 'Last twelve months' : 'Last six months' };
}

export function computeTrend(
  period: Period,
  expenses: Expense[],
  shifts: Shift[],
  now = new Date(),
): TrendChart {
  const { buckets, caption } = buildBuckets(period, now);

  const spend = buckets.map((b) =>
    sumAmounts(expenses.filter((e) => {
      const t = new Date(e.date).getTime();
      return t >= b.start.getTime() && t < b.end.getTime();
    })),
  );
  const income = buckets.map((b) =>
    shifts
      .filter((s) => {
        const t = parseLocalDate(s.date).getTime();
        return t >= b.start.getTime() && t < b.end.getTime();
      })
      .reduce((sum, s) => sum + parseFloat(s.estimated_pay), 0),
  );

  const max = Math.max(...spend, ...income) * 1.1 || 1;
  const scaleY = (v: number) => (CHART_TOP + (1 - v / max) * (CHART_BOTTOM - CHART_TOP)).toFixed(1);
  const step = CHART_WIDTH / (buckets.length - 1);

  const points = spend.map((v, i) => ({ x: (i * step).toFixed(1), y: scaleY(v) }));
  const spendLine = points.map((p) => `${p.x},${p.y}`).join(' ');
  const incomeLine = income.map((v, i) => `${(i * step).toFixed(1)},${scaleY(v)}`).join(' ');

  return {
    labels: buckets.map((b) => b.label),
    points,
    spendLine,
    incomeLine,
    area: `0,${CHART_BOTTOM} ${spendLine} ${CHART_WIDTH},${CHART_BOTTOM}`,
    caption,
  };
}
