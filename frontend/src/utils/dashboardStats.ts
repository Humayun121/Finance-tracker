import type { Category, Expense } from '../types/models';

export type Period = 'week' | 'month' | 'year';

export interface PeriodRange {
  start: Date;
  end: Date;
}

export function getPeriodRange(period: Period, now = new Date()): PeriodRange {
  const end = now;
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

export function toDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysElapsed(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
}

export function formatCurrency(amount: number): string {
  return '£' + amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export interface CategoryBreakdownItem {
  id: number;
  name: string;
  amount: number;
  amountFormatted: string;
  pctStyle: string;
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
    pctStyle: `${((c.amount / max) * 100).toFixed(1)}%`,
  }));
}

export interface TrendMonth {
  label: string;
  value: number;
}

export interface TrendChart {
  months: TrendMonth[];
  points: { x: string; y: string }[];
  linePoints: string;
  areaPoints: string;
}

const CHART_WIDTH = 560;
const CHART_HEIGHT = 200;
const CHART_PAD_TOP = 20;
const CHART_PAD_BOTTOM = 40;
const CHART_BASELINE_Y = 160;

export function computeTrend(expenses: Expense[], now = new Date(), monthsBack = 6): TrendChart {
  const months: TrendMonth[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleDateString('en-GB', { month: 'short' }), value: 0 });
  }

  for (const e of expenses) {
    const d = new Date(e.date);
    const monthsAgo = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    const idx = monthsBack - 1 - monthsAgo;
    if (idx >= 0 && idx < months.length) {
      months[idx].value += parseFloat(e.amount);
    }
  }

  const values = months.map((m) => m.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = CHART_WIDTH / (months.length - 1);

  const points = months.map((m, i) => ({
    x: (i * step).toFixed(1),
    y: (
      CHART_PAD_TOP +
      (1 - (m.value - min) / range) * (CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM)
    ).toFixed(1),
  }));

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `0,${CHART_BASELINE_Y} ${linePoints} ${CHART_WIDTH},${CHART_BASELINE_Y}`;

  return { months, points, linePoints, areaPoints };
}
